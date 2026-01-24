
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../context/ToastContext'; // Assuming context exists or using standard alert
import { Calendar, ClipboardCheck, AlertTriangle, Save, Loader2, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export const QualityControl = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [criteria, setCriteria] = useState<any[]>([]);

    // Form State
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [responses, setResponses] = useState<Record<string, 'compliant' | 'non_compliant' | 'n/a'>>({});
    const [deductions, setDeductions] = useState<Record<string, number>>({});
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [generalNote, setGeneralNote] = useState('');

    // Demo data fallbacks
    const DEMO_SUPPLIERS = [
        { id: 'demo-1', name: 'شركة الأغذية المتحدة' },
        { id: 'demo-2', name: 'مطاعم الرياض للتموين' },
    ];

    const DEMO_CRITERIA = [
        { id: '1', category: 'النظافة', question: 'زي العمال نظيف ومرتب', max_score: 10 },
        { id: '2', category: 'النظافة', question: 'نظافة أدوات التقديم', max_score: 10 },
        { id: '3', category: 'الطعام', question: 'درجة حرارة الطعام مناسبة', max_score: 10 },
        { id: '4', category: 'الطعام', question: 'جودة المواد الخام', max_score: 10 },
        { id: '5', category: 'الخدمة', question: 'الالتزام بمواعيد التوصيل', max_score: 10 },
        { id: '6', category: 'الخدمة', question: 'تعامل الموظفين مع المستفيدين', max_score: 10 },
    ];

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            if (!supabase) {
                setSuppliers(DEMO_SUPPLIERS);
                setCriteria(DEMO_CRITERIA);
                setSelectedSupplier(DEMO_SUPPLIERS[0].id);
                return;
            }

            // Fetch Suppliers
            const { data: supData, error: supError } = await supabase
                .from('catering_suppliers')
                .select('*');

            if (supError || !supData?.length) {
                // Use demo data
                setSuppliers(DEMO_SUPPLIERS);
                setSelectedSupplier(DEMO_SUPPLIERS[0].id);
            } else {
                setSuppliers(supData);
                if (supData.length > 0) setSelectedSupplier(supData[0].id);
            }

            // Fetch Criteria
            const { data: critData, error: critError } = await supabase
                .from('evaluation_criteria')
                .select('*')
                .eq('is_active', true)
                .order('category');

            if (critError || !critData?.length) {
                setCriteria(DEMO_CRITERIA);
            } else {
                setCriteria(critData);
            }

        } catch (error) {
            if (import.meta.env.DEV) {
                console.log('[QualityControl] Using demo data:', error);
            }
            setSuppliers(DEMO_SUPPLIERS);
            setCriteria(DEMO_CRITERIA);
            setSelectedSupplier(DEMO_SUPPLIERS[0].id);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = (id: string, value: 'compliant' | 'non_compliant') => {
        setResponses(prev => ({ ...prev, [id]: value }));
        // Reset deduction if compliant
        if (value === 'compliant') {
            setDeductions(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }
    };

    const handleDeduction = (id: string, amount: string) => {
        setDeductions(prev => ({ ...prev, [id]: parseFloat(amount) || 0 }));
    };

    const calculateTotalDeduction = () => {
        return Object.values(deductions).reduce((acc, curr) => acc + (curr || 0), 0);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const totalPenalty = calculateTotalDeduction();

            // 1. Create Evaluation Record
            const { data: evalData, error: evalError } = await supabase
                .from('contractor_evaluations')
                .insert({
                    supplier_id: selectedSupplier,
                    evaluation_date: new Date().toISOString(),
                    total_penalty_amount: totalPenalty,
                    notes: generalNote
                })
                .select()
                .single();

            if (evalError) throw evalError;

            // 2. Create Evaluation Items
            const itemsToInsert = criteria.map(c => ({
                evaluation_id: evalData.id,
                criteria_id: c.id,
                status: responses[c.id] || 'n/a',
                deduction_amount: deductions[c.id] || 0,
                observation_text: notes[c.id] || ''
            }));

            const { error: itemsError } = await supabase
                .from('evaluation_answers')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            alert('تم حفظ التقييم بنجاح');
            // Reset form
            setResponses({});
            setDeductions({});
            setNotes({});
            setGeneralNote('');

        } catch (error) {
            console.error('Error saving evaluation:', error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    // Group criteria by category
    const groupedCriteria = criteria.reduce((acc, crit) => {
        if (!acc[crit.category]) acc[crit.category] = [];
        acc[crit.category].push(crit);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="bg-gray-50 min-h-screen p-6" dir="rtl">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#14415A]">مراقبة الجودة وتقييم المتعهد</h1>
                    <p className="text-gray-600">نظام تقييم الأداء اليومي وحساب الحسومات</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-4">
                    <span className="text-gray-500 text-sm">إجمالي الحسم المتوقع:</span>
                    <span className="text-2xl font-bold text-red-600 font-mono">
                        {calculateTotalDeduction().toFixed(2)} ريال
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Evaluation Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Supplier Select */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-2">المتعهد</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={selectedSupplier}
                            onChange={e => setSelectedSupplier(e.target.value)}
                        >
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name || 'Unnamed Supplier'}</option>)}
                        </select>
                    </div>

                    {/* Criteria Categories */}
                    {Object.entries(groupedCriteria).map(([category, items]) => (
                        <div key={category} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-[#14415A] text-white p-4 flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5" />
                                <h3 className="font-bold">{category}</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {(items as any[]).map((item: any) => (
                                    <div key={item.id} className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="font-medium text-gray-800 w-2/3">{item.question}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleResponse(item.id, 'compliant')}
                                                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${responses[item.id] === 'compliant'
                                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    مطابق
                                                </button>
                                                <button
                                                    onClick={() => handleResponse(item.id, 'non_compliant')}
                                                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${responses[item.id] === 'non_compliant'
                                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    غير مطابق
                                                </button>
                                            </div>
                                        </div>

                                        {/* Penalty Section (Shows if non-compliant) */}
                                        {responses[item.id] === 'non_compliant' && (
                                            <div className="bg-red-50 p-4 rounded-lg mt-2 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex gap-4 items-center">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-red-700 block mb-1">ملاحظة المخالفة</label>
                                                        <input
                                                            type="text"
                                                            className="w-full text-sm border-red-200 rounded-md focus:ring-red-500 focus:border-red-500"
                                                            placeholder="وصف المخالفة..."
                                                            value={notes[item.id] || ''}
                                                            onChange={e => setNotes({ ...notes, [item.id]: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="w-32">
                                                        <label className="text-xs font-bold text-red-700 block mb-1">قيمة الحسم</label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                className="w-full text-sm border-red-200 rounded-md pl-8 focus:ring-red-500 focus:border-red-500"
                                                                placeholder="0.00"
                                                                value={deductions[item.id] || ''}
                                                                onChange={e => handleDeduction(item.id, e.target.value)}
                                                            />
                                                            <DollarSign className="w-4 h-4 text-red-400 absolute left-2 top-2" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar / Summary */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm sticky top-6">
                        <h3 className="font-bold text-[#14415A] mb-4 flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            ملخص التقييم
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">عدد البنود المطابقة:</span>
                                <span className="font-bold text-green-600">{Object.values(responses).filter(r => r === 'compliant').length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">عدد المخالفات:</span>
                                <span className="font-bold text-red-600">{Object.values(responses).filter(r => r === 'non_compliant').length}</span>
                            </div>
                            <div className="border-t pt-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات عامة</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-lg text-sm"
                                    rows={4}
                                    placeholder="أي ملاحظات إضافية..."
                                    value={generalNote}
                                    onChange={e => setGeneralNote(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full bg-[#14415A] text-white py-3 rounded-lg font-bold hover:bg-[#0e2e40] transition-colors flex justify-center items-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'حفظ التقييم واعتماد الحسومات'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
