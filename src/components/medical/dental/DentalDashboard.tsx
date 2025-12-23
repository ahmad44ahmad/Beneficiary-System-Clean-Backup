import React, { useState } from 'react';
import { DentalOdontogram } from './DentalOdontogram';
import { UnifiedBeneficiaryProfile } from '../../../types/unified';
import { Card } from '../../ui/Card';
import { Smile, AlertCircle, HeartPulse } from 'lucide-react';

interface DentalDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: any) => void;
}

export const DentalDashboard: React.FC<DentalDashboardProps> = ({ beneficiary, onUpdate }) => {
    // Handle case where beneficiary is not provided
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته</p>
            </div>
        );
    }

    // Mock data access
    const dentalData = beneficiary.medicalProfile?.dental || { assessments: [] };
    const latestAssessment = dentalData.assessments[0];

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
                            <Smile size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Hygiene Status</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {latestAssessment?.plaqueIndex || 'Unknown'}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <AlertCircle size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Cavities</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {latestAssessment?.teeth?.filter(t => t.status === 'Decayed').length || 0}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <HeartPulse size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Gum Health</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {latestAssessment?.gumHealth || 'Healthy'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <DentalOdontogram
                    initialData={latestAssessment}
                    onSubmit={(data) => console.log('Update Dental Assessment', data)}
                />
            </div>
        </div>
    );
};
