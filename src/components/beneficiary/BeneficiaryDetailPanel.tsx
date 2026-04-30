import * as React from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { supaService } from '../../services/supaService';
import { Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog, MedicalExamination, IndividualEducationalPlan, InjuryReport, FamilyCaseStudy, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation, FamilyGuidanceReferral, PostCareFollowUp, DignityProfile } from '../../types';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import { MOCK_DIGNITY_PROFILES } from '../../types/dignity-profile';
import { VisitLogPanel } from '../dashboard/VisitLogPanel';
import { DignityProfileCard } from './DignityProfileCard';
import { Section, EmptyState, DescriptionList } from '../../design-system/primitives';
import type { DescriptionItem } from '../../design-system/primitives';
import { brand } from '../../design-system/tokens';
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

/**
 * BeneficiaryDetailPanel — operational-persona surface (Department Head,
 * Staff). Refactored to use design-system primitives: top identity card
 * via Section + DescriptionList, list cards via Section + EmptyState,
 * empty messages worded as next-action ("لم تُسجَّل... بعد") rather
 * than deficit ("لا توجد"). All sub-component contracts unchanged.
 */
export const BeneficiaryDetailPanel: React.FC<BeneficiaryDetailPanelProps> = ({
    beneficiary,
    caseStudies,
    socialResearchForms: _socialResearchForms,
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

    // Feature 1: Ehsan Algorithm - Data Logic
    // Hooks must be called before any early returns (rules-of-hooks)
    const [dignityProfile, setDignityProfile] = useState<DignityProfile | null>(null);

    const beneficiaryName = beneficiary?.fullName || (beneficiary as unknown as Record<string, unknown>)?.full_name as string || '';

    useEffect(() => {
        if (beneficiary) {
            const existingProfile = beneficiary.dignity_profile ||
                // Fallback to mock if not in DB yet
                MOCK_DIGNITY_PROFILES.find(dp => dp.beneficiaryId === beneficiary.id);

            if (existingProfile) {
                setDignityProfile(existingProfile as DignityProfile);
            } else {
                // Default template
                setDignityProfile({
                    beneficiaryId: beneficiary.id,
                    nickname: beneficiaryName.split(' ')[0] || 'غير محدد',
                    personalityType: 'social',
                    sensoryPreferences: { lighting: 'natural', noise: 'moderate', temperature: 'normal' },
                    microPreferences: { dislikes: [], favoriteColor: '' }
                });
            }
        }
    }, [beneficiary, beneficiaryName]);

    if (!beneficiary) {
        return (
            <main className="h-full flex items-center justify-center" aria-live="polite">
                <EmptyState
                    icon={<User className="w-6 h-6" />}
                    title="اختر مستفيداً من القائمة"
                    description="تظهر هنا بيانات المستفيد التفصيلية فور اختياره."
                />
            </main>
        );
    }

    // Cast to UnifiedBeneficiaryProfile to support new departmental data
    const unifiedProfile = beneficiary as UnifiedBeneficiaryProfile;

    // Handles updates from sub-components (placeholder)
    const handleUpdate = (_data: unknown) => {
        // Data updated successfully
    };

    const handleDignitySave = async (updatedData: DignityProfile) => {
        setDignityProfile(updatedData);
        if (beneficiary) {
            await supaService.updateDignityProfile(beneficiary.id, updatedData as Record<string, unknown>);
        }
    };

    const relevantCaseStudies = caseStudies.filter(cs => cs.beneficiaryId === beneficiary.id);
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

    const headerItems: DescriptionItem[] = [
        { label: 'الاسم الكامل', value: beneficiary.fullName },
        { label: 'رقم المستفيد', value: beneficiary.id },
        { label: 'العمر', value: beneficiary.age ?? '—' },
        {
            label: 'الحالة',
            value: beneficiary.status === 'active' ? 'نشط' : beneficiary.status === 'discharged' ? 'خروج' : '—',
        },
    ];

    return (
        <main className="space-y-6 animate-in fade-in duration-300" aria-live="polite">
            <Section title="بطاقة المستفيد">
                <DescriptionList items={headerItems} layout="stacked" className="grid grid-cols-2 md:grid-cols-4 gap-6" />
            </Section>

            <div className="overflow-x-auto pb-2">
                <div className="flex flex-nowrap gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 min-w-max">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all flex-1 justify-center whitespace-nowrap",
                                    isActive
                                        ? "bg-white shadow-sm ring-1 ring-gray-200 font-bold"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                                style={isActive ? { color: brand.teal.hex } : undefined}
                            >
                                <tab.icon
                                    className="w-4 h-4"
                                    style={{ color: isActive ? brand.teal.hex : brand.coolGray.hex }}
                                />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-6 min-h-[400px]">
                <Suspense fallback={
                    <div className="flex items-center justify-center p-12 h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#269798]/20 border-t-teal-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium" style={{ color: brand.coolGray.hex }}>جاري تحميل البيانات...</p>
                        </div>
                    </div>
                }>
                    {activeTab === 'dignity' && (
                        <DignityProfileCard
                            profile={dignityProfile}
                            onUpdate={handleDignitySave}
                        />
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
                            <Section title="الخطط التربوية الفردية (IEP)">
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
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل خطط تربوية بعد"
                                        description="تظهر هنا الخطط التربوية الفردية للمستفيد فور إضافتها."
                                    />
                                )}
                            </Section>

                            <Section title="خطط التأهيل العلاجية">
                                {relevantRehabPlans.length > 0 ? (
                                    <ul className="space-y-3">
                                        {relevantRehabPlans.map(rp => (
                                            <li key={rp.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                                <strong>تاريخ الخطة:</strong> {rp.planDate} | <strong>الفريق:</strong> {rp.teamMembers.map(m => m.name).join(', ')}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل خطط تأهيل بعد"
                                        description="ابدأ بإضافة خطة تأهيلية فردية تناسب المستفيد."
                                    />
                                )}
                            </Section>
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
                                onAddLog={handleUpdate}
                            />

                            <Section title="سجل الإصابات والحوادث" subtitle="مصطلح قانوني — يُستخدم في البلاغات الرسمية">
                                {relevantInjuryReports.length > 0 ? (
                                    <ul className="space-y-3">
                                        {relevantInjuryReports.map(ir => (
                                            <li key={ir.id} className="p-3 bg-[#DC2626]/10 rounded-lg border-e-4 border-e-red-500 text-sm">
                                                <strong>التاريخ:</strong> {ir.date} {ir.time}
                                                <br />
                                                <strong>النوع:</strong> {ir.injuryType} | <strong>المكان:</strong> {ir.location}
                                                <br />
                                                <strong>الوصف:</strong> {ir.description}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState
                                        title="لا أحداث مسجَّلة في الفترة الحالية"
                                        description="غياب الأحداث مؤشّر إيجابي على بيئة الرعاية."
                                    />
                                )}
                            </Section>
                        </div>
                    )}

                    {activeTab === 'family' && (
                        <>
                            <Section title="بيانات الأسرة والولي">
                                <DescriptionList
                                    layout="two-col"
                                    items={[
                                        { label: 'ولي الأمر', value: beneficiary.guardianName ?? '—' },
                                        { label: 'صلة القرابة', value: beneficiary.guardianRelation ?? '—' },
                                        { label: 'هاتف التواصل', value: beneficiary.guardianPhone ?? '—' },
                                        { label: 'مقر الإقامة', value: beneficiary.guardianResidence ?? '—' },
                                    ]}
                                />
                            </Section>

                            <Section title="دراسات الحالة الأسرية">
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
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل دراسات أسرية بعد"
                                        description="تُضاف دراسات الحالة الأسرية بواسطة الأخصائي الاجتماعي."
                                    />
                                )}
                            </Section>

                            <Section title="دراسات الحالة العامة">
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
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل دراسات حالة عامة بعد"
                                        description="ابدأ من نموذج المقابلة المعتمد لدى المركز."
                                    />
                                )}
                            </Section>

                            <Section title="تحويلات الإرشاد الأسري">
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
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل تحويلات بعد"
                                        description="تُسجَّل تحويلات الإرشاد الأسري عند انعقاد جلسة مع الأهل."
                                    />
                                )}
                            </Section>

                            <Section title="متابعة الرعاية اللاحقة">
                                {relevantPostCareFollowUps.length > 0 ? (
                                    <ul className="space-y-3">
                                        {relevantPostCareFollowUps.map(pc => (
                                            <li key={pc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                                <strong>تاريخ الزيارة:</strong> {pc.visitDate} | <strong>الغرض:</strong> {pc.visitPurpose}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل متابعات لاحقة بعد"
                                        description="تُسجَّل بعد خروج المستفيد لمتابعة استمرارية الدمج المجتمعي."
                                    />
                                )}
                            </Section>
                        </>
                    )}

                    {activeTab === 'training' && (
                        <>
                            <Section title="تحويلات التدريب">
                                {relevantTrainingReferrals.length > 0 ? (
                                    <ul className="space-y-3">
                                        {relevantTrainingReferrals.map(tr => (
                                            <li key={tr.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                                <strong>تاريخ التحويل:</strong> {tr.referralDate}
                                                <br />
                                                <strong>الأهداف:</strong> {[
                                                    tr.goals.educationalIntegration && 'دمج تعليمي',
                                                    tr.goals.communityIntegration && 'دمج مجتمعي',
                                                    tr.goals.returnToFamily && 'عودة للأسرة',
                                                    tr.goals.vocationalPrep && 'تهيئة مهنية',
                                                    tr.goals.skillDevelopment && 'تطوير مهارات',
                                                    tr.goals.talentDevelopment && 'تنمية مواهب'
                                                ].filter(Boolean).join(', ')}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل تحويلات تدريبية بعد"
                                        description="تُحدَّد التحويلات بناءً على خطة التأهيل المهني والاجتماعي."
                                    />
                                )}
                            </Section>

                            <Section title="متابعة الخطة التدريبية">
                                {relevantTrainingFollowUps.length > 0 ? (
                                    <ul className="space-y-3">
                                        {relevantTrainingFollowUps.map(tf => (
                                            <li key={tf.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                                <strong>الشهر:</strong> {tf.month} | <strong>المهارات:</strong> {tf.skills.length}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل متابعات تدريبية بعد"
                                        description="تُسجَّل المتابعات شهرياً لقياس تطوّر المهارات."
                                    />
                                )}
                            </Section>

                            <Section title="التقييم المهني">
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
                                ) : (
                                    <EmptyState
                                        title="لم تُسجَّل تقييمات مهنية بعد"
                                        description="يُجرى التقييم بعد اكتمال جلسات التهيئة المهنية."
                                    />
                                )}
                            </Section>
                        </>
                    )}
                </Suspense>
            </div>
        </main>
    );
};
