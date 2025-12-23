import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    Beneficiary, CaseStudy, SocialResearch, RehabilitationPlan, VisitLog,
    InventoryItem, ClothingRequest, MedicalExamination, IndividualEducationalPlan,
    InjuryReport, FamilyCaseStudy, SocialActivityPlan, SocialActivityDocumentation,
    SocialActivityFollowUp, TrainingReferral, TrainingPlanFollowUp, VocationalEvaluation,
    FamilyGuidanceReferral, PostCareFollowUp
} from '../types';
import { MedicalProfile, VaccinationRecord } from '../types/medical';
import { beneficiaries as initialBeneficiaries } from '../data/beneficiaries';
import { visitLogs as initialVisitLogs } from '../data/visits';
import { inventoryItems as initialInventory } from '../data/inventory';

interface DataContextType {
    beneficiaries: Beneficiary[];
    visitLogs: VisitLog[];
    inventory: InventoryItem[];
    // Add other state arrays here...
    // For brevity in this refactor, I'm exposing the setters or methods to update them
    addVisitLog: (log: VisitLog) => void;
    updateInventory: (items: InventoryItem[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>(initialVisitLogs);
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

    // ... (We would move all the state from App.tsx here ideally, but for now let's start small)

    const addVisitLog = (log: VisitLog) => setVisitLogs(prev => [log, ...prev]);
    const updateInventory = (items: InventoryItem[]) => setInventory(items);

    return (
        <DataContext.Provider value={{ beneficiaries, visitLogs, inventory, addVisitLog, updateInventory }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
