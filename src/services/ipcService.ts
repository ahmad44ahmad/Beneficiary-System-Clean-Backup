import { supabase } from '../config/supabase';

// ═══════════════════════════════════════════════════════════════════════════════
// IPC Service - مكافحة العدوى
// ═══════════════════════════════════════════════════════════════════════════════

// Types
export interface Location {
    id: string;
    name: string;
    name_en?: string;
    section: string;
    building: string;
    floor: number;
    capacity?: number;
    is_high_risk: boolean;
}

export interface IPCIncident {
    id: string;
    incident_category: string;
    detection_date: string;
    detection_time?: string;
    affected_type: 'beneficiary' | 'staff' | 'visitor';
    beneficiary_id?: string;
    reported_by: string;
    location_id?: string;
    infection_site?: string;
    pathogen_identified?: string;
    symptoms: string[];
    onset_date?: string;
    severity_level: 'mild' | 'moderate' | 'severe' | 'critical';
    immediate_actions: string[];
    isolation_required: boolean;
    isolation_type?: string;
    status: 'open' | 'investigating' | 'containment' | 'resolved' | 'closed';
    assigned_to?: string;
    investigation_notes?: string;
    root_cause?: string;
    outcome?: string;
    created_at: string;
}

export interface IPCInspection {
    id: string;
    inspection_date: string;
    inspection_time?: string;
    shift: string;
    inspector_name: string;
    location_id: string;
    location?: Location;
    checklist_template_id?: string;
    checklist_data: Record<string, boolean>;
    total_items: number;
    compliant_items: number;
    compliance_score: number;
    non_compliance_details?: string;
    corrective_actions?: string;
    follow_up_required: boolean;
    evidence_photos?: string[];
    created_at: string;
}

export interface ChecklistTemplate {
    id: string;
    template_name: string;
    template_name_ar: string;
    category: string;
    checklist_items: Record<string, { ar: string; weight: number; category: string }>;
    is_active: boolean;
}

export interface Immunization {
    id: string;
    person_type: 'beneficiary' | 'staff';
    beneficiary_id?: string;
    staff_name?: string;
    vaccine_code: string;
    vaccine_name: string;
    vaccine_name_ar?: string;
    dose_number: number;
    total_doses: number;
    date_administered: string;
    next_due_date?: string;
    immunity_status: string;
    adverse_reaction: boolean;
}

export interface IPCStats {
    totalInspections: number;
    avgComplianceRate: number;
    complianceTrend: number;
    activeIncidents: number;
    incidentsTrend: number;
    immunizationRate: number;
    pendingFollowups: number;
}

// Demo Data
const DEMO_LOCATIONS: Location[] = [
    { id: '1', name: 'جناح الذكور - الدور الأول', section: 'ذكور', building: 'المبنى الرئيسي', floor: 1, is_high_risk: false },
    { id: '2', name: 'جناح الذكور - الدور الثاني', section: 'ذكور', building: 'المبنى الرئيسي', floor: 2, is_high_risk: false },
    { id: '3', name: 'جناح الإناث - الدور الأول', section: 'إناث', building: 'المبنى الرئيسي', floor: 1, is_high_risk: false },
    { id: '4', name: 'العيادة الطبية', section: 'خدمات', building: 'المبنى الرئيسي', floor: 0, is_high_risk: true },
    { id: '5', name: 'غرفة العزل', section: 'خدمات', building: 'المبنى الرئيسي', floor: 0, is_high_risk: true },
    { id: '6', name: 'المطبخ الرئيسي', section: 'خدمات', building: 'المبنى الرئيسي', floor: 0, is_high_risk: true },
];

const DEMO_CHECKLIST_TEMPLATE: ChecklistTemplate = {
    id: 'demo-1',
    template_name: 'Daily IPC Round',
    template_name_ar: 'الجولة اليومية لمكافحة العدوى',
    category: 'hygiene',
    is_active: true,
    checklist_items: {
        hand_moment_1: { ar: 'قبل ملامسة المريض/المستفيد', weight: 10, category: '5_moments' },
        hand_moment_2: { ar: 'قبل الإجراء التعقيمي', weight: 10, category: '5_moments' },
        hand_moment_3: { ar: 'بعد التعرض لسوائل الجسم', weight: 10, category: '5_moments' },
        hand_moment_4: { ar: 'بعد ملامسة المريض/المستفيد', weight: 10, category: '5_moments' },
        hand_moment_5: { ar: 'بعد ملامسة محيط المريض', weight: 10, category: '5_moments' },
        sanitizer_available: { ar: 'توفر المعقم في نقاط الرعاية', weight: 5, category: 'supplies' },
        soap_filled: { ar: 'موزعات الصابون ممتلئة', weight: 5, category: 'supplies' },
        ppe_gloves: { ar: 'توفر القفازات بأحجام متعددة', weight: 8, category: 'ppe' },
        ppe_gowns: { ar: 'توفر العباءات الواقية', weight: 8, category: 'ppe' },
        ppe_masks: { ar: 'توفر الكمامات الطبية', weight: 8, category: 'ppe' },
        waste_yellow: { ar: 'فرز النفايات الطبية (الحاوية الصفراء)', weight: 8, category: 'waste' },
        sharps_safe: { ar: 'حاويات الأدوات الحادة آمنة', weight: 8, category: 'waste' },
    }
};

const DEMO_STATS: IPCStats = {
    totalInspections: 24,
    avgComplianceRate: 87,
    complianceTrend: 3,
    activeIncidents: 2,
    incidentsTrend: -1,
    immunizationRate: 94,
    pendingFollowups: 5,
};

// Helper
const logError = (context: string, error: any) => {
    if (import.meta.env.DEV) {
        console.error(`[IPCService] ${context}:`, error);
    }
};

const isSupabaseReady = (): boolean => !!supabase;

// ═══════════════════════════════════════════════════════════════════════════════
// Service
// ═══════════════════════════════════════════════════════════════════════════════

export const ipcService = {
    // المواقع
    async getLocations(): Promise<Location[]> {
        if (!isSupabaseReady()) return DEMO_LOCATIONS;

        try {
            const { data, error } = await supabase
                .from('locations')
                .select('*')
                .order('section');

            if (error || !data?.length) return DEMO_LOCATIONS;
            return data;
        } catch (error) {
            logError('getLocations', error);
            return DEMO_LOCATIONS;
        }
    },

    // قوالب قوائم التحقق
    async getChecklistTemplates(): Promise<ChecklistTemplate[]> {
        if (!isSupabaseReady()) return [DEMO_CHECKLIST_TEMPLATE];

        try {
            const { data, error } = await supabase
                .from('ipc_checklist_templates')
                .select('*')
                .eq('is_active', true);

            if (error || !data?.length) return [DEMO_CHECKLIST_TEMPLATE];
            return data;
        } catch (error) {
            logError('getChecklistTemplates', error);
            return [DEMO_CHECKLIST_TEMPLATE];
        }
    },

    // جولات التفتيش
    async getInspections(limit: number = 50): Promise<IPCInspection[]> {
        if (!isSupabaseReady()) return [];

        try {
            const { data, error } = await supabase
                .from('ipc_inspections')
                .select(`*, locations(*)`)
                .order('inspection_date', { ascending: false })
                .limit(limit);

            if (error) {
                logError('getInspections', error);
                return [];
            }
            return data || [];
        } catch (error) {
            logError('getInspections', error);
            return [];
        }
    },

    async saveInspection(inspection: Partial<IPCInspection>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            console.log('[IPCService] Demo mode - inspection not saved:', inspection);
            return { success: true, id: 'demo-' + Date.now() };
        }

        try {
            const { data, error } = await supabase
                .from('ipc_inspections')
                .insert(inspection)
                .select('id')
                .single();

            if (error) {
                logError('saveInspection', error);
                return { success: false };
            }
            return { success: true, id: data.id };
        } catch (error) {
            logError('saveInspection', error);
            return { success: false };
        }
    },

    // حوادث العدوى
    async getIncidents(status?: string): Promise<IPCIncident[]> {
        if (!isSupabaseReady()) return [];

        try {
            let query = supabase
                .from('ipc_incidents')
                .select('*')
                .order('detection_date', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) {
                logError('getIncidents', error);
                return [];
            }
            return data || [];
        } catch (error) {
            logError('getIncidents', error);
            return [];
        }
    },

    async saveIncident(incident: Partial<IPCIncident>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            console.log('[IPCService] Demo mode - incident not saved:', incident);
            return { success: true, id: 'demo-' + Date.now() };
        }

        try {
            const { data, error } = await supabase
                .from('ipc_incidents')
                .insert(incident)
                .select('id')
                .single();

            if (error) {
                logError('saveIncident', error);
                return { success: false };
            }
            return { success: true, id: data.id };
        } catch (error) {
            logError('saveIncident', error);
            return { success: false };
        }
    },

    // التحصينات
    async getImmunizations(personType?: 'beneficiary' | 'staff'): Promise<Immunization[]> {
        if (!isSupabaseReady()) return [];

        try {
            let query = supabase
                .from('immunizations')
                .select('*')
                .order('date_administered', { ascending: false });

            if (personType) {
                query = query.eq('person_type', personType);
            }

            const { data, error } = await query;

            if (error) {
                logError('getImmunizations', error);
                return [];
            }
            return data || [];
        } catch (error) {
            logError('getImmunizations', error);
            return [];
        }
    },

    // إحصائيات اللوحة
    async getIPCStats(): Promise<IPCStats> {
        if (!isSupabaseReady()) return DEMO_STATS;

        try {
            // جلب جولات الأسبوع الحالي
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const { data: inspections, error: insError } = await supabase
                .from('ipc_inspections')
                .select('compliance_score, follow_up_required')
                .gte('inspection_date', weekAgo.toISOString().split('T')[0]);

            // جلب الحالات النشطة
            const { data: incidents, error: incError } = await supabase
                .from('ipc_incidents')
                .select('id')
                .in('status', ['open', 'investigating', 'containment']);

            if (insError || incError) {
                return DEMO_STATS;
            }

            const totalInspections = inspections?.length || 0;
            const avgComplianceRate = totalInspections > 0
                ? Math.round(inspections.reduce((sum, i) => sum + (i.compliance_score || 0), 0) / totalInspections)
                : 0;
            const pendingFollowups = inspections?.filter(i => i.follow_up_required).length || 0;

            return {
                totalInspections,
                avgComplianceRate,
                complianceTrend: 0, // يحتاج مقارنة بالأسبوع السابق
                activeIncidents: incidents?.length || 0,
                incidentsTrend: 0,
                immunizationRate: 94, // يحتاج حساب حقيقي
                pendingFollowups,
            };
        } catch (error) {
            logError('getIPCStats', error);
            return DEMO_STATS;
        }
    },

    // بيانات الرسم البياني الأسبوعي
    async getWeeklyComplianceData(): Promise<Array<{ week: string; compliance: number; incidents: number }>> {
        // Demo data for now
        return [
            { week: 'الأسبوع 1', compliance: 82, incidents: 4 },
            { week: 'الأسبوع 2', compliance: 85, incidents: 3 },
            { week: 'الأسبوع 3', compliance: 84, incidents: 2 },
            { week: 'الأسبوع 4', compliance: 87, incidents: 2 },
        ];
    }
};

export default ipcService;
