import React, { useState } from 'react';
import { TrainingReferral } from '../types';
import { useUnifiedData } from '../context/UnifiedDataContext';
import { TrainingReferralForm } from '../components/training/TrainingReferralForm';
import { Button } from '../components/ui/Button';

export const TrainingDashboard = () => {
    const { beneficiaries } = useUnifiedData();
    const [referrals, setReferrals] = useState<TrainingReferral[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    const handleSave = (referral: TrainingReferral) => {
        setReferrals(prev => [referral, ...prev]);
        setIsCreating(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">التأهيل المجتمعي والتدريب</h1>
                    <p className="text-gray-500">إدارة طلبات التحويل ومتابعة البرامج التدريبية</p>
                </div>
                <Button className="bg-green-600" onClick={() => setIsCreating(true)}>
                    + طلب تحويل جديد (نموذج 4)
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm">إجمالي المحولين</h3>
                    <p className="text-2xl font-bold">{referrals.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm">دمج تعليمي</h3>
                    <p className="text-2xl font-bold">{referrals.filter(r => r.goals.educationalIntegration).length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm">تأهيل مهني</h3>
                    <p className="text-2xl font-bold">{referrals.filter(r => r.goals.vocationalPrep).length}</p>
                </div>
            </div>

            {/* Referrals List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-bold text-gray-700">سجل التحويلات</h3>
                </div>
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="p-3">اسم المستفيد</th>
                            <th className="p-3">تاريخ التحويل</th>
                            <th className="p-3">نوع التحويل</th>
                            <th className="p-3">الحالة</th>
                            <th className="p-3">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {referrals.map(referral => {
                            const beneficiary = beneficiaries.find(b => b.id === referral.beneficiaryId);
                            const types = [];
                            if (referral.goals.educationalIntegration) types.push('تعليمي');
                            if (referral.goals.vocationalPrep) types.push('مهني');
                            if (referral.goals.communityIntegration) types.push('مجتمعي');

                            return (
                                <tr key={referral.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium">{beneficiary?.fullName || 'غير معروف'}</td>
                                    <td className="p-3">{referral.referralDate}</td>
                                    <td className="p-3">
                                        <div className="flex gap-1 flex-wrap">
                                            {types.map(t => <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{t}</span>)}
                                        </div>
                                    </td>
                                    <td className="p-3"><span className="text-green-600 bg-green-50 px-2 py-1 rounded">معتمد</span></td>
                                    <td className="p-3">
                                        <Button variant="ghost" size="sm">عرض</Button>
                                    </td>
                                </tr>
                            );
                        })}
                        {referrals.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    لا توجد طلبات تحويل مسجلة
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isCreating && (
                <TrainingReferralForm
                    beneficiaries={beneficiaries}
                    onSubmit={handleSave}
                    onCancel={() => setIsCreating(false)}
                />
            )}
        </div>
    );
};
