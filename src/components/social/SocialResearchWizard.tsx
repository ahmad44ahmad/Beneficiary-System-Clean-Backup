import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Beneficiary } from '../../types';
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
    const { currentUser } = useUser();
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
                    // In a real app, we might pull more info here if available
                }));
            }
        }
    }, [selectedBeneficiaryId]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = () => {
        // Here we would save to the backend/context
        // Simulate API call
        setTimeout(() => {
            navigate('/social');
        }, 500);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
                            <h3 className="font-bold text-blue-800 mb-2">البيانات الأساسية (تعبئة تلقائية)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">المستفيد</label>
                                    <select
                                        className="w-full border rounded-md p-2 bg-white"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                onChange={() => setFormData({ ...formData, isFatherAlive: opt as any })}
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
                                                onChange={() => setFormData({ ...formData, isMotherAlive: opt as any })}
                                            />
                                            <span>{opt === 'yes' ? 'على قيد الحياة' : opt === 'no' ? 'متوفى' : 'مجهول'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">التركيبة الأسرية (الإخوة والأخوات)</label>
                            <textarea
                                className="w-full border rounded-md p-2 h-24"
                                placeholder="اذكر عدد الإخوة، ترتيب المستفيد، ومن يقيم معه في المنزل..."
                                value={formData.familyComposition || ''}
                                onChange={e => setFormData({ ...formData, familyComposition: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">مدى تكيف الأسرة مع حالة المستفيد</label>
                            <textarea
                                className="w-full border rounded-md p-2 h-24"
                                placeholder="صف تقبل الأسرة، زياراتهم، اهتمامهم..."
                                value={formData.familyAdaptation || ''}
                                onChange={e => setFormData({ ...formData, familyAdaptation: e.target.value })}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">نوع السكن</label>
                                <select
                                    className="w-full border rounded-md p-2"
                                    value={formData.chronicIllnessDetails || ''} // Using a temp field mapping for demo
                                    onChange={e => setFormData({ ...formData, chronicIllnessDetails: e.target.value })}
                                >
                                    <option value="">اختر...</option>
                                    <option value="owned">ملك</option>
                                    <option value="rented">إيجار</option>
                                    <option value="popular">شعبي</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الحالة الاقتصادية</label>
                                <select className="w-full border rounded-md p-2">
                                    <option value="good">جيدة</option>
                                    <option value="average">متوسطة</option>
                                    <option value="low">ضعيفة (يحتاج دعم)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">تفاصيل الدخل (الضمان، التقاعد، إلخ)</label>
                            <textarea
                                className="w-full border rounded-md p-2 h-24"
                                placeholder="اذكر مصادر الدخل..."
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-4">
                            <h4 className="font-bold text-yellow-800 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                ملخص الباحث الاجتماعي
                            </h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                هذا الملخص سيظهر في الملف الرئيسي للمستفيد وسيطلع عليه الفريق الطبي والإداري.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">ملخص البحث</label>
                            <textarea
                                className="w-full border rounded-md p-2 h-32"
                                placeholder="اكتب ملخصاً شاملاً للحالة الاجتماعية..."
                                value={formData.socialResearchSummary || ''}
                                onChange={e => setFormData({ ...formData, socialResearchSummary: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">التوصيات</label>
                            <textarea
                                className="w-full border rounded-md p-2 h-24"
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
        <div className="max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">بحث اجتماعي جديد</h1>
                <p className="text-gray-500">توثيق الحالة الاجتماعية للمستفيد لضمان تقديم الرعاية المناسبة</p>
            </div>

            {/* Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600' :
                                        isCompleted ? 'border-green-600 bg-green-50 text-green-600' :
                                            'border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs font-medium mt-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <Card className="p-6 min-h-[400px] flex flex-col">
                <div className="flex-1">
                    {renderStepContent()}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
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
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                            <Save className="w-4 h-4 ml-2" />
                            حفظ واعتماد البحث
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
