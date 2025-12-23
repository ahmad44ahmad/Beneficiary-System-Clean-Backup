
import React, { useState } from 'react';
import { ShieldAlert, Brain, Activity, CheckCircle, AlertTriangle, Save, History } from 'lucide-react';
import { supabase } from '../../config/supabase';

interface FallRiskAssessmentProps {
    beneficiaryName: string;
    beneficiaryId: string;
    onSave?: (data: any) => void;
}

export const FallRiskAssessment: React.FC<FallRiskAssessmentProps> = ({ beneficiaryName, beneficiaryId, onSave }) => {
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        historyOfFalls: false,
        secondaryDiagnosis: false,
        ambulatoryAid: 'none', // none, crutches, furniture
        ivTherapy: false,
        gait: 'normal', // normal, weak, impaired
        mentalStatus: 'oriented' // oriented, forgets
    });

    // Morse Fall Scale Calculation Logic
    const calculateScore = () => {
        let score = 0;
        if (formData.historyOfFalls) score += 25;
        if (formData.secondaryDiagnosis) score += 15;

        if (formData.ambulatoryAid === 'crutches') score += 15;
        else if (formData.ambulatoryAid === 'furniture') score += 30;

        if (formData.ivTherapy) score += 20;

        if (formData.gait === 'weak') score += 10;
        else if (formData.gait === 'impaired') score += 20;

        if (formData.mentalStatus === 'forgets') score += 15;

        return score;
    };

    const getRiskLevel = (score: number) => {
        if (score < 25) return { label: 'منخفض (Low Risk)', value: 'low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
        if (score < 51) return { label: 'متوسط (Medium Risk)', value: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
        return { label: 'عالي (High Risk)', value: 'high', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
    };

    const score = calculateScore();
    const risk = getRiskLevel(score);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload = {
                beneficiary_id: beneficiaryId,
                assessment_date: new Date().toISOString().split('T')[0],
                risk_score: score,
                risk_level: risk.value,

                history_of_falls: formData.historyOfFalls,
                secondary_diagnosis: formData.secondaryDiagnosis,
                ambulatory_aid: formData.ambulatoryAid,
                iv_therapy: formData.ivTherapy,
                gait: formData.gait,
                mental_status: formData.mentalStatus,

                assessed_by: null // Typically from auth context
            };

            const { error: insertError } = await supabase
                .from('fall_risk_assessments')
                .insert(payload);

            if (insertError) throw insertError;

            setSuccessMessage('تم حفظ تقييم المخاطر بنجاح');
            if (onSave) onSave(payload);

        } catch (err: any) {
            console.error('Error saving assessment:', err);
            setError(err.message || 'حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100 font-readex" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-orange-600 to-amber-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6" />
                        الحارس الذكي - تقييم مخاطر السقوط
                    </h2>
                    <p className="opacity-90 mt-1 text-sm">تقييم مورس (Morse Fall Scale) - {beneficiaryName}</p>
                </div>
                {successMessage && (
                    <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                        <CheckCircle className="w-5 h-5" />
                        {successMessage}
                    </div>
                )}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Form Section */}
                <div className="md:col-span-2 space-y-6">

                    <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-orange-200 pb-2">
                            <History className="h-5 w-5 text-orange-500" />
                            1. التاريخ والمناولة
                        </h3>

                        <div className="space-y-3">
                            <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${formData.historyOfFalls ? 'bg-orange-50 border-orange-300' : 'bg-white hover:border-orange-300'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.historyOfFalls}
                                    onChange={e => setFormData({ ...formData, historyOfFalls: e.target.checked })}
                                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <div>
                                    <span className="text-gray-900 font-medium block">تاريخ سابق للسقوط</span>
                                    <span className="text-gray-500 text-sm">هل سقط المستفيد خلال الثلاثة أشهر الماضية؟ (+25)</span>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${formData.secondaryDiagnosis ? 'bg-orange-50 border-orange-300' : 'bg-white hover:border-orange-300'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.secondaryDiagnosis}
                                    onChange={e => setFormData({ ...formData, secondaryDiagnosis: e.target.checked })}
                                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <div>
                                    <span className="text-gray-900 font-medium block">وجود تشخيص ثانوي</span>
                                    <span className="text-gray-500 text-sm">هل يوجد أكثر من تشخيص طبي في الملف؟ (+15)</span>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${formData.ivTherapy ? 'bg-orange-50 border-orange-300' : 'bg-white hover:border-orange-300'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.ivTherapy}
                                    onChange={e => setFormData({ ...formData, ivTherapy: e.target.checked })}
                                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <div>
                                    <span className="text-gray-900 font-medium block">علاج وريدي (IV / Heparin Lock)</span>
                                    <span className="text-gray-500 text-sm">هل يستخدم المغذي أو إبرة مميعة؟ (+20)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-orange-200 pb-2">
                            <Activity className="h-5 w-5 text-orange-500" />
                            2. الحركة والمساعدة
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">3. أداة المساعدة في المشي</label>
                                <select
                                    value={formData.ambulatoryAid}
                                    onChange={e => setFormData({ ...formData, ambulatoryAid: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="none">لا يوجد / كرسي متحرك / مساعدة تمريضية (0)</option>
                                    <option value="crutches">عكاز / عصا / مشاية (15)</option>
                                    <option value="furniture">يتكأ على الأثاث والجدران (30)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">5. المشية / التنقل (Gait)</label>
                                <select
                                    value={formData.gait}
                                    onChange={e => setFormData({ ...formData, gait: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="normal">طبيعية / طريح فراش / كرسي متحرك كلي (0)</option>
                                    <option value="weak">ضعيفة (انحناء بسيط، خطوات قصيرة) (10)</option>
                                    <option value="impaired">مضطربة (صعوبة نهوض، ترنح) (20)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">6. الحالة الذهنية</label>
                                <select
                                    value={formData.mentalStatus}
                                    onChange={e => setFormData({ ...formData, mentalStatus: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="oriented">مدرك لقدراته وحدوده (0)</option>
                                    <option value="forgets">ينسى حدوده / يبالغ في تقدير قدرته (15)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Score & Action Panel */}
                <div className="md:col-span-1">
                    <div className={`p-6 rounded-xl border-2 ${risk.bg} ${risk.border} h-full flex flex-col justify-between sticky top-4`}>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">مجموع النقاط</h3>
                            <div className={`text-5xl font-black ${risk.color} mb-2 tracking-tighter`}>{score}</div>
                            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white ${risk.color} shadow-sm border`}>
                                {risk.label}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-gray-600" />
                                الإجراءات الموصى بها:
                            </h4>
                            <div className="bg-white/60 rounded-lg p-3 text-sm text-gray-700 space-y-2 border border-gray-100">
                                {score >= 51 && (
                                    <>
                                        <div className="flex items-start gap-2 text-red-700 font-bold">
                                            <span>•</span>
                                            <span>تفعيل بروتوكول السقوط العالي فوراً</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>مرافقة عند دخول الحمام</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>وضع سوار أصفر للمستفيد</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>رفع حواجز السرير دائماً</span>
                                        </div>
                                    </>
                                )}
                                {score >= 25 && score < 51 && (
                                    <>
                                        <div className="flex items-start gap-2 text-yellow-800 font-bold">
                                            <span>•</span>
                                            <span>تفعيل إجراءات الوقاية القياسية</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>مراجعة الأدوية المسببة للدوار</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>توفير إضاءة ليلية خافتة</span>
                                        </div>
                                    </>
                                )}
                                {score < 25 && (
                                    <>
                                        <div className="flex items-start gap-2 text-green-700 font-bold">
                                            <span>•</span>
                                            <span>الرعاية التمريضية الأساسية</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>تقييم دوري شهرياً</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4 text-center font-medium bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`w-full mt-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold ${saving ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {saving ? 'جاري الحفظ...' : (
                                <>
                                    <Save className="h-5 w-5" />
                                    حفظ التقييم
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
