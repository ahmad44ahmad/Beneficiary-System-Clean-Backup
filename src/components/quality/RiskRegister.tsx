import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle, TrendingUp, Shield, Activity, Droplet } from 'lucide-react';

interface RiskItem {
    id: string;
    category: 'Falls' | 'Choking' | 'Infection' | 'Behavioral' | 'Medical';
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigation: string;
    lastReview: string;
}

export const RiskRegister: React.FC = () => {
    const [risks, setRisks] = useState<RiskItem[]>([
        { id: '1', category: 'Falls', probability: 'Medium', impact: 'High', mitigation: 'Bed rails, Non-slip socks', lastReview: '2023-10-01' },
        { id: '2', category: 'Choking', probability: 'Low', impact: 'High', mitigation: 'Soft diet, Supervision during meals', lastReview: '2023-10-01' },
        { id: '3', category: 'Infection', probability: 'High', impact: 'Medium', mitigation: 'Isolation protocol, PPE', lastReview: '2023-10-15' }
    ]);

    const getRiskScore = (p: string, i: string) => {
        const map: any = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return map[p] * map[i];
    };

    const getRiskColor = (score: number) => {
        if (score >= 6) return 'bg-red-100 text-red-800 border-red-200';
        if (score >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Active Risk Register
                    </h3>
                    <p className="text-sm text-gray-500">Live risk matrix and mitigation strategies.</p>
                </div>
                <Button size="sm" variant="outline">Update Assessment</Button>
            </div>

            {/* Vital Info Cards */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-red-100 bg-red-50">
                    <div className="flex items-center gap-3">
                        <Droplet className="w-8 h-8 text-red-500" />
                        <div>
                            <span className="text-xs font-bold text-red-400 uppercase">Blood Type</span>
                            <div className="text-2xl font-bold text-red-700">O+</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-orange-100 bg-orange-50">
                    <div className="flex items-center gap-3">
                        <Activity className="w-8 h-8 text-orange-500" />
                        <div>
                            <span className="text-xs font-bold text-orange-400 uppercase">Allergies</span>
                            <div className="text-lg font-bold text-orange-700">Penicillin, Nuts</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Risk Matrix Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitigation Strategy</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Review</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {risks.map((risk) => {
                            const score = getRiskScore(risk.probability, risk.impact);
                            return (
                                <tr key={risk.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{risk.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(score)}`}>
                                            {risk.probability} / {risk.impact} ({score})
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{risk.mitigation}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.lastReview}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
