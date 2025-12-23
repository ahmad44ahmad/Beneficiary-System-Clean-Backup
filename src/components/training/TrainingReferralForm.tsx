import React, { useState } from 'react';
import { TrainingReferral, Beneficiary } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TrainingReferralFormProps {
    beneficiaries: Beneficiary[];
    onSubmit: (data: TrainingReferral) => void;
    onCancel: () => void;
}

export const TrainingReferralForm: React.FC<TrainingReferralFormProps> = ({ beneficiaries, onSubmit, onCancel }) => {
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');

    // Initialize empty form state
    const [formData, setFormData] = useState<Partial<TrainingReferral>>({
        referralDate: new Date().toISOString().split('T')[0],
        goals: {
            communityIntegration: false,
            educationalIntegration: false,
            returnToFamily: false,
            vocationalPrep: false,
            skillDevelopment: false,
            talentDevelopment: false,
        },
        currentPerformance: {
            selfCare: 'average',
            eating: 'average',
            personalHygiene: 'average',
            communication: 'average',
            socialEtiquette: 'average',
            cooperation: 'average',
            discrimination: 'average',
            toolKnowledge: 'average',
            instructionAcceptance: 'average',
            spatialTemporalAwareness: 'average',
            namesAwareness: 'average',
            dangerAwareness: 'average',
            writingAbility: 'average',
            concentration: 'average',
        },
    });

    const selectedBeneficiary = beneficiaries.find(b => b.id === selectedBeneficiaryId);

    const handleGoalChange = (key: keyof typeof formData.goals) => {
        setFormData(prev => ({
            ...prev,
            goals: {
                ...prev.goals!,
                [key]: !prev.goals![key]
            }
        }));
    };

    const handlePerformanceChange = (key: keyof typeof formData.currentPerformance, value: 'good' | 'average' | 'poor') => {
        setFormData(prev => ({
            ...prev,
            currentPerformance: {
                ...prev.currentPerformance!,
                [key]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBeneficiaryId) return;

        // Construct final object
        const finalData: TrainingReferral = {
            id: crypto.randomUUID(),
            beneficiaryId: selectedBeneficiaryId,
            referralDate: formData.referralDate!,
            referralDateHijri: formData.referralDateHijri,
            medicalDiagnosis: selectedBeneficiary?.medicalDiagnosis,
            psychologicalDiagnosis: selectedBeneficiary?.psychiatricDiagnosis,
            goals: formData.goals as any,
            currentPerformance: formData.currentPerformance as any,
            specialistName: formData.specialistName,
            trainerName: formData.trainerName,
            supervisorName: formData.supervisorName,
            notes: formData.notes || '',
        };
        onSubmit(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-800">نموذج تحويل للالتحاق بالبرامج التدريبية (نموذج 4)</h2>
                    <Button variant="ghost" onClick={onCancel}>✕</Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Header Section: Beneficiary Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستفيد</label>
                            <select
                                className="w-full border rounded-md p-2"
                                value={selectedBeneficiaryId}
                                onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                                required
                            >
                                <option value="">اختر مستفيد...</option>
                                {beneficiaries.map(b => (
                                    <option key={b.id} value={b.id}>{b.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                            <div className="p-2 bg-gray-100 rounded border text-gray-600">
                                {selectedBeneficiary?.dob || '-'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">التشخيص الطبي</label>
                            <div className="p-2 bg-gray-100 rounded border text-gray-600">
                                {selectedBeneficiary?.medicalDiagnosis || '-'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">التشخيص النفسي</label>
                            <div className="p-2 bg-gray-100 rounded border text-gray-600">
                                {selectedBeneficiary?.psychiatricDiagnosis || '-'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التحويل (ميلادي)</label>
                            <Input
                                type="date"
                                value={formData.referralDate}
                                onChange={(e) => setFormData({ ...formData, referralDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الغرفة</label>
                            <div className="p-2 bg-gray-100 rounded border text-gray-600">
                                {selectedBeneficiary?.roomNumber || '-'}
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Referral Goals */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-green-700 border-b pb-2">1. أهداف التحويل</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { k: 'communityIntegration', label: 'دمج مجتمعي' },
                                { k: 'educationalIntegration', label: 'دمج تعليمي' },
                                { k: 'returnToFamily', label: 'عودة للأسرة' },
                                { k: 'skillDevelopment', label: 'تطوير مهارات' },
                                { k: 'vocationalPrep', label: 'تهيئة مهنية' },
                                { k: 'talentDevelopment', label: 'تنمية مواهب' },
                            ].map(({ k, label }) => (
                                <label key={k} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={(formData.goals as any)[k]}
                                        onChange={() => handleGoalChange(k as any)}
                                        className="w-5 h-5 text-green-600 rounded"
                                    />
                                    <span className="font-medium text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Current Performance Assessment Table */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-green-700 border-b pb-2">2. مستوى الأداء الحالي</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-right w-1/2">المهارة</th>
                                        <th className="border p-2 text-center">جيد</th>
                                        <th className="border p-2 text-center">جيد نوعاً ما</th>
                                        <th className="border p-2 text-center">الملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { k: 'selfCare', label: 'الاعتماد على نفسه قضاء الحاجة' },
                                        { k: 'eating', label: 'الاعتماد على نفسه في تناول الطعام' },
                                        { k: 'personalHygiene', label: 'الاعتماد على نفسه في العناية الشخصية' },
                                        { k: 'communication', label: 'التواصل مع الآخرين' },
                                        { k: 'socialEtiquette', label: 'معرفة الآداب العامة واحترام الآخرين' },
                                        { k: 'cooperation', label: 'يشارك ويبادر للتعاون مع الآخرين' },
                                        { k: 'discrimination', label: 'لديه القدرة على التمييز والتصنيف' },
                                        { k: 'toolKnowledge', label: 'لديه حصيلة معرفية للأدوات حوله' },
                                        { k: 'instructionAcceptance', label: 'يتقبل الأوامر والتوجيهات' },
                                        { k: 'spatialTemporalAwareness', label: 'يدرك المكان والزمان' },
                                        { k: 'namesAwareness', label: 'يدرك أسماء المحيطين حوله' },
                                        { k: 'dangerAwareness', label: 'يدرك المخاطر ويبتعد عنها' },
                                        { k: 'writingAbility', label: 'يمسك القلم ويحاول الكتابة' },
                                        { k: 'concentration', label: 'مستوى التركيز والانتباه لديه' },
                                    ].map(({ k, label }) => (
                                        <tr key={k} className="hover:bg-gray-50">
                                            <td className="border p-2 text-gray-800 font-medium">{label}</td>
                                            <td className="border p-2 text-center">
                                                <input
                                                    type="radio"
                                                    name={k}
                                                    checked={(formData.currentPerformance as any)[k] === 'good'}
                                                    onChange={() => handlePerformanceChange(k as any, 'good')}
                                                />
                                            </td>
                                            <td className="border p-2 text-center">
                                                <input
                                                    type="radio"
                                                    name={k}
                                                    checked={(formData.currentPerformance as any)[k] === 'average'}
                                                    onChange={() => handlePerformanceChange(k as any, 'average')}
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input className="w-full border-none bg-transparent focus:ring-0 text-sm" placeholder="..." />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 3: Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الأخصائي المتابع</label>
                            <Input
                                value={formData.specialistName}
                                onChange={(e) => setFormData({ ...formData, specialistName: e.target.value })}
                                placeholder="الاسم والتوقيع"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المدرب المستلم</label>
                            <Input
                                value={formData.trainerName}
                                onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                                placeholder="الاسم والتوقيع"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">مشرف قسم التأهيل المجتمعي</label>
                            <Input
                                value={formData.supervisorName}
                                onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                                placeholder="الاسم والتوقيع"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button variant="outline" onClick={onCancel} type="button">إلغاء</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" type="submit">
                            حفظ واعتماد النموذج
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
