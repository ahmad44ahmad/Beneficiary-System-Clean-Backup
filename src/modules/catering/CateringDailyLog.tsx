import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Utensils, Calendar, Clock, AlertCircle, FileSignature, Save, Printer, Check, X, Loader2, FileSpreadsheet, Download } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { ReceivingCommittee } from './ReceivingCommittee';
import { usePrint } from '../../hooks/usePrint';
import { useExport } from '../../hooks/useExport';
import { useToast } from '../../context/ToastContext';
interface MealItem {
    id: string;
    beneficiary_name: string;
    plan_type: string;
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'consumed' | 'refused';
    meal_type: string;
}

export const CateringDailyLog: React.FC = () => {
    const navigate = useNavigate();
    const { printTable, isPrinting } = usePrint();
    const { exportToExcel, exportToCsv, isExporting } = useExport();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [meals, setMeals] = useState<MealItem[]>([]);
    const [selectedMealType, setSelectedMealType] = useState('غداء');

    // Column definitions for export
    const MEAL_COLUMNS = [
        { key: 'beneficiary_name', header: 'المستفيد' },
        { key: 'plan_type', header: 'النظام الغذائي' },
        { key: 'status', header: 'الحالة' },
        { key: 'meal_type', header: 'نوع الوجبة' }
    ];

    // Export handlers
    const handlePrint = () => {
        if (meals.length === 0) {
            showToast('لا توجد بيانات للطباعة', 'error');
            return;
        }
        printTable(meals, MEAL_COLUMNS, {
            title: `سجل وجبات ${selectedMealType}`,
            subtitle: `التاريخ: ${new Date().toLocaleDateString('ar-SA')}`
        });
        showToast('تم فتح نافذة الطباعة', 'success');
    };

    const handleExportExcel = async () => {
        if (meals.length === 0) {
            showToast('لا توجد بيانات للتصدير', 'error');
            return;
        }
        exportToExcel(meals, MEAL_COLUMNS, { filename: `سجل_وجبات_${selectedMealType}` });
        showToast(`تم تصدير ${meals.length} سجل إلى Excel`, 'success');
    };

    useEffect(() => {
        fetchMeals();
    }, [selectedMealType]);

    const fetchMeals = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('daily_meals')
                .select(`
                    id, 
                    status, 
                    meal_type,
                    beneficiaries!inner ( full_name ),
                    dietary_plans ( plan_type )
                `)
                .eq('meal_date', today)
                .eq('meal_type', selectedMealType);

            if (data) {
                const formatted = data.map((m: any) => ({
                    id: m.id,
                    beneficiary_name: m.beneficiaries?.full_name,
                    plan_type: m.dietary_plans?.plan_type || 'قياسي',
                    status: m.status,
                    meal_type: m.meal_type
                }));
                setMeals(formatted);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateDailyMeals = async () => {
        setGenerating(true);
        try {
            // 1. Get all active beneficiaries with their active plan
            const { data: beneficiaries } = await supabase
                .from('beneficiaries')
                .select('id')
                .eq('status', 'active'); // Assuming lowercase 'active' based on previous data

            if (!beneficiaries?.length) return;

            const today = new Date().toISOString().split('T')[0];

            // 2. Prepare inserts
            const newMeals = beneficiaries.map(b => ({
                beneficiary_id: b.id,
                meal_date: today,
                meal_type: selectedMealType,
                status: 'pending'
            }));

            // 3. Bulk Insert (Upsert to avoid duplicates)
            const { error } = await supabase
                .from('daily_meals')
                .upsert(newMeals, { onConflict: 'beneficiary_id,meal_date,meal_type' });

            if (!error) {
                fetchMeals();
            } else {
                console.error(error);
            }
        } finally {
            setGenerating(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setMeals(prev => prev.map(m => m.id === id ? { ...m, status: newStatus as any } : m));

        await supabase
            .from('daily_meals')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id);
    };

    const markAllDelivered = async () => {
        const ids = meals.filter(m => m.status === 'pending').map(m => m.id);
        if (!ids.length) return;

        setLoading(true);
        await supabase
            .from('daily_meals')
            .update({ status: 'delivered', updated_at: new Date().toISOString() })
            .in('id', ids);

        fetchMeals();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#14415A]">تسجيل الوجبات اليومي</h1>
                    <p className="text-gray-600">إدارة توزيع وجبات: {selectedMealType}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/catering')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        عودة للوحة القيادة
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-700">نوع الوجبة:</label>
                    <select
                        value={selectedMealType}
                        onChange={(e) => setSelectedMealType(e.target.value)}
                        className="border-gray-300 rounded-lg focus:ring-[#F5961E] focus:border-[#F5961E]"
                    >
                        <option value="فطور">فطور</option>
                        <option value="غداء">غداء</option>
                        <option value="عشاء">عشاء</option>
                        <option value="وجبة خفيفة 1">وجبة خفيفة 1</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    {meals.length === 0 ? (
                        <button
                            onClick={generateDailyMeals}
                            disabled={generating}
                            className="px-4 py-2 bg-[#148287] text-white rounded-lg hover:bg-[#0e6b6f] flex items-center gap-2"
                        >
                            {generating ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            إنشاء قائمة الوجبات
                        </button>
                    ) : (
                        <button
                            onClick={markAllDelivered}
                            className="px-4 py-2 bg-[#F5961E] text-white rounded-lg hover:bg-[#d98210] flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            تسجيل الكل "تم التسليم"
                        </button>
                    )}
                    <button
                        onClick={handleExportExcel}
                        disabled={isExporting || meals.length === 0}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 flex items-center gap-2 disabled:opacity-50"
                        aria-label="تصدير إلى Excel"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={isPrinting || meals.length === 0}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50"
                        aria-label="طباعة"
                    >
                        <Printer className="w-4 h-4" />
                        طباعة
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><LoadingSpinner size="md" /></div>
                ) : meals.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        لا توجد وجبات مسجلة في النظام لهذا الوقت. قم بإنشاء القائمة أولاً.
                    </div>
                ) : (
                    <table className="w-full text-right">
                        <thead className="bg-[#14415A] text-white text-sm">
                            <tr>
                                <th className="px-6 py-4">المستفيد</th>
                                <th className="px-6 py-4">النظام الغذائي</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {meals.map((meal) => (
                                <tr key={meal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{meal.beneficiary_name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${meal.plan_type === 'قياسي' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700 font-bold'
                                            }`}>
                                            {meal.plan_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={meal.status} />
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-2">
                                        {meal.status !== 'consumed' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(meal.id, 'delivered')}
                                                    title="تم التسليم"
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                >
                                                    <Utensils className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(meal.id, 'consumed')}
                                                    title="تم الاستهلاك"
                                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(meal.id, 'refused')}
                                                    title="رفض"
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Digital Receiving Committee Footer */}
            <ReceivingCommittee date={new Date()} />
        </div>
    );
};

// StatusBadge imported from shared components
