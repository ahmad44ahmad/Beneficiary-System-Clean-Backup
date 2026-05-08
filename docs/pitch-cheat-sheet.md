---
title: "بصيرة — Pitch Cheat-Sheet"
geometry: margin=15mm
fontsize: 10pt
---

# بصيرة — Pitch Cheat-Sheet

**Demo URL:** `https://beneficiary-system-clean-backup.vercel.app/dashboard?as=demo`

**Auto-signin** as `demo@basira.local` / role=director · `?as=demo` is dropped from the URL bar after ~2s.

**Manual fallback:** `/login` → `demo@basira.local` / `demo-pitch-2026` · **Wi-Fi failure:** `http://localhost:5175/dashboard`

---

## Click order — 8 + 2 bonus

| # | Route | Hit point |
|---|---|---|
| 1 | `/` | بصيرة + 5 ركائز + للدخول |
| 2 | `/dashboard` | لوحة القيادة التنفيذية (Executive Dashboard), Vital Pulse, المساءلة |
| 3 | `/empowerment` | محرك التمكين, 3 مسارات. **Click أبو سعد** → screen 3b. |
| 3b | `/empowerment/dignity/172` | Karama profile: محمد / أبو سعد · cup-of-water dream · first-person fields |
| 4 | `/family-portal` | بوابة الأسرة · يوميات · 4-factor 0–100 · 50% intervention threshold |
| 5 | `/alerts` | 6 alert types: O₂ / حرارة / دواء / سقوط / سلوك / شهية |
| 6 | `/legal-shield` | 4 pillars: CRPD · PDPL · NCA ECC-2:2024 · معايير الوكالة + cert + audit trail |
| 7 | `/quality/manual` | ISO 9001 · 7 chapters · 132 ops |
| 8 | `/sroi` | 1.80:1 · NEF/SSE · deadweight 25% / attribution 30% / displacement 5% |
| + | `/beneficiaries-list` | Excel + طباعة export demo |
| + | `/handover` | RLS proof: «متابعة علامات الجفاف لدى المستفيد محمد (172)» |

---

## Failure modes — quick recovery

| Symptom | Action |
|---|---|
| URL shows `?as=demo` after 5s | Cosmetic only. Continue. |
| `/handover` empty / blank | Re-load with `?as=demo` or `/login` + creds. |
| All Supabase reads error | In-memory fallback still serves screens 1–8. Continue. |
| Old «القياس» heading | Hard reload (Ctrl+F5). If still stale: `vercel rollback`. |
| Wi-Fi totally down | Switch to `localhost:5175` — Vite dev auto-signs in. |
| One screen blank | Skip to next — 8-screen path is independent. |

---

## What NOT to show

- **Supabase Studio** (C3 leaked-password warning visible on Free tier).
- **Vercel project settings** (14 stale POSTGRES_*/NEXT_PUBLIC_* env vars from old marketplace integration).
- **`Debug: Role Switcher` widget** (DEV-only — if it shows on prod, the wrong build was promoted).

---

## Accepted advisor warnings (5 total) — one-liner answers

| C-id | Warning | Answer if reviewer asks |
|---|---|---|
| **C3** | `auth_leaked_password_protection` ×1 | Pro-tier feature; toggle hidden on Free plan. Enabled at production tier upgrade. |
| **C17** | `materialized_view_in_api` ×2 | Authenticated-only SELECT; anon blocked. Private schema would break wellbeingService API surface. |
| **C18** | `rls_policy_always_true` ×2 (audit / ai_decision INSERT) | Append-only; permissive INSERT preserves nurse/secretary audit. SELECT gated to director/admin. |

Pre-Session E: **90 lints** · Post-Session E: **5** (3 accepted, 2 intentional) · **−85 net**.

---

## Anchors

- Beneficiary id **`172`** = محمد / أبو سعد · cup-of-water SMART goal.
- Production deployment: `dpl_DSjcBc61kbgwTVTQ2VfCSHzEzmHr` · target: production.
- Latest v2 commit: `878a415`. Tag: `pitch-prep-session-F`.
- Sources: `docs/pitch-day-playbook.md` · `docs/pitch-rehearsal.md` · `docs/pitch-narrator-ar.md` · `docs/pitch-prep.md` (Session ledger A–F).
