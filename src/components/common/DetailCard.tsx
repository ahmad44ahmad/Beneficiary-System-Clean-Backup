import * as React from 'react';

interface DetailCardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export const DetailCard: React.FC<DetailCardProps> = ({ title, children, actions }) => (
    <div className="detail-card">
        <div className="card-header">
            <span>{title}</span>
            {actions && <div className="card-actions">{actions}</div>}
        </div>
        <div className="card-content">
            <dl className="detail-grid">{children}</dl>
        </div>
    </div>
);
