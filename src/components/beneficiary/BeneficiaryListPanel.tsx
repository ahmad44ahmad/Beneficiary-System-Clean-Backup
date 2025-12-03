import * as React from 'react';
import { Beneficiary } from '../../types';
import { SearchBar } from '../common/SearchBar';
import { BeneficiaryListItem } from './BeneficiaryListItem';
import { BeneficiaryMasterView } from '../profile/BeneficiaryMasterView';

interface BeneficiaryListPanelProps {
    beneficiaries: Beneficiary[];
    selectedBeneficiary: Beneficiary | null;
    onSelect: (beneficiary: Beneficiary) => void;
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BeneficiaryListPanel: React.FC<BeneficiaryListPanelProps> = ({ beneficiaries, selectedBeneficiary, onSelect, searchTerm, onSearchChange }) => {
    const [viewingBeneficiaryId, setViewingBeneficiaryId] = React.useState<string | null>(null);

    const filteredBeneficiaries = beneficiaries.filter(
        (b) =>
            b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.includes(searchTerm)
    );

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" +
            "الاسم,رقم الهوية,رقم الغرفة,تاريخ الدخول\n" +
            filteredBeneficiaries.map(b => `"${b.fullName}","${b.nationalId || ''}","${b.roomNumber || ''}","${b.enrollmentDate}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "beneficiaries_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <aside className="beneficiary-list-panel">
            <div className="panel-header-actions" style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
                <button onClick={handleExport} className="btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>
                    تصدير القائمة (Excel)
                </button>
            </div>
            <ul className="beneficiary-list" role="listbox">
                {filteredBeneficiaries.map((beneficiary) => (
                    <BeneficiaryListItem
                        key={beneficiary.id + beneficiary.fullName}
                        beneficiary={beneficiary}
                        isSelected={selectedBeneficiary?.id === beneficiary.id && selectedBeneficiary?.fullName === beneficiary.fullName}
                        onSelect={onSelect}
                        onQuickView={(id) => setViewingBeneficiaryId(id)}
                    />
                ))}
            </ul>

            {viewingBeneficiaryId && (
                <BeneficiaryMasterView
                    beneficiaryId={viewingBeneficiaryId}
                    isOpen={!!viewingBeneficiaryId}
                    onClose={() => setViewingBeneficiaryId(null)}
                />
            )}
        </aside>
    );
};
