import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { useApp } from '../context/AppContext';
import { useUnifiedData } from '../context/UnifiedDataContext';
import { ProtectedRoute } from './common/ProtectedRoute';
import { Beneficiary } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-hrsd-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-500 text-sm">جاري التحميل...</span>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// ESSENTIAL PAGES (Static Imports - Load Immediately)
// ═══════════════════════════════════════════════════════════════════════════
import { Dashboard } from '../pages/Dashboard';
import { WelcomePage } from '../pages/WelcomePage';
import { LoginPage } from '../pages/LoginPage';
import { BeneficiaryListPanel } from './beneficiary/BeneficiaryListPanel';
import { BeneficiaryDetailPanel } from './beneficiary/BeneficiaryDetailPanel';
import { BeneficiaryMasterView } from './profile/BeneficiaryMasterView';
import { NewAdmissionForm } from './beneficiary/NewAdmissionForm';

// ═══════════════════════════════════════════════════════════════════════════
// LAZY LOADED MODULES (Dynamic Imports - Load On-Demand)
// ═══════════════════════════════════════════════════════════════════════════

// Medical Module
const MedicalDashboard = lazy(() => import('./medical/MedicalDashboard').then(m => ({ default: m.MedicalDashboard })));
const MedicalOverview = lazy(() => import('./medical/MedicalOverview').then(m => ({ default: m.MedicalOverview })));

// Social Module
const SocialOverview = lazy(() => import('./social/SocialOverview').then(m => ({ default: m.SocialOverview })));
const SocialActivitiesPanel = lazy(() => import('./social/SocialActivitiesPanel').then(m => ({ default: m.SocialActivitiesPanel })));
const LeaveRequestFlow = lazy(() => import('./social/LeaveRequestFlow').then(m => ({ default: m.LeaveRequestFlow })));
const SocialResearchWizard = lazy(() => import('./social/SocialResearchWizard').then(m => ({ default: m.SocialResearchWizard })));

// Quality Module
const QualityManual = lazy(() => import('./quality/QualityManual').then(m => ({ default: m.QualityManual })));
const QualityDashboard = QualityManual; // Alias for backward compatibility

// Reports Module
const StrategicDashboard = lazy(() => import('./reports/StrategicDashboard').then(m => ({ default: m.StrategicDashboard })));
const ReportsDashboard = lazy(() => import('./reports/ReportsDashboard').then(m => ({ default: m.ReportsDashboard })));
const ReportGenerator = lazy(() => import('./reports/ReportGenerator').then(m => ({ default: m.ReportGenerator })));
const ExecutiveReport = lazy(() => import('../pages/ExecutiveReport').then(m => ({ default: m.ExecutiveReport })));

// Dashboard Components
const InventoryPanel = lazy(() => import('./dashboard/InventoryPanel').then(m => ({ default: m.InventoryPanel })));
const DailyFollowUpPanel = lazy(() => import('./dashboard/DailyFollowUpPanel').then(m => ({ default: m.DailyFollowUpPanel })));
const ExecutiveDashboard = lazy(() => import('./dashboard/ExecutiveDashboard').then(m => ({ default: m.ExecutiveDashboard })));
const CrossModuleDashboard = lazy(() => import('./dashboard/CrossModuleDashboard').then(m => ({ default: m.CrossModuleDashboard })));
const LiabilityDashboard = lazy(() => import('./dashboard/LiabilityDashboard').then(m => ({ default: m.LiabilityDashboard })));
const StrategicKPIDashboard = lazy(() => import('./dashboard/StrategicKPIDashboard').then(m => ({ default: m.StrategicKPIDashboard })));

// Support & Training
const SupportDashboard = lazy(() => import('../pages/SupportDashboard').then(m => ({ default: m.SupportDashboard })));
const TrainingDashboard = lazy(() => import('../pages/TrainingDashboard').then(m => ({ default: m.TrainingDashboard })));
const SecretariatDashboard = lazy(() => import('./secretariat/SecretariatDashboard').then(m => ({ default: m.SecretariatDashboard })));

// Clothing & Inventory
const ClothingManagementPanel = lazy(() => import('./clothing/ClothingManagementPanel').then(m => ({ default: m.ClothingManagementPanel })));

// Rehab & Care
const RehabPlanBuilder = lazy(() => import('./rehab/RehabPlanBuilder').then(m => ({ default: m.RehabPlanBuilder })));
const DailyCareForm = lazy(() => import('./care/DailyCareForm').then(m => ({ default: m.DailyCareForm })));
const FallRiskAssessment = lazy(() => import('./safety/FallRiskAssessment').then(m => ({ default: m.FallRiskAssessment })));

// Catering Module
const CateringDashboard = lazy(() => import('../modules/catering/CateringDashboard').then(m => ({ default: m.CateringDashboard })));
const CateringDailyLog = lazy(() => import('../modules/catering/CateringDailyLog').then(m => ({ default: m.CateringDailyLog })));
const CateringReports = lazy(() => import('../modules/catering/CateringReports').then(m => ({ default: m.CateringReports })));
const QualityControl = lazy(() => import('../modules/catering/QualityControl').then(m => ({ default: m.QualityControl })));
const CateringQualityDashboard = lazy(() => import('../modules/catering/QualityDashboard').then(m => ({ default: m.QualityDashboard })));
const MonthlyInvoice = lazy(() => import('../modules/catering/MonthlyInvoice').then(m => ({ default: m.MonthlyInvoice })));

// Operations Module
const OperationsDashboard = lazy(() => import('../modules/operations/OperationsDashboard').then(m => ({ default: m.OperationsDashboard })));
const AssetRegistry = lazy(() => import('../modules/operations/AssetRegistry').then(m => ({ default: m.AssetRegistry })));
const WasteManagement = lazy(() => import('../modules/operations/WasteManagement').then(m => ({ default: m.WasteManagement })));
const PreventiveMaintenance = lazy(() => import('../modules/operations/PreventiveMaintenance').then(m => ({ default: m.PreventiveMaintenance })));
const MaintenanceRequests = lazy(() => import('../modules/operations/MaintenanceRequests').then(m => ({ default: m.MaintenanceRequests })));

// GRC Module
const GRCDashboard = lazy(() => import('../modules/grc/GRCDashboard').then(m => ({ default: m.GRCDashboard })));
const RiskRegister = lazy(() => import('../modules/grc/RiskRegister').then(m => ({ default: m.RiskRegister })));
const ComplianceTracker = lazy(() => import('../modules/grc/ComplianceTracker').then(m => ({ default: m.ComplianceTracker })));
const IndependenceTracker = lazy(() => import('../modules/grc/IndependenceTracker').then(m => ({ default: m.IndependenceTracker })));
const AccountabilityAnalysis = lazy(() => import('../modules/grc/AccountabilityAnalysis').then(m => ({ default: m.AccountabilityAnalysis })));

// IPC Module
const IPCDashboard = lazy(() => import('../modules/ipc').then(m => ({ default: m.IPCDashboard })));
const DailyIPCInspection = lazy(() => import('../modules/ipc').then(m => ({ default: m.DailyIPCInspection })));
const IncidentReportForm = lazy(() => import('../modules/ipc').then(m => ({ default: m.IncidentReportForm })));
const ImmunizationTracker = lazy(() => import('../modules/ipc').then(m => ({ default: m.ImmunizationTracker })));
const IPCAnalytics = lazy(() => import('../modules/ipc').then(m => ({ default: m.IPCAnalytics })));

// Empowerment Module
const EmpowermentDashboard = lazy(() => import('../modules/empowerment').then(m => ({ default: m.EmpowermentDashboard })));
const SmartGoalBuilder = lazy(() => import('../modules/empowerment').then(m => ({ default: m.SmartGoalBuilder })));
const GoalProgressTracker = lazy(() => import('../modules/empowerment').then(m => ({ default: m.GoalProgressTracker })));
const DignityFile = lazy(() => import('../modules/empowerment').then(m => ({ default: m.DignityFile })));

// Family Portal
const FamilyPortal = lazy(() => import('../modules/family').then(m => ({ default: m.FamilyPortal })));

// Integrated Reports
const IntegratedDashboard = lazy(() => import('../modules/reports/IntegratedDashboard').then(m => ({ default: m.IntegratedDashboard })));

// Organization
const OrgStructurePage = lazy(() => import('../pages/OrgStructurePage').then(m => ({ default: m.OrgStructurePage })));

// Crisis Mode
const CrisisMode = lazy(() => import('./crisis/CrisisMode').then(m => ({ default: m.CrisisMode })));

// AI Indicators
const SmartIndicatorsHub = lazy(() => import('./indicators/SmartIndicatorsHub').then(m => ({ default: m.SmartIndicatorsHub })));
const BiologicalAuditIndicator = lazy(() => import('./indicators/BiologicalAuditIndicator').then(m => ({ default: m.BiologicalAuditIndicator })));
const BehavioralPrediction = lazy(() => import('./indicators/BehavioralPrediction').then(m => ({ default: m.BehavioralPrediction })));
const EarlyWarningSystem = lazy(() => import('./indicators/EarlyWarningSystem').then(m => ({ default: m.EarlyWarningSystem })));
const SatisfactionPulse = lazy(() => import('./indicators/SatisfactionPulse').then(m => ({ default: m.SatisfactionPulse })));
const CostPerBeneficiary = lazy(() => import('./indicators/CostPerBeneficiary').then(m => ({ default: m.CostPerBeneficiary })));
const BenchmarkDashboard = lazy(() => import('./indicators/BenchmarkDashboard').then(m => ({ default: m.BenchmarkDashboard })));
const ISOComplianceTracker = lazy(() => import('./indicators/ISOComplianceTracker').then(m => ({ default: m.ISOComplianceTracker })));
const HRImpactIndicator = lazy(() => import('./indicators/HRImpactIndicator').then(m => ({ default: m.HRImpactIndicator })));

// Beneficiary Management
const BeneficiaryListPage = lazy(() => import('./beneficiary/BeneficiaryListPage').then(m => ({ default: m.BeneficiaryListPage })));
const BeneficiaryTimeline = lazy(() => import('./beneficiary/BeneficiaryTimeline').then(m => ({ default: m.BeneficiaryTimeline })));

// Admin Components
const AuditLogViewer = lazy(() => import('./admin/AuditLogViewer').then(m => ({ default: m.AuditLogViewer })));

// Basira Components
const MorningPulse = lazy(() => import('./pulse/MorningPulse').then(m => ({ default: m.MorningPulse })));
const WellbeingHeatmap = lazy(() => import('./pulse/WellbeingHeatmap').then(m => ({ default: m.WellbeingHeatmap })));
const SmartAlertsPanel = lazy(() => import('./alerts/SmartAlertsPanel').then(m => ({ default: m.SmartAlertsPanel })));
const MedicationAdministration = lazy(() => import('./medication/MedicationAdministration').then(m => ({ default: m.MedicationAdministration })));
const ShiftHandover = lazy(() => import('./shift/ShiftHandover').then(m => ({ default: m.ShiftHandover })));
const EmergencyDashboard = lazy(() => import('./emergency/EmergencyDashboard').then(m => ({ default: m.EmergencyDashboard })));
const SchedulingSystem = lazy(() => import('./scheduling/SchedulingSystem').then(m => ({ default: m.SchedulingSystem })));
const StaffProfile = lazy(() => import('./staff/StaffProfile').then(m => ({ default: m.StaffProfile })));

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

                    {/* Beneficiary List Page (Enhanced) */}
                    <Route path="beneficiaries-list" element={<BeneficiaryListPage />} />

                    {/* Individual Beneficiary Profile - Full Page View */}
                    <Route path="beneficiaries/:id" element={<BeneficiaryTimeline />} />

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

                    {/* Quality Manual Route */}
                    <Route path="quality/manual" element={<QualityManual />} />

                    {/* Admin Routes */}
                    <Route path="admin/audit-logs" element={<AuditLogViewer />} />

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
