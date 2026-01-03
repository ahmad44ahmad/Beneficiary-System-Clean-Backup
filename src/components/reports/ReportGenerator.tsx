import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Download, Printer, ChevronLeft,
    Calendar, User, Building, CheckCircle,
    Loader2, Eye, Settings
} from 'lucide-react';

// Report Types
const REPORT_TYPES = [
    {
        id: 'beneficiary_summary',
        title: 'تقرير ملخص المستفيد',
        description: 'ملخص شامل لحالة المستفيد والأهداف والتقدم',
        icon: User,
        color: 'blue',
    },
    {
        id: 'ipc_compliance',
        title: 'تقرير الامتثال IPC',
        description: 'تقرير مكافحة العدوى والتفتيشات الأسبوعية',
        icon: CheckCircle,
        color: 'green',
    },
    {
        id: 'empowerment_progress',
        title: 'تقرير التمكين والأهداف',
        description: 'تفاصيل الأهداف التأهيلية ونسب الإنجاز',
        icon: FileText,
        color: 'purple',
    },
    {
        id: 'monthly_center',
        title: 'التقرير الشهري للمركز',
        description: 'إحصائيات شاملة للمركز والخدمات المقدمة',
        icon: Building,
        color: 'teal',
    },
];

// Report Card Component
const ReportCard: React.FC<{
    report: typeof REPORT_TYPES[0];
    onGenerate: (id: string) => void;
    generating: boolean;
}> = ({ report, onGenerate, generating }) => {
    const Icon = report.icon;

    const colorClasses: Record<string, { bg: string; icon: string; button: string }> = {
        blue: { bg: 'bg-blue-50', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
        green: { bg: 'bg-green-50', icon: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
        purple: { bg: 'bg-purple-50', icon: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
        teal: { bg: 'bg-teal-50', icon: 'text-teal-600', button: 'bg-teal-600 hover:bg-teal-700' },
    };

    const colors = colorClasses[report.color] || colorClasses.blue;

    return (
        <div className={`${colors.bg} rounded-2xl p-5 hover-lift transition-all`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onGenerate(report.id)}
                            disabled={generating}
                            className={`flex-1 py-2 ${colors.button} text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all`}
                        >
                            {generating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {generating ? 'جاري الإنشاء...' : 'تحميل PDF'}
                        </button>
                        <button className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                            <Printer className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Generate PDF Function (Client-side)
const generatePDF = async (reportType: string): Promise<void> => {
    // Create report content based on type
    const reportTitles: Record<string, string> = {
        beneficiary_summary: 'تقرير ملخص المستفيد',
        ipc_compliance: 'تقرير الامتثال لمكافحة العدوى',
        empowerment_progress: 'تقرير التمكين والأهداف التأهيلية',
        monthly_center: 'التقرير الشهري للمركز',
    };

    const title = reportTitles[reportType] || 'تقرير';
    const date = new Date().toLocaleDateString('ar-SA');

    // Create printable HTML content
    const content = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        * { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        body { padding: 40px; background: white; color: #1f2937; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0d9488; }
        .header h1 { font-size: 28px; color: #14415a; margin-bottom: 10px; }
        .header p { color: #6b7280; }
        .logo { width: 80px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section h2 { font-size: 18px; color: #0d9488; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: #f0fdfa; padding: 15px; border-radius: 12px; text-align: center; }
        .stat-card .value { font-size: 24px; font-weight: 700; color: #14415a; }
        .stat-card .label { font-size: 12px; color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; color: #14415a; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>وزارة الموارد البشرية والتنمية الاجتماعية</h1>
        <p>مركز التأهيل الشامل</p>
        <h2 style="margin-top: 20px; color: #0d9488;">${title}</h2>
        <p>تاريخ التقرير: ${date}</p>
    </div>
    
    <div class="section">
        <h2>ملخص الإحصائيات</h2>
        <div class="stat-grid">
            <div class="stat-card">
                <div class="value">85%</div>
                <div class="label">معدل الامتثال</div>
            </div>
            <div class="stat-card">
                <div class="value">12</div>
                <div class="label">أهداف نشطة</div>
            </div>
            <div class="stat-card">
                <div class="value">45</div>
                <div class="label">مستفيد</div>
            </div>
            <div class="stat-card">
                <div class="value">94%</div>
                <div class="label">نسبة التحصين</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>التفاصيل</h2>
        <table>
            <thead>
                <tr>
                    <th>البند</th>
                    <th>الحالة</th>
                    <th>ملاحظات</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>مكافحة العدوى</td>
                    <td style="color: #22c55e;">✓ ممتاز</td>
                    <td>جميع الفحوصات مكتملة</td>
                </tr>
                <tr>
                    <td>التمكين والتأهيل</td>
                    <td style="color: #22c55e;">✓ جيد جداً</td>
                    <td>3 أهداف محققة هذا الشهر</td>
                </tr>
                <tr>
                    <td>الرعاية الصحية</td>
                    <td style="color: #22c55e;">✓ ممتاز</td>
                    <td>جميع التحصينات محدثة</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>تم إنشاء هذا التقرير بواسطة نظام بصيرة 2.0</p>
        <p>© ${new Date().getFullYear()} وزارة الموارد البشرية والتنمية الاجتماعية</p>
    </div>
</body>
</html>`;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();

        // Wait for fonts to load then print
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
};

export const ReportGenerator: React.FC = () => {
    const navigate = useNavigate();
    const [generating, setGenerating] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });

    const handleGenerate = async (reportId: string) => {
        setGenerating(reportId);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        await generatePDF(reportId);

        setGenerating(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">مولد التقارير</h1>
                        <p className="text-gray-500">إنشاء وتصدير التقارير بصيغة PDF</p>
                    </div>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    نطاق التاريخ
                </h3>
                <div className="flex gap-4 items-center flex-wrap">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">من</label>
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">إلى</label>
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 self-end">
                        <Settings className="w-4 h-4" />
                        خيارات متقدمة
                    </button>
                </div>
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REPORT_TYPES.map(report => (
                    <ReportCard
                        key={report.id}
                        report={report}
                        onGenerate={handleGenerate}
                        generating={generating === report.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReportGenerator;
