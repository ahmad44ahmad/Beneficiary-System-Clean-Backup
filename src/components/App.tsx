import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { useApp } from '../context/AppContext';
import { useUnifiedData } from '../context/UnifiedDataContext';
import { ProtectedRoute } from './common/ProtectedRoute';

// Component Imports
import { Dashboard } from '../pages/Dashboard';
import { BeneficiaryListPanel } from './beneficiary/BeneficiaryListPanel';
import { BeneficiaryDetailPanel } from './beneficiary/BeneficiaryDetailPanel';
import { BeneficiaryMasterView } from './profile/BeneficiaryMasterView';
import { MedicalDashboard } from './medical/MedicalDashboard';
import { MedicalOverview } from './medical/MedicalOverview';
import { InventoryPanel } from './dashboard/InventoryPanel';
import { ClothingManagementPanel } from './clothing/ClothingManagementPanel';
import { DailyFollowUpPanel } from './dashboard/DailyFollowUpPanel';
import { SocialActivitiesPanel } from './social/SocialActivitiesPanel';
import { NewAdmissionForm } from './beneficiary/NewAdmissionForm';
import { SocialOverview } from './social/SocialOverview';
import { LeaveRequestFlow } from './social/LeaveRequestFlow';
import { SocialResearchWizard } from './social/SocialResearchWizard';
import { RehabPlanBuilder } from './rehab/RehabPlanBuilder';
import { StrategicDashboard } from './reports/StrategicDashboard';
import { SupportDashboard } from '../pages/SupportDashboard';
import { QualityDashboard } from '../pages/QualityDashboard';
import { ReportsDashboard } from './reports/ReportsDashboard';
import { TrainingDashboard } from '../pages/TrainingDashboard';
import { SecretariatDashboard } from './secretariat/SecretariatDashboard';
import { ExecutiveDashboard } from './dashboard/ExecutiveDashboard';
import { DailyCareForm } from './care/DailyCareForm';
import { FallRiskAssessment } from './safety/FallRiskAssessment';
import { QualityControl } from '../modules/catering/QualityControl';
import { QualityDashboard as CateringQualityDashboard } from '../modules/catering/QualityDashboard';
import { CateringDashboard } from '../modules/catering/CateringDashboard';
import { CateringDailyLog } from '../modules/catering/CateringDailyLog';
import { CateringReports } from '../modules/catering/CateringReports';
import { MonthlyInvoice } from '../modules/catering/MonthlyInvoice';

// Operations & Maintenance Module
import { OperationsDashboard } from '../modules/operations/OperationsDashboard';
import { AssetRegistry } from '../modules/operations/AssetRegistry';
import { WasteManagement } from '../modules/operations/WasteManagement';

import { OrgStructurePage } from '../pages/OrgStructurePage';
import { Beneficiary } from '../types';

export const App = () => {
    const {
        activeBeneficiary: selectedBeneficiary,
        setActiveBeneficiary: setSelectedBeneficiary,
        isMasterViewOpen,
        setIsMasterViewOpen
    } = useApp();

    const {
        beneficiaries: unifiedBeneficiaries,
        visitLogs,
        inventory,
        caseStudies,
        socialResearchForms,
        rehabilitationPlans,
        medicalExaminations,
        educationalPlans,
        injuryReports,
        familyCaseStudies,
        trainingReferrals,
        trainingPlanFollowUps,
        vocationalEvaluations,
        familyGuidanceReferrals,
        postCareFollowUps,
        socialActivityPlans,
        socialActivityDocs,
        socialActivityFollowUps,
        vaccinations,
        isolationStats,
        medicalProfiles,
        addVisitLog,
        addSocialActivityPlan,
        addSocialActivityDoc,
        addSocialActivityFollowUp,
        addMedicalProfile
    } = useUnifiedData();

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreatingMedicalProfile, setIsCreatingMedicalProfile] = useState(false);

    // Handlers
    const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        setIsMasterViewOpen(true);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    <Route path="dashboard" element={<Dashboard />} />

                    <Route path="beneficiaries" element={
                        <div className="flex gap-4 h-[calc(100vh-8rem)]">
                            <BeneficiaryListPanel
                                beneficiaries={unifiedBeneficiaries}
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
                                />
                            </div>
                        </div>
                    } />

                    <Route path="medical" element={
                        <div className="p-6">
                            <MedicalOverview vaccinations={vaccinations} isolationStats={isolationStats} />
                        </div>
                    } />

                    <Route path="social" element={<SocialOverview />} />
                    <Route path="social/leaves" element={<LeaveRequestFlow />} />
                    <Route path="social/research/new" element={<SocialResearchWizard />} />
                    <Route path="social/activities" element={
                        <SocialActivitiesPanel
                            plans={socialActivityPlans}
                            documentations={socialActivityDocs}
                            followUps={socialActivityFollowUps}
                            onAddPlan={addSocialActivityPlan}
                            onAddDocumentation={addSocialActivityDoc}
                            onAddFollowUp={addSocialActivityFollowUp}
                        />
                    } />

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
                    <Route path="training" element={
                        <ProtectedRoute allowedRoles={['director', 'specialist', 'admin']}>
                            <TrainingDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="secretariat" element={
                        <ProtectedRoute allowedRoles={['director', 'admin', 'secretary']}>
                            <SecretariatDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="structure" element={<OrgStructurePage />} />
                    <Route path="basira" element={<ExecutiveDashboard />} />
                    <Route path="basira/care" element={
                        <DailyCareForm
                            beneficiaryName="تجربة - عبدالله صالح"
                            beneficiaryId="demo-1"
                            onSubmit={(data) => console.log(data)}
                        />
                    } />
                    <Route path="basira/safety" element={
                        <FallRiskAssessment
                            beneficiaryName="تجربة - عبدالله صالح"
                            beneficiaryId="demo-1"
                            onSave={(data) => console.log(data)}
                        />
                    } />

                    {/* Catering Module Routes */}
                    <Route path="catering" element={<CateringDashboard />} />
                    <Route path="catering/daily-log" element={<CateringDailyLog />} />
                    <Route path="catering/reports" element={<CateringReports />} />
                    <Route path="catering/quality" element={<QualityControl />} />
                    <Route path="catering/quality-dashboard" element={<CateringQualityDashboard />} />
                    <Route path="catering/invoice" element={<MonthlyInvoice />} />

                    {/* Operations & Maintenance Module Routes */}
                    <Route path="operations" element={<OperationsDashboard />} />
                    <Route path="operations/assets" element={<AssetRegistry />} />
                    <Route path="operations/waste" element={<WasteManagement />} />

                </Route>
            </Routes >

            {/* Modals */}
            {
                isCreatingMedicalProfile && (
                    <NewAdmissionForm
                        beneficiaries={unifiedBeneficiaries} /* Updated to use unified list */
                        onSave={(profile) => { addMedicalProfile(profile); setIsCreatingMedicalProfile(false); }}
                        onCancel={() => setIsCreatingMedicalProfile(false)}
                    />
                )
            }

            {/* Master View Modal */}
            {
                selectedBeneficiary && (
                    <BeneficiaryMasterView
                        beneficiaryId={selectedBeneficiary.id}
                        isOpen={isMasterViewOpen}
                        onClose={() => setIsMasterViewOpen(false)}
                    />
                )
            }
        </>
    );
};
