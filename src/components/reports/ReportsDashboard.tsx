import React, { useState } from 'react';
import { ISOComplianceReport } from './ISOComplianceReport';
import { SustainabilityReport } from './SustainabilityReport';
import { Card } from '../ui/Card';
import { FileText, BarChart2, Printer } from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<'iso' | 'sustainability' | null>(null);

    if (selectedReport === 'iso') {
        return (
            <div>
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center print:hidden">
                    <button onClick={() => setSelectedReport(null)} className="text-blue-600 font-bold hover:underline">
                        &larr; العودة للتقارير
                    </button>
                    <span className="text-gray-500 text-sm">وضع المعاينة والطباعة</span>
                </div>
                <ISOComplianceReport />
            </div>
        );
    }

    if (selectedReport === 'sustainability') {
        return (
            <div>
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center print:hidden">
                    <button onClick={() => setSelectedReport(null)} className="text-blue-600 font-bold hover:underline">
                        &larr; العودة للتقارير
                    </button>
                    <span className="text-gray-500 text-sm">وضع المعاينة والطباعة</span>
                </div>
                <SustainabilityReport />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Printer className="w-8 h-8 text-gray-700" />
                    مركز التقارير الذكي (Reporting Center)
                </h1>
                <p className="text-gray-500 mt-1">توليد التقارير الرسمية، وثائق الامتثال، ومؤشرات الأداء بضغطة زر.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ISO Report Card */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-blue-600 group" onClick={() => setSelectedReport('iso')}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">رسمي / ISO</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">تقرير الامتثال (ISO 9001)</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        تقرير تفصيلي يوضح نتائج التدقيق الداخلي، حالات عدم المطابقة، وحالة الإجراءات التصحيحية. مطلوب للمدقق الخارجي.
                    </p>
                    <div className="text-blue-600 font-bold text-sm flex items-center">
                        عرض وطباعة التقرير &larr;
                    </div>
                </Card>

                {/* Sustainability Report Card */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-green-600 group" onClick={() => setSelectedReport('sustainability')}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-full group-hover:bg-green-100 transition-colors">
                            <BarChart2 className="w-8 h-8 text-green-600" />
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">استراتيجي / SROI</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">تقرير الاستدامة والأثر</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        قياس العائد الاجتماعي (SROI)، كفاءة استخدام الموارد، ومؤشرات السلامة. يدعم تقارير الأداء الاستراتيجي.
                    </p>
                    <div className="text-green-600 font-bold text-sm flex items-center">
                        عرض وطباعة التقرير &larr;
                    </div>
                </Card>
            </div>
        </div>
    );
};
