import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog, MedicalExamination, IndividualEducationalPlan, InjuryReport, FamilyCaseStudy, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation, FamilyGuidanceReferral, PostCareFollowUp } from '../../types';
import { DetailCard } from '../common/DetailCard';
import { DetailItem } from '../common/DetailItem';
import { VisitLogPanel } from '../dashboard/VisitLogPanel';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../ui/Button';
import { User, FileText, Activity, Users, BookOpen, HeartPulse } from 'lucide-react';

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
            <main className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد من القائمة لعرض بياناته</p>
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

    const tabs = [
        { id: 'rehab', label: 'الخطة التأهيلية والمتابعة الفردية', icon: Activity },
        { id: 'social', label: 'المتابعة الاجتماعية والأنشطة', icon: Users },
        { id: 'family', label: 'الإرشاد الأسري والرعاية اللاحقة', icon: HeartPulse },
        { id: 'training', label: 'التدريب والتأهيل المهني', icon: BookOpen },
    ] as const;

    return (
        <main className="space-y-6 animate-in fade-in duration-300" aria-live="polite">
            <Card className="bg-white">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DetailItem label="الاسم الكامل" value={beneficiary.fullName} />
                        <DetailItem label="رقم المستفيد" value={beneficiary.id} />
                        <DetailItem label="العمر" value={beneficiary.age} />
                        <DetailItem label="الحالة" value={beneficiary.status === 'active' ? 'نشط' : beneficiary.status === 'exit' ? 'خروج' : '-'} />
                    </div>
                </div>
            </Card>

            <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all flex-1 justify-center",
                            activeTab === tab.id
                                ? "bg-white text-primary shadow-sm ring-1 ring-gray-200"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-gray-400")} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {activeTab === 'rehab' && (
                    <>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={onStartCreateRehabPlan}>إضافة خطة تأهيل</Button>
                            <Button variant="outline" onClick={onStartCreateEducationalPlan}>إضافة خطة تربوية (IEP)</Button>
                            <Button variant="outline" onClick={onStartCreateMedicalExam}>إضافة كشف طبي</Button>
                            <Button variant="outline" onClick={onStartCreateSocialResearch}>إضافة بحث اجتماعي</Button>
                        </div>

                        <DetailCard title="البيانات الأساسية والتقييم">
                            <DetailItem label="التشخيص الطبي" value={beneficiary.medicalDiagnosis} />
                            <DetailItem label="التشخيص النفسي" value={beneficiary.psychiatricDiagnosis || '-'} />
                            <DetailItem label="مستوى الذكاء" value={`${beneficiary.iqLevel} (${beneficiary.iqScore})`} />
                        </DetailCard>

                        <DetailCard title="الخطط التربوية الفردية (IEP)">
                            {relevantEducationalPlans.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantEducationalPlans.map(ep => (
                                        <li key={ep.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>تاريخ الخطة:</strong> {ep.planDate} | <strong>المعلم:</strong> {ep.teacherName}
                                            <br />
                                            <strong>مستوى الأداء:</strong> {ep.currentPerformanceLevel.substring(0, 50)}...
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد خطط تربوية مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="خطط التأهيل العلاجية">
                            {relevantRehabPlans.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantRehabPlans.map(rp => (
                                        <li key={rp.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>تاريخ الخطة:</strong> {rp.planDate} | <strong>الفريق:</strong> {rp.teamMembers.map(m => m.name).join(', ')}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد خطط تأهيل مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="الكشوفات الطبية">
                            {relevantMedicalExams.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantMedicalExams.map(me => (
                                        <li key={me.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>التاريخ:</strong> {me.date} | <strong>الطبيب:</strong> {me.doctorName}
                                            <br />
                                            <strong>التشخيص:</strong> {me.diagnosis}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد كشوفات طبية مسجلة.</p>}
                        </DetailCard>
                    </>
                )}

                {activeTab === 'social' && (
                    <>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={onStartClothingRequest}>صرف كسوة</Button>
                            <Button variant="outline" onClick={onStartCreateInjuryReport}>إبلاغ عن إصابة</Button>
                        </div>

                        <VisitLogPanel
                            beneficiary={beneficiary}
                            logs={visitLogs}
                            onAddLog={onAddVisitLog}
                        />

                        <DetailCard title="سجل الإصابات والحوادث">
                            {relevantInjuryReports.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantInjuryReports.map(ir => (
                                        <li key={ir.id} className="p-3 bg-red-50 rounded-lg border-r-4 border-r-red-500 text-sm">
                                            <strong>التاريخ:</strong> {ir.date} {ir.time}
                                            <br />
                                            <strong>النوع:</strong> {ir.injuryType} | <strong>المكان:</strong> {ir.location}
                                            <br />
                                            <strong>الوصف:</strong> {ir.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد إصابات مسجلة.</p>}
                        </DetailCard>
                    </>
                )}

                {activeTab === 'family' && (
                    <>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={onStartCreateFamilyCaseStudy}>إضافة دراسة حالة أسرية</Button>
                            <Button variant="outline" onClick={onStartCreateCaseStudy}>إضافة دراسة حالة عامة</Button>
                            <Button variant="outline" onClick={onStartCreateFamilyGuidanceReferral}>تحويل للإرشاد الأسري</Button>
                            <Button variant="outline" onClick={onStartCreatePostCareFollowUp}>متابعة رعاية لاحقة</Button>
                        </div>

                        <DetailCard title="بيانات الأسرة والولي">
                            <DetailItem label="ولي الأمر" value={beneficiary.guardianName} />
                            <DetailItem label="صلة القرابة" value={beneficiary.guardianRelation} />
                            <DetailItem label="هاتف التواصل" value={beneficiary.guardianPhone} />
                            <DetailItem label="مقر الإقامة" value={beneficiary.guardianResidence} />
                        </DetailCard>

                        <DetailCard title="دراسات الحالة الأسرية">
                            {relevantFamilyCaseStudies.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantFamilyCaseStudies.map(fcs => (
                                        <li key={fcs.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>تاريخ الدراسة:</strong> {fcs.studyDate} | <strong>الباحث:</strong> {fcs.socialWorkerName}
                                            <br />
                                            <strong>التوصيات:</strong> {fcs.recommendations.substring(0, 100)}...
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد دراسات أسرية مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="دراسات الحالة العامة">
                            {relevantCaseStudies.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantCaseStudies.map(cs => (
                                        <li key={cs.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>تاريخ المقابلة:</strong> {cs.interviewDate}
                                            <br />
                                            <strong>النتائج:</strong> {cs.interviewResults.substring(0, 100)}...
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد دراسات حالة عامة مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="تحويلات الإرشاد الأسري">
                            {relevantFamilyGuidanceReferrals.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantFamilyGuidanceReferrals.map(fg => (
                                        <li key={fg.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>تاريخ التحويل:</strong> {fg.referralDate} | <strong>التفاعل:</strong> {fg.familyInteraction === 'interactive' ? 'متفاعل' : fg.familyInteraction === 'somewhat' ? 'نوعاً ما' : 'غير متفاعل'}
                                            <br />
                                            <strong>البرامج:</strong> {fg.targetPrograms}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد تحويلات مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="متابعة الرعاية اللاحقة">
                            {relevantPostCareFollowUps.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantPostCareFollowUps.map(pc => (
                                        <li key={pc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>تاريخ الزيارة:</strong> {pc.visitDate} | <strong>الغرض:</strong> {pc.visitPurpose}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد متابعات مسجلة.</p>}
                        </DetailCard>
                    </>
                )}

                {activeTab === 'training' && (
                    <>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={onStartCreateTrainingReferral}>تحويل للتدريب</Button>
                            <Button variant="outline" onClick={onStartCreateTrainingFollowUp}>متابعة الخطة التدريبية</Button>
                            <Button variant="outline" onClick={onStartCreateVocationalEval}>تقييم مهني</Button>
                        </div>

                        <DetailCard title="تحويلات التدريب">
                            {relevantTrainingReferrals.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantTrainingReferrals.map(tr => (
                                        <li key={tr.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
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
                            ) : <p className="text-gray-500 text-sm">لا توجد تحويلات مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="متابعة الخطة التدريبية">
                            {relevantTrainingFollowUps.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantTrainingFollowUps.map(tf => (
                                        <li key={tf.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>الشهر:</strong> {tf.month} | <strong>المهارات:</strong> {tf.skills.length}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد متابعات مسجلة.</p>}
                        </DetailCard>

                        <DetailCard title="التقييم المهني">
                            {relevantVocationalEvals.length > 0 ? (
                                <ul className="space-y-3">
                                    {relevantVocationalEvals.map(ve => (
                                        <li key={ve.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                            <strong>التاريخ:</strong> {ve.date} | <strong>المهنة:</strong> {ve.profession}
                                            <br />
                                            <strong>المجموع:</strong> {ve.totalScore} / 60
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-sm">لا توجد تقييمات مسجلة.</p>}
                        </DetailCard>
                    </>
                )}
            </div>
        </main>
    );
};
