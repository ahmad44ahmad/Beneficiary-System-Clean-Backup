# Cybersecurity Alignment — Intake Brief for Next Session

**Created:** 2026-04-22 (end of today's session)
**Branch:** `v2`
**Scope:** Align Basira (frontend + backend + Supabase DB) with the 63 Saudi cybersecurity policies Ahmad shared.
**Session pattern:** This brief is the **first read** for the next Claude session. Read it, then execute.

---

## 0. Context carry-over from today's session

What the new session needs to know before touching anything:

- `v2` branch is live on origin. `main` is tagged `v1.0.0-zero-paper` (the endorsed MHRSD deliverable — do not break).
- Plans already shipped: `PLAN-comprehensive-2026.md`, `docs/dignity-index-v0.md`, `docs/loc-reduction-plan.md`, `docs/linguistic-refactor-inventory.md`, `docs/ui-upgrade-plan-2026-04-22.md`, `docs/drive-inventory-2026-04-22.md`.
- Presentations: `presentations/01-center-executive-profile.md`, `presentations/02-basira-digital-governance.md`, `presentations/03-empowerment-roadmap.md`.
- `.mcp.json` commits a project-scoped Supabase MCP (`project_ref=ruesovrbhcjphmfdcpsa`). Restart Claude Code in this directory so the Supabase MCP tools load.
- Supabase agent skills installed at `.agents/skills/supabase/` and `.agents/skills/supabase-postgres-best-practices/` — read `.agents/skills/supabase/SKILL.md` early.

---

## 1. What Ahmad asked for (exact scope)

1. **Review the 62 cybersecurity policy documents** he shared on Drive (index: file ID `18Dw3Ku7lkvug-vQkNK78w48i70KCKlvS5OK4Lgb_4Tc`, titled *"فهرس بأسماء المستندات الـ 63 الموجودة في مجلد الأمن السيبراني"*).
2. **Review Supabase** (the current DB using the newly loaded project-scoped MCP) — posture, RLS, audit, secrets.
3. **Align Basira** (frontend + backend + DB) to the latest regulations — noting the interplay between the three layers.
4. **Produce a plan** — not a sweeping rewrite.

### Explicit constraints (quoted from Ahmad)

> *"و لا تتشدد لا زلنا في مرحلة التطوير"* — Don't be overly strict; still development phase.

> *"البينات المعقده و صفحة لاغلاق التطبيق و حذف البينات للمستفيدي هذا لن يتم"* — Complex data masking, kill-switch pages, and beneficiary-data-deletion flows — **out of scope**. Reason:

> *"عندما اسلمه الوزارة كل من يطلع عليه من ذوي المصلحة له حق الاطلاع"* — When handed to the ministry, every stakeholder viewing has legitimate viewing rights.

> *"و من سوف يضعها علي الكلاد و يربطها بنفاذ ليس انا بل الوكاله بعد اخذ الموافقات"* — Who puts it in production and connects Nafath is not Ahmad — the Agency does, after approvals.

**Translation for the next Claude:** target **design-time + handover-readiness** alignment, not production-ready security hardening. Don't build features that presume production deployment (kill-switch, GDPR-style erase requests, emergency data-scrubbing). Do ensure code + architecture are **compliance-ready** so the Agency can deploy without retrofitting.

---

## 2. The 63 documents — classified

Source: index file `18Dw3Ku7...` + today's metadata sampling. All files live in Drive folder `1iv82F0dP_TsAjD8uFI4xwipfcX5JMvUZ`. All created 2026-03-12 as Google Docs (Markdown-formatted originals). File-naming convention `DT-IS-POL-{number}_V{version}.md` maps to Saudi **NCA ECC/CSCC** control taxonomy.

### Tier A — Core governance & risk (READ DEEPLY FIRST — ~6 files)

| Code | Title (EN) | Focus for Basira |
|---|---|---|
| `DT-IS-POL-001_V4` | *(likely top-level cybersecurity master policy)* | Gap-analysis reference |
| Governance Policy | Policy ownership + RACI | Who owns what in Basira |
| Policy for governance framework preparation | Governance framework meta-policy | Hierarchy of policies |
| سياسة البنية المؤسسية | Institutional Architecture Policy | Architecture alignment |
| Risk Management Policy + Risk Management Policy 4.0 | 2 versions — use 4.0 | Risk register |
| `DT-IS-FRM-2320` | Cybersecurity Risk Management Framework | Risk method |
| `DT-IS-FRM-520` | Cybersecurity Controls Compliance Management Framework | Control catalog |

### Tier B — Data & privacy (HIGH priority — 8 files)

| Code | Title | Basira relevance |
|---|---|---|
| Personal Data Protection Policy v1.0 | **PDPL alignment** (Saudi law) | Beneficiary PII handling; already pgaudit-instrumented |
| Privacy Notice v1.2 | User-facing privacy notice | Needs a visible notice route in UI |
| Data Privacy Policy (1 + 2) | Duplicates likely; pick newest | Same |
| Data Retention and Disposal Policy v1.0 | Retention + deletion rules | Critical — constrains backups, audit logs, soft-delete behavior |
| Data Sharing Policy v1.0 (×2) | Cross-org sharing | Nafath/ministry integration relevance |
| Data Reference and Moderation Policy v1.0 | سياسة مرجعية البيانات | Master-data references |
| `DT-IS-POL-1000_V10` | Cybersecurity in Data Classification | Beneficiary data is almost certainly "حساس" |

### Tier C — Identity, access, authentication (HIGH — 3 files)

| Code | Title | Basira touchpoint |
|---|---|---|
| `DT-IS-POL-1400` + `DT-IS-POL-1400_V10` | Identity & Authorization Management (V10 is newer) | Supabase auth policies; RLS; role matrix |
| `DT-IS-POL-2400_V4` | Social Media Account Security | Not directly app-relevant |

### Tier D — Infrastructure & operations (MEDIUM — 10 files)

| Code | Title |
|---|---|
| `DT-IS-POL-100_V10` | Asset Management |
| `DT-IS-POL-200_V10` | Backup & Restore Management |
| `DT-IS-POL-300_V9` | Business Continuity |
| `DT-IS-POL-400` + `DT-IS-POL-400_V7` | **Cloud Computing** — critical for Supabase/Vercel |
| `DT-IS-POL-1200_V10` | Terminal Security |
| `DT-IS-POL-2100_V10` | Physical Security |
| `DT-IS-POL-2200_V4` | Remote Work |
| Emergency Management Policy v1.0 | Incident response |

### Tier E — Application security (HIGH for code-side — 7 files)

| Code | Title | Code-side impact |
|---|---|---|
| `DT-IS-POL-3100_V1` | **Systems Development Lifecycle Security** | How we write code — CI checks, SAST |
| Software Development Policy | SDLC generic | Same |
| `DT-IS-POL-800_V10` | Cryptographic | TLS, at-rest encryption, key management |
| `DT-IS-POL-1100_V10` | Email Cybersecurity | Notification email paths in Basira |
| Email Management Policy | Email general | Same |
| `DT-IS-POL-2500_V7` | Technical Assurance | Pen-test + audit posture |
| `DT-IS-POL-1700_V10` | Acceptable Use of Information Assets | Staff usage rules |

### Tier F — Monitoring & audit (MEDIUM — 4 files)

| Code | Title |
|---|---|
| `DT-IS-POL-1300_V7` | Event Log Management & Monitoring |
| `DT-IS-POL-500_V4` | Compliance, Review & Audit |
| Policy for monitoring and managing technical events | Same |
| Performance Monitoring Management Procedures | Operations |

### Tier G — HR & human factors (MEDIUM — 2 files)

| Code | Title |
|---|---|
| `DT-IS-POL-1500_V10` | HR Cybersecurity |
| Project and initiative management policy | PMO governance |

### Tier H — AI-specific (EMERGING — 2 files)

| Code | Title |
|---|---|
| `DT-IS-POL-2900_V1` | AI Cybersecurity Policy |
| `DT-IS-POL-3000_V1` | AI Acceptable Use Policy |

Basira uses Google Generative AI (`@google/generative-ai` in package.json) → relevant.

### Tier I — Reference / user-facing

| Code | Title |
|---|---|
| EV User Guide AR / EN | Probably "EV system" user guide — end-user-facing reference |
| DT-IS-POL-600 V4 / 900 V4 / 1800 (non-versioned) / 2000 V7 / 2800 V3 | Additional policies (not yet classified — probe during session) |

### Quantity reconciliation

Index says 63 docs. Ahmad sent 62 URLs. Possible duplicates in the share list; possible 1-file miss. Work assumption: **63 unique documents exist in the folder; 62 are linked in the request**.

---

## 3. Focus areas — where frontend, backend, and database intersect

| Concern | Frontend | Backend | Supabase |
|---|---|---|---|
| **Identity & session** | Supabase auth UI; JWT handling; logout | Session middleware; refresh-token rotation | Auth schema; MFA for privileged roles |
| **PII exposure** | Masked rendering of national IDs (done, commit `ff10dc4`) | API responses don't leak PII | RLS policies per role × table |
| **Data classification** | UI tags showing sensitivity level | Logging redaction | Column-level classification comments (extend migration 022 pattern) |
| **Event logs** | Client-side action trail | Server-side audit trail | `audit_logs` table + pgaudit already present |
| **Backups** | N/A | N/A | Supabase PITR retention + export policy |
| **Cloud provider posture** | N/A | Vercel region + config | Supabase region + provider (AWS Tokyo / EU) |
| **Cryptographic** | HTTPS only | TLS enforcement | at-rest encryption by Supabase; Vault for secrets |
| **Session timeout** | Auto-logout UI | Token TTL | refresh-token TTL |
| **Access role matrix** | Role-guarded routes | Middleware guards | RLS per role + revocation |

**Rule:** every finding should name all three layers where relevant.

---

## 4. Recommended plan shape (for the next session)

**Phase 1 — Discovery (half a day):**
1. Read Tier A (6 governance docs) deeply.
2. Read Tier B key docs (PDPL + Retention + Data Sharing).
3. Read Tier E key docs (SDLC + Crypto + Technical Assurance).
4. **Supabase audit via MCP**: `list_tables`, `list_extensions`, `get_advisors`, `get_logs` for security level. Map actual RLS policies to Tier B/C requirements.
5. **Frontend audit**: grep for secrets, logging, client-side DB calls without RLS awareness.

**Phase 2 — Gap matrix (1-2 sessions):**
- Produce `docs/security-gap-matrix.md`: each NCA control × (Frontend / Backend / Supabase) × (Current state / Target / Gap / Effort).
- Ahmad reviews — marks "dev-phase OK to defer" vs "fix now".

**Phase 3 — Code + schema alignment:**
- Implement what's marked "fix now" on `v2`.
- Document dev-phase deferrals clearly so the Agency sees them as known-knowns at handover.

**Phase 4 — Handover packet:**
- A single doc that tells the Agency's deployment team: *"When you deploy, here are the 12 things you need to configure that we deliberately left for you (env vars, secrets, Nafath keys, region pinning, etc.)."*

---

## 5. Explicit out-of-scope items (do NOT build these)

Ahmad's direct instruction:

- ❌ Kill-switch page / emergency data wipe
- ❌ Complex PII masking UX (beyond national-ID mask already present)
- ❌ Beneficiary-initiated data-deletion flow
- ❌ Nafath production integration (Agency handles this post-handover)
- ❌ Cloud region migration decisions
- ❌ Production secret management (env var discipline yes; actual secret rotation no)

---

## 6. First 5 actions for the new session

In order:

1. **Restart check** — confirm the Supabase MCP is loaded (should see `mcp__supabase__*` tools).
2. **Read this file** in full + `PLAN-comprehensive-2026.md` §5 (Risk Register) + §6.4 (Schema decisions).
3. **Read Tier A** (6 files) — use `mcp__claude_ai_Google_Drive__read_file_content` for each.
4. **Probe Supabase** via MCP: `list_tables public`, `list_extensions`, `get_advisors type=security`, sample `get_logs`.
5. **Produce the gap matrix** skeleton (not full) — then pause and ask Ahmad which sections to deep-drill first.

**Stopping rule:** if any single file is > 64k chars (see experience with "قيادة التميز المؤسسي" today — saved to `.claude/projects/.../tool-results/` automatically), probe structure with `jq` + read slice-by-slice.

---

## 7. Kickoff prompt Ahmad pastes into the new session

```
أكمل المهمة القادمة: مواءمة تطبيق بصيرة مع لوائح الأمن السيبراني الوزارية (63 وثيقة).

نقطة البداية: اقرأ بالكامل الملف التالي قبل أي إجراء:
C:\dev\basira\docs\security-intake-2026-04-22.md

هذا الملف يحتوي:
- السياق التراكمي من الجلسات السابقة
- تصنيف الـ63 وثيقة في 9 طبقات (A-I) حسب الأولوية
- قيود المهمة الصريحة: لا خارج نطاق، لا صرامة زائدة، مرحلة تطوير فقط
- التداخل بين Frontend / Backend / Supabase — مصفوفة جاهزة
- أول 5 إجراءات مطلوبة
- قاعدة التوقف عند الملفات الضخمة

ابدأ بالفعل رقم 1 في §6 من الملف (التحقق من MCP) ثم تابع بالترتيب.
استخدم goal-level autonomy — لا تسأل خطوة بخطوة.
تجنب CBAHI وتجنب الرمزية الطبية (راجع feedback_pt_project_rules.md).
اعمل على فرع v2. لا تدفع إلى origin دون إذن صريح.
```

---

## 8. Handoff discipline — what should NOT happen in the new session

- ❌ Re-reading what's already inventoried in `docs/drive-inventory-2026-04-22.md` (that was a different set of 46 files).
- ❌ Re-doing Phase 1 of `PLAN-comprehensive-2026.md` (already done).
- ❌ Changing the clothing module, sidebar, or daily-care color (stable).
- ❌ Starting a separate branch. All work lands on `v2`.
- ❌ Closing anything on `main` (it's the endorsed Zero Paper record).

### What SHOULD happen
- ✅ Fresh cache, laser focus on security alignment.
- ✅ Use this brief as the source-of-truth context.
- ✅ Use the Supabase MCP actively (now project-scoped, should appear after restart).
- ✅ Keep findings + gap matrix under `docs/security-*.md`.
- ✅ Commit often, push when a coherent chunk is ready.

---

## 9. Open questions the new session may surface (expect them)

1. **Data classification:** is beneficiary data "حساس" or "سري" in the ministry taxonomy? Needs confirmation from Ahmad or from reading `DT-IS-POL-1000_V10`.
2. **Retention period:** Data Retention Policy v1.0 will specify exact years. Current code has no retention enforcement.
3. **Audit log retention:** pgaudit is on, but Supabase log retention has a ceiling. Does the policy require export?
4. **Nafath integration scope:** the Agency handles it — but should our code **stub** the integration points so they plug in cleanly later? (Recommend yes.)
5. **AI usage scope:** do we use Google Generative AI on beneficiary data, or only on synthetic/anonymized data? (Ahmad's answer determines whether `DT-IS-POL-2900 / 3000` applies critically.)

Raise these to Ahmad after Phase 1 Discovery — not before.

---

**End of intake brief. The new Claude is ready to execute.**
