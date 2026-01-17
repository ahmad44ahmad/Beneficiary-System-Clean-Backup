import React, { useState } from 'react';
import { mockRisks, mockIncidents, mockAudits, mockCAPAs } from '../data/quality';
import { RiskRegister } from '../components/quality/RiskRegister';
import { DigitalAuditTool } from '../components/quality/DigitalAuditTool';
import { QualityProcessesPanel } from '../components/quality/QualityProcessesPanel';
import { QualityManual } from '../components/quality/QualityManual';
import { Card } from '../components/ui/Card';
import {
    ShieldCheck,
    AlertTriangle,
    ClipboardCheck,
    Activity,
    PlusCircle,
    FileText,
    Plus,
    ArrowUpRight,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const QualityDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'guide' | 'operations' | 'risks' | 'audit' | 'incidents'>('overview');
    const [risks, setRisks] = useState(mockRisks);
    const [audit, setAudit] = useState(mockAudits[0]); // Demo: Active Audit

    // Metrics
    const criticalRisks = risks.filter(r => r.score > 15).length;
    const openCAPAs = mockCAPAs.filter(c => c.status === 'open' || c.status === 'in_progress').length;
    const incidentCount = mockIncidents.length;

    // Stats for Overview
    const stats = {
        pendingAudits: 3,
        openIncidents: 5,
        highRisks: criticalRisks,
        complianceRate: 94
    };

    // Handlers
    const handleAddRisk = (newRisk: any) => {
        setRisks([...risks, { ...newRisk, id: `r_${Date.now()}` }]);
    };

    const handleUpdateFinding = (id: string, isCompliant: boolean, evidence?: string) => {
        setAudit(prev => ({
            ...prev,
            findings: prev.findings.map(f => f.id === id ? { ...f, isCompliant, evidence } : f)
        }));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة الجودة</h1>
                    <p className="text-gray-500">مراقبة مؤشرات الأداء وضمان الامتثال للمعايير</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        تقرير الجودة
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        تدقيق جديد
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    لوحة القيادة
                </button>
                <button
                    onClick={() => setActiveTab('guide')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'guide'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BookOpen className="w-4 h-4 inline-block ml-2" />
                    دليل الجودة الشامل
                </button>
                <button
                    onClick={() => setActiveTab('operations')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'operations'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    دليل العمليات
                </button>
                <button
                    onClick={() => setActiveTab('risks')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'risks'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    سجل المخاطر
                </button>
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'audit'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    التدقيق الداخلي
                </button>
                <button
                    onClick={() => setActiveTab('incidents')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'incidents'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    إدارة الوقائع
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="p-4 border-t-4 border-t-blue-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">نسبة الامتثال</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.complianceRate}%</h3>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +2.5% عن الشهر السابق
                                </div>
                            </Card>

                            <Card className="p-4 border-t-4 border-t-yellow-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">تدقيق جاري</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingAudits}</h3>
                                    </div>
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <ClipboardCheck className="w-5 h-5 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    3 مجدولة لهذا الأسبوع
                                </div>
                            </Card>

                            <Card className="p-4 border-t-4 border-t-red-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">مخاطر عالية</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.highRisks}</h3>
                                    </div>
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-red-600">
                                    تتطلب إجراءات فورية
                                </div>
                            </Card>

                            <Card className="p-4 border-t-4 border-t-purple-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">وقائع مفتوحة</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.openIncidents}</h3>
                                    </div>
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-purple-600">
                                    2 قيد التحقيق
                                </div>
                            </Card>
                        </div>

                        {/* Recent Activity & Charts Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="font-bold text-gray-900 mb-4">نشاطات الجودة الأخيرة</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">تم إغلاق واقعة #2024-{100 + i}</p>
                                                <p className="text-xs text-gray-500">قبل {i + 2} ساعات • قسم التمريض</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card className="p-6">
                                <h3 className="font-bold text-gray-900 mb-4">الامتثال حسب القسم</h3>
                                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed">
                                    <p className="text-gray-400">رسم بياني يظهر نسب الامتثال</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'guide' && <QualityManual />}

                {activeTab === 'operations' && <QualityProcessesPanel />}

                {activeTab === 'risks' && <RiskRegister />}

                {activeTab === 'audit' && (
                    <DigitalAuditTool
                        audit={audit}
                        onUpdateFinding={handleUpdateFinding}
                        onCompleteAudit={() => alert('Audit Completed! Report Generated.')}
                    />
                )}

                {activeTab === 'incidents' && (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">سجل الحوادث والإصابات</h3>
                        <p className="text-gray-500 mt-2 mb-6">يمكنك هنا استعراض سجل الحوادث السابق أو إضافة بلاغ جديد.</p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline">عرض السجل</Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white">
                                <AlertTriangle className="w-4 h-4 ml-2" />
                                بلاغ جديد
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
