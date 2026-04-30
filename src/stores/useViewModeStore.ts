import { create } from 'zustand';

/**
 * Persona model — Phase 2.5 substrate.
 *
 * Reflects Ahmad's directive (2026-04-30): the app is a "starter brick"
 * handed to the ministry. Family is intentionally OUT of scope (handled by
 * a future ministry-built UI via the family-bridge API contract). Vice
 * Minister is also OUT — at that level the artifact is a printed/PPT
 * briefing, not the live app. The highest persona that opens the app is
 * the Wakeel.
 *
 * Each persona carries a scope:
 *   - 'operational' → sees individual beneficiary data, daily flows,
 *     editing rights. STAFF + DEPARTMENT_HEAD live here.
 *   - 'aggregate'   → sees only counts, classifications, KPIs, risk
 *     register summaries. NEVER drills into a beneficiary record.
 *     BRANCH_GM + WAKEEL live here.
 *
 * The application axis "محور الخدمة هو المستفيد" is enforced by this
 * scope split: operational flows are not exposed to aggregate personas,
 * preventing the surveillance-of-staff anti-pattern.
 */

export type Persona =
    | 'WAKEEL'           // وكيل الوزارة للتأهيل والتوجيه الاجتماعي
    | 'BRANCH_GM'        // مدير عام فرع الوزارة
    | 'DEPARTMENT_HEAD'  // رئيس قسم
    | 'STAFF';           // أخصائي اجتماعي / أخصائي علاج طبيعي / طبيب / ...

export type PersonaScope = 'operational' | 'aggregate';

/**
 * Legacy alias map — preserves compatibility for any persisted state or
 * code that still references the old enum during the transition.
 * Remove after Phase 2.5 stabilizes.
 */
const LEGACY_ALIASES: Record<string, Persona> = {
    ADMIN: 'BRANCH_GM',
    DIRECTOR: 'DEPARTMENT_HEAD',
};

const PERSONA_SCOPES: Record<Persona, PersonaScope> = {
    WAKEEL: 'aggregate',
    BRANCH_GM: 'aggregate',
    DEPARTMENT_HEAD: 'operational',
    STAFF: 'operational',
};

/**
 * Display titles for the role switcher. Stored as a structure so the
 * ministry's Digital Transformation team can extend `aliases` later
 * (e.g. مشرف اجتماعي / خبير اجتماعي → all map to STAFF) without
 * changing the canonical Persona enum.
 */
export interface PersonaMeta {
    canonical: string;
    aliases: string[];
}

export const PERSONA_META: Record<Persona, PersonaMeta> = {
    WAKEEL: {
        canonical: 'وكيل التأهيل والتوجيه الاجتماعي',
        aliases: [],
    },
    BRANCH_GM: {
        canonical: 'مدير عام فرع الوزارة',
        aliases: [],
    },
    DEPARTMENT_HEAD: {
        canonical: 'رئيس قسم',
        aliases: ['مشرف خدمات'],
    },
    STAFF: {
        canonical: 'أخصائي',
        aliases: ['أخصائي اجتماعي', 'أخصائي علاج طبيعي', 'مشرف اجتماعي', 'خبير اجتماعي', 'طبيب'],
    },
};

export const personaScope = (persona: Persona): PersonaScope => PERSONA_SCOPES[persona];

export const isAggregatePersona = (persona: Persona): boolean =>
    PERSONA_SCOPES[persona] === 'aggregate';

/** Type guard with legacy migration. Used internally by setView. */
const normalizePersona = (raw: string): Persona => {
    if (raw in PERSONA_SCOPES) return raw as Persona;
    if (raw in LEGACY_ALIASES) return LEGACY_ALIASES[raw];
    return 'STAFF';
};

interface ViewModeState {
    currentView: Persona;
}

interface ViewModeActions {
    setView: (mode: Persona | string) => void;
}

export const useViewModeStore = create<ViewModeState & ViewModeActions>()((set) => ({
    currentView: 'STAFF',
    setView: (mode) => set({ currentView: normalizePersona(mode) }),
}));

/**
 * Backwards-compatible alias — many components still import `ViewMode`.
 * Mark as deprecated so consumers migrate to `Persona` over time.
 *
 * @deprecated Use `Persona` from this module instead.
 */
export type ViewMode = Persona;
