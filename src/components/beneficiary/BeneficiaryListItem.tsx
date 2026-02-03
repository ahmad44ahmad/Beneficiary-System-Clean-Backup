import * as React from 'react';
import { Eye } from 'lucide-react';
import { Beneficiary } from '../../types';
import { ALERT_TAGS } from '../../data/domain-assets';

interface BeneficiaryListItemProps {
    beneficiary: Beneficiary;
    isSelected: boolean;
    onSelect: (beneficiary: Beneficiary) => void;
    onQuickView: (id: string) => void;
}

export const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({ beneficiary, isSelected, onSelect, onQuickView }) => {
    // Get alerts from beneficiary
    const alerts = beneficiary.alerts || [];

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(beneficiary);
        }
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuickView(beneficiary.id);
    };

    return (
        <div
            className={`beneficiary-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(beneficiary)}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyPress}
        >
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 flex-1">
                    {/* Name and ID */}
                    <div className="flex-1">
                        <div className="item-name">{beneficiary.fullName}</div>
                        <div className="item-id">رقم المستفيد: {beneficiary.id?.slice(0, 8) || 'N/A'}</div>
                    </div>

                    {/* Alert Badges */}
                    {alerts.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                            {alerts.slice(0, 2).map((alertId, idx) => {
                                const alert = ALERT_TAGS.find(t =>
                                    t.id === alertId ||
                                    t.label === alertId
                                );
                                if (alert) {
                                    return (
                                        <span
                                            key={alertId}
                                            className={`alert-badge-${alert.id} px-2 py-0.5 rounded-full text-xs text-white flex items-center gap-1`}
                                            // eslint-disable-next-line react/forbid-component-props
                                            style={{ backgroundColor: alert.color }}
                                            title={alert.label}
                                        >
                                            <span>{alert.icon}</span>
                                            <span className="hidden sm:inline">{alert.label}</span>
                                        </span>
                                    );
                                }
                                return (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded-full text-xs bg-gray-500 text-white"
                                        title={alertId}
                                    >
                                        ⚠️
                                    </span>
                                );
                            })}
                            {alerts.length > 2 && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-400 text-white">
                                    +{alerts.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleQuickView}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600 transition-colors"
                    title="Quick View"
                    aria-label="Quick View"
                >
                    <Eye size={18} />
                </button>
            </div>
        </div>
    );
};
