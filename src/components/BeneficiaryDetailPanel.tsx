import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog, MedicalExamination, IndividualEducationalPlan, InjuryReport, FamilyCaseStudy, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation, FamilyGuidanceReferral, PostCareFollowUp } from '../types';
import { DetailCard } from './DetailCard';
import { DetailItem } from './DetailItem';
import { VisitLogPanel } from './VisitLogPanel';

interface BeneficiaryDetailPanelProps {
    beneficiary: Beneficiary | null;
    caseStudies: CaseStudy[];
    socialResearchForms: SocialResearch[];
    rehabilitationPlans: RehabilitationPlan[];
    visitLogs: VisitLog[];
    medicalExaminations: MedicalExamination[];
    educationalPlans: IndividualEducationalPlan[];
    injuryReports: InjuryReport[];
    familyCaseStudies: FamilyCaseStudy[];
    onStartCreateCaseStudy: () => void;
    onStartCreateSocialResearch: () => void;
    onStartCreateRehabPlan: () => void;
    onAddVisitLog: (log: VisitLog) => void;
    onStartClothingRequest: () => void;
    onStartCreateMedicalExam: () => void;
    onStartCreateEducationalPlan: () => void;
    onStartCreateInjuryReport: () => void;
    onStartCreateFamilyCaseStudy: () => void;
    trainingReferrals: TrainingReferral[];
    trainingPlanFollowUps: TrainingPlanFollowUp[];
    vocationalEvaluations: VocationalEvaluation[];
    onStartCreateTrainingReferral: () => void;
    onStartCreateTrainingFollowUp: () => void;
    onStartCreateVocationalEval: () => void;
    familyGuidanceReferrals: FamilyGuidanceReferral[];
    postCareFollowUps: PostCareFollowUp[];
    onStartCreateFamilyGuidanceReferral: () => void;
    onStartCreatePostCareFollowUp: () => void;
}

export const BeneficiaryDetailPanel: React.FC<BeneficiaryDetailPanelProps> = ({
    beneficiary,
    caseStudies,
    socialResearchForms,
    rehabilitationPlans,
    visitLogs,
    medicalExaminations,
    educationalPlans,
    injuryReports,
    familyCaseStudies,
    onStartCreateCaseStudy,
    onStartCreateSocialResearch,
    onStartCreateRehabPlan,
    onAddVisitLog,
    onStartClothingRequest,
    onStartCreateMedicalExam,
    onStartCreateEducationalPlan,
    onStartCreateInjuryReport,
    onStartCreateFamilyCaseStudy,
    trainingReferrals,
    trainingPlanFollowUps,
    vocationalEvaluations,
    onStartCreateTrainingReferral,
    onStartCreateTrainingFollowUp,
    onStartCreateVocationalEval,
    familyGuidanceReferrals,
    postCareFollowUps,
    onStartCreateFamilyGuidanceReferral,
    onStartCreatePostCareFollowUp
}) => {
    const [activeTab, setActiveTab] = useState<'rehab' | 'social' | 'family' | 'training'>('rehab');

    if (!beneficiary) {
        return (
            <main className="beneficiary-detail-panel">
                <div className="placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                    <p className="placeholder-text">يرجى اختيار مستفيد من القائمة لعرض بياناته</p>
                </div>
            </main>
        );
    }

    const relevantCaseStudies = caseStudies.filter(cs => cs.beneficiaryId === beneficiary.id);
    const relevantSocialResearch = socialResearchForms.filter(sr => sr.beneficiaryId === beneficiary.id);
    const relevantRehabPlans = rehabilitationPlans.filter(rp => rp.beneficiaryId === beneficiary.id);
    const relevantMedicalExams = medicalExaminations.filter(me => me.beneficiaryId === beneficiary.id);
    const relevantEducationalPlans = educationalPlans.filter(ep => ep.beneficiaryId === beneficiary.id);
    const relevantInjuryReports = injuryReports.filter(ir => ir.beneficiaryId === beneficiary.id);
    const relevantFamilyCaseStudies = familyCaseStudies.filter(fcs => fcs.beneficiaryId === beneficiary.id);
    const relevantTrainingReferrals = trainingReferrals.filter(tr => tr.beneficiaryId === beneficiary.id);
    const relevantTrainingFollowUps = trainingPlanFollowUps.filter(tf => tf.beneficiaryId === beneficiary.id);
    const relevantVocationalEvals = vocationalEvaluations.filter(ve => ve.beneficiaryId === beneficiary.id);
    const relevantFamilyGuidanceReferrals = familyGuidanceReferrals.filter(fg => fg.beneficiaryId === beneficiary.id);
    const relevantPostCareFollowUps = postCareFollowUps.filter(pc => pc.beneficiaryId === beneficiary.id);

    return (
        <main className="beneficiary-detail-panel" aria-live="polite">
            <div className="detail-card" style={{ marginBottom: '1rem' }}>
                <div className="card-content">
                    <div className="detail-grid">
                        <DetailItem label="الاسم الكامل" value={beneficiary.fullName} />
                        <DetailItem label="رقم المستفيد" value={beneficiary.id} />
                        <DetailItem label="العمر" value={beneficiary.age} />
                        <DetailItem label="الحالة" value={beneficiary.status === 'active' ? 'نشط' : beneficiary.status === 'exit' ? 'خروج' : '-'} />
                    </div>
                </div>
            </div>

            <div className="main-nav" style={{ marginBottom: '1.5rem', justifyContent: 'flex-start', background: '#f5f5f5', padding: '0.5rem', borderRadius: '8px' }}>
                <button
                    className={activeTab === 'rehab' ? 'active' : ''}
                    onClick={() => setActiveTab('rehab')}
                    style={{ color: activeTab === 'rehab' ? '#0d47a1' : '#666', background: activeTab === 'rehab' ? 'white' : 'transparent', border: activeTab === 'rehab' ? '1px solid #ddd' : 'none', boxShadow: activeTab === 'rehab' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                    ١. الخطة التأهيلية والمتابعة الفردية
                </button>
                <button
                    className={activeTab === 'social' ? 'active' : ''}
                    onClick={() => setActiveTab('social')}
                    style={{ color: activeTab === 'social' ? '#0d47a1' : '#666', background: activeTab === 'social' ? 'white' : 'transparent', border: activeTab === 'social' ? '1px solid #ddd' : 'none', boxShadow: activeTab === 'social' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                    ٢. المتابعة الاجتماعية والأنشطة
                </button>
                <button
                    className={activeTab === 'family' ? 'active' : ''}
                    onClick={() => setActiveTab('family')}
                    style={{ color: activeTab === 'family' ? '#0d47a1' : '#666', background: activeTab === 'family' ? 'white' : 'transparent', border: activeTab === 'family' ? '1px solid #ddd' : 'none', boxShadow: activeTab === 'family' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                    ٣. الإرشاد الأسري والرعاية اللاحقة
                </button>
                <button
                    className={activeTab === 'training' ? 'active' : ''}
                    onClick={() => setActiveTab('training')}
                    style={{ color: activeTab === 'training' ? '#0d47a1' : '#666', background: activeTab === 'training' ? 'white' : 'transparent', border: activeTab === 'training' ? '1px solid #ddd' : 'none', boxShadow: activeTab === 'training' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                    ٤. التدريب والتأهيل المهني
                </button>
            </div>

            {activeTab === 'rehab' && (
                <>
                    <div className="detail-actions">
                        <button className="button-primary" onClick={onStartCreateRehabPlan}>إضافة خطة تأهيل</button>
                        <button className="button-secondary" onClick={onStartCreateEducationalPlan}>إضافة خطة تربوية (IEP)</button>
                        <button className="button-secondary" onClick={onStartCreateMedicalExam}>إضافة كشف طبي</button>
                        <button className="button-secondary" onClick={onStartCreateSocialResearch}>إضافة بحث اجتماعي</button>
                    </div>

                    <DetailCard title="البيانات الأساسية والتقييم">
                        <DetailItem label="التشخيص الطبي" value={beneficiary.medicalDiagnosis} />
                        <DetailItem label="التشخيص النفسي" value={beneficiary.psychiatricDiagnosis || '-'} />
                        <DetailItem label="مستوى الذكاء" value={`${beneficiary.iqLevel} (${beneficiary.iqScore})`} />
                    </DetailCard>

                    <DetailCard title="الخطط التربوية الفردية (IEP)">
                        {relevantEducationalPlans.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantEducationalPlans.map(ep => (
                                    <li key={ep.id} className="case-study-list-item">
                                        <strong>تاريخ الخطة:</strong> {ep.planDate} | <strong>المعلم:</strong> {ep.teacherName}
                                        <br />
                                        <strong>مستوى الأداء:</strong> {ep.currentPerformanceLevel.substring(0, 50)}...
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد خطط تربوية مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="خطط التأهيل العلاجية">
                        {relevantRehabPlans.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantRehabPlans.map(rp => (
                                    <li key={rp.id} className="case-study-list-item">
                                        <strong>تاريخ الخطة:</strong> {rp.planDate} | <strong>الفريق:</strong> {rp.teamMembers.map(m => m.name).join(', ')}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد خطط تأهيل مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="الكشوفات الطبية">
                        {relevantMedicalExams.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantMedicalExams.map(me => (
                                    <li key={me.id} className="case-study-list-item">
                                        <strong>التاريخ:</strong> {me.date} | <strong>الطبيب:</strong> {me.doctorName}
                                        <br />
                                        <strong>التشخيص:</strong> {me.diagnosis}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد كشوفات طبية مسجلة.</p>}
                    </DetailCard>
                </>
            )}

            {activeTab === 'social' && (
                <>
                    <div className="detail-actions">
                        <button className="button-primary" onClick={onStartClothingRequest}>صرف كسوة</button>
                        <button className="button-secondary" onClick={onStartCreateInjuryReport}>إبلاغ عن إصابة</button>
                    </div>

                    <VisitLogPanel
                        beneficiary={beneficiary}
                        logs={visitLogs}
                        onAddLog={onAddVisitLog}
                    />

                    <DetailCard title="سجل الإصابات والحوادث">
                        {relevantInjuryReports.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantInjuryReports.map(ir => (
                                    <li key={ir.id} className="case-study-list-item" style={{ borderLeft: '4px solid #c62828' }}>
                                        <strong>التاريخ:</strong> {ir.date} {ir.time}
                                        <br />
                                        <strong>النوع:</strong> {ir.injuryType} | <strong>المكان:</strong> {ir.location}
                                        <br />
                                        <strong>الوصف:</strong> {ir.description}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد إصابات مسجلة.</p>}
                    </DetailCard>
                </>
            )}

            {activeTab === 'family' && (
                <>
                    <div className="detail-actions">
                        <button className="button-primary" onClick={onStartCreateFamilyCaseStudy}>إضافة دراسة حالة أسرية</button>
                        <button className="button-secondary" onClick={onStartCreateCaseStudy}>إضافة دراسة حالة عامة</button>
                        <button className="button-secondary" onClick={onStartCreateFamilyGuidanceReferral}>تحويل للإرشاد الأسري</button>
                        <button className="button-secondary" onClick={onStartCreatePostCareFollowUp}>متابعة رعاية لاحقة</button>
                    </div>

                    <DetailCard title="بيانات الأسرة والولي">
                        <DetailItem label="ولي الأمر" value={beneficiary.guardianName} />
                        <DetailItem label="صلة القرابة" value={beneficiary.guardianRelation} />
                        <DetailItem label="هاتف التواصل" value={beneficiary.guardianPhone} />
                        <DetailItem label="مقر الإقامة" value={beneficiary.guardianResidence} />
                    </DetailCard>

                    <DetailCard title="دراسات الحالة الأسرية">
                        {relevantFamilyCaseStudies.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantFamilyCaseStudies.map(fcs => (
                                    <li key={fcs.id} className="case-study-list-item">
                                        <strong>تاريخ الدراسة:</strong> {fcs.studyDate} | <strong>الباحث:</strong> {fcs.socialWorkerName}
                                        <br />
                                        <strong>التوصيات:</strong> {fcs.recommendations.substring(0, 100)}...
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد دراسات أسرية مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="دراسات الحالة العامة">
                        {relevantCaseStudies.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantCaseStudies.map(cs => (
                                    <li key={cs.id} className="case-study-list-item">
                                        <strong>تاريخ المقابلة:</strong> {cs.interviewDate}
                                        <br />
                                        <strong>النتائج:</strong> {cs.interviewResults.substring(0, 100)}...
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد دراسات حالة عامة مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="تحويلات الإرشاد الأسري">
                        {relevantFamilyGuidanceReferrals.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantFamilyGuidanceReferrals.map(fg => (
                                    <li key={fg.id} className="case-study-list-item">
                                        <strong>تاريخ التحويل:</strong> {fg.referralDate} | <strong>التفاعل:</strong> {fg.familyInteraction === 'interactive' ? 'متفاعل' : fg.familyInteraction === 'somewhat' ? 'نوعاً ما' : 'غير متفاعل'}
                                        <br />
                                        <strong>البرامج:</strong> {fg.targetPrograms}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد تحويلات مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="متابعة الرعاية اللاحقة">
                        {relevantPostCareFollowUps.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantPostCareFollowUps.map(pc => (
                                    <li key={pc.id} className="case-study-list-item">
                                        <strong>تاريخ الزيارة:</strong> {pc.visitDate} | <strong>الغرض:</strong> {pc.visitPurpose}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد متابعات مسجلة.</p>}
                    </DetailCard>
                </>
            )}

            {activeTab === 'training' && (
                <>
                    <div className="detail-actions">
                        <button className="button-primary" onClick={onStartCreateTrainingReferral}>تحويل للتدريب</button>
                        <button className="button-secondary" onClick={onStartCreateTrainingFollowUp}>متابعة الخطة التدريبية</button>
                        <button className="button-secondary" onClick={onStartCreateVocationalEval}>تقييم مهني</button>
                    </div>

                    <DetailCard title="تحويلات التدريب">
                        {relevantTrainingReferrals.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantTrainingReferrals.map(tr => (
                                    <li key={tr.id} className="case-study-list-item">
                                        <strong>تاريخ التحويل:</strong> {tr.referralDate}
                                        <br />
                                        <strong>الأهداف:</strong> {[
                                            tr.goals.educationalIntegration && 'دمج تعليمي',
                                            tr.goals.socialIntegration && 'دمج مجتمعي',
                                            tr.goals.returnToFamily && 'عودة للأسرة',
                                            tr.goals.vocationalPrep && 'تهيئة مهنية',
                                            tr.goals.skillDevelopment && 'تطوير مهارات',
                                            tr.goals.talentDevelopment && 'تنمية مواهب'
                                        ].filter(Boolean).join(', ')}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد تحويلات مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="متابعة الخطة التدريبية">
                        {relevantTrainingFollowUps.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantTrainingFollowUps.map(tf => (
                                    <li key={tf.id} className="case-study-list-item">
                                        <strong>الشهر:</strong> {tf.month} | <strong>المهارات:</strong> {tf.skills.length}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد متابعات مسجلة.</p>}
                    </DetailCard>

                    <DetailCard title="التقييم المهني">
                        {relevantVocationalEvals.length > 0 ? (
                            <ul className="case-study-list">
                                {relevantVocationalEvals.map(ve => (
                                    <li key={ve.id} className="case-study-list-item">
                                        <strong>التاريخ:</strong> {ve.date} | <strong>المهنة:</strong> {ve.profession}
                                        <br />
                                        <strong>المجموع:</strong> {ve.totalScore} / 60
                                    </li>
                                ))}
                            </ul>
                        ) : <p>لا توجد تقييمات مسجلة.</p>}
                    </DetailCard>
                </>
            )}
        </main>
    );
};
