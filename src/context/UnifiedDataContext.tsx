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
import { UnifiedBeneficiaryProfile } from '../types/unified';
import { deriveSmartTags } from '../utils/tagEngine';

// Import Demo Data
import { demoBeneficiaries } from '../data/demoData';
import { beneficiaries as originalBeneficiaries } from '../data/beneficiaries';

interface UnifiedDataContextType {
    beneficiaries: UnifiedBeneficiaryProfile[];
    // Legacy arrays kept for compatibility if needed, but main data is in beneficiaries
    visitLogs: VisitLog[];
    inventory: InventoryItem[];

    // Actions
    getBeneficiaryById: (id: string) => UnifiedBeneficiaryProfile | undefined;
    updateBeneficiary: (id: string, data: Partial<Beneficiary>) => void;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize with BOTH Original and Demo Data and apply Smart Tags
    const [beneficiaries, setBeneficiaries] = useState<UnifiedBeneficiaryProfile[]>(() => {
        // Map original beneficiaries to UnifiedBeneficiaryProfile structure
        const mappedOriginals: UnifiedBeneficiaryProfile[] = originalBeneficiaries.map(b => ({
            ...b,
            visitLogs: [],
            incidents: [],
            medicalHistory: [],
            socialResearch: [],
            rehabPlans: [],
            smartTags: deriveSmartTags(b) // Apply tags on load
        }));

        const allBeneficiaries = [...mappedOriginals, ...demoBeneficiaries];

        // Remove duplicates if any (based on ID)
        const uniqueBeneficiaries = Array.from(new Map(allBeneficiaries.map(item => [item.id, item])).values());

        return uniqueBeneficiaries;
    });

    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    const getBeneficiaryById = (id: string) => {
        return beneficiaries.find(b => b.id === id);
    };

    const updateBeneficiary = (id: string, data: Partial<Beneficiary>) => {
        setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    };

    return (
        <UnifiedDataContext.Provider value={{
            beneficiaries,
            visitLogs,
            inventory,
            getBeneficiaryById,
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
