import * as React from 'react';
import { Beneficiary } from '../types';
import { SearchBar } from './SearchBar';
import { BeneficiaryListItem } from './BeneficiaryListItem';

interface BeneficiaryListPanelProps {
    beneficiaries: Beneficiary[];
    selectedBeneficiary: Beneficiary | null;
    onSelect: (beneficiary: Beneficiary) => void;
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BeneficiaryListPanel: React.FC<BeneficiaryListPanelProps> = ({ beneficiaries, selectedBeneficiary, onSelect, searchTerm, onSearchChange }) => {
    const filteredBeneficiaries = beneficiaries.filter(
        (b) =>
            b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.includes(searchTerm)
    );

    return (
        <aside className="beneficiary-list-panel">
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
            <ul className="beneficiary-list" role="listbox">
                {filteredBeneficiaries.map((beneficiary) => (
                    <BeneficiaryListItem
                        key={beneficiary.id + beneficiary.fullName}
                        beneficiary={beneficiary}
                        isSelected={selectedBeneficiary?.id === beneficiary.id && selectedBeneficiary?.fullName === beneficiary.fullName}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        </aside>
    );
};
