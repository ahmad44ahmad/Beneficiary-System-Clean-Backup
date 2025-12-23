
import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { generateShiftSummary } from '../../utils/shiftReportGenerator';
import {
    Save,
    AlertCircle,
    Thermometer,
    Activity,
    User,
    Clipboard,
    CheckCircle2,
    Droplet,
    FileText,
    X
} from 'lucide-react';

interface DailyCareFormProps {
    beneficiaryName: string;
    beneficiaryId: string;
    onSuccess?: () => void;
}

export const DailyCareForm: React.FC<DailyCareFormProps> = ({ beneficiaryName, beneficiaryId, onSuccess }) => {
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // Report State
    const [showReport, setShowReport] = useState(false);
    const [reportText, setReportText] = useState('');
    const [loadingReport, setLoadingReport] = useState(false);

    const [formData, setFormData] = useState({
        shift: 'صباحي',
        temperature: '',
        pulse: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        oxygen_saturation: '',
        blood_sugar: '',
        weight: '',

        mobility_today: 'active', // active, limited, bedridden
        mood: 'stable',
        notes: '',
        incidents: '',
        requires_followup: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            // Handle numeric fields
            if (['temperature', 'pulse', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'oxygen_saturation', 'blood_sugar', 'weight'].includes(name)) {
                // allow empty string or number
                setFormData(prev => ({ ...prev, [name]: value }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        }
    };



    const handleGenerateReport = async () => {
        setLoadingReport(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('daily_care_logs')
                .select('*')
                .eq('beneficiary_id', beneficiaryId)
                .eq('log_date', today)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const summary = generateShiftSummary(data || [], beneficiaryName);
            setReportText(summary);
            setShowReport(true);
        } catch (err) {
            console.error('Error generating report:', err);
            alert('حدث خطأ أثناء إنشاء التقرير');
        } finally {
            setLoadingReport(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            // Prepare payload with corrected types
            const payload = {
                beneficiary_id: beneficiaryId,
                recorded_by: null, // Typically from auth context, can be nullable if RLS allows/defaults
                shift: formData.shift,
                log_date: new Date().toISOString().split('T')[0],
                log_time: new Date().toLocaleTimeString('en-GB'), // HH:MM:SS

                temperature: formData.temperature ? parseFloat(formData.temperature) : null,
                pulse: formData.pulse ? parseInt(formData.pulse) : null,
                blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
                blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
                oxygen_saturation: formData.oxygen_saturation ? parseInt(formData.oxygen_saturation) : null,
                blood_sugar: formData.blood_sugar ? parseInt(formData.blood_sugar) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,

                mobility_today: formData.mobility_today,
                mood: formData.mood,
                notes: formData.notes,
                incidents: formData.incidents,
                requires_followup: formData.requires_followup
            };

            const { error: insertError } = await supabase
                .from('daily_care_logs')
                .insert(payload);

            if (insertError) throw insertError;

            setSuccessMessage('تم حفظ سجل العناية اليومية بنجاح');
            // Reset critical fields? Or keep for ease of next entry? Let's keep for now or partial reset used fields.
            // setFormData(prev => ({ ...prev, notes: '', incidents: '' })); 

            if (onSuccess) onSuccess();

        } catch (err: any) {
            console.error('Error saving daily log:', err);
            setError(err.message || 'حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100 font-readex" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6" />
                        سجل العناية اليومي
                    </h2>
                    <p className="opacity-90 mt-1 text-sm">تسجيل العلامات الحيوية والملاحظات اليومية للمستفيد: {beneficiaryName}</p>
                </div>
                {successMessage && (
                    <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                        <CheckCircle2 className="w-5 h-5" />
                        {successMessage}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Shift Selection */}
                <div className="md:col-span-2 bg-emerald-50 p-4 rounded-lg flex items-center gap-4">
                    <label className="font-bold text-emerald-800">الوردية (Shift):</label>
                    <div className="flex gap-4">
                        {['صباحي', 'مسائي', 'ليلي'].map(s => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="shift"
                                    value={s}
                                    checked={formData.shift === s}
                                    onChange={handleChange}
                                    className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-emerald-900">{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Vital Signs Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        العلامات الحيوية
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الحرارة (C)</label>
                            <input
                                name="temperature"
                                type="number"
                                step="0.1"
                                placeholder="37.0"
                                value={formData.temperature}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none hover:border-emerald-300 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">النبض (BPM)</label>
                            <input
                                name="pulse"
                                type="number"
                                placeholder="80"
                                value={formData.pulse}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none hover:border-emerald-300 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ضغط الدم (ملم زئبق)</label>
                            <div className="flex items-center gap-2" dir="ltr">
                                <input
                                    name="blood_pressure_systolic"
                                    type="number"
                                    placeholder="Sys"
                                    value={formData.blood_pressure_systolic}
                                    onChange={handleChange}
                                    className="w-1/2 p-2 border rounded-lg text-center"
                                />
                                <span className="text-gray-400">/</span>
                                <input
                                    name="blood_pressure_diastolic"
                                    type="number"
                                    placeholder="Dia"
                                    value={formData.blood_pressure_diastolic}
                                    onChange={handleChange}
                                    className="w-1/2 p-2 border rounded-lg text-center"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الأكسجين (%)</label>
                            <input
                                name="oxygen_saturation"
                                type="number"
                                placeholder="98"
                                value={formData.oxygen_saturation}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none hover:border-emerald-300 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">السكر (mg/dL)</label>
                            <input
                                name="blood_sugar"
                                type="number"
                                placeholder="100"
                                value={formData.blood_sugar}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none hover:border-emerald-300 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الوزن (kg)</label>
                            <input
                                name="weight"
                                type="number"
                                step="0.1"
                                placeholder="optional"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none hover:border-emerald-300 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* General Assessment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                        <User className="h-5 w-5 text-blue-500" />
                        التقييم العام
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة الحركية اليوم</label>
                            <select
                                name="mobility_today"
                                value={formData.mobility_today}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="active">نشيط / طبيعي</option>
                                <option value="limited">حركة محدودة</option>
                                <option value="bedridden">ملازم للفراش طوال اليوم</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">المزاج والحالة النفسية</label>
                            <select
                                name="mood"
                                value={formData.mood}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="stable">مستقر</option>
                                <option value="happy">سعيد / متعاون</option>
                                <option value="anxious">قلق / متوتر</option>
                                <option value="aggressive">عدواني</option>
                                <option value="depressed">مكتئب / منعزل</option>
                                <option value="confused">مشوش الذهن</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات التمريض</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                            placeholder="سجل أي ملاحظات غير عادية هنا..."
                        />
                    </div>
                </div>

                {/* Incidents & Followup */}
                <div className="md:col-span-2 bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-2 text-red-800 font-bold">
                        <AlertCircle className="w-5 h-5" />
                        <span>حوادث ومتابعة</span>
                    </div>
                    <div className="space-y-3">
                        <textarea
                            name="incidents"
                            value={formData.incidents}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg h-16 focus:ring-2 focus:ring-red-500 outline-none resize-none bg-white"
                            placeholder="هل وقع أي حادث أو عرض صحي طارئ؟ (اتركه فارغاً إذا لم يوجد)"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="requires_followup"
                                checked={formData.requires_followup}
                                onChange={handleChange}
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                            />
                            <span className="font-medium text-red-700">يحتاج إلى متابعة طبية أو إشراف خاص في الوردية القادمة</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 pt-4 border-t flex justify-between items-center bg-gray-50 -m-6 p-6 mt-2">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex gap-3 mr-auto">
                        <button
                            type="button"
                            className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'جار الحفظ...' :
                                <>
                                    <Save className="h-5 w-5" />
                                    حفظ السجل
                                </>}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};
