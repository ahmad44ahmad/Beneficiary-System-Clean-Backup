import { supabase } from '../config/supabase';
import { ShiftHandoverItem, ShiftType, ShiftSummary } from '../types/shift';

// shift_handover_items is not yet provisioned in the remote DB (Session E migration).
// Until the migration ships, we serve in-memory demo data and skip the network round
// trip entirely — eliminates the HTTP 404 noise on /handover. Once the table exists,
// flip this back to `null` to re-enable supabase + the lazy probe path below.
let shiftItemsTableAvailable: boolean | null = false;

const logError = (context: string, error: unknown) => {
    if (import.meta.env.DEV) {
        console.warn(`[shiftService] ${context}:`, error);
    }
};

const isTableMissingError = (error: { code?: string } | null | undefined): boolean =>
    error?.code === 'PGRST205' || error?.code === 'PGRST204' || error?.code === '42P01';

const DEMO_SHIFT_ITEMS: ShiftHandoverItem[] = [
    {
        id: 'shi-001',
        category: 'critical',
        title: 'متابعة علامات الجفاف لدى المستفيد محمد (172)',
        description: 'انخفاض في كمية السوائل المُتناولة خلال الساعات الماضية. يُرجى مراقبة المؤشرات الحيوية كل ساعتين، وتشجيعه على الإمساك بكوب الماء بشكل مستقل ضمن خطة العلاج الوظيفي.',
        beneficiary_id: '172',
        beneficiaryName: 'محمد — أبو سعد',
        priority: 'high',
        shift_type: 'morning',
        status: 'active',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        created_by: 'الممرضة نورة',
    },
    {
        id: 'shi-002',
        category: 'medication',
        title: 'جرعة دواء الضغط الساعة العاشرة',
        description: 'يُعطى المستفيد أحمد سالم (5001 — أبو حميد) دواء الضغط في الساعة العاشرة صباحاً مع كوب من الماء.',
        beneficiary_id: '5001',
        beneficiaryName: 'أحمد سالم — أبو حميد',
        priority: 'medium',
        shift_type: 'morning',
        status: 'active',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        created_by: 'الممرضة نورة',
    },
    {
        id: 'shi-003',
        category: 'care',
        title: 'حصة العلاج الطبيعي الساعة الحادية عشرة',
        description: 'تنسيق نقل المستفيدين من القسم إلى صالة العلاج الطبيعي قبل بداية الجلسات بعشر دقائق، مع التأكد من توفّر كراسي النقل ومرافقة الفنّيين.',
        priority: 'medium',
        shift_type: 'morning',
        status: 'active',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        created_by: 'المشرف خالد',
    },
    {
        id: 'shi-004',
        category: 'pending',
        title: 'تحديث ملف الكرامة لمستفيدَين جديدَين',
        description: 'يحتاج ملف الكرامة لكلٍّ من فهد ومنصور إلى استكمال البيانات الشخصية والتفضيلات قبل نهاية الوردية.',
        priority: 'low',
        shift_type: 'morning',
        status: 'active',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        created_by: 'المشرفة ريم',
    },
];

const cloneDemoItem = (item: ShiftHandoverItem): ShiftHandoverItem => ({ ...item });

export const shiftService = {
    async getShiftItems(shiftType?: ShiftType): Promise<ShiftHandoverItem[]> {
        if (shiftItemsTableAvailable === false) {
            const items = DEMO_SHIFT_ITEMS.map(cloneDemoItem);
            return shiftType ? items.filter(i => i.shift_type === shiftType) : items;
        }

        let query = supabase
            .from('shift_handover_items')
            .select(`
                *,
                beneficiaries (
                    full_name
                )
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (shiftType) {
            query = query.eq('shift_type', shiftType);
        }

        const { data, error } = await query;

        if (error) {
            if (isTableMissingError(error)) {
                shiftItemsTableAvailable = false;
                logError('getShiftItems → falling back to demo', error);
                const items = DEMO_SHIFT_ITEMS.map(cloneDemoItem);
                return shiftType ? items.filter(i => i.shift_type === shiftType) : items;
            }
            logError('getShiftItems', error);
            throw error;
        }

        shiftItemsTableAvailable = true;
        return data.map((item: Record<string, unknown>) => ({
            ...item,
            beneficiaryName: (item.beneficiaries as { full_name?: string } | null)?.full_name
        } as ShiftHandoverItem));
    },

    async addShiftItem(item: Omit<ShiftHandoverItem, 'id' | 'created_at'>): Promise<ShiftHandoverItem> {
        if (shiftItemsTableAvailable === false) {
            return {
                ...item,
                id: `shi-local-${Date.now()}`,
                created_at: new Date().toISOString(),
            } as ShiftHandoverItem;
        }

        const { data, error } = await supabase
            .from('shift_handover_items')
            .insert(item)
            .select()
            .single();

        if (error) {
            if (isTableMissingError(error)) {
                shiftItemsTableAvailable = false;
                return {
                    ...item,
                    id: `shi-local-${Date.now()}`,
                    created_at: new Date().toISOString(),
                } as ShiftHandoverItem;
            }
            logError('addShiftItem', error);
            throw error;
        }

        return data;
    },

    async updateShiftItem(id: string, updates: Partial<ShiftHandoverItem>): Promise<void> {
        if (shiftItemsTableAvailable === false) return;

        const { error } = await supabase
            .from('shift_handover_items')
            .update(updates)
            .eq('id', id);

        if (error) {
            if (isTableMissingError(error)) {
                shiftItemsTableAvailable = false;
                return;
            }
            logError('updateShiftItem', error);
            throw error;
        }
    },

    async deleteShiftItem(id: string): Promise<void> {
        if (shiftItemsTableAvailable === false) return;

        const { error } = await supabase
            .from('shift_handover_items')
            .delete()
            .eq('id', id);

        if (error) {
            if (isTableMissingError(error)) {
                shiftItemsTableAvailable = false;
                return;
            }
            logError('deleteShiftItem', error);
            throw error;
        }
    },

    async getShiftSummary(shiftType: ShiftType): Promise<ShiftSummary> {
        return {
            shiftType,
            startTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            endTime: new Date(Date.now() + 8 * 3600 * 1000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            staffName: 'الممرضة نورة',
            totalBeneficiaries: 145,
            medicationsGiven: 48,
            incidentsReported: 1,
            assessmentsCompleted: 32,
        };
    }
};
