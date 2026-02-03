import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, CheckCircle, TrendingUp, UserPlus } from 'lucide-react';
import { Card } from '../ui/Card';
import { staffingOptimizerService, WardAcuity } from '../../services/staffingOptimizerService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export const ShiftRecommendationCard: React.FC = () => {
    const [acuity, setAcuity] = useState<WardAcuity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        staffingOptimizerService.calculateWardAcuity('WARD-A')
            .then(data => {
                setAcuity(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="h-64 bg-gray-50 rounded-xl animate-pulse"></div>;
    if (!acuity) return null;

    const data = [
        { name: 'تمريض (RN)', actual: acuity.currentStaff.rn, recommended: acuity.recommendedStaff.rn },
        { name: 'مساعدين (CA)', actual: acuity.currentStaff.ca, recommended: acuity.recommendedStaff.ca },
    ];

    return (
        <Card className={`border-l-4 ${acuity.status === 'understaffed' ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            نظام "Opti-Staff" الذكي
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">توصيات التوظيف بناءً على حدة الحالات</p>
                    </div>
                    {acuity.status === 'understaffed' ? (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> نقص في الكادر
                        </span>
                    ) : (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> توزيع مثالي
                        </span>
                    )}
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">نقاط حدة القسم</p>
                        <p className="text-2xl font-bold text-purple-600">{acuity.totalAcuityScore}</p>
                        <div className="flex justify-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 3 ? 'bg-purple-500' : 'bg-gray-300'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-blue-600 mb-1">الحالات الحرجة</p>
                        <p className="text-2xl font-bold text-blue-700">{acuity.highRiskCount}</p>
                        <p className="text-[10px] text-blue-400">تحتاج مراقبة 1:1</p>
                    </div>
                </div>

                <div className="h-40 w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="actual" name="الموجود" fill="#94a3b8" barSize={12} radius={[0, 4, 4, 0]} />
                            <Bar dataKey="recommended" name="المطلوب (AI)" fill="#3b82f6" barSize={12} radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.actual < entry.recommended ? '#ef4444' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {acuity.status === 'understaffed' && (
                    <button className="w-full py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        طلب دعم فوري
                    </button>
                )}
            </div>
        </Card>
    );
};
