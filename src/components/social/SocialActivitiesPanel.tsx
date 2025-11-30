import React, { useState } from 'react';
import { SocialActivityPlan, SocialActivityDocumentation, SocialActivityFollowUp } from '../../types';
import { SocialActivityPlanForm } from './SocialActivityPlanForm';
import { SocialActivityDocumentationForm } from './SocialActivityDocumentationForm';
import { SocialActivityFollowUpForm } from './SocialActivityFollowUpForm';

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
        <div className="social-activities-panel">
            <div className="tabs">
                <button
                    className={activeTab === 'plans' ? 'active' : ''}
                    onClick={() => setActiveTab('plans')}
                >
                    الخطط السنوية
                </button>
                <button
                    className={activeTab === 'documentation' ? 'active' : ''}
                    onClick={() => setActiveTab('documentation')}
                >
                    توثيق الأنشطة
                </button>
                <button
                    className={activeTab === 'followup' ? 'active' : ''}
                    onClick={() => setActiveTab('followup')}
                >
                    متابعة الأنشطة
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'plans' && (
                    <div className="plans-section">
                        <div className="section-header">
                            <h3>الخطط السنوية للأنشطة الاجتماعية</h3>
                            <button className="btn-primary" onClick={() => setIsCreatingPlan(true)}>
                                إضافة خطة جديدة
                            </button>
                        </div>
                        <div className="plans-list">
                            {plans.length === 0 ? (
                                <p className="empty-state">لا توجد خطط مضافة</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>العام</th>
                                            <th>اسم النشاط</th>
                                            <th>المشرف</th>
                                            <th>وقت التنفيذ</th>
                                            <th>التكلفة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans.map(plan => (
                                            <tr key={plan.id}>
                                                <td>{plan.year}</td>
                                                <td>{plan.activityType}</td>
                                                <td>{plan.supervisor}</td>
                                                <td>{plan.executionTimeStart} - {plan.executionTimeEnd}</td>
                                                <td>{plan.cost || 'لا يوجد'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'documentation' && (
                    <div className="documentation-section">
                        <div className="section-header">
                            <h3>توثيق الأنشطة</h3>
                            <button className="btn-primary" onClick={() => setIsCreatingDoc(true)}>
                                توثيق نشاط جديد
                            </button>
                        </div>
                        <div className="docs-list">
                            {documentations.length === 0 ? (
                                <p className="empty-state">لا توجد أنشطة موثقة</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>اسم النشاط</th>
                                            <th>التاريخ</th>
                                            <th>النوع</th>
                                            <th>المشرف</th>
                                            <th>عدد المشاركين</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documentations.map(doc => (
                                            <tr key={doc.id}>
                                                <td>{doc.activityName}</td>
                                                <td>{doc.date}</td>
                                                <td>{doc.type}</td>
                                                <td>{doc.supervisor}</td>
                                                <td>{(doc.internalParticipants?.length || 0) + (doc.externalParticipants?.length || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'followup' && (
                    <div className="followup-section">
                        <div className="section-header">
                            <h3>متابعة قسم الأنشطة</h3>
                            <button className="btn-primary" onClick={() => setIsCreatingFollowUp(true)}>
                                إضافة متابعة
                            </button>
                        </div>
                        <div className="followup-list">
                            {followUps.length === 0 ? (
                                <p className="empty-state">لا توجد متابعات مسجلة</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>الشهر</th>
                                            <th>اسم النشاط</th>
                                            <th>التاريخ</th>
                                            <th>المسؤول</th>
                                            <th>الانجاز</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {followUps.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.month}</td>
                                                <td>{item.activityName}</td>
                                                <td>{item.date}</td>
                                                <td>{item.responsiblePerson}</td>
                                                <td>{item.status === 'achieved' ? 'تم' : 'لم يتم'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>

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
