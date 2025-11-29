import * as React from 'react';
import { Beneficiary } from '../types';

interface BeneficiaryListItemProps {
    beneficiary: Beneficiary;
    isSelected: boolean;
    onSelect: (beneficiary: Beneficiary) => void;
}

export const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({ beneficiary, isSelected, onSelect }) => (
    <li
        className={`beneficiary-list-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(beneficiary)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onSelect(beneficiary)}
    >
        <div className="item-name">{beneficiary.fullName}</div>
        <div className="item-id">رقم المستفيد: {beneficiary.id}</div>
    </li>
);
