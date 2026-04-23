#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# Basira — Handover-Packet Full Export
# DT-IS-POL-400 V7 §3.6 (Cloud Exit) + DT-IS-POL-200 V10 (Backup)
# Referenced from: docs/handover-security-packet.md §7
#                  docs/backup-strategy.md §3.2
# ═══════════════════════════════════════════════════════════════════════════════
#
# Purpose
# -------
# Produce a self-contained, portable archive of the Basira Supabase database,
# suitable either as a recurring nightly backup or as the one-shot export on
# contract termination with the cloud provider.
#
# Output per run: backups/basira_YYYYMMDD_HHMMSS/
#   schema.sql          — DDL only
#   data.sql            — plain SQL inserts (portable)
#   data.dump           — pg_dump custom format (fast restore)
#   rls_policies.sql    — RLS policies extracted separately (audit artifact)
#   audit_logs.csv      — audit trail (PDPL-critical)
#   auth_users.csv      — auth table snapshot (passwords NOT included)
#   manifest.json       — export metadata + row counts
#   checksums.sha256    — integrity checksums
#   README.md           — bilingual restore instructions
#
# Usage
# -----
#   ./scripts/export-full.sh                    # uses DATABASE_URL from .env
#   DATABASE_URL=postgres://... ./scripts/export-full.sh
#
# Prerequisites: pg_dump, psql (same major version as Supabase), bash ≥ 4.
#
# Security
# --------
#   - Connection string is never echoed.
#   - Output directory set to 0700.
#   - Individual artifacts set to 0600.
#   - sha256 checksums support tamper detection.
#
# User-facing messages are Arabic (per handover-packet policy).
# Comments and technical output are English (operational clarity).
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── configuration ────────────────────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="$REPO_ROOT/backups/basira_$TIMESTAMP"

# ─── resolve DATABASE_URL ─────────────────────────────────────────────────────
if [[ -z "${DATABASE_URL:-}" ]]; then
    if [[ -f "$REPO_ROOT/.env" ]] && grep -q '^DATABASE_URL=' "$REPO_ROOT/.env"; then
        set +u
        # shellcheck source=/dev/null
        source <(grep '^DATABASE_URL=' "$REPO_ROOT/.env")
        set -u
    fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "❌ متغيّر DATABASE_URL غير مُعرَّف."
    echo
    echo "الطرق المقبولة لضبطه:"
    echo "  1) إضافة السطر DATABASE_URL=postgres://... إلى ملف .env (مُستثنى من git)."
    echo "  2) تمريره مع الأمر: DATABASE_URL=... $0"
    echo
    echo "سلسلة الاتصال متاحة في لوحة Supabase ← Project Settings ← Database."
    exit 1
fi

# ─── preflight ────────────────────────────────────────────────────────────────
command -v pg_dump >/dev/null || { echo "❌ أداة pg_dump غير مُثبَّتة. ثبِّت أدوات عميل PostgreSQL."; exit 1; }
command -v psql    >/dev/null || { echo "❌ أداة psql غير مُثبَّتة. ثبِّت أدوات عميل PostgreSQL."; exit 1; }

echo "🔍 فحص جاهزيّة الاتصال…"
if ! psql "$DATABASE_URL" -c '\q' 2>/dev/null; then
    echo "❌ تعذّر الاتصال بقاعدة البيانات. راجِع DATABASE_URL."
    exit 1
fi

PG_VERSION=$(psql "$DATABASE_URL" -Atc "SHOW server_version_num;")
echo "  ✓ تمّ الاتصال — PostgreSQL نسخة $PG_VERSION"

# ─── staging directory ────────────────────────────────────────────────────────
mkdir -p "$OUT_DIR"
chmod 0700 "$OUT_DIR"
echo "📦 مجلّد الإخراج: $OUT_DIR"

# ─── 1. schema (DDL only) ─────────────────────────────────────────────────────
echo "📐 تصدير البنية (schema) …"
pg_dump "$DATABASE_URL" \
    --schema-only \
    --no-owner --no-privileges \
    --schema=public \
    > "$OUT_DIR/schema.sql"
SCHEMA_LINES=$(wc -l < "$OUT_DIR/schema.sql")
echo "  ✓ schema.sql ($SCHEMA_LINES سطر)"

# ─── 2. data (plain SQL, portable) ────────────────────────────────────────────
echo "📊 تصدير البيانات بصيغة SQL نصّيّة (محمولة) …"
pg_dump "$DATABASE_URL" \
    --data-only \
    --no-owner --no-privileges \
    --schema=public \
    --column-inserts \
    > "$OUT_DIR/data.sql"
echo "  ✓ data.sql ($(du -h "$OUT_DIR/data.sql" | cut -f1))"

# ─── 3. data (custom format, fast restore) ────────────────────────────────────
echo "🗜️  تصدير البيانات بصيغة pg_dump المضغوطة …"
pg_dump "$DATABASE_URL" \
    --format=custom \
    --no-owner --no-privileges \
    --schema=public \
    --file="$OUT_DIR/data.dump"
echo "  ✓ data.dump ($(du -h "$OUT_DIR/data.dump" | cut -f1))"

# ─── 4. RLS policies (extra copy for audit) ───────────────────────────────────
echo "🔒 استخراج سياسات RLS بشكل مستقلّ …"
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
echo "  ✓ rls_policies.sql ($POLICY_COUNT سياسة)"

# ─── 5. audit_logs → separate CSV (PDPL-critical) ─────────────────────────────
echo "📋 تصدير audit_logs إلى ملف CSV منفصل (مهمّ لـ PDPL) …"
psql "$DATABASE_URL" -AtX \
    -c "\COPY (SELECT * FROM audit_logs ORDER BY created_at) TO STDOUT WITH (FORMAT csv, HEADER true)" \
    > "$OUT_DIR/audit_logs.csv" 2>/dev/null \
    || echo "  ⚠ جدول audit_logs غير موجود أو فارغ (مقبول في قواعد جديدة)"
AUDIT_LINES=$(wc -l < "$OUT_DIR/audit_logs.csv")
echo "  ✓ audit_logs.csv ($AUDIT_LINES سطر)"

# ─── 6. auth users snapshot (NO password hashes) ──────────────────────────────
# We export identifiers + metadata only. Password hashes stay inside Supabase
# Auth; on restore to a new host, users reset their passwords.
echo "👥 تصدير قائمة حسابات المصادقة (بدون كلمات السرّ) …"
psql "$DATABASE_URL" -AtX \
    -c "\COPY (SELECT id, email, created_at, last_sign_in_at, raw_user_meta_data FROM auth.users ORDER BY created_at) TO STDOUT WITH (FORMAT csv, HEADER true)" \
    > "$OUT_DIR/auth_users.csv" 2>/dev/null \
    || echo "  ⚠ تعذّر الوصول إلى auth.users (قد تحتاج صلاحيّات service_role)."
AUTH_LINES=$(wc -l < "$OUT_DIR/auth_users.csv" 2>/dev/null || echo 0)
echo "  ✓ auth_users.csv ($AUTH_LINES سطر)"

# ─── 7. row-count manifest ────────────────────────────────────────────────────
echo "📝 توليد ملفّ الإحصاء (manifest) …"
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

# Build manifest.json
cat > "$OUT_DIR/manifest.json" <<MANIFEST
{
  "basira_version": "v2",
  "export_timestamp": "$TIMESTAMP",
  "export_tool": "scripts/export-full.sh",
  "postgres_version": $PG_VERSION,
  "artifacts": {
    "schema": "schema.sql",
    "data_plain": "data.sql",
    "data_custom": "data.dump",
    "rls_policies": "rls_policies.sql",
    "audit_logs": "audit_logs.csv",
    "auth_users": "auth_users.csv",
    "row_counts": "row_counts.json",
    "checksums": "checksums.sha256"
  },
  "policy_count": $POLICY_COUNT,
  "audit_row_count": $((AUDIT_LINES - 1)),
  "auth_user_count": $((AUTH_LINES - 1)),
  "source_policy": "DT-IS-POL-400 V7 §3.6 (Exit Requirements)",
  "transport_note": "Artifacts must be transported to the receiving host over an encrypted channel and verified with checksums.sha256 before import.",
  "retention_note": "Audit logs retention default 7 years — confirm with Agency per Data Retention Policy v1.0."
}
MANIFEST
echo "  ✓ manifest.json"

# ─── 8. checksums (after all artifacts exist) ─────────────────────────────────
echo "🔐 حساب checksums للتحقّق من السلامة …"
(cd "$OUT_DIR" && sha256sum ./*.sql ./*.dump ./*.csv ./*.json > checksums.sha256 2>/dev/null || true)
echo "  ✓ checksums.sha256"

# ─── 9. bilingual README with restore instructions ────────────────────────────
cat > "$OUT_DIR/README.md" <<'README_EOF'
# Basira Full Export / أرشيف بصيرة الكامل

Produced by `scripts/export-full.sh` per **DT-IS-POL-400 V7 §3.6** (Cloud Exit)
+ **DT-IS-POL-200 V10** (Backup). Referenced from `docs/backup-strategy.md §3.2`.

مُنتَج عبر `scripts/export-full.sh` وفق سياسات HRSD. مرجعه `docs/backup-strategy.md §3.2`.

## Contents / المحتويات

| File / الملف | Purpose / الغرض |
|---|---|
| `schema.sql` | Database DDL — tables, indexes, views, functions |
| `data.sql` | Plain-SQL inserts — portable, slow to restore |
| `data.dump` | pg_dump custom format — fast restore via pg_restore |
| `rls_policies.sql` | RLS policies extracted separately (audit artifact) |
| `audit_logs.csv` | Audit trail — must be retained per PDPL + POL-1300 |
| `auth_users.csv` | Auth users snapshot (NO password hashes) |
| `row_counts.json` | Per-table row counts for verification |
| `manifest.json` | Export metadata |
| `checksums.sha256` | Integrity checksums |

## Integrity Verification / التحقّق من السلامة

```bash
cd basira_YYYYMMDD_HHMMSS
sha256sum -c checksums.sha256
```

يجب أن تُطبَع كلّ الملفّات بعلامة `OK` قبل أيّ عمليّة استرجاع.
All files must print `OK` before any restore operation.

## Restore to a Fresh Postgres Host / الاسترجاع إلى مُضيف Postgres جديد

```bash
# 1. Create target database
createdb -h <host> -U <user> basira_restored

# 2. Fast restore (custom format)
pg_restore \
  --host=<host> --username=<user> --dbname=basira_restored \
  --no-owner --no-privileges \
  data.dump

# 3. Apply RLS policies
psql -h <host> -U <user> -d basira_restored -f rls_policies.sql

# 4. Verify row counts match manifest.json
psql -h <host> -U <user> -d basira_restored -c "
  SELECT tablename,
         (xpath('/row/count/text()',
          query_to_xml('SELECT COUNT(*) FROM public.' || quote_ident(tablename),
                       false, true, '')))[1]::text::bigint AS rows
  FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
"
```

### Auth Users / حسابات المصادقة

On restore to a new auth backend, password hashes cannot be transferred.
Send a password-reset email to every imported account.

عند استرجاع بيانات المصادقة إلى مزوّد جديد، كلمات السرّ المُعاماة لا تُنقَل.
يُرسَل بريد إعادة تعيين كلمة السرّ إلى كلّ حساب مُستَورَد.

## Security Notes / ملاحظات أمنيّة

- **Transport over encrypted channels only** (SFTP/SCP/TLS-protected object storage).
- **Verify checksums before import.**
- **Audit logs must be preserved** per DT-IS-POL-1300 V7 (default retention 7 years).
- **Delete backups securely** when no longer needed (`shred -u` on Linux, or
  cryptographic wipe on object storage).

- **النقل عبر قنوات مُشفَّرة فقط** (SFTP/SCP/مخزن كائنات محميّ بـTLS).
- **التحقّق من checksums قبل الاسترجاع إلزاميّ.**
- **سجلّات التدقيق تُحفَظ** وفق DT-IS-POL-1300 V7 (الافتراضيّ 7 سنوات).
- **الحذف الآمن للنُّسَخ** عند انتفاء الحاجة (`shred -u` أو مسح تشفيريّ).

## Supabase-Specific Caveats / تحفّظات خاصّة بـSupabase

This export does NOT include:

- Storage objects — export separately via Storage API.
- Edge Functions source — check `supabase/functions/` in the Basira repo.
- Project secrets / Vault entries — rotate on target host.
- Webhooks / triggers at the Supabase platform level.

For a truly complete migration, export those separately as per
`docs/backup-strategy.md §3.3-3.4`.
README_EOF

echo "  ✓ README.md (ثنائيّ اللغة)"

# ─── 10. final permissions + summary ──────────────────────────────────────────
chmod -R 0600 "$OUT_DIR"/*
find "$OUT_DIR" -type d -exec chmod 0700 {} +

TOTAL_SIZE=$(du -sh "$OUT_DIR" | cut -f1)

echo
echo "═══════════════════════════════════════════════════════════════════"
echo "✓ اكتمل التصدير"
echo "  المسار      : $OUT_DIR"
echo "  الحجم       : $TOTAL_SIZE"
echo "  السياسات    : $POLICY_COUNT"
echo "  سجلّات تدقيق : $((AUDIT_LINES - 1)) صفّاً"
echo "  حسابات auth  : $((AUTH_LINES - 1))"
echo
echo "  الخطوات التالية:"
echo "    1. التحقّق: (cd $OUT_DIR && sha256sum -c checksums.sha256)"
echo "    2. اختبار استرجاع على قاعدة بيانات تجريبيّة."
echo "    3. النقل عبر قناة مُشفَّرة إلى التخزين البعيد."
echo
echo "  ⚠ ملاحظة: مجلّد backups/ مُستثنى من git — لا تُرفَع النُّسَخ."
echo "═══════════════════════════════════════════════════════════════════"
