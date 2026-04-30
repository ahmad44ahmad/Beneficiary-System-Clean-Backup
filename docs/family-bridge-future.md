# Family Bridge — Future Integration Notes

**Audience:** Ministry Digital Transformation team (وكالة التحول الرقمي)
who will integrate Basira with a future family-facing surface.

**Status:** Types-only stub at `src/integrations/family-bridge.ts`. No
producer, no consumer, no implementation. This document explains how
the contract was designed so a future PR can wire it up.

---

## 1. Why family is out of Basira's UI

Basira is a center-staff tool. Adding a family-authentication path
inside the same SPA would:

- Mix two compliance surfaces (staff identity + citizen identity) in one
  codebase, which the ministry's information-security policy treats
  separately.
- Pull family UX requirements (low-bandwidth, intermittent connection,
  varying device generations) into a tool optimized for desktop kiosks
  and tablets at the center.
- Create a single point where a regression on the staff side could
  affect citizen-facing surfaces, raising the impact tier.

The cleaner architecture: Basira emits events, a separate
ministry-managed surface (or SMS/WhatsApp Business templates) consumes
them.

---

## 2. The three events

Defined in `src/integrations/family-bridge.ts`:

| Event | When | What it carries |
|---|---|---|
| `VideoReadyEvent` | Staff records and a manager approves a short clip | Access token (NOT the file), caption, reviewer, channel preference |
| `SessionInvite` | Staff invites family to a center event | Session type, time, location, contact staff phone |
| `ProgressDigest` | Periodic summary (weekly/biweekly) | 3-5 highlight bullets, optional invitation, reviewer |

Common contract:

- All events identify the beneficiary by **hash**, never by internal
  ID. The hash function lives in the producing service when it's built
  — Basira does not commit to a specific algorithm here.
- All events include a **reviewer** record (staff ID + role + timestamp)
  for audit.
- All events are **one-way**. Basira does not consume responses; the
  family-facing surface does.

---

## 3. What the integrating team needs to decide

These are deliberately not specified in the type stub. They depend on
ministry infrastructure choices that Basira should not pre-empt:

1. **Transport**: webhook POST? message queue? internal event bus?
2. **Identity**: how the family-facing UI authenticates a recipient
   (likely النفاذ الوطني الموحد + the beneficiary hash, but the
   mapping table is the ministry's to maintain).
3. **Storage**: where the actual video files live and how
   `videoAccessToken` exchanges for a signed URL.
4. **Retention**: how long videos and event records persist after
   delivery; tied to legal retention policy for guardian
   communications.
5. **Channel routing logic**: when to fall back from WhatsApp to SMS,
   how to handle bounced messages.

The Basira side stays small: when the producing service is wired in, it
emits events and forgets.

---

## 4. Suggested integration sequence (when ministry is ready)

1. Ministry team builds the family-facing receiver (independent of
   Basira). Decides on auth + storage.
2. A separate Basira PR adds a thin producer in
   `src/integrations/family-bridge-producer.ts`:
   - One emit function per event type.
   - Calls into whatever transport the ministry chose.
   - Hashing the beneficiary ID happens here.
3. The center-side UI gains a "إرسال للأهل" button on the appropriate
   screens (after director approval, per Ahmad's workflow). The button
   calls the producer.
4. End-to-end test on staging with one real beneficiary and one real
   guardian phone number.

No changes are required to the type-stub file when (1) and (2) ship.
The types are the stable contract.

---

## 5. Why types-only is the right amount of work now

- We surface the contract early so the ministry team can react and
  amend it.
- We do not commit Basira to producing events that infrastructure does
  not yet exist to receive.
- We do not block Phase 2.5 substrate work on a dependency we can't
  resolve from inside the center.

If the ministry team rejects the contract entirely, the cost is a
single file deletion. Cheap insurance.

---

## 6. Cross-references

- Type stub: `src/integrations/family-bridge.ts`
- Brand identity: `~/.claude/projects/C--Users-aass1/memory/reference_hrsd_brand_identity.md`
- Dignity language for highlights: `src/design-system/dignity-language.ts`
- Original decision context (Arabic transcript): session memory
  `session_2026-04-30_basira-brand-migration.md`
