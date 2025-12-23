import * as React from 'react';
import { Eye } from 'lucide-react';
import { Beneficiary } from '../../types';

interface BeneficiaryListItemProps {
    beneficiary: Beneficiary;
    isSelected: boolean;
    onSelect: (beneficiary: Beneficiary) => void;
    onQuickView: (id: string) => void;
}

export const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({ beneficiary, isSelected, onSelect, onQuickView }) => (
    <li
        className={`beneficiary-list-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(beneficiary)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onSelect(beneficiary)}
    >
        <div className="flex justify-between items-center w-full">
            <div>
                <div className="item-name">{beneficiary.fullName}</div>
                <div className="item-id">رقم المستفيد: {beneficiary.id}</div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(beneficiary.id);
                }}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600 transition-colors"
                title="Quick View"
            >
                <Eye size={18} />
            </button>
        </div>
    </li>
);
