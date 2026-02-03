import React, { useState } from 'react';
import {
    AlertTriangle,
    Shield,
    EyeOff,
    Send,
    CheckCircle2,
    HelpCircle,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { submitOvrReport, OvrReport } from '../../services/ovrService';
import { useNavigate } from 'react-router-dom';

export const OvrReportForm: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<OvrReport>>({
        isAnonymous: false,
        severity: 'minor',
        category: 'other'
    });

    const categories = [
        { id: 'medication_error', label: 'خطأ دوائي', icon: '💊' },
        { id: 'fall', label: 'سقوط', icon: '🤕' },
        { id: 'behavioral', label: 'سلوك عدواني', icon: '🤬' },
        { id: 'equipment', label: 'عطل أجهزة', icon: '⚙️' },
        { id: 'other', label: 'أخرى', icon: '📝' }
    ];

    const severities = [
        { id: 'near_miss', label: 'وشيك الوقوع (Near Miss)', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'minor', label: 'بسيط', color: 'bg-green-100 text-green-800' },
        { id: 'moderate', label: 'متوسط', color: 'bg-orange-100 text-orange-800' },
        { id: 'major', label: 'جسمي', color: 'bg-red-100 text-red-800' },
        { id: 'sentinel', label: 'حدث جسيم (Sentinel)', color: 'bg-red-900 text-white' }
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitOvrReport({
                ...formData as any,
                incidentDate: new Date().toISOString().split('T')[0]
            });
            // Show success via step 4? or toast? reusing validation step for simplicity
            setStep(4);
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">نموذج الإبلاغ عن حادث (OVR)</h1>
                <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                    نحن نطبق سياسة "الثقافة العادلة" (Just Culture).
                    هدفك هو تحسين النظام، وليس اللوم. يمكنك الإبلاغ بشكل مجهول.
                </p>
            </div>

            {/* Steps Indicator */}
            <div className="flex justify-between items-center mb-8 px-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex flex-col items-center gap-2 ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                            ${step === s ? 'bg-red-600 text-white ring-4 ring-red-100' :
                                step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                            {s === 1 ? 'تفاصيل الحادث' : s === 2 ? 'التصنيف' : 'المراجعة'}
                        </span>
                    </div>
                ))}
            </div>

            <Card className="p-8 shadow-lg border-t-4 border-t-red-500">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ماذا حدث؟ (وصف مختصر)</label>
                            <textarea
                                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-sans"
                                placeholder="صف الحادثة بوضوح..."
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <EyeOff className={`w-6 h-6 ${formData.isAnonymous ? 'text-blue-600' : 'text-gray-400'}`} />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800">إرسال كبلاغ مجهول؟ (Anonymous)</h4>
                                <p className="text-xs text-gray-500">لن يتم تسجيل اسمك في النظام</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isAnonymous}
                                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-[-100%] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">نوع الحادث</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFormData({ ...formData, category: cat.id as any })}
                                        className={`p-3 rounded-xl border text-center transition-all ${formData.category === cat.id
                                            ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200'
                                            : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{cat.icon}</div>
                                        <div className="text-sm font-medium">{cat.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">درجة الضرر (Impact)</label>
                            <div className="space-y-2">
                                {severities.map(sev => (
                                    <button
                                        key={sev.id}
                                        onClick={() => setFormData({ ...formData, severity: sev.id as any })}
                                        className={`w-full text-right px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${formData.severity === sev.id
                                            ? 'border-gray-400 bg-gray-50 font-bold'
                                            : 'border-gray-100 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>{sev.label}</span>
                                        {formData.severity === sev.id && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-lg text-blue-900 mb-4">ملخص البلاغ</h3>
                            <div className="space-y-2 text-sm text-blue-800 text-right">
                                <p><span className="font-bold ml-2">التصنيف:</span> {categories.find(c => c.id === formData.category)?.label}</p>
                                <p><span className="font-bold ml-2">الضرر:</span> {severities.find(s => s.id === formData.severity)?.label}</p>
                                <p><span className="font-bold ml-2">الخصوصية:</span> {formData.isAnonymous ? 'مجهول الهوية' : 'معرف بالاسم'}</p>
                                <p className="mt-4 p-3 bg-white/50 rounded-lg border border-blue-100 text-gray-700">
                                    "{formData.description}"
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl text-yellow-800 text-sm text-right">
                            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>
                                يضمن النظام أن هذا البلاغ سيعامل بسرية تامة ويستخدم لغرض التحسين والتطوير، وليس للعقاب.
                            </p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-in zoom-in duration-500">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام (OVR) بنجاح</h2>
                        <p className="text-gray-500 mb-8">شكراً لمساهمتك في تحسين سلامة المرضى والجودة.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-black transition-colors"
                        >
                            عودة للرئيسية
                        </button>
                    </div>
                )}

                {/* Validation Error Message */}
                {step === 1 && !formData.description && (
                    <p className="text-red-500 text-xs mt-2 opacity-0 animate-pulse" id="error-msg">يرجى وصف الحادث</p>
                )}

                {step < 4 && (
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium"
                            >
                                <ArrowRight className="w-4 h-4" />
                                السابق
                            </button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <button
                                onClick={() => {
                                    if (step === 1 && !formData.description) return; // Simple validation
                                    setStep(step + 1);
                                }}
                                disabled={step === 1 && !formData.description}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                التالي
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-200"
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'إعتماد وإرسال'}
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};
