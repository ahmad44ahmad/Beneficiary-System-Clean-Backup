import * as React from 'react';
import { Beneficiary } from '../../types';
import { SearchBar } from '../common/SearchBar';
import { BeneficiaryListItem } from './BeneficiaryListItem';
import { useUnifiedData } from '../../context/UnifiedDataContext';

interface BeneficiaryListPanelProps {
    beneficiaries: Beneficiary[];
    selectedBeneficiary: Beneficiary | null;
    onSelect: (beneficiary: Beneficiary) => void;
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ITEMS_PER_PAGE = 20;

export const BeneficiaryListPanel: React.FC<BeneficiaryListPanelProps> = ({ beneficiaries, selectedBeneficiary, onSelect, searchTerm, onSearchChange }) => {
    const { loading } = useUnifiedData();
    const [currentPage, setCurrentPage] = React.useState(1);

    const filteredBeneficiaries = React.useMemo(() => {
        if (!searchTerm) return beneficiaries;
        const lowerTerm = searchTerm.toLowerCase();
        return beneficiaries.filter(
            (b) =>
                (b.fullName && b.fullName.toLowerCase().includes(lowerTerm)) ||
                (b.id && b.id.toString().includes(lowerTerm)) ||
                (b.nationalId && b.nationalId.toString().includes(lowerTerm))
        );
    }, [beneficiaries, searchTerm]);

    // Reset to page 1 when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const paginatedBeneficiaries = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBeneficiaries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredBeneficiaries, currentPage]);

    const totalPages = Math.ceil(filteredBeneficiaries.length / ITEMS_PER_PAGE);

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
        <aside className="beneficiary-list-panel flex flex-col h-full">
            <div className="panel-header-actions p-4 flex flex-col gap-2 shrink-0 bg-white border-b z-10">
                <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
                <button onClick={handleExport} className="cursor-pointer font-medium w-full text-sm py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                    تصدير القائمة (Excel)
                </button>
                <div className="text-xs text-gray-500 text-center">
                    {loading ? 'Updating...' : `Showing ${paginatedBeneficiaries.length} of ${filteredBeneficiaries.length} beneficiaries`}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading && beneficiaries.length === 0 ? (
                    <div className="p-4 space-y-3">
                        {/* Skeleton Loader */}
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <ul className="beneficiary-list" role="listbox">
                        {paginatedBeneficiaries.map((beneficiary) => (
                            <BeneficiaryListItem
                                key={beneficiary.id}
                                beneficiary={beneficiary}
                                isSelected={selectedBeneficiary?.id === beneficiary.id}
                                onSelect={onSelect}
                                onQuickView={() => onSelect(beneficiary)}
                            />
                        ))}
                    </ul>
                )}

                {!loading && filteredBeneficiaries.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No beneficiaries found matching "{searchTerm}"
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="p-2 border-t bg-gray-50 flex justify-between items-center shrink-0">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </aside>
    );
};
