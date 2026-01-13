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
import { PreventiveMaintenance } from '../modules/operations/PreventiveMaintenance';
import { MaintenanceRequests } from '../modules/operations/MaintenanceRequests';

// Strategic Dashboard
import { StrategicKPIDashboard } from './dashboard/StrategicKPIDashboard';

// GRC Module (Governance, Risk, Compliance)
import { GRCDashboard } from '../modules/grc/GRCDashboard';
import { RiskRegister } from '../modules/grc/RiskRegister';
import { ComplianceTracker } from '../modules/grc/ComplianceTracker';
import { IndependenceTracker } from '../modules/grc/IndependenceTracker';
import { AccountabilityAnalysis } from '../modules/grc/AccountabilityAnalysis';

import { OrgStructurePage } from '../pages/OrgStructurePage';
import { Beneficiary } from '../types';

// Integrated Reports
import { IntegratedDashboard } from '../modules/reports/IntegratedDashboard';

// IPC Module (Infection Prevention Control)
import { IPCDashboard, DailyIPCInspection, IncidentReportForm, ImmunizationTracker, IPCAnalytics } from '../modules/ipc';

// Empowerment Module (التمكين والتأهيل)
import { EmpowermentDashboard, SmartGoalBuilder, GoalProgressTracker, DignityFile } from '../modules/empowerment';

// Family Portal (بوابة الأسرة)
import { FamilyPortal } from '../modules/family';

// Cross-Module Dashboard
import { CrossModuleDashboard } from './dashboard/CrossModuleDashboard';

// Report Generator
import { ReportGenerator } from './reports/ReportGenerator';

// Liability Dashboard (Strategic Defense)
import { LiabilityDashboard } from './dashboard/LiabilityDashboard';

// Crisis Mode (Emergency Protocol)
import { CrisisMode } from './crisis/CrisisMode';

// AI Indicators
import { BiologicalAuditIndicator } from './indicators/BiologicalAuditIndicator';
import { BehavioralPrediction } from './indicators/BehavioralPrediction';
import { SmartIndicatorsHub } from './indicators/SmartIndicatorsHub';
import { EarlyWarningSystem } from './indicators/EarlyWarningSystem';
import { SatisfactionPulse } from './indicators/SatisfactionPulse';
import { CostPerBeneficiary } from './indicators/CostPerBeneficiary';
import { BenchmarkDashboard } from './indicators/BenchmarkDashboard';
import { ISOComplianceTracker } from './indicators/ISOComplianceTracker';
import { HRImpactIndicator } from './indicators/HRImpactIndicator';

// Beneficiary Management
import { BeneficiaryListPage } from './beneficiary/BeneficiaryListPage';

// Welcome Page
import { WelcomePage } from '../pages/WelcomePage';

// Executive Report
import { ExecutiveReport } from '../pages/ExecutiveReport';

// New Basira Components
import { MorningPulse } from './pulse/MorningPulse';
import { WellbeingHeatmap } from './pulse/WellbeingHeatmap';
import { SmartAlertsPanel } from './alerts/SmartAlertsPanel';
import { MedicationAdministration } from './medication/MedicationAdministration';
import { BeneficiaryTimeline } from './beneficiary/BeneficiaryTimeline';
import { ShiftHandover } from './shift/ShiftHandover';
import { EmergencyDashboard } from './emergency/EmergencyDashboard';
import { SchedulingSystem } from './scheduling/SchedulingSystem';
import { StaffProfile } from './staff/StaffProfile';
import { LoginPage } from '../pages/LoginPage';

// Enhanced GRC and Quality Components
import { GRCDashboardEnhanced } from '../modules/grc/GRCDashboardEnhanced';
import { QualityManualEnhanced } from './quality/QualityManualEnhanced';
import { QualityDashboardEnhanced } from '../pages/QualityDashboardEnhanced';

// GRC Pro and Quality Manual Pro (with real data)
import GRCDashboardPro from '../modules/grc-pro/21_GRCDashboardPro';
import QualityManualPro from '../modules/grc-pro/22_QualityManualPro';

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
                {/* Login Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* Welcome Page - Landing */}
                <Route path="/" element={<WelcomePage />} />

                {/* Main Application with Layout */}
                <Route path="/*" element={<MainLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="executive-report" element={<ExecutiveReport />} />

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

                    {/* Basira Advanced Components */}
                    <Route path="pulse" element={<MorningPulse />} />
                    <Route path="wellbeing" element={<WellbeingHeatmap />} />
                    <Route path="smart-alerts" element={<SmartAlertsPanel />} />
                    <Route path="medication-admin" element={<MedicationAdministration />} />
                    <Route path="timeline/:id" element={<BeneficiaryTimeline />} />
                    <Route path="timeline" element={<BeneficiaryTimeline />} />
                    <Route path="handover" element={<ShiftHandover />} />
                    <Route path="emergency" element={<EmergencyDashboard />} />
                    <Route path="scheduling" element={<SchedulingSystem />} />
                    <Route path="staff-profile/:id" element={<StaffProfile />} />
                    <Route path="staff-profile" element={<StaffProfile />} />

                    {/* Enhanced GRC and Quality Routes */}
                    <Route path="grc-enhanced" element={<GRCDashboardEnhanced />} />
                    <Route path="quality-enhanced" element={<QualityDashboardEnhanced />} />
                    <Route path="quality/manual" element={<QualityManualEnhanced />} />

                    {/* GRC Pro Routes (with real data) */}
                    <Route path="grc-pro" element={<GRCDashboardPro />} />
                    <Route path="quality-manual-pro" element={<QualityManualPro />} />

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
                    <Route path="overview" element={<CrossModuleDashboard />} />
                    <Route path="liability" element={<LiabilityDashboard />} />
                    <Route path="crisis" element={<CrisisMode />} />
                    <Route path="indicators" element={<SmartIndicatorsHub />} />
                    <Route path="indicators/biological" element={<BiologicalAuditIndicator />} />
                    <Route path="indicators/behavioral" element={<BehavioralPrediction />} />
                    <Route path="indicators/early-warning" element={<EarlyWarningSystem />} />
                    <Route path="indicators/satisfaction" element={<SatisfactionPulse />} />
                    <Route path="indicators/cost" element={<CostPerBeneficiary />} />
                    <Route path="indicators/hr" element={<HRImpactIndicator />} />
                    <Route path="indicators/benchmark" element={<BenchmarkDashboard />} />
                    <Route path="indicators/iso" element={<ISOComplianceTracker />} />
                    <Route path="beneficiaries-list" element={<BeneficiaryListPage />} />
                    <Route path="reports" element={<ReportGenerator />} />
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
                    <Route path="operations/preventive" element={<PreventiveMaintenance />} />
                    <Route path="operations/maintenance" element={<MaintenanceRequests />} />
                    <Route path="operations/maintenance/new" element={<MaintenanceRequests />} />

                    {/* Strategic Dashboard */}
                    <Route path="strategic" element={<StrategicKPIDashboard />} />

                    {/* GRC Module Routes */}
                    <Route path="grc" element={<GRCDashboard />} />
                    <Route path="grc/risks" element={<RiskRegister />} />
                    <Route path="grc/risks/new" element={<RiskRegister />} />
                    <Route path="grc/compliance" element={<ComplianceTracker />} />
                    <Route path="grc/independence" element={<IndependenceTracker />} />
                    <Route path="grc/accountability" element={<AccountabilityAnalysis />} />

                    {/* Integrated Reports */}
                    <Route path="integrated-reports" element={<IntegratedDashboard />} />

                    {/* IPC Module Routes */}
                    <Route path="ipc" element={<IPCDashboard />} />
                    <Route path="ipc/inspection" element={<DailyIPCInspection />} />
                    <Route path="ipc/incident/new" element={<IncidentReportForm />} />
                    <Route path="ipc/immunizations" element={<ImmunizationTracker />} />
                    <Route path="ipc/analytics" element={<IPCAnalytics />} />

                    {/* Empowerment Module Routes */}
                    <Route path="empowerment" element={<EmpowermentDashboard />} />
                    <Route path="empowerment/goal/new" element={<SmartGoalBuilder />} />
                    <Route path="empowerment/goal/:goalId" element={<GoalProgressTracker />} />
                    <Route path="empowerment/dignity/:beneficiaryId?" element={<DignityFile />} />

                    {/* Family Portal Routes */}
                    <Route path="family" element={<FamilyPortal />} />

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
