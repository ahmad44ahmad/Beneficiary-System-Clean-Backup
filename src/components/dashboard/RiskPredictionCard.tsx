import React, { useMemo } from 'react';
import { Activity, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { UnifiedBeneficiaryProfile } from '../types';
import { calculateRiskScore, getWardTensionScore } from '../../services/riskAnalysisService';
import { useNavigate } from 'react-router-dom';

interface RiskPredictionCardProps {
    beneficiaries: UnifiedBeneficiaryProfile[];
}

export const RiskPredictionCard: React.FC<RiskPredictionCardProps> = ({ beneficiaries }) => {
    const navigate = useNavigate();

    // Calculate Ward Metrics
    const wardTension = useMemo(() => getWardTensionScore(beneficiaries), [beneficiaries]);

    const highRiskCases = useMemo(() => {
        return beneficiaries
            .map(b => ({ ...b, risk: calculateRiskScore(b) }))
            .filter(b => b.risk.score >= 50)
            .sort((a, b) => b.risk.score - a.risk.score)
            .slice(0, 5); // Top 5
    }, [beneficiaries]);

    const getTensionColor = (score: number) => {
        if (score < 30) return 'text-green-500';
        if (score < 60) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <Card className="h-full border-red-50 shadow-sm relative overflow-hidden">
            {/* Background Pulse Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-orange-500 to-red-500 opacity-20" />

            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-500" />
                            النبض الحيوي (Vital Pulse)
                        </h3>
                        <p className="text-xs text-gray-500">مؤشر المخاطر التنبؤي (Ehsan AI)</p>
                    </div>
                    <div className={`text-2xl font-bold ${getTensionColor(wardTension)}`}>
                        {wardTension}%
                    </div>
                </div>

                {/* Ward Status Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${wardTension < 30 ? 'bg-green-500' : wardTension < 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${wardTension}%` }}
                    />
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        حالات تتطلب الانتباه ({highRiskCases.length})
                    </h4>

                    {highRiskCases.length > 0 ? (
                        highRiskCases.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/beneficiaries/${item.id}`)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100 group"
                            >
                                <div className="relative">
                                    <img
                                        src={item.gender === 'female'
                                            ? 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png'
                                            : 'https://cdn-icons-png.flaticon.com/512/4042/4042356.png'}
                                        alt={item.fullName}
                                        className="w-10 h-10 rounded-full bg-white border border-red-100 p-1"
                                    />
                                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-gray-800 text-sm truncate group-hover:text-red-700 transition-colors">
                                        {item.fullName}
                                    </h5>
                                    <div className="text-xs text-red-600 truncate flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {item.risk.factors[0] || 'عوامل متعددة'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-red-600 leading-none">
                                        {item.risk.score}
                                    </span>
                                    <span className="text-[10px] text-gray-400">نقاط</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-400" />
                            <p className="text-sm">لا توجد حالات حرجة حالياً</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
