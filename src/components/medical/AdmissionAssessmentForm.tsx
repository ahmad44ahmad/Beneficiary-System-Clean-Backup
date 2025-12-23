import React, { useState } from 'react';
import { Beneficiary, NursingAdmissionAssessment } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ChevronRight, ChevronLeft, Save } from 'lucide-react';

interface AdmissionAssessmentFormProps {
    beneficiary: Beneficiary;
    onCancel: () => void;
    onSave: (data: Partial<NursingAdmissionAssessment>) => void;
}

export const AdmissionAssessmentForm: React.FC<AdmissionAssessmentFormProps> = ({ beneficiary, onCancel, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<NursingAdmissionAssessment>>({
        beneficiaryId: beneficiary.id,
        assessmentDate: new Date().toISOString(),
        vitals: {
            temperature: 37,
            pulse: 80,
            respiration: 16,
            bloodPressure: '',
            o2Saturation: 98,
            weight: 0,
            height: 0,
            bmi: 0,
            painScore: 0
        },
        generalAppearance: {
            hygiene: 'Good',
            mentalStatus: 'Alert'
        },
        physicalSystemReview: {
            heent: '',
            respiratory: '',
            cardiovascular: '',
            gastrointestinal: '',
            genitourinary: '',
            musculoskeletal: '',
            integumentary: '',
            neurological: ''
        },
        adls: {
            feeding: 'Independent',
            bathing: 'Independent',
            toileting: 'Independent',
            mobility: 'Independent',
            transfer: 'Independent'
        },
        risks: {
            fallRisk: false,
            pressureUlcerRisk: false,
            aspirationRisk: false,
            allergies: []
        }
    });

    const handleVitalChange = (field: keyof NursingAdmissionAssessment['vitals'], value: string | number) => {
        setFormData(prev => ({
            ...prev,
            vitals: { ...prev.vitals!, [field]: value }
        }));
    };

    const handleAdlChange = (field: keyof NursingAdmissionAssessment['adls'], value: string) => {
        setFormData(prev => ({
            ...prev,
            adls: { ...prev.adls!, [field]: value }
        }));
    };

    const handleSave = () => {
        console.log('Saving Assessment:', formData);
        onSave(formData); // In a real app, pass formData here
    };

    // Step 1: Vitals
    // Step 2: Physical & General
    // Step 3: Functional & Risk

    const nextStep = () => setStep(s => Math.min(3, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    return (
        <div className="bg-white rounded-xl shadow-lg border p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">تقييم تمريضي جديد (Admission Assessment)</h2>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>1. العلامات الحيوية</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>2. الفحص البدني</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>3. المخاطر والوظائف</span>
                </div>
            </div>

            <div className="mb-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="font-semibold text-gray-700">العلامات الحيوية (Vital Signs)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الحرارة (Temperature)</label>
                                <input
                                    type="number"
                                    value={formData.vitals?.temperature}
                                    onChange={e => handleVitalChange('temperature', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="°C"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">النبض (Pulse)</label>
                                <input
                                    type="number"
                                    value={formData.vitals?.pulse}
                                    onChange={e => handleVitalChange('pulse', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="bpm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">التنفس (Resp. Rate)</label>
                                <input
                                    type="number"
                                    value={formData.vitals?.respiration}
                                    onChange={e => handleVitalChange('respiration', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="cpm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ضغط الدم (BP)</label>
                                <input
                                    type="text"
                                    value={formData.vitals?.bloodPressure}
                                    onChange={e => handleVitalChange('bloodPressure', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="120/80"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الوزن (Weight kg)</label>
                                <input
                                    type="number"
                                    value={formData.vitals?.weight}
                                    onChange={e => handleVitalChange('weight', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الطول (Height cm)</label>
                                <input
                                    type="number"
                                    value={formData.vitals?.height}
                                    onChange={e => handleVitalChange('height', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">تشبع الأكسجين (SpO2)</label>
                                <input
                                    type="number"
                                    value={formData.vitals?.o2Saturation}
                                    onChange={e => handleVitalChange('o2Saturation', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded"
                                    placeholder="%"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">مقياس الألم (Pain 0-10)</label>
                                <input
                                    type="range"
                                    min="0" max="10"
                                    value={formData.vitals?.painScore}
                                    onChange={e => handleVitalChange('painScore', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-center text-sm font-bold">{formData.vitals?.painScore}</div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="font-semibold text-gray-700">الفحص العام (General & Physical)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border rounded bg-gray-50">
                                <h4 className="font-bold mb-3">المظهر العام (General Appearance)</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded text-blue-600" />
                                        <span>شاحب (Pallor)</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded text-blue-600" />
                                        <span>يرقان (Jaundice)</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded text-blue-600" />
                                        <span>زراق (Cyanosis)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-4 border rounded bg-gray-50">
                                <h4 className="font-bold mb-3">الجلد (Skin Integrity)</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="skin" className="text-blue-600" defaultChecked />
                                        <span>سليم (Intact)</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="skin" className="text-blue-600" />
                                        <span>جاف / متشقق (Dry/Cracked)</span>
                                    </label>
                                    <div className="mt-2">
                                        <label className="text-xs">ملاحظات (قرح فراش / جروح):</label>
                                        <textarea className="w-full text-sm p-2 border rounded mt-1" rows={2}
                                            value={formData.physicalSystemReview?.integumentary}
                                            onChange={e => setFormData(prev => ({ ...prev, physicalSystemReview: { ...prev.physicalSystemReview!, integumentary: e.target.value } }))}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded bg-gray-50 col-span-full">
                                <h4 className="font-bold mb-3">الجهاز التنفسي (Respiratory)</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <label className="flex items-center gap-2"><input type="checkbox" /> <span>طبيعي</span></label>
                                    <label className="flex items-center gap-2"><input type="checkbox" /> <span>سعال (Cough)</span></label>
                                    <label className="flex items-center gap-2"><input type="checkbox" /> <span>بلغم (Sputum)</span></label>
                                    <label className="flex items-center gap-2"><input type="checkbox" /> <span>صفير (Wheezing)</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h3 className="font-semibold text-gray-700">التقييم الوظيفي والمخاطر (Functional & Risks)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold border-b pb-2">أنشطة الحياة اليومية (ADLs)</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label>التغذية (Feeding)</label>
                                        <select
                                            className="w-full p-2 border rounded mt-1"
                                            value={formData.adls?.feeding}
                                            onChange={e => handleAdlChange('feeding', e.target.value)}
                                        >
                                            <option value="Independent">مستقل (Independent)</option>
                                            <option value="Assist">مساعدة (Assist)</option>
                                            <option value="Dependent">كلي (Dependent)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>الحمام (Bathing)</label>
                                        <select
                                            className="w-full p-2 border rounded mt-1"
                                            value={formData.adls?.bathing}
                                            onChange={e => handleAdlChange('bathing', e.target.value)}
                                        >
                                            <option value="Independent">مستقل (Independent)</option>
                                            <option value="Assist">مساعدة (Assist)</option>
                                            <option value="Dependent">كلي (Dependent)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>الحركة (Mobility)</label>
                                        <select
                                            className="w-full p-2 border rounded mt-1"
                                            value={formData.adls?.mobility}
                                            onChange={e => handleAdlChange('mobility', e.target.value)}
                                        >
                                            <option value="Independent">مستقل (Independent)</option>
                                            <option value="Assist">مساعدة (Assist)</option>
                                            <option value="Bedbound">قعيد (Bedbound)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold border-b pb-2 text-red-700">تقييم المخاطر (Risk Assessment)</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-3 border rounded hover:bg-red-50 cursor-pointer">
                                        <span>خطر السقوط (Fall Risk - Morse)</span>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-red-600"
                                            checked={formData.risks?.fallRisk}
                                            onChange={e => setFormData(prev => ({ ...prev, risks: { ...prev.risks!, fallRisk: e.target.checked } }))}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded hover:bg-red-50 cursor-pointer">
                                        <span>قرح الفراش (Braden Scale Risk)</span>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-red-600"
                                            checked={formData.risks?.pressureUlcerRisk}
                                            onChange={e => setFormData(prev => ({ ...prev, risks: { ...prev.risks!, pressureUlcerRisk: e.target.checked } }))}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded hover:bg-red-50 cursor-pointer">
                                        <span>خطر الشرق (Aspiration Risk)</span>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-red-600"
                                            checked={formData.risks?.aspirationRisk}
                                            onChange={e => setFormData(prev => ({ ...prev, risks: { ...prev.risks!, aspirationRisk: e.target.checked } }))}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between border-t pt-4">
                <Button variant="secondary" onClick={step === 1 ? onCancel : prevStep}>
                    {step === 1 ? 'إلغاء' : <><ChevronRight className="w-4 h-4 ml-2" /> السابق</>}
                </Button>
                <Button onClick={step === 3 ? handleSave : nextStep}>
                    {step === 3 ? <><Save className="w-4 h-4 mr-2" /> حفظ التقييم</> : <>التالي <ChevronLeft className="w-4 h-4 mr-2" /></>}
                </Button>
            </div>
        </div>
    );
};
