import * as React from 'react';
import { useState, useEffect } from 'react';
import { Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog, InventoryItem, ClothingRequest, MedicalExamination, IndividualEducationalPlan, InjuryReport, FamilyCaseStudy, SocialActivityPlan, SocialActivityDocumentation, SocialActivityFollowUp, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation, FamilyGuidanceReferral, PostCareFollowUp } from '../types';
import { beneficiaries } from '../data/beneficiaries';
import { visitLogs as initialVisitLogs } from '../data/visits';
import { inventoryItems as initialInventory } from '../data/inventory';
import { BeneficiaryListPanel } from './BeneficiaryListPanel';
import { BeneficiaryDetailPanel } from './BeneficiaryDetailPanel';
import { CaseStudyForm } from './CaseStudyForm';
import { SocialResearchForm } from './SocialResearchForm';
import { RehabilitationPlanForm } from './RehabilitationPlanForm';
import { InventoryPanel } from './InventoryPanel';
import { ClothingRequestForm } from './ClothingRequestForm';
import { MedicalExaminationForm } from './MedicalExaminationForm';
import { IndividualEducationalPlanForm } from './IndividualEducationalPlanForm';
import { InjuryReportForm } from './InjuryReportForm';
import { FamilyCaseStudyForm } from './FamilyCaseStudyForm';
import { SocialActivitiesPanel } from './SocialActivitiesPanel';
import { TrainingReferralForm } from './TrainingReferralForm';
import { TrainingPlanFollowUpForm } from './TrainingPlanFollowUpForm';
import { VocationalEvaluationForm } from './VocationalEvaluationForm';
import { FamilyGuidanceReferralForm } from './FamilyGuidanceReferralForm';
import { PostCareFollowUpForm } from './PostCareFollowUpForm';
import { ClothingManagementPanel } from './ClothingManagementPanel';
import { DailyFollowUpPanel } from './DailyFollowUpPanel';

export const App = () => {
    const [currentView, setCurrentView] = useState<'beneficiaries' | 'inventory' | 'social-activities' | 'clothing' | 'daily-follow-up'>('beneficiaries');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Data State
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

    // Modal State
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
        if (isCreatingCaseStudy || isCreatingSocialResearch || isCreatingRehabPlan || isCreatingClothingRequest || isCreatingMedicalExam || isCreatingEducationalPlan || isCreatingInjuryReport || isCreatingFamilyCaseStudy) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isCreatingCaseStudy, isCreatingSocialResearch, isCreatingRehabPlan, isCreatingClothingRequest, isCreatingMedicalExam, isCreatingEducationalPlan, isCreatingInjuryReport, isCreatingFamilyCaseStudy]);

    const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
        setSelectedBeneficiary(beneficiary);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handlers for Forms
    const handleStartCreateCaseStudy = () => setIsCreatingCaseStudy(true);
    const handleCancelCreateCaseStudy = () => setIsCreatingCaseStudy(false);
    const handleSaveCaseStudy = (newStudy: CaseStudy) => {
        setCaseStudies(prev => [...prev, newStudy]);
        setIsCreatingCaseStudy(false);
    };

    const handleStartCreateSocialResearch = () => setIsCreatingSocialResearch(true);
    const handleCancelCreateSocialResearch = () => setIsCreatingSocialResearch(false);
    const handleSaveSocialResearch = (newResearch: SocialResearch) => {
        setSocialResearchForms(prev => [...prev, newResearch]);
        setIsCreatingSocialResearch(false);
    };

    const handleStartCreateRehabPlan = () => setIsCreatingRehabPlan(true);
    const handleCancelCreateRehabPlan = () => setIsCreatingRehabPlan(false);
    const handleSaveRehabPlan = (newPlan: RehabilitationPlan) => {
        setRehabilitationPlans(prev => [...prev, newPlan]);
        setIsCreatingRehabPlan(false);
    };

    const handleAddVisitLog = (newLog: VisitLog) => {
        setVisitLogs(prev => [newLog, ...prev]);
    };

    const handleStartClothingRequest = () => setIsCreatingClothingRequest(true);
    const handleCancelClothingRequest = () => setIsCreatingClothingRequest(false);
    const handleSaveClothingRequest = (request: ClothingRequest) => {
        setClothingRequests(prev => [...prev, request]);

        // Update inventory quantities
        const updatedInventory = inventory.map(item => {
            const requestedItem = request.items.find(ri => ri.itemId === item.id);
            if (requestedItem) {
                return { ...item, quantity: Math.max(0, item.quantity - requestedItem.quantity) };
            }
            return item;
        });
        setInventory(updatedInventory);

        setIsCreatingClothingRequest(false);
    };

    const handleStartCreateMedicalExam = () => setIsCreatingMedicalExam(true);
    const handleCancelCreateMedicalExam = () => setIsCreatingMedicalExam(false);
    const handleSaveMedicalExam = (newExam: MedicalExamination) => {
        setMedicalExaminations(prev => [...prev, newExam]);
        setIsCreatingMedicalExam(false);
    };

    const handleStartCreateEducationalPlan = () => setIsCreatingEducationalPlan(true);
    const handleCancelCreateEducationalPlan = () => setIsCreatingEducationalPlan(false);
    const handleSaveEducationalPlan = (newPlan: IndividualEducationalPlan) => {
        setEducationalPlans(prev => [...prev, newPlan]);
        setIsCreatingEducationalPlan(false);
    };

    const handleStartCreateInjuryReport = () => setIsCreatingInjuryReport(true);
    const handleCancelCreateInjuryReport = () => setIsCreatingInjuryReport(false);
    const handleSaveInjuryReport = (newReport: InjuryReport) => {
        setInjuryReports(prev => [...prev, newReport]);
        setIsCreatingInjuryReport(false);
    };

    const handleStartCreateFamilyCaseStudy = () => setIsCreatingFamilyCaseStudy(true);
    const handleCancelCreateFamilyCaseStudy = () => setIsCreatingFamilyCaseStudy(false);
    const handleSaveFamilyCaseStudy = (newStudy: FamilyCaseStudy) => {
        setFamilyCaseStudies(prev => [...prev, newStudy]);
        setIsCreatingFamilyCaseStudy(false);
    };

    const handleStartCreateTrainingReferral = () => setIsCreatingTrainingReferral(true);
    const handleCancelCreateTrainingReferral = () => setIsCreatingTrainingReferral(false);
    const handleSaveTrainingReferral = (item: TrainingReferral) => {
        setTrainingReferrals(prev => [...prev, item]);
        setIsCreatingTrainingReferral(false);
    };

    const handleStartCreateTrainingFollowUp = () => setIsCreatingTrainingFollowUp(true);
    const handleCancelCreateTrainingFollowUp = () => setIsCreatingTrainingFollowUp(false);
    const handleSaveTrainingFollowUp = (item: TrainingPlanFollowUp) => {
        setTrainingPlanFollowUps(prev => [...prev, item]);
        setIsCreatingTrainingFollowUp(false);
    };

    const handleStartCreateVocationalEval = () => setIsCreatingVocationalEval(true);
    const handleCancelCreateVocationalEval = () => setIsCreatingVocationalEval(false);
    const handleSaveVocationalEval = (item: VocationalEvaluation) => {
        setVocationalEvaluations(prev => [...prev, item]);
        setIsCreatingVocationalEval(false);
    };

    const handleStartCreateFamilyGuidanceReferral = () => setIsCreatingFamilyGuidanceReferral(true);
    const handleCancelCreateFamilyGuidanceReferral = () => setIsCreatingFamilyGuidanceReferral(false);
    const handleSaveFamilyGuidanceReferral = (item: FamilyGuidanceReferral) => {
        setFamilyGuidanceReferrals(prev => [...prev, item]);
        setIsCreatingFamilyGuidanceReferral(false);
    };

    const handleStartCreatePostCareFollowUp = () => setIsCreatingPostCareFollowUp(true);
    const handleCancelCreatePostCareFollowUp = () => setIsCreatingPostCareFollowUp(false);
    const handleSavePostCareFollowUp = (item: PostCareFollowUp) => {
        setPostCareFollowUps(prev => [...prev, item]);
        setIsCreatingPostCareFollowUp(false);
    };

    return (
        <>
            <header className="app-header">
                <div className="header-content">
                    <h1>نظام إدارة بيانات المستفيدين - مركز التأهيل الشامل</h1>
                    <nav className="main-nav">
                        <button
                            className={currentView === 'beneficiaries' ? 'active' : ''}
                            onClick={() => setCurrentView('beneficiaries')}
                        >
                            المستفيدين
                        </button>
                        <button
                            className={currentView === 'clothing' ? 'active' : ''}
                            onClick={() => setCurrentView('clothing')}
                        >
                            الكسوة
                        </button>
                        <button
                            className={currentView === 'inventory' ? 'active' : ''}
                            onClick={() => setCurrentView('inventory')}
                        >
                            المستودع
                        </button>
                        <button
                            className={currentView === 'daily-follow-up' ? 'active' : ''}
                            onClick={() => setCurrentView('daily-follow-up')}
                        >
                            المتابعة اليومية
                        </button>
                        <button
                            className={currentView === 'social-activities' ? 'active' : ''}
                            onClick={() => setCurrentView('social-activities')}
                        >
                            الأنشطة الاجتماعية
                        </button>
                    </nav>
                </div>
            </header>

            <div className="main-container">
                {currentView === 'beneficiaries' ? (
                    <>
                        <BeneficiaryListPanel
                            beneficiaries={beneficiaries}
                            selectedBeneficiary={selectedBeneficiary}
                            onSelect={handleSelectBeneficiary}
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                        />
                        <BeneficiaryDetailPanel
                            beneficiary={selectedBeneficiary}
                            caseStudies={caseStudies}
                            socialResearchForms={socialResearchForms}
                            rehabilitationPlans={rehabilitationPlans}
                            visitLogs={visitLogs}
                            onStartCreateCaseStudy={handleStartCreateCaseStudy}
                            onStartCreateSocialResearch={handleStartCreateSocialResearch}
                            onStartCreateRehabPlan={handleStartCreateRehabPlan}
                            onAddVisitLog={handleAddVisitLog}
                            onStartClothingRequest={handleStartClothingRequest}
                            medicalExaminations={medicalExaminations}
                            onStartCreateMedicalExam={handleStartCreateMedicalExam}
                            educationalPlans={educationalPlans}
                            injuryReports={injuryReports}
                            familyCaseStudies={familyCaseStudies}
                            onStartCreateEducationalPlan={handleStartCreateEducationalPlan}
                            onStartCreateInjuryReport={handleStartCreateInjuryReport}
                            onStartCreateFamilyCaseStudy={handleStartCreateFamilyCaseStudy}
                            trainingReferrals={trainingReferrals}
                            trainingPlanFollowUps={trainingPlanFollowUps}
                            vocationalEvaluations={vocationalEvaluations}
                            onStartCreateTrainingReferral={handleStartCreateTrainingReferral}
                            onStartCreateTrainingFollowUp={handleStartCreateTrainingFollowUp}
                            onStartCreateVocationalEval={handleStartCreateVocationalEval}
                            familyGuidanceReferrals={familyGuidanceReferrals}
                            postCareFollowUps={postCareFollowUps}
                            onStartCreateFamilyGuidanceReferral={handleStartCreateFamilyGuidanceReferral}
                            onStartCreatePostCareFollowUp={handleStartCreatePostCareFollowUp}
                        />
                    </>
                ) : currentView === 'clothing' ? (
                    <ClothingManagementPanel />
                ) : currentView === 'inventory' ? (
                    <InventoryPanel inventory={inventory} />
                ) : currentView === 'daily-follow-up' ? (
                    <DailyFollowUpPanel />
                ) : (
                    <SocialActivitiesPanel
                        socialActivityPlans={socialActivityPlans}
                        socialActivityDocs={socialActivityDocs}
                        socialActivityFollowUps={socialActivityFollowUps}
                        onAddPlan={(plan) => setSocialActivityPlans(prev => [...prev, plan])}
                        onAddDocumentation={(doc) => setSocialActivityDocs(prev => [...prev, doc])}
                        onAddFollowUp={(item) => setSocialActivityFollowUps(prev => [...prev, item])}
                    />
                )}
            </div>

            {/* Modals */}
            {isCreatingCaseStudy && selectedBeneficiary && (
                <CaseStudyForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveCaseStudy}
                    onCancel={handleCancelCreateCaseStudy}
                />
            )}
            {isCreatingSocialResearch && selectedBeneficiary && (
                <SocialResearchForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveSocialResearch}
                    onCancel={handleCancelCreateSocialResearch}
                />
            )}
            {isCreatingRehabPlan && selectedBeneficiary && (
                <RehabilitationPlanForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveRehabPlan}
                    onCancel={handleCancelCreateRehabPlan}
                />
            )}
            {isCreatingClothingRequest && selectedBeneficiary && (
                <ClothingRequestForm
                    beneficiary={selectedBeneficiary}
                    inventory={inventory}
                    onSave={handleSaveClothingRequest}
                    onCancel={handleCancelClothingRequest}
                />
            )}
            {isCreatingMedicalExam && selectedBeneficiary && (
                <MedicalExaminationForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveMedicalExam}
                    onCancel={handleCancelCreateMedicalExam}
                />
            )}
            {isCreatingEducationalPlan && selectedBeneficiary && (
                <IndividualEducationalPlanForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveEducationalPlan}
                    onCancel={handleCancelCreateEducationalPlan}
                />
            )}
            {isCreatingInjuryReport && selectedBeneficiary && (
                <InjuryReportForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveInjuryReport}
                    onCancel={handleCancelCreateInjuryReport}
                />
            )}
            {isCreatingFamilyCaseStudy && selectedBeneficiary && (
                <FamilyCaseStudyForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveFamilyCaseStudy}
                    onCancel={handleCancelCreateFamilyCaseStudy}
                />
            )}
            {isCreatingTrainingReferral && selectedBeneficiary && (
                <TrainingReferralForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveTrainingReferral}
                    onCancel={handleCancelCreateTrainingReferral}
                />
            )}
            {isCreatingTrainingFollowUp && selectedBeneficiary && (
                <TrainingPlanFollowUpForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveTrainingFollowUp}
                    onCancel={handleCancelCreateTrainingFollowUp}
                />
            )}
            {isCreatingVocationalEval && selectedBeneficiary && (
                <VocationalEvaluationForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveVocationalEval}
                    onCancel={handleCancelCreateVocationalEval}
                />
            )}
            {isCreatingFamilyGuidanceReferral && selectedBeneficiary && (
                <FamilyGuidanceReferralForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSaveFamilyGuidanceReferral}
                    onCancel={handleCancelCreateFamilyGuidanceReferral}
                />
            )}
            {isCreatingPostCareFollowUp && selectedBeneficiary && (
                <PostCareFollowUpForm
                    beneficiary={selectedBeneficiary}
                    onSave={handleSavePostCareFollowUp}
                    onCancel={handleCancelCreatePostCareFollowUp}
                />
            )}
        </>
    );
};
