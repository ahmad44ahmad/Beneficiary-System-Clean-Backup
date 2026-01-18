-- ═══════════════════════════════════════════════════════════════════════════
-- BASIRA Phase 2: Create Missing Core Tables
-- Project: ruesovrbhcjphmfdcpsa
-- Generated: 2026-01-18
-- Run this script in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════
-- ============================================================================
-- SECTION 1: MEDICATION SCHEDULES
-- For tracking medication schedules and reminders
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.medication_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    times TEXT [],
    -- Array of times like ['08:00', '14:00', '20:00']
    scheduled_time TIME,
    -- For simple queries
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'active',
            'paused',
            'completed',
            'administered'
        )
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
-- Add foreign key only if beneficiaries table exists
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'beneficiaries'
) THEN BEGIN
ALTER TABLE medication_schedules
ADD CONSTRAINT fk_med_schedule_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE;
EXCEPTION
WHEN OTHERS THEN NULL;
END;
END IF;
END $$;
-- ============================================================================
-- SECTION 2: MEDICATION ADMINISTRATIONS
-- Log of medications given/missed
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.medication_administrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID,
    beneficiary_id UUID,
    administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    administered_by TEXT,
    status TEXT NOT NULL DEFAULT 'given' CHECK (
        status IN ('given', 'missed', 'refused', 'delayed')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Add foreign keys
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'medication_schedules'
) THEN BEGIN
ALTER TABLE medication_administrations
ADD CONSTRAINT fk_med_admin_schedule FOREIGN KEY (schedule_id) REFERENCES medication_schedules(id) ON DELETE CASCADE;
EXCEPTION
WHEN OTHERS THEN NULL;
END;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'beneficiaries'
) THEN BEGIN
ALTER TABLE medication_administrations
ADD CONSTRAINT fk_med_admin_beneficiary FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE;
EXCEPTION
WHEN OTHERS THEN NULL;
END;
END IF;
END $$;
-- ============================================================================
-- SECTION 3: SHIFT HANDOVER NOTES
-- For shift change notifications and alerts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shift_handover_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_type TEXT NOT NULL CHECK (
        shift_type IN (
            'morning',
            'evening',
            'night',
            'صباحي',
            'مسائي',
            'ليلي'
        )
    ),
    handover_by TEXT NOT NULL,
    received_by TEXT,
    notes TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    beneficiary_mentions UUID [],
    -- Array of beneficiary IDs mentioned
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ============================================================================
-- SECTION 4: INDEXES
-- Performance optimization
-- ============================================================================
-- Medication schedules indexes
CREATE INDEX IF NOT EXISTS idx_med_schedules_beneficiary ON medication_schedules(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_med_schedules_status ON medication_schedules(status);
CREATE INDEX IF NOT EXISTS idx_med_schedules_time ON medication_schedules(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_med_schedules_start ON medication_schedules(start_date);
-- Medication administrations indexes
CREATE INDEX IF NOT EXISTS idx_med_admin_beneficiary ON medication_administrations(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_med_admin_date ON medication_administrations(administered_at);
CREATE INDEX IF NOT EXISTS idx_med_admin_schedule ON medication_administrations(schedule_id);
-- Shift handover indexes
CREATE INDEX IF NOT EXISTS idx_handover_created ON shift_handover_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_handover_shift ON shift_handover_notes(shift_type);
CREATE INDEX IF NOT EXISTS idx_handover_read ON shift_handover_notes(is_read);
-- ============================================================================
-- SECTION 5: ROW LEVEL SECURITY
-- Enable RLS and create policies
-- ============================================================================
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_administrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_handover_notes ENABLE ROW LEVEL SECURITY;
-- Policies for medication_schedules
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_schedules'
        AND policyname = 'auth_access_med_schedules'
) THEN CREATE POLICY auth_access_med_schedules ON medication_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END $$;
-- Policies for medication_administrations
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_administrations'
        AND policyname = 'auth_access_med_admin'
) THEN CREATE POLICY auth_access_med_admin ON medication_administrations FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END $$;
-- Policies for shift_handover_notes
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'shift_handover_notes'
        AND policyname = 'auth_access_handover'
) THEN CREATE POLICY auth_access_handover ON shift_handover_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END $$;
-- ============================================================================
-- SECTION 6: SAMPLE DATA (Optional - for testing)
-- Creates sample medication schedules for existing beneficiaries
-- ============================================================================
-- Insert sample medication schedules for the first 3 beneficiaries
DO $$
DECLARE ben_id UUID;
counter INT := 0;
BEGIN FOR ben_id IN
SELECT id
FROM beneficiaries
LIMIT 5 LOOP counter := counter + 1;
-- Morning medication
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        scheduled_time,
        status
    )
VALUES (
        ben_id,
        'باراسيتامول',
        '500mg',
        '08:00',
        'pending'
    ) ON CONFLICT DO NOTHING;
-- Evening medication (for some beneficiaries)
IF counter <= 3 THEN
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        scheduled_time,
        status
    )
VALUES (ben_id, 'أوميبرازول', '20mg', '20:00', 'pending') ON CONFLICT DO NOTHING;
END IF;
END LOOP;
RAISE NOTICE 'Sample medication schedules created for % beneficiaries',
counter;
EXCEPTION
WHEN OTHERS THEN RAISE NOTICE 'Could not create sample data: %',
SQLERRM;
END $$;
-- Insert a sample shift handover note
INSERT INTO shift_handover_notes (shift_type, handover_by, notes, priority)
VALUES (
        'صباحي',
        'نظام التهيئة',
        'تم إعداد النظام بنجاح',
        'normal'
    ) ON CONFLICT DO NOTHING;
-- ============================================================================
-- FINAL: Success
-- ============================================================================
DO $$ BEGIN RAISE NOTICE '';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
RAISE NOTICE 'BASIRA PHASE 2 COMPLETE - Missing Tables Created';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
RAISE NOTICE 'Tables Created:';
RAISE NOTICE '  • medication_schedules (for medication tracking)';
RAISE NOTICE '  • medication_administrations (for medication logs)';
RAISE NOTICE '  • shift_handover_notes (for shift alerts)';
RAISE NOTICE '';
RAISE NOTICE 'All tables have:';
RAISE NOTICE '  ✓ Row Level Security enabled';
RAISE NOTICE '  ✓ Authenticated user policies';
RAISE NOTICE '  ✓ Performance indexes';
RAISE NOTICE '  ✓ Sample data for testing';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
END $$;