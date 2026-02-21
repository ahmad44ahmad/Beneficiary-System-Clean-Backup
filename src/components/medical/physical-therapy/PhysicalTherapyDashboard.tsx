import React, { useState } from 'react';
import { PTAssessmentForm } from './PTAssessmentForm';
import { PTProgressNoteManager } from './PTProgressNoteManager';
import { UnifiedBeneficiaryProfile } from '../../../types/unified';
import { Card } from '../../ui/Card';
import { Activity, ClipboardList, PenTool } from 'lucide-react';

interface PhysicalTherapyDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: any) => void;
}

export const PhysicalTherapyDashboard: React.FC<PhysicalTherapyDashboardProps> = ({ beneficiary, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'assessment' | 'notes'>('assessment');

    // Handle case where beneficiary is not provided
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته</p>
            </div>
        );
    }

    // Mock data access - in real app would come from beneficiary prop
    const ptData = beneficiary.medicalProfile?.physicalTherapy || { assessments: [], notes: [] };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Activity size={24} />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-500">الأهداف النشطة</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {ptData.assessments[0]?.goals?.length || 0}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <ClipboardList size={24} />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-500">آخر جلسة</p>
                            <p className="text-lg font-semibold text-gray-900">
                                قبل يومين
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <PenTool size={24} />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-500">جلسات هذا الشهر</p>
                            <p className="text-2xl font-semibold text-gray-900">12</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('assessment')}
                        className={`${activeTab === 'assessment' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        التقييم والخطة
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`${activeTab === 'notes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        ملاحظات التقدم
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === 'assessment' ? (
                    <PTAssessmentForm
                        initialData={ptData.assessments[0]}
                        onSubmit={() => {}}
                    />
                ) : (
                    <PTProgressNoteManager
                        notes={[]} // Pass actual notes array here
                        onAddNote={() => {}}
                    />
                )}
            </div>
        </div>
    );
};
