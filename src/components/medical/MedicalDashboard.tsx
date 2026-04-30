import React, { useState } from 'react';
import { Beneficiary } from '../../types';
import { MedicalExamination } from '../../types/medical';
import { Button } from '../ui/Button';
import { HeartPulse, FileText, ClipboardList, Activity, Plus } from 'lucide-react';
import { AdmissionAssessmentForm } from './AdmissionAssessmentForm';

interface MedicalDashboardProps {
    beneficiary?: Beneficiary | null;
    medicalExams?: MedicalExamination[];
    // Future props for nursing data would go here
}

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ beneficiary }) => {
    const [activeSubTab, setActiveSubTab] = useState<'overview' | 'assessment' | 'notes' | 'careplan'>('overview');
    const [isAssessing, setIsAssessing] = useState(false);

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
        <div className="space-y-6" dir="rtl">
            {/* Enhanced Sub-Navigation */}
            <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-md overflow-x-auto gap-1">
                <button
                    onClick={() => setActiveSubTab('overview')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeSubTab === 'overview'
                        ? 'gradient-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <Activity className="w-4 h-4" />
                    <span>نظرة عامة</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('assessment')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeSubTab === 'assessment'
                        ? 'gradient-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    <span>التقييم التمريضي</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('careplan')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeSubTab === 'careplan'
                        ? 'gradient-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <HeartPulse className="w-4 h-4" />
                    <span>خطة الرعاية</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('notes')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeSubTab === 'notes'
                        ? 'gradient-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>الملاحظات اليومية</span>
                </button>
            </div>

            {/* Content Area */}
            {activeSubTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="hrsd-card">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-hrsd-teal" />
                            العلامات الحيوية الأخيرة
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-[#DC2626]/10 to-[#DC2626]/10 rounded-xl border border-[#DC2626]/30 hover-lift">
                                <HeartPulse className="w-6 h-6 text-[#DC2626] mx-auto mb-2" />
                                <span className="text-xs text-[#DC2626] block font-semibold">ضغط الدم</span>
                                <span className="text-2xl font-bold text-[#B91C1C]">120/80</span>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-[#269798]/10 to-[#269798]/10 rounded-xl border border-[#269798]/30 hover-lift">
                                <Activity className="w-6 h-6 text-[#269798] mx-auto mb-2" />
                                <span className="text-xs text-[#269798] block font-semibold">النبض</span>
                                <span className="text-2xl font-bold text-[#1B7778]">72</span>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-[#2BB574]/10 to-[#2BB574]/10 rounded-xl border border-[#2BB574]/20 hover-lift">
                                <HeartPulse className="w-6 h-6 text-[#1E9658] mx-auto mb-2" />
                                <span className="text-xs text-[#1E9658] block font-semibold">الأكسجين</span>
                                <span className="text-2xl font-bold text-[#1E9658]">98%</span>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-[#F7941D]/10 to-[#F7941D]/10 rounded-xl border border-[#F7941D]/30 hover-lift">
                                <Activity className="w-6 h-6 text-[#D67A0A] mx-auto mb-2" />
                                <span className="text-xs text-[#D67A0A] block font-semibold">الحرارة</span>
                                <span className="text-2xl font-bold text-[#D67A0A]">37.0°</span>
                            </div>
                        </div>
                    </div>

                    <div className="hrsd-card">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-hrsd-teal" />
                            التشخيصات الطبية
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gradient-to-r from-[#269798]/10 to-transparent rounded-lg border-e-4 border-[#269798] hover-lift">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">{beneficiary.medicalDiagnosis}</span>
                                    <span className="badge badge-info">أساسي</span>
                                </div>
                            </div>
                            {beneficiary.psychiatricDiagnosis && (
                                <div className="p-3 bg-gradient-to-r from-[#FCB614]/10 to-transparent rounded-lg border-e-4 border-[#FCB614] hover-lift">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">{beneficiary.psychiatricDiagnosis}</span>
                                        <span className="badge" style={{ background: '#f3e8ff', color: '#6b21a8' }}>نفسي</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'assessment' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-hrsd-teal" />
                            تقييمات التمريض
                        </h3>
                        <Button onClick={() => setIsAssessing(true)} className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-lg hover-lift">
                            <Plus className="w-4 h-4" />
                            <span>تقييم جديد</span>
                        </Button>
                    </div>

                    <div className="hrsd-card text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <ClipboardList className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">لا توجد تقييمات سابقة</h4>
                        <p className="text-gray-500 text-sm">اضغط "تقييم جديد" للبدء في إنشاء تقييم تمريضي جديد</p>
                    </div>
                </div>
            )}

            {activeSubTab === 'careplan' && (
                <div className="hrsd-card text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#DC2626]/10 to-[#DC2626]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <HeartPulse className="w-10 h-10 text-[#DC2626]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">خطط الرعاية والتأهيل</h4>
                    <p className="text-gray-500 text-sm">تُعرض هنا الخطط الفردية للمستفيد ومستوى تحقيق أهدافها</p>
                </div>
            )}

            {activeSubTab === 'notes' && (
                <div className="hrsd-card text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#269798]/10 to-[#0F3144]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-[#269798]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">الملاحظات اليومية</h4>
                    <p className="text-gray-500 text-sm">يُسجَّل في هذا القسم تطور الحالة والملاحظات اليومية لفريق الرعاية</p>
                </div>
            )}
        </div>
    );
};
