-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة v2 — بوصلة القيادة (Leadership Compass)
-- Migration 024 | 2026-04-22
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Purpose: foundational schema for the Leadership Compass — a strategic-level
-- surface that presents DECISIONS (not just data) to senior leadership.
-- Per Ahmad's 2026-04-22 decisions: audience starts at Deputy for Development
-- and Director General, hybrid input (analytical + human), every decision
-- preserved (we learn from where outcomes land), honest-mirror enabled.
--
-- Reference spec: docs/strategic-decision-room-proposal.md
-- ═══════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 1. strategic_decisions — the decision ledger                                │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS strategic_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Classification
    level TEXT NOT NULL CHECK (level IN ('center', 'branch', 'sector', 'agency', 'ministry')),
    category TEXT NOT NULL CHECK (category IN (
        'budget',              -- ميزانيّة
        'policy',              -- سياسة
        'expansion',           -- تعميم/توسعة
        'escalation',          -- تصعيد مخاطرة
        'partnership',         -- شراكة استراتيجيّة
        'intervention',        -- تدخُّل خاصّ
        'governance',          -- حوكمة
        'other'
    )),

    -- Core content
    title TEXT NOT NULL,
    question TEXT NOT NULL,                   -- ما القرار بالضبط؟
    recommendation TEXT NOT NULL,              -- التوصية
    recommendation_reason TEXT,                -- السبب الواحد الحاسم

    -- Alternatives (up to ~3)
    alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- [{title, pros, cons, estimatedCost, estimatedImpact}]

    -- Evidence stack
    evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- [{type: 'data'|'precedent'|'risk'|'policy'|'expert', summary, source, linkTo}]

    -- Consequences per choice
    consequences JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- {ifApproved: {impact, risk, timeline}, ifDelayed: {...}, ifRejected: {...}}

    -- Financial + social impact
    estimated_cost_sar NUMERIC(14, 2),
    estimated_sroi DECIMAL(5, 2),              -- العائد الاجتماعي المتوقع (multiplier)
    affected_beneficiaries_count INTEGER,

    -- Connection to barrier compass (§6.2 of launchpad)
    barrier_types_addressed TEXT[],            -- array of B1..B10 codes

    -- Timing
    deadline DATE,
    urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),

    -- Ownership
    recommended_by_role TEXT,                  -- e.g. 'center_director', 'analyst', 'system'
    recommended_by_user_id UUID,               -- NULL if system-generated
    owner_role TEXT NOT NULL,                  -- who must decide

    -- Status (the lifecycle)
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'draft',                -- مسودّة — قيد الإعداد
        'pending',              -- مُعلَّق — بانتظار القرار
        'approved',             -- مُوافَق عليه
        'rejected',             -- مرفوض
        'delayed',              -- مُؤجَّل
        'more_evidence',        -- طلب مزيد من الأدلّة
        'expired',              -- انقضى الموعد دون قرار
        'superseded'            -- استُبدِل بقرار آخر
    )),

    -- Decision trail
    decided_at TIMESTAMPTZ,
    decided_by_user_id UUID,
    decision_notes TEXT,                       -- ملاحظات من صاحب القرار

    -- Outcome tracking (the learning loop — Ahmad's explicit requirement)
    outcome_3mo JSONB,                         -- {actual_impact, actual_cost, variance_notes}
    outcome_6mo JSONB,
    outcome_12mo JSONB,
    outcome_lesson TEXT,                       -- درسٌ مُستخلَص للذاكرة المؤسّسيّة

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategic_decisions_status_urgency
    ON strategic_decisions (status, urgency DESC, deadline ASC);
CREATE INDEX IF NOT EXISTS idx_strategic_decisions_level ON strategic_decisions (level);
CREATE INDEX IF NOT EXISTS idx_strategic_decisions_category ON strategic_decisions (category);

COMMENT ON TABLE strategic_decisions IS
    'تصنيف: محدود (Restricted). بوصلة القيادة — سجلّ القرارات الاستراتيجيّة. '
    'كلّ قرار يَبقى دائماً (لا حذف) للتعلُّم المؤسّسيّ — قرار أحمد 2026-04-22.';

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 2. honest_mirror_findings — structural issues surfaced automatically        │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS honest_mirror_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What rule detected this
    rule_code TEXT NOT NULL,                   -- e.g. 'STUCK_BENEFICIARIES'
    rule_description TEXT NOT NULL,            -- وصف القاعدة بالعربيّة

    -- What was found
    finding_headline TEXT NOT NULL,            -- السطر العلوي (موجز)
    finding_detail TEXT,                       -- الشرح الأطول
    supporting_data JSONB DEFAULT '{}'::jsonb, -- الأرقام والروابط الداعمة

    -- Severity + action
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'watch', 'concern', 'urgent')),
    suggested_action TEXT,                     -- ماذا يُنصَح بفعله
    related_decision_id UUID REFERENCES strategic_decisions(id),

    -- Lifecycle
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'addressed', 'dismissed')),
    acknowledged_by_user_id UUID,
    acknowledged_at TIMESTAMPTZ,
    resolution_notes TEXT,

    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mirror_findings_status_severity
    ON honest_mirror_findings (status, severity DESC, last_confirmed_at DESC);

COMMENT ON TABLE honest_mirror_findings IS
    'تصنيف: محدود (Restricted). المرآة الصادقة — تَعرض أنماطاً بنيويّة '
    'يَرى النظام أنّها تَستحقّ نظر القيادة، حتى لو غير مُريحة.';

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 3. Row-Level Security                                                       │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- Leadership Compass is restricted to strategic-leader roles + director + admin.
-- At dev phase we enable RLS but keep policies permissive for demo;
-- the Agency tightens these at deployment per POL-1400 §3.2-3.4.

ALTER TABLE strategic_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE honest_mirror_findings ENABLE ROW LEVEL SECURITY;

-- Placeholder policies — restrict later via JWT claims at handover.
DROP POLICY IF EXISTS "strategic_decisions_select_leadership" ON strategic_decisions;
CREATE POLICY "strategic_decisions_select_leadership"
    ON strategic_decisions FOR SELECT
    USING (true);  -- Dev: all authenticated; Production: restrict by role claim

DROP POLICY IF EXISTS "strategic_decisions_insert_leadership" ON strategic_decisions;
CREATE POLICY "strategic_decisions_insert_leadership"
    ON strategic_decisions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "strategic_decisions_update_leadership" ON strategic_decisions;
CREATE POLICY "strategic_decisions_update_leadership"
    ON strategic_decisions FOR UPDATE
    USING (true);

-- No DELETE policy. Decisions are never deleted — this enforces Ahmad's
-- requirement that every decision be preserved for institutional learning.
-- Attempts to DELETE will be rejected by RLS.

DROP POLICY IF EXISTS "honest_mirror_all_leadership" ON honest_mirror_findings;
CREATE POLICY "honest_mirror_all_leadership"
    ON honest_mirror_findings FOR ALL
    USING (true) WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 4. Classification comments (extends migration 023)                          │
-- └─────────────────────────────────────────────────────────────────────────────┘

COMMENT ON COLUMN strategic_decisions.evidence IS
    'Restricted — may reference sensitive operational data. Retain 7 years minimum.';

COMMENT ON COLUMN strategic_decisions.outcome_3mo IS
    'Retained indefinitely. Institutional learning record — per Ahmad 2026-04-22.';

-- ═══════════════════════════════════════════════════════════════════════════════
-- End of migration 024
-- ═══════════════════════════════════════════════════════════════════════════════
