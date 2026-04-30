# Handoff — 2026-04-28 — Vice Minister Briefing Build

> Session focused on producing the executive briefing deck for **معالي بدر بن إبراهيم السويلم**, newly appointed Vice Minister of HRSD for Social Development. Did NOT touch product code, migrations, or the existing kickoff backlog (002/023/024 still unapplied).

---

## What was produced

**`C:\Users\aass1\Desktop\إيجاز معالي نائب الوزير - بصيرة.pptx`**

- 6 visible slides + 9 hidden expansion slides
- 100% native PowerPoint shapes (text boxes, rectangles, ovals, lines) — fully editable
- Logo top-right + ministry footer on every visible slide
- 9 clickable thumbnails embedded — click → full-screen hidden slide → click image → returns

### Visible deck structure

| # | Title | Purpose |
|---|---|---|
| 1 | الغلاف | Cover — logo, "بصيرة" big, audience attribution |
| 2 | ما هي بصيرة؟ | 4 high-level bullet cards + 2 thumbnails (splash, org structure) |
| 3 | الخيط الذهبي | From daily task → Vision 2030. 5-layer diagram + 2 thumbnails (medication, notifications) |
| 4 | كومة بصيرة | 4-tier audit pyramid (Outcomes → Governance → Operations → Platform) + 3 thumbnails (risk, audit, legal shield) |
| 5 | ثلاث ركائز قابلة للقياس | Dignity / Governance / Investment + 2 thumbnails (compass, family portal) |
| 6 | خاتمة | "نُقدِّم نموذجاً، لا طلباً مالياً" — 3 sections (achieved / focus / invitation) |

### Build pipeline (for iteration)

- `C:\tmp\basira-deck\build-native-pptx.py` — main script
- `C:\tmp\basira-deck\shots\` — 9 curated screenshots + logo
- Re-run: `python3 C:/tmp/basira-deck/build-native-pptx.py`
- Earlier image-based version (HTML/CSS): `C:\tmp\basira-deck\slide{1,2,3}.html` + `C:\dev\basira\scripts\render-slides.mjs` (kept as reference)

---

## Critical decisions locked this session

### Audience name (verified, all variants are wrong)
- ✓ **بدر بن إبراهيم السويلم** (Al-Suwailem)
- Variants seen in AI-generated drafts (and rejected): "بندر", "السليم", "السلم", "آل ألوم"

### No budget ask — default
Ahmad: «ميزانية صفر طلب لا نريد اي ميزانية الان». Closing slide reframed accordingly. Saved as `feedback_no_budget_ask.md` for future executive pitches.

### SROI: 1.75× (not 1.5× and not 2.5×)
- Code formula `src/data/sroiAssumptions.ts` computes ~1.5×
- Live Leadership Compass UI displays **1.75×** (verified via Ahmad's screenshot 050337.png)
- Deck uses 1.75× to match what an auditor would see if he opens the system
- **Open task:** reconcile formula ↔ UI. Not done this session.

### Engine name (memorize)
- ✓ **خوارزمية الإحسان** (Ihsan algorithm) — confirmed in code at `src/components/beneficiary/DignityProfileForm.tsx:26`
- ✗ Wrong variants in NotebookLM drafts: "FSON", "ASON", "آسون", "إيسون"

---

## Strategic backlog (NOT done this session)

The 2026-04-22 handoff backlog is still mostly unaddressed. Picking up where we left off:

1. **Migrations 022/023/024 unapplied** — biggest gap. Leadership Compass still on SEED data. Decisions table doesn't exist in Supabase. The "decisions are permanent" governance rule is currently fictional.
2. **Untracked tree** (5+ days old):
   - `src/modules/grc/components/AddRequirementModal.tsx`
   - `docs/code-strategic-map-2026-04-23.md`
   - `docs/elevenlabs-voice-research-2026-04-23.md`
   - `docs/walkthrough-inventory-2026-04-23.md`
   - `walkthrough-screenshots/` (9.7M of PNGs)
   - `video-production/` (102M of mp3/webm/audio)
   - `scripts/render-slides.mjs` (NEW — added this session)
   - `CLAUDE.md` modification (v2 branch documentation)
3. **Security packet 9/11** — 2 documents short of completion
4. **vm-demo Tier 4** committed but not shipped/reviewed externally

---

## Process learnings worth keeping

- **Claude Design (Anthropic, launched 2026-04-17)** is fast for first drafts but introduces hallucinations: emoji glyphs sneaking into Arabic words ("الم🇸🇦كة"), inverted prepositions ("تستخدم" vs "تَخدم"), and fabricated stats. Always render-and-inspect before delivery.
- **Image-based PPTX is unacceptable** for executive deliverables — Ahmad must be able to edit text in PowerPoint. Use `python-pptx` with native shapes.
- **41 screenshots → 9 picks** is the right ratio for an executive deck. More = clutter.
- **Clickable thumbnails → hidden slides** pattern works in `python-pptx` via `shape.click_action.target_slide` IF you store persistent picture references (proxies are regenerated each iteration).

---

## File status when this handoff was written

- `git status` (branch v2): unchanged from 2026-04-22 list + new files: `scripts/render-slides.mjs`, `docs/vm-pitch-script-2026-04-28.md`, `docs/handoff-2026-04-28-vice-minister-briefing.md`
- Modified: `src/data/sroiAssumptions.ts` (retuned to 1.80×), `src/data/beneficiaries.ts` (added Ahmad Salem id 5001), `src/types/dignity-profile.ts` (Abu Hameed profile updated + Hilal-fans deed)
- Dev server: running on port 5175
- No commits made this session
- No pushes made this session

---

## Late-session additions (last hour)

### 1. Ahmad Salem demo profile + Hilal-fans deed
- New beneficiary in `src/data/beneficiaries.ts` (id `5001`, kunya «أبو حميد»)
- Updated dp1 in `src/types/dignity-profile.ts` to point to id 5001 with corrected preferences (loves شعبي + شيلات, hates silence)
- New deed entry: «إيثار: تَنازُل عن جهاز التحكم لأجل زملائه» (gathered Hilal fans, gave them remote despite folk show he loves) — Ahmad will use this as a demo example for colleagues

### 2. Verbatim pitch script captured
`docs/vm-pitch-script-2026-04-28.md` — the exact words Ahmad will say to Vice Minister Al-Suwailem. **Never paraphrase**. The system must match the script when he points to screens.

### 3. SROI canonical value: 1.80×
- Pitch says «ريالٌ وثمانون هللة»
- `sroiAssumptions.ts` retuned (rehabSuccessRate 0.50, costSavings 0.58, employment 0.20) to compute ~1.80×
- ⚠️ Briefing PPTX still shows 1.75× — needs rebuild before delivery: re-run `python3 C:/tmp/basira-deck/build-native-pptx.py` after editing the two 1.75× occurrences in the script to 1.80×

### 4. UI redesign work for next session (NOT done)
Ahmad explicitly requested redesign of:
- **Pulse Dashboard** (`نبض المركز`) — heatmap red/orange/green must be visually striking, ministerial-grade
- **Smart Alerts panel** (`التنبيهات الذكية`) — clearer heatmap + more credible data
- Distinct view layouts for Vice-Minister vs Wakeel vs Branch-GM personas
- Login screen pillars must show: AI · Institutional Excellence · Compliance

Out of scope this session — context exhausted. Carry forward.
