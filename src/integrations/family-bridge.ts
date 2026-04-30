/**
 * Family Bridge — Phase 2.5 substrate (types only, no implementation).
 *
 * Per Ahmad's directive (2026-04-30), the family of a beneficiary is
 * intentionally OUT of the Basira UI. Families do not authenticate to
 * Basira, do not see operational dashboards, and do not have a persona
 * inside the app.
 *
 * Instead, ministry-authorized contact points (typically the Branch GM
 * after director review) trigger ONE-WAY events that are picked up by a
 * future ministry-built family-facing surface (a small web app behind
 * Saudi النفاذ الوطني الموحد, an SMS link, or WhatsApp Business). This
 * file is the contract between Basira and that future surface.
 *
 * **Not implemented.** No producer, no consumer. Only types and intent.
 *
 * The ministry's Digital Transformation team can:
 *   1. Subscribe to these event types via whatever API surface they
 *      build (REST POST, message queue, internal bus — none of our
 *      concern from Basira's side).
 *   2. Decide on the family-facing UI shape, identity verification, and
 *      compliance — none of which Basira pretends to know.
 *   3. Add additional fields as needed; this file is a starting
 *      contract, not a frozen specification.
 *
 * **Why types-only matters.** A type-only stub forces us to design the
 * data shape carefully without committing the application to producing
 * those events yet. When the ministry is ready, an emit() function +
 * webhook configuration is a small follow-on PR.
 */

/**
 * Beneficiary identifier in family-bridge events.
 *
 * IMPORTANT: this is NOT the internal beneficiaryId. It is a hashed
 * pseudonym that allows the family-facing UI to associate events with a
 * recipient without exposing the internal record key. The hash function
 * + key live in the future implementation, not here.
 */
export type BeneficiaryHash = string;

/** Saudi mobile number, E.164 format. Validated by the producer. */
export type SaudiMobile = string;

/** ISO 8601 timestamp string. */
export type ISOTimestamp = string;

/**
 * Identity of the staff member who reviewed and approved a piece of
 * family-bound content. Used purely for audit by the family-facing
 * surface ("هذا الفيديو راجعه: مدير المركز, 2026-05-01"). The family
 * does not see the staffId — they see the role label.
 */
export interface FamilyReviewer {
    staffId: string;
    role: 'BRANCH_GM' | 'DEPARTMENT_HEAD' | 'STAFF';
    reviewedAt: ISOTimestamp;
}

// ─────────────────────────────────────────────────────────────────────
// Event 1 — VideoReadyEvent
// ─────────────────────────────────────────────────────────────────────

/**
 * Emitted when a short video clip (e.g., "مستفيد يقرأ القرآن لأمّه") has
 * been recorded by staff, reviewed by a manager, and is ready to be
 * delivered to the family.
 *
 * The actual video file is NOT in this event. The family-facing surface
 * fetches it from a signed URL using `videoAccessToken` against
 * ministry-managed storage.
 */
export interface VideoReadyEvent {
    type: 'video.ready';
    eventId: string;
    occurredAt: ISOTimestamp;
    beneficiaryHash: BeneficiaryHash;
    /** Token the family-facing UI exchanges for a signed media URL. */
    videoAccessToken: string;
    /** Token TTL — after this the family must re-request from staff. */
    accessExpiresAt: ISOTimestamp;
    /** One-line caption to be shown above the player. Arabic. */
    caption: string;
    /** Reviewer audit. */
    reviewer: FamilyReviewer;
    /** Delivery channel preference set by the reviewer. */
    deliveryChannel: 'sms' | 'whatsapp' | 'either';
    /** Optional contact override; defaults to family-of-record. */
    deliverTo?: SaudiMobile;
}

// ─────────────────────────────────────────────────────────────────────
// Event 2 — SessionInvite
// ─────────────────────────────────────────────────────────────────────

/**
 * Emitted when staff invites the family to attend a session at the
 * center (family counseling, milestone celebration, intake meeting).
 * The family-facing UI surfaces this as an SMS/WhatsApp message with a
 * single tap-to-confirm and the contact number of the responsible
 * staff member for time changes.
 */
export interface SessionInvite {
    type: 'session.invite';
    eventId: string;
    occurredAt: ISOTimestamp;
    beneficiaryHash: BeneficiaryHash;
    /** Categorical session type — drives copy templates on the receiver side. */
    sessionType:
        | 'family-counseling'
        | 'progress-review'
        | 'celebration'
        | 'discharge-planning'
        | 'admission-intake';
    scheduledAt: ISOTimestamp;
    /** Plain-text location, e.g. "مركز التأهيل الشامل بالباحة - قاعة الإرشاد". */
    location: string;
    /** Contact channel for time changes. Mobile is preferred (Ahmad's directive). */
    contactStaffId: string;
    contactStaffMobile: SaudiMobile;
    /** Optional Arabic note explaining purpose, max 280 chars. */
    note?: string;
}

// ─────────────────────────────────────────────────────────────────────
// Event 3 — ProgressDigest
// ─────────────────────────────────────────────────────────────────────

/**
 * Emitted at a configured cadence (weekly / biweekly) summarizing the
 * beneficiary's progress in plain language. NOT a medical report —
 * dignity-language safe summary highlighting milestones, integration
 * activities, and family-facing reassurance. No diagnosis codes.
 */
export interface ProgressDigest {
    type: 'progress.digest';
    eventId: string;
    occurredAt: ISOTimestamp;
    beneficiaryHash: BeneficiaryHash;
    period: { from: ISOTimestamp; to: ISOTimestamp };
    /** 3-5 bullet points, plain Arabic, dignity-language compliant. */
    highlights: string[];
    /** Optional next-step prompt — "زيارة هذا الأسبوع مرحَّب بها". */
    invitation?: string;
    reviewer: FamilyReviewer;
}

// ─────────────────────────────────────────────────────────────────────
// Union + helper type
// ─────────────────────────────────────────────────────────────────────

/** Discriminated union of all family-bridge events. */
export type FamilyBridgeEvent = VideoReadyEvent | SessionInvite | ProgressDigest;

/**
 * Type guard for narrowing.
 *   if (isVideoReady(e)) { ... e.videoAccessToken ... }
 */
export const isVideoReady = (e: FamilyBridgeEvent): e is VideoReadyEvent => e.type === 'video.ready';
export const isSessionInvite = (e: FamilyBridgeEvent): e is SessionInvite => e.type === 'session.invite';
export const isProgressDigest = (e: FamilyBridgeEvent): e is ProgressDigest => e.type === 'progress.digest';
