import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { UserProvider } from '../context/UserContext';
import { ToastProvider } from '../context/ToastContext';
import { ProtectedRoute } from './common/ProtectedRoute';

// Data Imports
import { beneficiaries } from '../data/beneficiaries';
import { visitLogs as initialVisitLogs } from '../data/visits';
import { inventoryItems as initialInventory } from '../data/inventory';

// Type Imports
import {
    Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog,
    InventoryItem, ClothingRequest, MedicalExamination, IndividualEducationalPlan,
    InjuryReport, FamilyCaseStudy, SocialActivityPlan, SocialActivityDocumentation,
    SocialActivityFollowUp, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation,
    FamilyGuidanceReferral, PostCareFollowUp
} from '../types';
import { MedicalProfile, VaccinationRecord } from '../types/medical';

// Component Imports
import { Dashboard } from '../pages/Dashboard';
import { DashboardPanel } from './dashboard/DashboardPanel';
import { BeneficiaryListPanel } from './beneficiary/BeneficiaryListPanel';
import { BeneficiaryDetailPanel } from './beneficiary/BeneficiaryDetailPanel';
import { MedicalDashboard } from './medical/MedicalDashboard';
import { InventoryPanel } from './dashboard/InventoryPanel';
import { ClothingManagementPanel } from './clothing/ClothingManagementPanel';
import { DailyFollowUpPanel } from './dashboard/DailyFollowUpPanel';
import { SocialActivitiesPanel } from './social/SocialActivitiesPanel';
import { NewAdmissionForm } from './beneficiary/NewAdmissionForm';
import { SocialDashboard } from './social/SocialDashboard';
import { LeaveRequestFlow } from './social/LeaveRequestFlow';
import { SocialResearchWizard } from './social/SocialResearchWizard';
import { RehabPlanBuilder } from './rehab/RehabPlanBuilder';
import { StrategicDashboard } from './reports/StrategicDashboard';
import { SupportDashboard } from '../pages/SupportDashboard';
import { QualityDashboard } from '../pages/QualityDashboard';
import { ReportsDashboard } from './reports/ReportsDashboard';

// Form Imports (kept for now, will be refactored into pages later)
import { CaseStudyForm } from './social/CaseStudyForm';
import { SocialResearchForm } from './social/SocialResearchForm';
import { RehabilitationPlanForm } from './beneficiary/RehabilitationPlanForm';
import { ClothingRequestForm } from './clothing/ClothingRequestForm';
import { MedicalExaminationForm } from './medical/MedicalExaminationForm';
import { IndividualEducationalPlanForm } from './beneficiary/IndividualEducationalPlanForm';
import { InjuryReportForm } from './medical/InjuryReportForm';
import { FamilyCaseStudyForm } from './social/FamilyCaseStudyForm';
import { TrainingReferralForm } from './beneficiary/TrainingReferralForm';
import { TrainingPlanFollowUpForm } from './beneficiary/TrainingPlanFollowUpForm';
import { VocationalEvaluationForm } from './beneficiary/VocationalEvaluationForm';
import { FamilyGuidanceReferralForm } from './social/FamilyGuidanceReferralForm';
import { PostCareFollowUpForm } from './beneficiary/PostCareFollowUpForm';

export const App = () => {
    // -------------------------------------------------------------------------
    // Global State (Temporary - to be moved to Context/React Query)
    // -------------------------------------------------------------------------
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Domain Data State
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [socialResearchForms, setSocialResearchForms] = useState<SocialResearch[]>([]);
    const [rehabilitationPlans, setRehabilitationPlans] = useState<RehabilitationPlan[]>([]);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>(initialVisitLogs);
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [clothingRequests, setClothingRequests] = useState<ClothingRequest[]>([]);
    const [medicalExaminations, setMedicalExaminations] = useState<MedicalExamination[]>([]);
    const [educationalPlans, setEducationalPlans] = useState<IndividualEducationalPlan[]>([]);
    const [injuryReports, setInjuryReports] = useState<InjuryReport[]>([]);
    const [familyCaseStudies, setFamilyCaseStudies] = useState<FamilyCaseStudy[]>([]);
    const [socialActivityPlans, setSocialActivityPlans] = useState<SocialActivityPlan[]>([]);
    const [socialActivityDocs, setSocialActivityDocs] = useState<SocialActivityDocumentation[]>([]);
    const [socialActivityFollowUps, setSocialActivityFollowUps] = useState<SocialActivityFollowUp[]>([]);
    const [trainingReferrals, setTrainingReferrals] = useState<TrainingReferral[]>([]);
    const [trainingPlanFollowUps, setTrainingPlanFollowUps] = useState<TrainingPlanFollowUp[]>([]);
    const [vocationalEvaluations, setVocationalEvaluations] = useState<VocationalEvaluation[]>([]);
    const [familyGuidanceReferrals, setFamilyGuidanceReferrals] = useState<FamilyGuidanceReferral[]>([]);
    const [postCareFollowUps, setPostCareFollowUps] = useState<PostCareFollowUp[]>([]);

    // Medical Data State
    const [medicalProfiles, setMedicalProfiles] = useState<MedicalProfile[]>([]);
    const [isCreatingMedicalProfile, setIsCreatingMedicalProfile] = useState(false);

    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([
        { id: '1', beneficiaryId: '101', vaccineName: 'Influenza', dueDate: '2023-11-01', status: 'Overdue' },
        { id: '2', beneficiaryId: '102', vaccineName: 'Hepatitis B', dueDate: '2023-12-15', status: 'Pending' }
    ]);

    const isolationStats = {
        totalBeds: 10,
        occupiedBeds: 2,
        patients: [
            { name: 'محمد علي', reason: 'اشتباه عدوى تنفسية' },
            { name: 'خالد أحمد', reason: 'جدري مائي' }
        ]
    };

    // -------------------------------------------------------------------------
    // Modal State (Legacy - to be refactored)
    // -------------------------------------------------------------------------
    const [isCreatingCaseStudy, setIsCreatingCaseStudy] = useState(false);
    const [isCreatingSocialResearch, setIsCreatingSocialResearch] = useState(false);
    const [isCreatingRehabPlan, setIsCreatingRehabPlan] = useState(false);
    const [isCreatingClothingRequest, setIsCreatingClothingRequest] = useState(false);
    const [isCreatingMedicalExam, setIsCreatingMedicalExam] = useState(false);
    const [isCreatingEducationalPlan, setIsCreatingEducationalPlan] = useState(false);
    const [isCreatingInjuryReport, setIsCreatingInjuryReport] = useState(false);
    const [isCreatingFamilyCaseStudy, setIsCreatingFamilyCaseStudy] = useState(false);
    const [isCreatingTrainingReferral, setIsCreatingTrainingReferral] = useState(false);
    const [isCreatingTrainingFollowUp, setIsCreatingTrainingFollowUp] = useState(false);
    const [isCreatingVocationalEval, setIsCreatingVocationalEval] = useState(false);
    const [isCreatingFamilyGuidanceReferral, setIsCreatingFamilyGuidanceReferral] = useState(false);
    const [isCreatingPostCareFollowUp, setIsCreatingPostCareFollowUp] = useState(false);

    useEffect(() => {
        if (isCreatingCaseStudy || isCreatingSocialResearch || isCreatingRehabPlan || isCreatingClothingRequest || isCreatingMedicalExam || isCreatingEducationalPlan || isCreatingInjuryReport || isCreatingFamilyCaseStudy || isCreatingMedicalProfile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isCreatingCaseStudy, isCreatingSocialResearch, isCreatingRehabPlan, isCreatingClothingRequest, isCreatingMedicalExam, isCreatingEducationalPlan, isCreatingInjuryReport, isCreatingFamilyCaseStudy, isCreatingMedicalProfile]);

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------
    const handleSelectBeneficiary = (beneficiary: Beneficiary) => setSelectedBeneficiary(beneficiary);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

    // Form Handlers
    const handleSaveCaseStudy = (newStudy: CaseStudy) => { setCaseStudies(prev => [...prev, newStudy]); setIsCreatingCaseStudy(false); };
    const handleSaveSocialResearch = (newResearch: SocialResearch) => { setSocialResearchForms(prev => [...prev, newResearch]); setIsCreatingSocialResearch(false); };
    const handleSaveRehabPlan = (newPlan: RehabilitationPlan) => { setRehabilitationPlans(prev => [...prev, newPlan]); setIsCreatingRehabPlan(false); };
    const handleAddVisitLog = (newLog: VisitLog) => setVisitLogs(prev => [newLog, ...prev]);
    const handleSaveClothingRequest = (request: ClothingRequest) => {
        setClothingRequests(prev => [...prev, request]);
        const updatedInventory = inventory.map(item => {
            const requestedItem = request.items.find(ri => ri.itemId === item.id);
            if (requestedItem) return { ...item, quantity: Math.max(0, item.quantity - requestedItem.quantity) };
            return item;
        });
        setInventory(updatedInventory);
        setIsCreatingClothingRequest(false);
    };
    const handleSaveMedicalExam = (newExam: MedicalExamination) => { setMedicalExaminations(prev => [...prev, newExam]); setIsCreatingMedicalExam(false); };
    const handleSaveEducationalPlan = (newPlan: IndividualEducationalPlan) => { setEducationalPlans(prev => [...prev, newPlan]); setIsCreatingEducationalPlan(false); };
    const handleSaveInjuryReport = (newReport: InjuryReport) => { setInjuryReports(prev => [...prev, newReport]); setIsCreatingInjuryReport(false); };
    const handleSaveFamilyCaseStudy = (newStudy: FamilyCaseStudy) => { setFamilyCaseStudies(prev => [...prev, newStudy]); setIsCreatingFamilyCaseStudy(false); };
    const handleSaveTrainingReferral = (item: TrainingReferral) => { setTrainingReferrals(prev => [...prev, item]); setIsCreatingTrainingReferral(false); };
    const handleSaveTrainingFollowUp = (item: TrainingPlanFollowUp) => { setTrainingPlanFollowUps(prev => [...prev, item]); setIsCreatingTrainingFollowUp(false); };
    const handleSaveVocationalEval = (item: VocationalEvaluation) => { setVocationalEvaluations(prev => [...prev, item]); setIsCreatingVocationalEval(false); };
    const handleSaveFamilyGuidanceReferral = (item: FamilyGuidanceReferral) => { setFamilyGuidanceReferrals(prev => [...prev, item]); setIsCreatingFamilyGuidanceReferral(false); };
    const handleSavePostCareFollowUp = (item: PostCareFollowUp) => { setPostCareFollowUps(prev => [...prev, item]); setIsCreatingPostCareFollowUp(false); };

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    return (
        <UserProvider>
            <ToastProvider>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />

                        <Route path="dashboard" element={<Dashboard />} />

                        <Route path="beneficiaries" element={
                            <div className="flex gap-4 h-[calc(100vh-8rem)]">
                                <BeneficiaryListPanel
                                    beneficiaries={beneficiaries}
                                    selectedBeneficiary={selectedBeneficiary}
                                    onSelect={handleSelectBeneficiary}
                                    searchTerm={searchTerm}
                                    onSearchChange={handleSearchChange}
                                />
                                <div className="flex-1 overflow-y-auto">
                                    <BeneficiaryDetailPanel
                                        beneficiary={selectedBeneficiary}
                                        caseStudies={caseStudies}
                                        socialResearchForms={socialResearchForms}
                                        rehabilitationPlans={rehabilitationPlans}
                                        visitLogs={visitLogs}
                                        medicalExaminations={medicalExaminations}
                                        educationalPlans={educationalPlans}
                                        injuryReports={injuryReports}
                                        familyCaseStudies={familyCaseStudies}
                                        trainingReferrals={trainingReferrals}
                                        trainingPlanFollowUps={trainingPlanFollowUps}
                                        vocationalEvaluations={vocationalEvaluations}
                                        familyGuidanceReferrals={familyGuidanceReferrals}
                                        postCareFollowUps={postCareFollowUps}
                                        // Handlers
                                        onStartCreateCaseStudy={() => setIsCreatingCaseStudy(true)}
                                        onStartCreateSocialResearch={() => setIsCreatingSocialResearch(true)}
                                        onStartCreateRehabPlan={() => setIsCreatingRehabPlan(true)}
                                        onAddVisitLog={handleAddVisitLog}
                                        onStartClothingRequest={() => setIsCreatingClothingRequest(true)}
                                        onStartCreateMedicalExam={() => setIsCreatingMedicalExam(true)}
                                        onStartCreateEducationalPlan={() => setIsCreatingEducationalPlan(true)}
                                        onStartCreateInjuryReport={() => setIsCreatingInjuryReport(true)}
                                        onStartCreateFamilyCaseStudy={() => setIsCreatingFamilyCaseStudy(true)}
                                        onStartCreateTrainingReferral={() => setIsCreatingTrainingReferral(true)}
                                        onStartCreateTrainingFollowUp={() => setIsCreatingTrainingFollowUp(true)}
                                        onStartCreateVocationalEval={() => setIsCreatingVocationalEval(true)}
                                        onStartCreateFamilyGuidanceReferral={() => setIsCreatingFamilyGuidanceReferral(true)}
                                        onStartCreatePostCareFollowUp={() => setIsCreatingPostCareFollowUp(true)}
                                    />
                                </div>
                            </div>
                        } />

                        <Route path="medical" element={
                            <div className="medical-view">
                                <div className="actions mb-4 flex justify-end">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => setIsCreatingMedicalProfile(true)}>
                                        + تسجيل دخول طبي جديد (Admission)
                                    </button>
                                </div>
                                <MedicalDashboard vaccinations={vaccinations} isolationStats={isolationStats} />
                            </div>
                        } />

                        <Route path="social" element={<SocialDashboard />} />
                        <Route path="social/leaves" element={<LeaveRequestFlow />} />
                        <Route path="social/research/new" element={<SocialResearchWizard />} />

                        <Route path="rehab/plan/new" element={
                            <ProtectedRoute allowedRoles={['director', 'doctor', 'social_worker']}>
                                <RehabPlanBuilder />
                            </ProtectedRoute>
                        } />

                        <Route path="reports/strategic" element={
                            <ProtectedRoute allowedRoles={['director', 'admin']}>
                                <StrategicDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="inventory" element={<InventoryPanel inventory={inventory} />} />

                        <Route path="clothing" element={<ClothingManagementPanel />} />

                        <Route path="daily-follow-up" element={<DailyFollowUpPanel />} />

                        <Route path="support" element={
                            <ProtectedRoute allowedRoles={['director', 'admin', 'social_worker']}>
                                <SupportDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="quality" element={
                            <ProtectedRoute allowedRoles={['director', 'admin']}>
                                <QualityDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="reports" element={
                            <ProtectedRoute allowedRoles={['director', 'admin']}>
                                <ReportsDashboard />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>

                {/* Modals */}
                {isCreatingMedicalProfile && (
                    <NewAdmissionForm
                        beneficiaries={beneficiaries}
                        onSave={(profile) => { setMedicalProfiles([...medicalProfiles, profile]); setIsCreatingMedicalProfile(false); }}
                        onCancel={() => setIsCreatingMedicalProfile(false)}
                    />
                )}

                {isCreatingCaseStudy && selectedBeneficiary && (
                    <CaseStudyForm beneficiary={selectedBeneficiary} onSave={handleSaveCaseStudy} onCancel={() => setIsCreatingCaseStudy(false)} />
                )}
                {isCreatingSocialResearch && selectedBeneficiary && (
                    <SocialResearchForm beneficiary={selectedBeneficiary} onSave={handleSaveSocialResearch} onCancel={() => setIsCreatingSocialResearch(false)} />
                )}
                {isCreatingRehabPlan && selectedBeneficiary && (
                    <RehabilitationPlanForm beneficiary={selectedBeneficiary} onSave={handleSaveRehabPlan} onCancel={() => setIsCreatingRehabPlan(false)} />
                )}
                {isCreatingClothingRequest && selectedBeneficiary && (
                    <ClothingRequestForm beneficiary={selectedBeneficiary} inventory={inventory} onSave={handleSaveClothingRequest} onCancel={() => setIsCreatingClothingRequest(false)} />
                )}
                {isCreatingMedicalExam && selectedBeneficiary && (
                    <MedicalExaminationForm beneficiary={selectedBeneficiary} onSave={handleSaveMedicalExam} onCancel={() => setIsCreatingMedicalExam(false)} />
                )}
                {isCreatingEducationalPlan && selectedBeneficiary && (
                    <IndividualEducationalPlanForm beneficiary={selectedBeneficiary} onSave={handleSaveEducationalPlan} onCancel={() => setIsCreatingEducationalPlan(false)} />
                )}
                {isCreatingInjuryReport && selectedBeneficiary && (
                    <InjuryReportForm beneficiary={selectedBeneficiary} onSave={handleSaveInjuryReport} onCancel={() => setIsCreatingInjuryReport(false)} />
                )}
                {isCreatingFamilyCaseStudy && selectedBeneficiary && (
                    <FamilyCaseStudyForm beneficiary={selectedBeneficiary} onSave={handleSaveFamilyCaseStudy} onCancel={() => setIsCreatingFamilyCaseStudy(false)} />
                )}
                {isCreatingTrainingReferral && selectedBeneficiary && (
                    <TrainingReferralForm beneficiary={selectedBeneficiary} onSave={handleSaveTrainingReferral} onCancel={() => setIsCreatingTrainingReferral(false)} />
                )}
                {isCreatingTrainingFollowUp && selectedBeneficiary && (
                    <TrainingPlanFollowUpForm beneficiary={selectedBeneficiary} onSave={handleSaveTrainingFollowUp} onCancel={() => setIsCreatingTrainingFollowUp(false)} />
                )}
                {isCreatingVocationalEval && selectedBeneficiary && (
                    <VocationalEvaluationForm beneficiary={selectedBeneficiary} onSave={handleSaveVocationalEval} onCancel={() => setIsCreatingVocationalEval(false)} />
                )}
                {isCreatingFamilyGuidanceReferral && selectedBeneficiary && (
                    <FamilyGuidanceReferralForm beneficiary={selectedBeneficiary} onSave={handleSaveFamilyGuidanceReferral} onCancel={() => setIsCreatingFamilyGuidanceReferral(false)} />
                )}
                {isCreatingPostCareFollowUp && selectedBeneficiary && (
                    <PostCareFollowUpForm beneficiary={selectedBeneficiary} onSave={handleSavePostCareFollowUp} onCancel={() => setIsCreatingPostCareFollowUp(false)} />
                )}
            </ToastProvider>
        </UserProvider>
    );
};
