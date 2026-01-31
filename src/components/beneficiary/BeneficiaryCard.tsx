import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, MapPin, Calendar, Activity,
    TrendingUp, ChevronRight, Heart, AlertTriangle
} from 'lucide-react';
import { ALERT_TAGS } from '../../data/domain-assets';

interface BeneficiaryCardProps {
    id: string;
    name: string;
    age: number;
    room: string;
    wing: string;
    admission_date: string;
    status: 'stable' | 'needs_attention' | 'critical';
    ipc_status: 'safe' | 'monitor' | 'alert';
    latest_goal?: string;
    avatar_url?: string;
    alerts?: string[]; // Alert tag IDs from domain-assets
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
    id,
    name,
    age,
    room,
    wing,
    admission_date,
    status,
    ipc_status,
    latest_goal,
    avatar_url,
    alerts = []
}) => {
    const navigate = useNavigate();

    const statusColors = {
        stable: 'bg-hrsd-green-light text-hrsd-green-dark',
        needs_attention: 'bg-hrsd-gold-light text-hrsd-gold-dark',
        critical: 'bg-red-100 text-red-700',
    };

    const ipcColors = {
        safe: 'border-hrsd-green',
        monitor: 'border-hrsd-gold',
        alert: 'border-red-500',
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div
            onClick={() => navigate(`/beneficiaries/${id}`)}
            className={`hrsd-card cursor-pointer border-r-4 ${ipcColors[ipc_status]} hover-lift transition-all`}
            dir="rtl"
        >
            {/* Header with Avatar */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="icon-container-lg bg-gradient-to-br from-hrsd-teal to-hrsd-teal-dark">
                        {avatar_url ? (
                            <img
                                src={avatar_url}
                                alt={name}
                                className="w-full h-full rounded-xl object-cover"
                            />
                        ) : (
                            <User className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-hierarchy-card-title text-gray-900">{name}</h3>
                        <p className="text-hierarchy-small text-gray-500">{age} سنة</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-hierarchy-small text-gray-600">
                    <MapPin className="w-4 h-4 text-hrsd-teal" />
                    <span>{wing} - غرفة {room}</span>
                </div>
                <div className="flex items-center gap-2 text-hierarchy-small text-gray-600">
                    <Calendar className="w-4 h-4 text-hrsd-gold" />
                    <span>{formatDate(admission_date)}</span>
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`badge-${status === 'stable' ? 'success' : status === 'needs_attention' ? 'warning' : 'danger'}`}>
                    <Heart className="w-3 h-3 ml-1" />
                    {status === 'stable' ? 'مستقر' : status === 'needs_attention' ? 'يحتاج متابعة' : 'حرج'}
                </span>
                <span className="badge-info">
                    <Activity className="w-3 h-3 ml-1" />
                    IPC: {ipc_status === 'safe' ? 'آمن' : ipc_status === 'monitor' ? 'مراقبة' : 'تنبيه'}
                </span>
            </div>

            {/* Alert Tags */}
            {alerts.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                    {alerts.map((alertId) => {
                        const alert = ALERT_TAGS.find(t => t.id === alertId);
                        if (!alert) return null;
                        return (
                            <span
                                key={alertId}
                                className="px-2 py-1 rounded-full text-xs text-white flex items-center gap-1"
                                style={{ backgroundColor: alert.color }}
                                title={alert.label}
                            >
                                <span>{alert.icon}</span>
                                <span>{alert.label}</span>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Latest Goal */}
            {latest_goal && (
                <div className="bg-hrsd-teal/5 rounded-lg p-2 flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-hrsd-teal flex-shrink-0 mt-0.5" />
                    <p className="text-hierarchy-small text-gray-700 line-clamp-2">{latest_goal}</p>
                </div>
            )}
        </div>
    );
};

export default BeneficiaryCard;
