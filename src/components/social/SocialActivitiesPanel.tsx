import React, { useState } from 'react';
import { CalendarDays, FileCheck, ClipboardCheck, Plus } from 'lucide-react';
import { SocialActivityPlan, SocialActivityDocumentation, SocialActivityFollowUp } from '../../types';
import { SocialActivityPlanForm } from './SocialActivityPlanForm';
import { SocialActivityDocumentationForm } from './SocialActivityDocumentationForm';
import { SocialActivityFollowUpForm } from './SocialActivityFollowUpForm';

const TABS = [
    { id: 'plans' as const, label: 'الخطط السنوية', formLabel: 'نموذج 1', icon: CalendarDays },
    { id: 'documentation' as const, label: 'توثيق الأنشطة', formLabel: '', icon: FileCheck },
    { id: 'followup' as const, label: 'متابعة الأنشطة', formLabel: '', icon: ClipboardCheck },
];

interface SocialActivitiesPanelProps {
    plans: SocialActivityPlan[];
    documentations: SocialActivityDocumentation[];
    followUps: SocialActivityFollowUp[];
    onAddPlan: (plan: SocialActivityPlan) => void;
    onAddDocumentation: (doc: SocialActivityDocumentation) => void;
    onAddFollowUp: (followUp: SocialActivityFollowUp) => void;
}

export const SocialActivitiesPanel: React.FC<SocialActivitiesPanelProps> = ({
    plans,
    documentations,
    followUps,
    onAddPlan,
    onAddDocumentation,
    onAddFollowUp
}) => {
    const [activeTab, setActiveTab] = useState<'plans' | 'documentation' | 'followup'>('plans');
    const [isCreatingPlan, setIsCreatingPlan] = useState(false);
    const [isCreatingDoc, setIsCreatingDoc] = useState(false);
    const [isCreatingFollowUp, setIsCreatingFollowUp] = useState(false);

    return (
        <div className="space-y-6" dir="rtl">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1.5 overflow-x-auto">
                {TABS.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                                        whitespace-nowrap transition-all duration-200
                                        ${activeTab === tab.id
                                    ? 'bg-white text-[#148287] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            <TabIcon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.formLabel && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-md
                                    ${activeTab === tab.id ? 'bg-[#148287]/10 text-[#148287]' : 'bg-gray-200 text-gray-500'}`}>
                                    {tab.formLabel}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreatingPlan(true)}
                            className="px-5 py-2.5 bg-[#148287] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة خطة جديدة
                        </button>
                    </div>

                    {plans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                                <CalendarDays className="w-10 h-10 text-teal-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد خطط مضافة</h3>
                            <p className="text-sm text-gray-400">ابدأ بإضافة خطة نشاط سنوية جديدة</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-l from-[#148287]/5 to-[#14415A]/5 border-b border-gray-200">
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">العام</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">اسم النشاط</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">المشرف</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">وقت التنفيذ</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">التكلفة</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">الفئة المستهدفة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {plans.map(plan => (
                                            <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm text-gray-600">{plan.year}</td>
                                                <td className="px-5 py-4 text-sm text-gray-700 font-medium">{plan.activityType}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{plan.supervisor}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{plan.executionTimeStart}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{plan.cost || '0'}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{plan.targetGroup}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Documentation Tab */}
            {activeTab === 'documentation' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreatingDoc(true)}
                            className="px-5 py-2.5 bg-[#148287] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            توثيق نشاط جديد
                        </button>
                    </div>

                    {documentations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                <FileCheck className="w-10 h-10 text-emerald-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد أنشطة موثقة</h3>
                            <p className="text-sm text-gray-400">ابدأ بتوثيق نشاط اجتماعي جديد</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-l from-[#148287]/5 to-[#14415A]/5 border-b border-gray-200">
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">اسم النشاط</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">التاريخ</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">النوع</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">المشرف</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">عدد المشاركين</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {documentations.map(doc => (
                                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm text-gray-700 font-medium">{doc.activityName}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{doc.date}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{doc.type}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{doc.supervisor}</td>
                                                <td className="px-5 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#148287]">
                                                        {(doc.internalParticipants?.length || 0) + (doc.externalParticipants?.length || 0)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Follow-up Tab */}
            {activeTab === 'followup' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreatingFollowUp(true)}
                            className="px-5 py-2.5 bg-[#148287] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة متابعة
                        </button>
                    </div>

                    {followUps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                                <ClipboardCheck className="w-10 h-10 text-amber-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد متابعات مسجلة</h3>
                            <p className="text-sm text-gray-400">ابدأ بإضافة تقرير متابعة جديد</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-l from-[#148287]/5 to-[#14415A]/5 border-b border-gray-200">
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">الشهر</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">اسم النشاط</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">التاريخ</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">المسؤول</th>
                                            <th className="text-right px-5 py-4 text-sm font-bold text-[#14415A] whitespace-nowrap">الإنجاز</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {followUps.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm text-gray-600">{item.month}</td>
                                                <td className="px-5 py-4 text-sm text-gray-700 font-medium">{item.activityName}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{item.date}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{item.responsiblePerson}</td>
                                                <td className="px-5 py-4 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${item.status === 'achieved'
                                                            ? 'bg-emerald-50 text-[#2DB473]'
                                                            : 'bg-red-50 text-red-600'}`}>
                                                        {item.status === 'achieved' ? 'تم' : 'لم يتم'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {isCreatingPlan && (
                <SocialActivityPlanForm
                    onSave={(plan) => {
                        onAddPlan(plan);
                        setIsCreatingPlan(false);
                    }}
                    onCancel={() => setIsCreatingPlan(false)}
                />
            )}

            {isCreatingDoc && (
                <SocialActivityDocumentationForm
                    onSave={(doc) => {
                        onAddDocumentation(doc);
                        setIsCreatingDoc(false);
                    }}
                    onCancel={() => setIsCreatingDoc(false)}
                />
            )}

            {isCreatingFollowUp && (
                <SocialActivityFollowUpForm
                    onSave={(item) => {
                        onAddFollowUp(item);
                        setIsCreatingFollowUp(false);
                    }}
                    onCancel={() => setIsCreatingFollowUp(false)}
                />
            )}
        </div>
    );
};
