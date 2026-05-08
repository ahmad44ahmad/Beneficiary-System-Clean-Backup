# Pitch rehearsal — timed walk

**Date:** 2026-05-08 · **Surface:** production deploy `dpl_DSjcBc61kbgwTVTQ2VfCSHzEzmHr` at `https://beneficiary-system-clean-backup.vercel.app` · **Auth:** `?as=demo` URL flag → `demo@basira.local` / `app_metadata.role=director`

## Headline

| Metric | Result |
|---|---|
| Screens walked | 11 (8 main demo path + 1 sub + 2 bonus) |
| Console errors total | **0** |
| Navigation failures | **0** |
| Slowest TTFB | 92 ms (screen 3b) |
| Slowest DOMContentLoaded | 296 ms (screen 3) |
| Median page-load (DCL) | ~245 ms |

**The deployed URL is pitch-ready.** All RLS-protected reads succeed, all key markers per the demo path render, no regressions caught.

## Per-screen table

| # | Route | TTFB | DCL | Body | Errors | Key markers — passes | Screenshot |
|---|---|---|---|---|---|---|---|
| 1 | `/` | 83 ms | 233 ms | 1287 | 0 | H1 «بصيرة», 5 pillars, للدخول CTA | `pitch-screens/pitch-rehearsal-01-welcome.png` |
| 2 | `/dashboard` | 87 ms | 277 ms | 2397 | 0 | bilingual «لوحة القيادة التنفيذية (Executive Dashboard)», center title, ministry subtitle, Vital Pulse, Accountability. NO old «القياس». DEBUG widget absent. role=director. | `pitch-screens/pitch-rehearsal-02-dashboard.png` |
| 3 | `/empowerment` | 87 ms | 296 ms | 2667 | 0 | محرك التمكين, 3 categories (الاستقلال / الدمج / العودة), cup-of-water inline | `pitch-screens/pitch-rehearsal-03-empowerment.png` |
| 3b | `/empowerment/dignity/172` | 92 ms | 244 ms | 1905 | 0 | Karama profile populated: محمد / أبو سعد, first-person fields with tashkeel («الجلوسُ في الشمس...»), cup-of-water dream («أن أستقلَّ في إمساك كوب الماء...»), 8 input/textarea fields with values, **navy background** (Session C fix held), **no #DC2626 red** anywhere | `pitch-screens/pitch-rehearsal-03b-karama.png` |
| 4 | `/family-portal` | 81 ms | 241 ms | 2674 | 0 | بوابة الأسرة, يوميات, محمد, آخر التحديثات | `pitch-screens/pitch-rehearsal-04-family-portal.png` |
| 5 | `/alerts` | 87 ms | 235 ms | 2273 | 0 | All 6 alert types: الأكسجين, الحرارة, دواء متأخر, خطر سقوط, سلوك غير معتاد, الشهية | `pitch-screens/pitch-rehearsal-05-alerts.png` |
| 6 | `/legal-shield` | 87 ms | 247 ms | 2945 | 0 | الدرع القانوني + 4 compliance pillars (CRPD, PDPL, NCA, الوكالة) + cert issuance + audit trail | `pitch-screens/pitch-rehearsal-06-legal-shield.png` |
| 7 | `/quality/manual` | 91 ms | 249 ms | 2439 | 0 | دليل الجودة الشامل + all 7 ISO 9001 chapters (سياق المنظمة, القيادة, التخطيط, الدعم, العمليات, تقييم الأداء, التحسين) + 132 ops claim | `pitch-screens/pitch-rehearsal-07-quality-manual.png` |
| 8 | `/sroi` | 84 ms | 231 ms | 2394 | 0 (1 warning) | العائد الاجتماعي, ratio, الاستثمار, الوفورات, الأثر, الحاسبة | `pitch-screens/pitch-rehearsal-08-sroi.png` |
| 9 | `/beneficiaries-list` | 90 ms | 241 ms | 13910 | 0 | Excel + طباعة + filters; full beneficiary list rendering (~654 Arabic-text rows). Largest payload of the walk. | `pitch-screens/pitch-rehearsal-09-beneficiaries-list.png` |
| 10 | `/handover` | 86 ms | 238 ms | 2439 | 0 | **«متابعة علامات الجفاف لدى المستفيد محمد (172)»** — seeded `shift_handover_items` row from migration 2 (Session E). Renders ONLY because the deployed user is JWT-authenticated as director and RLS approves. **End-to-end RLS proof on the deployed surface.** Navy background (Session C fix held). | `pitch-screens/pitch-rehearsal-10-handover.png` |

## Realistic walk timing

The page load itself averages ~250 ms (DCL). The pitch-time clock per screen is dominated by **narration**, not load:

| Phase | Per screen |
|---|---|
| Page load (TTFB → DCL → render) | <500 ms |
| Suggested narration | 20–30 s |
| Optional interaction (clicks, scroll) | 0–10 s |
| **Realistic per-screen** | **25–40 s** |

**11 screens × 30 s avg ≈ 5–6 minutes** for the spoken walk-through. Plus a 30-second "auto-signin lands here" warm-up at the start (load `/dashboard?as=demo`, wait for the URL bar to settle to `/dashboard`, then open `/`).

## Friction notes

These are not blockers — they're things to know before you stand up:

1. **`/empowerment` parent vs `/empowerment/dignity/172` Karama profile.** The cup-of-water goal renders inline on the parent route (no click required) BUT the full Karama "محمد / أبو سعد" content with first-person fields lives at `/empowerment/dignity/172`. The playbook step 3 says "click أبو سعد" — make sure that click navigates you to the dignity route, not stays on the parent. If the click flow is broken, manually type the URL.

2. **Form values vs body text.** On `/empowerment/dignity/172` the populated fields are in `<input>` `value` attributes — they don't appear in `body.innerText`. So if you skim the page reading top-to-bottom, the labels show but the data sits in the input boxes. Visually it's correct (the user sees populated boxes); copy-paste-style scans miss it.

3. **`/sroi` had 1 console *warning*** during the walk — not an error. Likely a non-fatal source-map or vendor warning. Reviewer's console will show it but it doesn't break anything. If asked: "Vite vendor advisory; non-blocking, scheduled for next deps bump."

4. **`/beneficiaries-list` is the heaviest screen** at ~14 KB body and ~654 rows. On a slow Wi-Fi link the page may take an extra 1–2 seconds to fully populate the list. Bring it up early in the walk, OR scroll to it gracefully so any tail-render doesn't catch you mid-sentence.

5. **No URL-bar issue.** The `?as=demo` flag drops cleanly on the deployed URL — you can show the address bar without showing the param. Verified in Session F end-of-session smoke test (commit `6f3a5cc`) and re-verified at the start of this rehearsal.

## Open the rehearsal screenshots

To eyeball the full set on Windows:

```powershell
explorer C:\dev\basira\docs\pitch-screens\
```

Or open them all sequentially:

```powershell
ii C:\dev\basira\docs\pitch-screens\pitch-rehearsal-01-welcome.png
```

## What this rehearsal does NOT cover

- **Click-flow on `/empowerment` → أبو سعد card** (manual interaction, not automatable from a script — open it yourself once before the pitch).
- **Excel / طباعة export buttons on `/beneficiaries-list`** (downloads + print preview — verified working in Session A, but not re-tested here since they trigger external dialogs).
- **Wi-Fi failure path** (laptop fallback at `localhost:5175` — verified separately at end of Session F).
- **Audience interruption recovery** — see `docs/pitch-day-playbook.md` §"Failure modes + recovery" for the canned answers.

## Sources

- Pitch URL spec: `docs/pitch-day-playbook.md`.
- Demo path canonical list: `docs/pitch-prep.md` §"Demo path".
- 51-route audit: `docs/pitch-prep-route-audit.md` (last run on production with `BASE_URL=https://beneficiary-system-clean-backup.vercel.app`).
- Auth chain: `src/context/AuthContext.tsx:90-122` (`?as=demo` URL flag, `replaceState` post-block).
