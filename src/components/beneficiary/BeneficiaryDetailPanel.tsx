import * as React from 'react';
import { useState, Suspense, lazy } from 'react';
import { Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog, MedicalExamination, IndividualEducationalPlan, InjuryReport, FamilyCaseStudy, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation, FamilyGuidanceReferral, PostCareFollowUp } from '../../types';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import { MOCK_DIGNITY_PROFILES } from '../../types/dignity-profile';
import { DetailCard } from '../common/DetailCard';
import { DetailItem } from '../common/DetailItem';
import { VisitLogPanel } from '../dashboard/VisitLogPanel';
import { DignityProfileCard } from './DignityProfileCard';
import { Card } from '../ui/Card';
import { cn } from '../ui/Button';
import {
    User,
    Activity,
    Users,
    BookOpen,
    HeartPulse,
    Heart,
    Stethoscope,
    MessageSquare,
    Brain,
    Smile,
    Files,
    Clipboard,
    ShieldAlert
} from 'lucide-react';
import { MedicalDashboard } from '../medical/MedicalDashboard';

// Lazy load departmental dashboards
const PhysicalTherapyDashboard = lazy(() => import('../medical/physical-therapy/PhysicalTherapyDashboard').then(module => ({ default: module.PhysicalTherapyDashboard })));
const SpeechTherapyDashboard = lazy(() => import('../medical/speech/SpeechTherapyDashboard').then(module => ({ default: module.SpeechTherapyDashboard })));
const PsychologyDashboard = lazy(() => import('../medical/psychology/PsychologyDashboard').then(module => ({ default: module.PsychologyDashboard })));
const DentalDashboard = lazy(() => import('../medical/dental/DentalDashboard').then(module => ({ default: module.DentalDashboard })));
const SocialDashboard = lazy(() => import('../social/SocialDashboard').then(module => ({ default: module.SocialDashboard })));
const ComprehensiveMedicalProfile = lazy(() => import('../medical/ComprehensiveMedicalProfile').then(module => ({ default: module.ComprehensiveMedicalProfile })));
const DailyCareForm = lazy(() => import('../care/DailyCareForm').then(module => ({ default: module.DailyCareForm })));
const FallRiskAssessment = lazy(() => import('../safety/FallRiskAssessment').then(module => ({ default: module.FallRiskAssessment })));

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
    trainingReferrals: TrainingReferral[];
    trainingPlanFollowUps: TrainingPlanFollowUp[];
    vocationalEvaluations: VocationalEvaluation[];
    familyGuidanceReferrals: FamilyGuidanceReferral[];
    postCareFollowUps: PostCareFollowUp[];
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
    trainingReferrals,
    trainingPlanFollowUps,
    vocationalEvaluations,
    familyGuidanceReferrals,
    postCareFollowUps
}) => {
    // Extended set of tabs
    const [activeTab, setActiveTab] = useState<'dignity' | 'basira_medical' | 'care' | 'safety' | 'medical' | 'pt' | 'st' | 'psych' | 'dental' | 'rehab' | 'social' | 'family' | 'training'>('dignity');

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

    // Cast to UnifiedBeneficiaryProfile to support new departmental data
    const unifiedProfile = beneficiary as UnifiedBeneficiaryProfile;

    // Handles updates from sub-components (placeholder)
    const handleUpdate = (data: any) => {
        // Data updated successfully
    };

    // Try to find a dignity profile, or fall back to the mock one for demo
    // Handle both camelCase (fullName) and snake_case (full_name) from Supabase
    const beneficiaryName = beneficiary.fullName || (beneficiary as any).full_name || '';
    const dignityProfile = MOCK_DIGNITY_PROFILES.find(dp => dp.beneficiaryId === beneficiary.id) || {
        ...MOCK_DIGNITY_PROFILES[0],
        id: `dp_${beneficiary.id}`,
        beneficiaryId: beneficiary.id,
        nickname: beneficiaryName.split(' ')[0] || 'غير محدد' // Use first name as nickname
    };

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
        { id: 'dignity', label: 'راحتي (Dignity)', icon: Heart },
        { id: 'basira_medical', label: 'الملف الطبي الشامل', icon: Files },
        { id: 'care', label: 'العناية اليومية', icon: Clipboard },
        { id: 'safety', label: 'الخطر والسقوط', icon: ShieldAlert },
        { id: 'medical', label: 'السجل الطبي', icon: HeartPulse },
        { id: 'pt', label: 'العلاج الطبيعي', icon: Stethoscope },
        { id: 'st', label: 'النطق والتخاطب', icon: MessageSquare },
        { id: 'psych', label: 'الخدمات النفسية', icon: Brain },
        { id: 'dental', label: 'الأسنان', icon: Smile },
        { id: 'social', label: 'الخدمات الاجتماعية', icon: Users },
        { id: 'rehab', label: 'الخطة التأهيلية', icon: Activity },
        { id: 'family', label: 'الأسرة والرعاية', icon: Users },
        { id: 'training', label: 'المتجر والتدريب', icon: BookOpen },
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

            <div className="overflow-x-auto pb-2">
                <div className="flex flex-nowrap gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all flex-1 justify-center whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-white text-teal-600 shadow-sm ring-1 ring-gray-200 font-bold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-teal-600" : "text-gray-400")} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6 min-h-[400px]">
                <Suspense fallback={
                    <div className="flex items-center justify-center p-12 h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 text-sm font-medium">جاري تحميل البيانات...</p>
                        </div>
                    </div>
                }>
                    {activeTab === 'dignity' && (
                        <DignityProfileCard profile={dignityProfile} />
                    )}

                    {activeTab === 'medical' && (
                        <MedicalDashboard
                            beneficiary={beneficiary}
                            medicalExams={relevantMedicalExams}
                        />
                    )}

                    {activeTab === 'basira_medical' && (
                        <ComprehensiveMedicalProfile beneficiaryId={beneficiary.id} />
                    )}

                    {activeTab === 'care' && (
                        <DailyCareForm
                            beneficiaryName={beneficiaryName}
                            beneficiaryId={beneficiary.id}
                        />
                    )}

                    {activeTab === 'safety' && (
                        <FallRiskAssessment
                            beneficiaryName={beneficiaryName}
                            beneficiaryId={beneficiary.id}
                        />
                    )}

                    {activeTab === 'pt' && (
                        <PhysicalTherapyDashboard
                            beneficiary={unifiedProfile}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {activeTab === 'st' && (
                        <SpeechTherapyDashboard
                            beneficiary={unifiedProfile}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {activeTab === 'psych' && (
                        <PsychologyDashboard
                            beneficiary={unifiedProfile}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {activeTab === 'dental' && (
                        <DentalDashboard
                            beneficiary={unifiedProfile}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {activeTab === 'rehab' && (
                        <>
                            <div className="flex flex-wrap gap-3">
                                {/* Actions removed as part of cleanup */}
                            </div>

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
                        </>
                    )}

                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            {/* New Social Dashboard Content */}
                            <SocialDashboard
                                beneficiary={unifiedProfile}
                                onUpdate={handleUpdate}
                            />

                            {/* Existing Social Content Kept for Continuity */}
                            <VisitLogPanel
                                beneficiary={beneficiary}
                                logs={visitLogs}
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
                        </div>
                    )}

                    {activeTab === 'family' && (
                        <>
                            <div className="flex flex-wrap gap-3">
                                {/* Actions removed as part of cleanup */}
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
                                {/* Actions removed as part of cleanup */}
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
                                                <strong>تاريخ:</strong> {ve.date} | <strong>المهنة:</strong> {ve.profession}
                                                <br />
                                                <strong>المجموع:</strong> {ve.totalScore} / 60
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500 text-sm">لا توجد تقييمات مسجلة.</p>}
                            </DetailCard>
                        </>
                    )}
                </Suspense>
            </div>
        </main>
    );
};
