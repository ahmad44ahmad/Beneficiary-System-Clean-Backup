import React, { useState } from 'react';
import { PsychProfileForm } from './PsychProfileForm';
import { UnifiedBeneficiaryProfile } from '../../../types/unified';
import { Card } from '../../ui/Card';
import { Brain, FileText, AlertOctagon } from 'lucide-react';

interface PsychologyDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: any) => void;
}

export const PsychologyDashboard: React.FC<PsychologyDashboardProps> = ({ beneficiary, onUpdate }) => {
    // Handle case where beneficiary is not provided
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته</p>
            </div>
        );
    }

    // Mock data access
    const psychData = beneficiary.medicalProfile?.psychology || { assessments: [] };
    const latestAssessment = psychData.assessments[0];

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-teal-100 text-teal-600">
                            <Brain size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">IQ Score</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {latestAssessment?.iqTests?.[0]?.fullScaleIQ || 'N/A'}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <FileText size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                            <p className="text-lg font-semibold text-gray-900 truncate w-40">
                                {latestAssessment?.diagnosis || 'Pending'}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <AlertOctagon size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Behavior Plan</p>
                            <p className="text-lg font-semibold text-gray-900">
                                Yes
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <PsychProfileForm
                    initialData={latestAssessment}
                    onSubmit={(data) => console.log('Update Psych Assessment', data)}
                />
            </div>
        </div>
    );
};
