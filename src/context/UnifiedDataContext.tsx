import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    Beneficiary,
    MedicalProfile,
    SocialResearch,
    VisitLog,
    IncidentReport,
    IndividualEducationalPlan,
    InventoryItem
} from '../types';
import { MedicalExamination } from '../types/medical';
import { RehabPlan } from '../types/rehab';

// Import Static Data
import { beneficiaries as initialBeneficiaries } from '../data/beneficiaries';
import { visitLogs as initialVisits } from '../data/visits';
import { rehabPlans as initialRehabPlans } from '../data/rehabPlans';
import { inventoryItems as initialInventory } from '../data/inventory';

interface UnifiedDataContextType {
    beneficiaries: Beneficiary[];
    medicalProfiles: MedicalProfile[];
    socialResearchForms: SocialResearch[];
    rehabilitationPlans: RehabPlan[];
    visitLogs: VisitLog[];
    inventory: InventoryItem[]; // Added inventory
    incidents: IncidentReport[];
    medicalExaminations: MedicalExamination[];
    educationalPlans: IndividualEducationalPlan[];

    // Actions
    addVisitLog: (log: VisitLog) => void;
    addIncident: (incident: IncidentReport) => void;
    updateBeneficiary: (id: string, data: Partial<Beneficiary>) => void;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State Initialization
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>(initialVisits);
    const [rehabilitationPlans, setRehabilitationPlans] = useState<RehabPlan[]>(initialRehabPlans);
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

    // Empty states for now (or load from future static files)
    const [medicalProfiles, setMedicalProfiles] = useState<MedicalProfile[]>([]);
    const [socialResearchForms, setSocialResearchForms] = useState<SocialResearch[]>([]);
    const [incidents, setIncidents] = useState<IncidentReport[]>([]);
    const [medicalExaminations, setMedicalExaminations] = useState<MedicalExamination[]>([]);
    const [educationalPlans, setEducationalPlans] = useState<IndividualEducationalPlan[]>([]);

    // Actions
    const addVisitLog = (log: VisitLog) => setVisitLogs(prev => [log, ...prev]);
    const addIncident = (incident: IncidentReport) => setIncidents(prev => [incident, ...prev]);
    const updateBeneficiary = (id: string, data: Partial<Beneficiary>) => {
        setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    };

    return (
        <UnifiedDataContext.Provider value={{
            beneficiaries,
            medicalProfiles,
            socialResearchForms,
            rehabilitationPlans,
            visitLogs,
            inventory,
            incidents,
            medicalExaminations,
            educationalPlans,
            addVisitLog,
            addIncident,
            updateBeneficiary
        }}>
            {children}
        </UnifiedDataContext.Provider>
    );
};

export const useUnifiedData = () => {
    const context = useContext(UnifiedDataContext);
    if (!context) {
        throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
    }
    return context;
};
