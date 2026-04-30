# ElevenLabs Arabic Voice Research — Governmental Narration

**Date:** 2026-04-23
**Use case:** 20–30 min walkthrough of an MHRSD government system, addressed to deputy ministers (معالي / سعادة) and senior officials
**Target register:** Formal MSA with optional Saudi/Gulf cadence; authoritative, warm-not-casual, measured

---

## 1. TL;DR — Top 3 Voices

Ranked for gravitas + MSA clarity + warmth-without-casualness + Saudi/Gulf fit.

| Rank | Voice | Voice ID | Accent | Why it fits |
|------|-------|----------|--------|-------------|
| 1 | **Saud** | `3nav5pHC1EYvWOd5LmnA` | Saudi MSA | Explicitly described as "clear deep voice with a formal tone, conveying a serious and trustworthy character." Library-listed for **government presentations and formal narration**. Deepest fit for the deputy-minister audience. |
| 2 | **Sultan** | `8KMBeKnOSHXjLqGuWsAE` | Saudi | "Deep and resonant Saudi voice with a warm and trustworthy tone." Slightly warmer than Saud — better if the walkthrough has human/beneficiary-centered segments. |
| 3 | **Arabic Knight** | `G1HOkzin3NMwRHSq60UI` | Neutral MSA | "Deep, clear male voice with a neutral Arabic accent." Safest choice if you want pan-Arab neutrality (no Saudi inflection) for a kingdom-level nomination context. |

**Backups worth auditioning:**
- **Jeddawi** (`yXEnnEln9armDCyhkXcA`) — Saudi Hejazi, confident, good for Jeddah-oriented audiences
- **Yahya** (`QRq5hPRAKf5ZhSlTBH6r`) — deep warm MSA, expressive (use if you want more emotion)
- **Mamdoh** (`68MRVrnQAt8vLbu0FCzw`) — Egyptian, deep, documentary-grade (skip if Saudi feel matters)
- **Majed** / **Omar** — listed in docs; Saudi Najdi cadence / refined MSA with Saudi warmth (voice IDs require Voice Library lookup)

---

## 2. Model choice — use **Eleven Multilingual v2**

| Model | Arabic support | Char limit | When to use |
|-------|----------------|------------|-------------|
| **eleven_multilingual_v2** ✅ | Saudi Arabia + UAE + MSA | 10,000 | **Long-form narration — your pick.** Most consistent voice quality across language switches, best emotional range for professional content. |
| eleven_v3 | 70+ languages, more expressive | 5,000 | Use only if you need dramatic delivery / multi-speaker dialogue. Higher latency, smaller chunks, overkill for walkthrough narration. |
| eleven_flash_v2_5 | 32 languages | 40,000 | Real-time use (~75ms latency). **Audio quality is lower** — don't use for recorded deliverables. |
| eleven_turbo_v2_5 | 32 languages | Large | Same tier as Flash — latency-optimized, not quality-optimized. |

**Decision:** `eleven_multilingual_v2` — it is the documented "polished multilingual narration" model. Chunk the script into 2,000–3,000-char segments for best stability (not the 10k max).

**Known Arabic limitations:**
- **Tashkeel (تشكيل):** No documented explicit-tashkeel handling. Adding full diacritization can help ambiguous words but may also over-constrain pronunciation — **test both with and without tashkeel on proper nouns**.
- **Pronunciation dictionaries:** IPA/CMU phoneme tags work **for English only**. For Arabic you must use **alias tags** (spell the word how you want it pronounced). See §5.
- **Rhythm/intonation:** Multilingual v2 can drift slightly on long Arabic run-on sentences. Break into shorter sentences separated by periods and commas.

---

## 3. Voice settings — formal-narration defaults

ElevenLabs sliders are non-deterministic (they define a range, not a fixed outcome). These are starting points; audition 30 seconds and adjust.

### Primary recommendation (Saud, Sultan, Arabic Knight) — "Official Narration"

```
Stability:           70  (0.70)
Similarity Boost:    85  (0.85)
Style Exaggeration:  10  (0.10)
Speaker Boost:       ON
Model:               eleven_multilingual_v2
```

- **Stability 70** — high enough to eliminate dramatic swings (no unexpected emotional flares on a deputy-minister deliverable), low enough to keep natural prosody. Going to 90+ produces monotone.
- **Similarity Boost 85** — preserves the deep authoritative timbre. Adds latency but you are not real-time.
- **Style 10** — a touch of the voice's natural style, but not theatrical. Governmental register ≠ audiobook narrator.
- **Speaker Boost ON** — improves proper-noun articulation, which matters for وزارة / تأهيل / بصيرة.

### Variant — "Warm Official" (for human-impact sections)

```
Stability:           60
Similarity Boost:    80
Style Exaggeration:  20
Speaker Boost:       ON
```

Use for segments describing beneficiary outcomes, impact stories, welcome/closing lines. Stays formal but allows a slight human lift.

### What NOT to do

- ❌ Stability below 50 → voice may editorialize mid-sentence. Fatal for government context.
- ❌ Style above 35 → drifts toward ad-read / podcast-host tone.
- ❌ Style at 0 → flat, robotic, disengaged. (Lower-style documentation advice is for English audiobooks, not formal Arabic.)

---

## 4. Pricing — which tier you need

| Tier | Price/mo | Credits | ~Minutes | Commercial license |
|------|----------|---------|----------|-------------------|
| Free | $0 | 10,000 | ~10 min | ❌ No |
| Starter | $5 | 30,000 | ~30 min | ✅ Yes |
| **Creator** | **$22** | **100,000** | **~60–100 min** | **✅ Yes (recommended)** |
| Pro | $99 | 500,000 | ~500 min | ✅ Yes |

**Your 20–30 min walkthrough ≈ 18,000–27,000 characters of Arabic text** (Arabic is denser per minute than English; assume ~900 chars/min at narration pace). That fits Starter, but:

- **Creator ($22) is the right pick** because you will re-record, audition, and iterate. Budget ~3x the final length in credits. Also unlocks **Professional Voice Cloning** if you later want a custom voice.
- Multilingual v2 costs **1 credit per character**. Flash/Turbo are 0.5/char — irrelevant here because you want quality.
- Commercial use (presenting to deputy ministers counts) **requires paid tier** — Free tier forbids it in the license.

---

## 5. Pronunciation tips for Saudi governmental terms

Since IPA phoneme tags don't work for Arabic, use **alias substitutions** in a `.pls` pronunciation dictionary, OR (simpler) **inline tashkeel the first occurrence** of each term.

### Common problem terms + fixes

| Written | Problem | Fix (alias or tashkeel) |
|---------|---------|-------------------------|
| وزارة | Sometimes flattened to "wazara" | `وِزارَة` (with fatha on ز) |
| معالي | Risks "ma'aali" vs "ma'aalee" | `مَعَالِي` |
| سعادة | Risk of "sa'aada" schwa on final | `سَعَادَة` |
| بصيرة | Can emerge as "baseera" or "basheera" | `بَصِيرَة` (sheen vs sad matters) |
| الباحة | Sometimes stressed as "al-baahaa" | `الْبَاحَة` |
| تأهيل | Hamza often dropped → "taheel" | `تَأْهِيل` (explicit sukun after hamza) |
| مشرف | Meaning flip (مُشرِف vs مُشرَف) | `مُشْرِف` |
| HRSD / MHRSD | English acronym in Arabic stream | Spell out: `وزارة الموارد البشرية والتنمية الاجتماعية` on first mention, then alias "MHRSD" → "إم إتش آر إس دي" only if you must |
| Al-Qarni (القرني) | Risk of "al-qumni" drift | `القَرْنِي` (explicit fatha + sukun) — the voice-dictation slip also haunts TTS |

### Workflow

1. Start with an **un-diacritized script**.
2. Generate 30-second sample. Listen with headphones.
3. For any mispronounced proper noun, **add tashkeel only on that word** (not the whole script — full tashkeel often makes Multilingual v2 over-enunciate).
4. Re-generate. If still wrong, use pronunciation dictionary alias (spell it phonetically in Arabic letters).

---

## 6. Competitive check — is ElevenLabs actually best?

**Short answer: Yes for naturalness, but Azure is competitive for Saudi-specific voices and may be cheaper at scale.**

- **Azure TTS** has dedicated `ar-SA` neural voices (**HamedNeural** male, **ZariyahNeural** female) scored MOS >4.1. Pronunciation is solid, SSML support is mature (phoneme tags work for Arabic), and pricing is ~$16 per 1M characters — cheaper than ElevenLabs at scale. **Tradeoff:** voices sound slightly more "newsreader-neutral" — less gravitas, less warmth. Good safe fallback; less memorable.
- **Google Cloud TTS** has `ar-XA` Wavenet/Neural2 voices. Quality is behind Azure and ElevenLabs for Arabic. Skip.
- **Amazon Polly** has **Hala** (ar-AE, female) and **Zeina** (ar, female) — both female, neither deep/authoritative. Not suitable for your male deputy-minister-addressing narration.
- **OpenAI TTS** — Arabic is passable but not production-grade for governmental register. Skip.

**Recommendation:** Use ElevenLabs (Saud / Sultan / Arabic Knight) for the deliverable. Keep Azure `ar-SA-HamedNeural` as a backup if you need faster re-renders or ElevenLabs credits run out.

---

## 7. Ready-to-use prompt for ElevenLabs' custom voice generator

If you want to **clone a specific style** via ElevenLabs' Voice Design / text-to-voice prompt (the generator that creates a voice from a description):

```
A senior Saudi male government spokesperson in his late 40s. Deep, resonant baritone
with a measured, unhurried delivery. Speaks classical Modern Standard Arabic with
subtle Najdi cadence — authoritative without being stern, warm without being casual.
Conveys institutional gravitas, the kind of voice you hear addressing His Excellency
the Deputy Minister at a formal briefing. Clean articulation of classical Arabic
letters (ض، ظ، ع، ح، ق). No dramatic flair, no ad-read brightness. Steady breath,
moderate pace, occasional weighted pauses after key policy terms. Timbre similar to
a seasoned Saudi Shura Council announcer or a veteran Al-Ekhbariya news anchor
reading a royal decree.
```

Paste into ElevenLabs Voice Design → generate 3 candidates → save the best as a Voice and apply settings from §3.

---

## 8. Citations

- [ElevenLabs Arabic Voices — json2video catalog](https://json2video.com/ai-voices/elevenlabs/languages/arabic/)
- [ElevenLabs Free Arabic TTS page](https://elevenlabs.io/text-to-speech/arabic)
- [ElevenLabs Models documentation](https://elevenlabs.io/docs/overview/models)
- [ElevenLabs Voices documentation](https://elevenlabs.io/docs/overview/capabilities/voices)
- [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
- [ElevenLabs Pronunciation Dictionaries docs](https://elevenlabs.io/docs/cookbooks/text-to-speech/pronunciation-dictionaries)
- [ElevenLabs Voice Settings — SDK docs](https://elevenlabs-sdk.mintlify.app/speech-synthesis/voice-settings)
- [ElevenLabs Pricing (2026) — BIGVU breakdown](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/)
- [ElevenLabs Pricing — official](https://elevenlabs.io/pricing)
- [Azure TTS Arabic voices — language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)
- [Azure AI voices in Arabic — improved pronunciation (Microsoft blog)](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-ai-voices-in-arabic-improved-pronunciation/4360306)
- [ElevenLabs Cheat Sheet 2026 — webfuse](https://www.webfuse.com/elevenlabs-cheat-sheet)
