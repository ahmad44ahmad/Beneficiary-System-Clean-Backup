import React, { useState } from 'react';
import { SpeechAssessmentForm } from './SpeechAssessmentForm';
import { UnifiedBeneficiaryProfile } from '../../../types/unified';
import { Card } from '../../ui/Card';
import { Mic, MessageCircle, AlertTriangle } from 'lucide-react';

interface SpeechTherapyDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: any) => void;
}

export const SpeechTherapyDashboard: React.FC<SpeechTherapyDashboardProps> = ({ beneficiary, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'assessment' | 'plans'>('assessment');

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
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <MessageCircle size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Communication Mode</p>
                            <p className="text-lg font-semibold text-gray-900">Verbal (Sentences)</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                            <Mic size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Intelligibility</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {latestAssessment?.intelligibility || 100}%
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Swallowing Risk</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {latestAssessment?.swallowing?.aspirationRisk ? 'High Risk' : 'Low Risk'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <SpeechAssessmentForm
                    initialData={latestAssessment}
                    onSubmit={(data) => console.log('Update Speech Assessment', data)}
                />
            </div>
        </div>
    );
};
