import React from 'react';
import { FileText, Printer } from 'lucide-react';
import { Button } from '../ui/Button';

interface PrintLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onPrint?: () => void;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ title, subtitle, children, onPrint }) => {
    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white">
            {/* Toolbar - Hidden in Print */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <h2 className="text-xl font-bold text-gray-800">معاينة التقرير</h2>
                <Button onClick={handlePrint} className="bg-blue-600 text-white hover:bg-blue-700">
                    <Printer className="w-4 h-4 ml-2" />
                    طباعة / تصدير PDF
                </Button>
            </div>

            {/* A4 Paper Container */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:w-full min-h-[297mm] p-10 print:p-0 relative">

                {/* Formal Header */}
                <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-start">
                    <div className="text-right">
                        <h1 className="text-lg font-bold text-gray-900">المملكة العربية السعودية</h1>
                        <h2 className="text-base font-medium text-gray-800">وزارة الموارد البشرية والتنمية الاجتماعية</h2>
                        <h3 className="text-sm text-gray-600">مركز التأهيل الشامل (قسم الذكور)</h3>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-xs text-gray-500">شعار الوزارة</span>
                        </div>
                    </div>
                    <div className="text-left text-sm text-gray-600">
                        <p>التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                        <p>رقم التقرير: REF-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                </div>

                {/* Report Title */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-gray-900 underline decoration-2 underline-offset-8">{title}</h1>
                    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
                </div>

                {/* Content */}
                <div className="report-content">
                    {children}
                </div>

                {/* Formal Footer */}
                <div className="mt-20 pt-8 border-t border-gray-300 flex justify-between items-end print:absolute print:bottom-10 print:left-0 print:right-0 print:px-10">
                    <div className="text-center">
                        <p className="text-sm font-bold mb-4">مدير قسم الجودة</p>
                        <div className="h-10 border-b border-dashed border-gray-400 w-40 mx-auto"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold mb-4">مدير المركز</p>
                        <div className="h-10 border-b border-dashed border-gray-400 w-40 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
