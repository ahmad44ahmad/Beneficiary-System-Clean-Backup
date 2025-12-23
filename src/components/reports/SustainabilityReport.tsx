import React from 'react';
import { PrintLayout } from './PrintLayout';
import { rehabPlans } from '../../data/rehabPlans';
import { mockAssets } from '../../data/assets';
import { mockIncidents } from '../../data/quality';
import { TrendingUp, Leaf, ShieldCheck } from 'lucide-react';

export const SustainabilityReport: React.FC = () => {
    // 1. Beneficiary Outcomes (Social Impact)
    const totalGoals = rehabPlans.reduce((acc, plan) => acc + plan.goals.length, 0);
    const achievedGoals = rehabPlans.reduce((acc, plan) => acc + plan.goals.filter(g => g.status === 'achieved' || g.progress === 100).length, 0);
    const successRate = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

    // 2. Resource Efficiency (Economic Impact)
    const totalAssetValue = mockAssets.reduce((acc, asset) => acc + asset.value, 0);
    const damagedAssetsValue = mockAssets.filter(a => a.condition === 'damaged').reduce((acc, asset) => acc + asset.value, 0);
    const assetUtilizationRate = Math.round(((totalAssetValue - damagedAssetsValue) / totalAssetValue) * 100);

    // 3. Safety & Well-being (Human Impact)
    const totalIncidents = mockIncidents.length;
    const closedIncidents = mockIncidents.filter(i => i.status === 'closed').length;
    const safetyResponseRate = totalIncidents > 0 ? Math.round((closedIncidents / totalIncidents) * 100) : 100;

    return (
        <PrintLayout
            title="تقرير الاستدامة والأثر الاجتماعي (SROI)"
            subtitle="قياس العائد على الاستثمار الاجتماعي وكفاءة الموارد - مبادرة واحة الإحسان"
        >
            {/* Impact Highlights */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="p-6 border rounded-lg bg-green-50 text-center">
                    <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-bold text-green-800">الأثر الاجتماعي</h4>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{successRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">نسبة تحقيق أهداف التأهيل</p>
                </div>
                <div className="p-6 border rounded-lg bg-blue-50 text-center">
                    <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-bold text-blue-800">الكفاءة التشغيلية</h4>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{assetUtilizationRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">نسبة استغلال الأصول</p>
                </div>
                <div className="p-6 border rounded-lg bg-teal-50 text-center">
                    <ShieldCheck className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <h4 className="font-bold text-teal-800">السلامة المهنية</h4>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{safetyResponseRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">معدل الاستجابة للحوادث</p>
                </div>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-8">
                {/* Section 1 */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">1. تحسين جودة الحياة (Quality of Life)</h3>
                    <p className="text-sm text-gray-600 mb-4 text-justify leading-relaxed">
                        يعكس هذا المؤشر مدى نجاح المركز في تحويل المستفيدين من حالة الاعتماد الكلي إلى الاستقلالية النسبية عبر خطط التأهيل الفردية.
                        تشير البيانات إلى تحقيق <strong>{achievedGoals}</strong> هدفاً تأهيلياً من أصل <strong>{totalGoals}</strong> هدفاً مخططاً له خلال الفترة الحالية.
                    </p>
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border p-2 text-right">نوع الهدف</th>
                                <th className="border p-2 text-center">العدد الكلي</th>
                                <th className="border p-2 text-center">تم الإنجاز</th>
                                <th className="border p-2 text-center">نسبة النجاح</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['medical', 'social', 'psychological', 'physiotherapy'].map(type => {
                                const typeGoals = rehabPlans.flatMap(p => p.goals).filter(g => g.type === type);
                                const typeTotal = typeGoals.length;
                                const typeAchieved = typeGoals.filter(g => g.status === 'achieved' || g.progress === 100).length;
                                return (
                                    <tr key={type}>
                                        <td className="border p-2 font-medium capitalize">{type}</td>
                                        <td className="border p-2 text-center">{typeTotal}</td>
                                        <td className="border p-2 text-center">{typeAchieved}</td>
                                        <td className="border p-2 text-center font-bold">
                                            {typeTotal > 0 ? Math.round((typeAchieved / typeTotal) * 100) : 0}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Section 2 */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">2. الحوكمة المالية واستدامة الأصول</h3>
                    <p className="text-sm text-gray-600 mb-4 text-justify leading-relaxed">
                        يهدف المركز إلى تعظيم الاستفادة من الموارد المتاحة وتقليل الهدر المالي الناتج عن سوء الاستخدام أو الأعطال.
                        تبلغ القيمة الإجمالية للأصول المدارة <strong>{totalAssetValue.toLocaleString()} ر.س</strong>، مع نسبة صلاحية تشغيلية تبلغ <strong>{assetUtilizationRate}%</strong>.
                    </p>
                    <div className="bg-gray-50 p-4 rounded border">
                        <h4 className="font-bold text-sm mb-2">توصيات التحسين:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            <li>زيادة وتيرة الصيانة الوقائية للأجهزة الطبية لتقليل فترات التوقف.</li>
                            <li>مراجعة عقود الموردين للأصول ذات معدلات الاستهلاك العالية.</li>
                            <li>تدريب الموظفين على التعامل الأمثل مع الأصول الجديدة.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PrintLayout>
    );
};
