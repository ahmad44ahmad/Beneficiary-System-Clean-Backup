import React, { useState } from 'react';
import { Beneficiary } from '../../types';
import { MedicalExamination, NursingAdmissionAssessment, NursingCarePlan, NursingProgressNote } from '../../types/medical';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { HeartPulse, FileText, ClipboardList, Activity, Plus } from 'lucide-react';
import { AdmissionAssessmentForm } from './AdmissionAssessmentForm';

interface MedicalDashboardProps {
    beneficiary?: Beneficiary | null;
    medicalExams?: MedicalExamination[];
    // Future props for nursing data would go here
}

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ beneficiary, medicalExams = [] }) => {
    const [activeSubTab, setActiveSubTab] = useState<'overview' | 'assessment' | 'notes' | 'careplan'>('overview');
    const [isAssessing, setIsAssessing] = useState(false);

    // Mock Nursing Data (Temporary until connected to Context)
    const mockNotes: NursingProgressNote[] = [];

    // Handle case where beneficiary is not provided
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته الطبية</p>
            </div>
        );
    }

    if (isAssessing) {
        return (
            <AdmissionAssessmentForm
                beneficiary={beneficiary}
                onCancel={() => setIsAssessing(false)}
                onSave={() => setIsAssessing(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Sub-Navigation */}
            <div className="flex bg-white p-1 rounded-lg border shadow-sm overflow-x-auto">
                <button
                    onClick={() => setActiveSubTab('overview')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Activity className="w-4 h-4" />
                    <span>نظرة عامة</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('assessment')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'assessment' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    <span>التقييم التمريضي</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('careplan')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'careplan' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <HeartPulse className="w-4 h-4" />
                    <span>خطة الرعاية</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('notes')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'notes' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>الملاحظات اليومية</span>
                </button>
            </div>

            {/* Content Area */}
            {activeSubTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="العلامات الحيوية الأخيرة">
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <span className="text-xs text-red-500 block">ضغط الدم</span>
                                <span className="text-xl font-bold text-red-700">120/80</span>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-xs text-blue-500 block">النبض</span>
                                <span className="text-xl font-bold text-blue-700">72</span>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <span className="text-xs text-green-500 block">الأكسجين</span>
                                <span className="text-xl font-bold text-green-700">98%</span>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <span className="text-xs text-orange-500 block">الحرارة</span>
                                <span className="text-xl font-bold text-orange-700">37.0°</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="التشخيصات الطبية">
                        <div className="p-4 space-y-2">
                            <div className="p-2 bg-gray-50 rounded border flex justify-between">
                                <span className="font-medium text-gray-900">{beneficiary.medicalDiagnosis}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">أساسي</span>
                            </div>
                            {beneficiary.psychiatricDiagnosis && (
                                <div className="p-2 bg-gray-50 rounded border flex justify-between">
                                    <span className="font-medium text-gray-900">{beneficiary.psychiatricDiagnosis}</span>
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">نفسي</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {activeSubTab === 'assessment' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">تقييمات التمريض (Admission Assessment)</h3>
                        <Button onClick={() => setIsAssessing(true)} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span>تقييم جديد</span>
                        </Button>
                    </div>

                    <div className="bg-gray-50 p-8 text-center rounded-lg border-2 border-dashed">
                        <p className="text-gray-500">لا توجد تقييمات سابقة. اضغط "تقييم جديد" للبدء.</p>
                    </div>
                </div>
            )}

            {activeSubTab === 'careplan' && (
                <div className="bg-white p-6 text-center rounded-xl shadow-sm">
                    <h3 className="text-gray-400 font-medium">خطط الرعاية التمريضية (Nursing Care Plans)</h3>
                    <p className="text-sm text-gray-300 mt-2">سيتم عرض الخطط العلاجية وتتبع الأهداف هنا.</p>
                </div>
            )}

            {activeSubTab === 'notes' && (
                <div className="bg-white p-6 text-center rounded-xl shadow-sm">
                    <h3 className="text-gray-400 font-medium">الملاحظات التمريضية (Progress Notes)</h3>
                    <p className="text-sm text-gray-300 mt-2">سجل الملاحظات اليومية وتطور الحالة.</p>
                </div>
            )}
        </div>
    );
};
