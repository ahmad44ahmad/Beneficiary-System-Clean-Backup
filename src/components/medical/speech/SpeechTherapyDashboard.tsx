import React from 'react';
import { SpeechAssessmentForm } from './SpeechAssessmentForm';
import { UnifiedBeneficiaryProfile } from '../../../types/unified';
import { Card } from '../../ui/Card';
import { Mic, MessageCircle, AlertTriangle } from 'lucide-react';

interface SpeechTherapyDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: Record<string, unknown>) => void;
}

export const SpeechTherapyDashboard: React.FC<SpeechTherapyDashboardProps> = ({ beneficiary }) => {

    // Handle case where beneficiary is not provided
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته</p>
            </div>
        );
    }

    // Mock data access
    const speechData = beneficiary.medicalProfile?.speechTherapy || { assessments: [] };
    const latestAssessment = speechData.assessments[0];

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-[#0F3144]/10 text-[#0F3144]">
                            <MessageCircle size={24} />
                        </div>
                        <div className="me-4">
                            <p className="text-sm font-medium text-gray-500">نمط التواصل</p>
                            <p className="text-lg font-semibold text-gray-900">لفظي (جمل)</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-[#DC2626]/10 text-[#DC2626]">
                            <Mic size={24} />
                        </div>
                        <div className="me-4">
                            <p className="text-sm font-medium text-gray-500">وضوح الكلام</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {latestAssessment?.intelligibility || 100}%
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-[#F7941D]/15 text-[#F7941D]">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="me-4">
                            <p className="text-sm font-medium text-gray-500">خطر البلع</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {latestAssessment?.swallowing?.aspirationRisk ? 'خطر عالي' : 'خطر منخفض'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <SpeechAssessmentForm
                    initialData={latestAssessment}
                    onSubmit={() => {}}
                />
            </div>
        </div>
    );
};
