import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { SocialResearch } from '../../types/social';
import { beneficiaries as initialBeneficiaries } from '../../data/beneficiaries';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { User, Home, Users, FileText, CheckCircle, ChevronRight, ChevronLeft, Save } from 'lucide-react';

// Steps definition
const STEPS = [
    { id: 1, title: 'بيانات المستفيد والولي', icon: User },
    { id: 2, title: 'الوضع الأسري', icon: Users },
    { id: 3, title: 'الوضع السكني والاقتصادي', icon: Home },
    { id: 4, title: 'الرأي المهني والتوصيات', icon: FileText },
];

export const SocialResearchWizard: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser: _currentUser } = useUser();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');

    // Form State
    const [formData, setFormData] = useState<Partial<SocialResearch>>({
        researchDate: new Date().toISOString().split('T')[0],
        isFatherAlive: 'yes',
        isMotherAlive: 'yes',
        hasChronicIllness: 'no',
    });

    // Auto-fill logic
    useEffect(() => {
        if (selectedBeneficiaryId) {
            const beneficiary = initialBeneficiaries.find(b => b.id === selectedBeneficiaryId);
            if (beneficiary) {
                setFormData(prev => ({
                    ...prev,
                    beneficiaryId: beneficiary.id,
                    beneficiaryName: beneficiary.fullName,
                }));
            }
        }
    }, [selectedBeneficiaryId]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = () => {
        setTimeout(() => {
            navigate('/social');
        }, 500);
    };

    const inputClasses = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#148287]/20 focus:border-[#148287] transition-all duration-200";

    const renderRadioGroup = (name: string, value: string | undefined, onChange: (val: string) => void) => (
        <div className="flex gap-3 flex-wrap">
            {['yes', 'no', 'unknown'].map(opt => (
                <label
                    key={opt}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200
                        ${value === opt
                            ? 'border-[#148287] bg-teal-50 text-[#148287]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        name={name}
                        className="hidden"
                        checked={value === opt}
                        onChange={() => onChange(opt)}
                    />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${value === opt ? 'border-[#148287]' : 'border-gray-300'}`}>
                        {value === opt && <span className="w-2 h-2 rounded-full bg-[#148287]" />}
                    </span>
                    <span className="text-sm font-medium">
                        {opt === 'yes' ? 'على قيد الحياة' : opt === 'no' ? 'متوفى' : 'مجهول'}
                    </span>
                </label>
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-teal-50 p-5 rounded-xl border border-teal-100">
                            <h3 className="font-bold text-[#14415A] mb-3">البيانات الأساسية (تعبئة تلقائية)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">المستفيد</label>
                                    <select
                                        className={inputClasses}
                                        value={selectedBeneficiaryId}
                                        onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                                    >
                                        <option value="">اختر مستفيد لبدء البحث...</option>
                                        {initialBeneficiaries.map(b => (
                                            <option key={b.id} value={b.id}>{b.fullName} (ID: {b.id})</option>
                                        ))}
                                    </select>
                                </div>
                                <Input label="تاريخ البحث" type="date" value={formData.researchDate} onChange={e => setFormData({ ...formData, researchDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="اسم الولي" value={formData.guardianName || ''} onChange={e => setFormData({ ...formData, guardianName: e.target.value })} />
                            <Input label="صلة القرابة" value={formData.guardianRelation || ''} onChange={e => setFormData({ ...formData, guardianRelation: e.target.value })} />
                            <Input label="رقم الجوال" value={formData.guardianMobile || ''} onChange={e => setFormData({ ...formData, guardianMobile: e.target.value })} />
                            <Input label="المهنة" value={formData.guardianProfession || ''} onChange={e => setFormData({ ...formData, guardianProfession: e.target.value })} />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">حالة الأب</label>
                                <div className="flex gap-4">
                                    {['yes', 'no', 'unknown'].map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="isFatherAlive"
                                                checked={formData.isFatherAlive === opt}
                                                onChange={() => setFormData({ ...formData, isFatherAlive: opt })}
                                            />
                                            <span>{opt === 'yes' ? 'على قيد الحياة' : opt === 'no' ? 'متوفى' : 'مجهول'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">حالة الأم</label>
                                <div className="flex gap-4">
                                    {['yes', 'no', 'unknown'].map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="isMotherAlive"
                                                checked={formData.isMotherAlive === opt}
                                                onChange={() => setFormData({ ...formData, isMotherAlive: opt })}
                                            />
                                            <span>{opt === 'yes' ? 'على قيد الحياة' : opt === 'no' ? 'متوفى' : 'مجهول'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">التركيبة الأسرية (الإخوة والأخوات)</label>
                            <textarea
                                className={inputClasses + ' h-28'}
                                placeholder="اذكر عدد الإخوة، ترتيب المستفيد، ومن يقيم معه في المنزل..."
                                value={formData.familyComposition || ''}
                                onChange={e => setFormData({ ...formData, familyComposition: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">مدى تكيف الأسرة مع حالة المستفيد</label>
                            <textarea
                                className={inputClasses + ' h-28'}
                                placeholder="صف تقبل الأسرة، زياراتهم، اهتمامهم..."
                                value={formData.familyAdaptation || ''}
                                onChange={e => setFormData({ ...formData, familyAdaptation: e.target.value })}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">نوع السكن</label>
                                <select
                                    className={inputClasses}
                                    value={formData.chronicIllnessDetails || ''}
                                    onChange={e => setFormData({ ...formData, chronicIllnessDetails: e.target.value })}
                                >
                                    <option value="">اختر...</option>
                                    <option value="owned">ملك</option>
                                    <option value="rented">إيجار</option>
                                    <option value="popular">شعبي</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">الحالة الاقتصادية</label>
                                <select className={inputClasses}>
                                    <option value="good">جيدة</option>
                                    <option value="average">متوسطة</option>
                                    <option value="low">ضعيفة (يحتاج دعم)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">تفاصيل الدخل (الضمان، التقاعد، إلخ)</label>
                            <textarea
                                className={inputClasses + ' h-28'}
                                placeholder="اذكر مصادر الدخل..."
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                            <h4 className="font-bold text-amber-800 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                ملخص الباحث الاجتماعي
                            </h4>
                            <p className="text-sm text-amber-700 mt-1">
                                هذا الملخص سيظهر في الملف الرئيسي للمستفيد وسيطلع عليه الفريق الطبي والإداري.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">ملخص البحث</label>
                            <textarea
                                className={inputClasses + ' h-36'}
                                placeholder="اكتب ملخصاً شاملاً للحالة الاجتماعية..."
                                value={formData.socialResearchSummary || ''}
                                onChange={e => setFormData({ ...formData, socialResearchSummary: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">التوصيات</label>
                            <textarea
                                className={inputClasses + ' h-28'}
                                placeholder="توصياتك كأخصائي اجتماعي (مثلاً: يحتاج زيارات مكثفة، يحتاج دعم مالي، إلخ)..."
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#148287] to-[#14415A] rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">بحث اجتماعي جديد</h1>
                    <p className="text-sm text-gray-500 mt-1">توثيق الحالة الاجتماعية للمستفيد لضمان تقديم الرعاية المناسبة</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line Background */}
                    <div className="absolute left-0 right-0 top-6 h-1 bg-gray-200 -z-10 rounded-full">
                        <div
                            className="h-full bg-gradient-to-l from-[#148287] to-[#2DB473] rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        />
                    </div>
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center bg-white px-3">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'border-[#148287] bg-teal-50 text-[#148287] shadow-md' :
                                        isCompleted ? 'border-[#2DB473] bg-emerald-50 text-[#2DB473]' :
                                            'border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs font-medium mt-2 ${isActive ? 'text-[#148287]' : isCompleted ? 'text-[#2DB473]' : 'text-gray-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <Card className="p-8 min-h-[450px] flex flex-col">
                <div className="flex-1">
                    {renderStepContent()}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                    >
                        <ChevronRight className="w-4 h-4 ml-2" />
                        السابق
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button onClick={handleNext} disabled={!selectedBeneficiaryId && currentStep === 1}>
                            التالي
                            <ChevronLeft className="w-4 h-4 mr-2" />
                        </Button>
                    ) : (
                        <Button className="bg-[#2DB473] hover:bg-[#1e9a5c]" onClick={handleSubmit}>
                            <Save className="w-4 h-4 ml-2" />
                            حفظ واعتماد البحث
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
