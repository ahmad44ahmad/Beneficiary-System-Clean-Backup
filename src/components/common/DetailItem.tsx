import * as React from 'react';

interface DetailItemProps {
    label: string;
    value?: string | number;
}

export const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <div className="detail-item">
        <dt>{label}</dt>
        <dd>{value || 'غير متوفر'}</dd>
    </div>
);
