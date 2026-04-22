#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# Basira — Exit Strategy Export Script
# DT-IS-POL-400 V7 §3.6 (Exit Requirements) + DT-IS-POL-200 V10 (Backup)
# ═══════════════════════════════════════════════════════════════════════════════
#
# Purpose: produce a complete, portable backup of Basira's data from Supabase,
# so the Agency can migrate to any Postgres-compatible host without vendor lock-in.
#
# Per POL-400 §3.6:
#   - Exit strategy shall be developed to ensure means for secure disposal
#     of data on termination or expiry of the contract
#   - Upon contract termination, the data shall be returned (in usable format)
#
# Output artifacts (timestamped):
#   backups/basira_YYYYMMDD_HHMMSS/
#     ├── schema.sql           — DDL only (no data)
#     ├── data.sql             — INSERT statements
#     ├── data.dump            — pg_dump custom format (fastest restore)
#     ├── rls_policies.sql     — extracted RLS policies
#     ├── audit_logs.csv       — audit trail exported separately (must be retained)
#     ├── manifest.json        — table-level row counts + checksum
#     └── README.md            — restoration instructions
#
# Usage:
#   ./scripts/export-full-backup.sh                   # use .env
#   DATABASE_URL=postgres://... ./scripts/export-full-backup.sh
#
# Prerequisites:
#   - pg_dump from PostgreSQL client tools (same major version as Supabase server)
#   - psql
#   - bash ≥ 4.0, sed, jq (optional but recommended)
#
# Security:
#   - Script never prints the connection string
#   - Output directory permissions set to 0700 (owner only)
#   - Checksum allows tamper detection
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── configuration ────────────────────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="$REPO_ROOT/backups/basira_$TIMESTAMP"

# Resolve DATABASE_URL: arg env → .env → fail
if [[ -z "${DATABASE_URL:-}" ]]; then
    if [[ -f "$REPO_ROOT/.env" ]] && grep -q '^DATABASE_URL=' "$REPO_ROOT/.env"; then
        # shellcheck source=/dev/null
        set +u
        source <(grep '^DATABASE_URL=' "$REPO_ROOT/.env")
        set -u
    fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "❌ DATABASE_URL not set."
    echo
    echo "Set it via one of:"
    echo "  1) Add DATABASE_URL=postgres://... to .env (gitignored)"
    echo "  2) Pass inline: DATABASE_URL=... $0"
    echo
    echo "Find the connection string in Supabase Dashboard → Project Settings → Database."
    exit 1
fi

# ─── preflight ────────────────────────────────────────────────────────────────
command -v pg_dump >/dev/null || { echo "❌ pg_dump not found. Install PostgreSQL client tools."; exit 1; }
command -v psql    >/dev/null || { echo "❌ psql not found. Install PostgreSQL client tools."; exit 1; }

echo "🔍 Preflight checks…"
if ! psql "$DATABASE_URL" -c '\q' 2>/dev/null; then
    echo "❌ Cannot connect to database. Check DATABASE_URL."
    exit 1
fi

PG_VERSION=$(psql "$DATABASE_URL" -Atc "SHOW server_version_num;")
echo "  ✓ connected — Postgres $PG_VERSION"

# ─── staging ──────────────────────────────────────────────────────────────────
mkdir -p "$OUT_DIR"
chmod 0700 "$OUT_DIR"
echo "📦 Output: $OUT_DIR"

# ─── 1. schema (DDL only) ─────────────────────────────────────────────────────
echo "📐 Exporting schema…"
pg_dump "$DATABASE_URL" \
    --schema-only \
    --no-owner --no-privileges \
    --schema=public \
    > "$OUT_DIR/schema.sql"
echo "  ✓ schema.sql ($(wc -l < "$OUT_DIR/schema.sql") lines)"

# ─── 2. data (plain SQL for portability) ──────────────────────────────────────
echo "📊 Exporting data (plain SQL)…"
pg_dump "$DATABASE_URL" \
    --data-only \
    --no-owner --no-privileges \
    --schema=public \
    --column-inserts \
    > "$OUT_DIR/data.sql"
echo "  ✓ data.sql ($(du -h "$OUT_DIR/data.sql" | cut -f1))"

# ─── 3. data (custom format for fast restore on any Postgres host) ────────────
echo "🗜️  Exporting data (custom format)…"
pg_dump "$DATABASE_URL" \
    --format=custom \
    --no-owner --no-privileges \
    --schema=public \
    --file="$OUT_DIR/data.dump"
echo "  ✓ data.dump ($(du -h "$OUT_DIR/data.dump" | cut -f1))"

# ─── 4. RLS policies (extra copy for audit) ───────────────────────────────────
echo "🔒 Exporting RLS policies…"
psql "$DATABASE_URL" -AtX -c "
    SELECT
        'CREATE POLICY ' || quote_ident(policyname) ||
        ' ON ' || quote_ident(schemaname) || '.' || quote_ident(tablename) ||
        CASE WHEN permissive = 'RESTRICTIVE' THEN ' AS RESTRICTIVE' ELSE '' END ||
        ' FOR ' || cmd ||
        ' TO ' || array_to_string(roles, ', ') ||
        CASE WHEN qual IS NOT NULL THEN E'\n  USING (' || qual || ')' ELSE '' END ||
        CASE WHEN with_check IS NOT NULL THEN E'\n  WITH CHECK (' || with_check || ')' ELSE '' END ||
        ';' AS ddl
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
" > "$OUT_DIR/rls_policies.sql"
POLICY_COUNT=$(grep -c '^CREATE POLICY' "$OUT_DIR/rls_policies.sql" || echo 0)
echo "  ✓ rls_policies.sql ($POLICY_COUNT policies)"

# ─── 5. audit_logs → separate CSV (PDPL-critical) ─────────────────────────────
echo "📋 Exporting audit_logs as CSV…"
psql "$DATABASE_URL" -AtX -c "\COPY (SELECT * FROM audit_logs ORDER BY created_at) TO STDOUT WITH (FORMAT csv, HEADER true)" \
    > "$OUT_DIR/audit_logs.csv" 2>/dev/null || echo "  ⚠ audit_logs not found or empty (OK for fresh DBs)"
AUDIT_LINES=$(wc -l < "$OUT_DIR/audit_logs.csv")
echo "  ✓ audit_logs.csv ($AUDIT_LINES lines)"

# ─── 6. per-table row counts manifest ─────────────────────────────────────────
echo "📝 Building manifest…"
psql "$DATABASE_URL" -AtX -c "
    SELECT json_agg(
        json_build_object(
            'table', tablename,
            'rows', (xpath('/row/count/text()', query_to_xml('SELECT COUNT(*) FROM public.' || quote_ident(tablename), false, true, '')))[1]::text::bigint
        ) ORDER BY tablename
    )
    FROM pg_tables
    WHERE schemaname = 'public';
" > "$OUT_DIR/row_counts.json"

# Compute checksums (tamper detection)
(cd "$OUT_DIR" && sha256sum ./*.sql ./*.dump ./*.csv ./*.json 2>/dev/null > checksums.sha256 || true)

# Build manifest
cat > "$OUT_DIR/manifest.json" <<MANIFEST
{
  "basira_version": "v2",
  "export_timestamp": "$TIMESTAMP",
  "export_tool": "scripts/export-full-backup.sh",
  "postgres_version": $PG_VERSION,
  "artifacts": {
    "schema": "schema.sql",
    "data_plain": "data.sql",
    "data_custom": "data.dump",
    "rls_policies": "rls_policies.sql",
    "audit_logs": "audit_logs.csv",
    "row_counts": "row_counts.json",
    "checksums": "checksums.sha256"
  },
  "policy_count": $POLICY_COUNT,
  "audit_row_count": $((AUDIT_LINES - 1)),
  "source_policy": "DT-IS-POL-400 V7 §3.6 (Exit Requirements)",
  "retention_note": "Artifacts must be transported to the receiving host over an encrypted channel and verified with checksums.sha256 before import."
}
MANIFEST
echo "  ✓ manifest.json"

# ─── 7. restoration README ────────────────────────────────────────────────────
cat > "$OUT_DIR/README.md" <<'README_EOF'
# Basira Full Backup

This directory is a complete, portable backup of a Basira Supabase instance,
produced per **DT-IS-POL-400 V7 §3.6** (Cloud Exit Requirements).

## Contents

| File | Purpose |
|---|---|
| `schema.sql` | Plain-SQL DDL (tables, indexes, views, functions) |
| `data.sql` | Plain-SQL inserts — readable, slow to restore |
| `data.dump` | pg_dump custom format — fast restore via `pg_restore` |
| `rls_policies.sql` | All RLS policies (extra copy for audit) |
| `audit_logs.csv` | Audit trail — must be retained per PDPL |
| `row_counts.json` | Per-table row counts for verification |
| `manifest.json` | Metadata about this backup |
| `checksums.sha256` | Tamper-detection checksums |

## Restoration to a Fresh Postgres Host

```bash
# 1. Verify integrity
sha256sum -c checksums.sha256

# 2. Create the target database (replace <host>, <user>, <db>)
createdb -h <host> -U <user> basira_restored

# 3. Option A: Fast restore via custom dump
pg_restore \
  --host=<host> --username=<user> --dbname=basira_restored \
  --no-owner --no-privileges \
  data.dump

# 3. Option B: Plain-SQL restore (portable, slower)
psql -h <host> -U <user> -d basira_restored -f schema.sql
psql -h <host> -U <user> -d basira_restored -f data.sql

# 4. Apply RLS policies
psql -h <host> -U <user> -d basira_restored -f rls_policies.sql

# 5. Verify row counts match manifest.json
psql -h <host> -U <user> -d basira_restored -c "
  SELECT tablename, (xpath('/row/count/text()', query_to_xml('SELECT COUNT(*) FROM public.' || quote_ident(tablename), false, true, '')))[1]::text::bigint AS rows
  FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
"
```

## Security Notes

- **Transport over encrypted channel only** (SFTP, SCP, TLS-protected S3).
- **Verify checksums before import.**
- **Audit logs must be preserved** per DT-IS-POL-1300 V7 — default retention 7 years
  (confirm with Agency per Data Retention Policy v1.0).
- **Delete this backup securely** when no longer needed (`shred -u` on Linux).

## Supabase-Specific Caveats

This export does NOT include:
- Supabase Auth users (export separately from `auth.users`)
- Supabase Storage objects (export from the Storage API)
- Edge Functions source (check `supabase/functions/` in the Basira repo)
- Project secrets / Vault entries (must be rotated on target host)

For a truly complete migration, export those separately.
README_EOF

echo "  ✓ README.md"

# ─── 8. final permissions + summary ───────────────────────────────────────────
chmod -R 0600 "$OUT_DIR"/*
find "$OUT_DIR" -type d -exec chmod 0700 {} +

TOTAL_SIZE=$(du -sh "$OUT_DIR" | cut -f1)
echo
echo "═══════════════════════════════════════════════════════════════════"
echo "✓ Export complete"
echo "  Location : $OUT_DIR"
echo "  Size     : $TOTAL_SIZE"
echo "  Policies : $POLICY_COUNT"
echo "  Audit    : $((AUDIT_LINES - 1)) rows"
echo
echo "  Next steps:"
echo "    1. Verify checksums: (cd $OUT_DIR && sha256sum -c checksums.sha256)"
echo "    2. Test-restore on a scratch database"
echo "    3. Transport artifacts over encrypted channel"
echo
echo "  ⚠ Do NOT commit backups/ to git (already in .gitignore)"
echo "═══════════════════════════════════════════════════════════════════"
