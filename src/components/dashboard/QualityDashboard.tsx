import React, { useEffect, useState } from 'react';
import {
    FileText,
    AlertTriangle,
    CheckCircle2,
    BarChart2,
    Shield,
    Users,
    TrendingUp
} from 'lucide-react';
import { getOvrReports, getOvrStats, OvrReport, OvrStats } from '../../services/ovrService';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

export const QualityDashboard: React.FC = () => {
    const [reports, setReports] = useState<OvrReport[]>([]);
    const [stats, setStats] = useState<OvrStats | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [r, s] = await Promise.all([getOvrReports(), getOvrStats()]);
            setReports(r);
            setStats(s);
        };
        fetchData();
    }, []);

    const getSeverityBadge = (severity: string) => {
        const styles: Record<string, string> = {
            'near_miss': 'bg-yellow-100 text-yellow-800',
            'minor': 'bg-green-100 text-green-800',
            'moderate': 'bg-orange-100 text-orange-800',
            'major': 'bg-red-100 text-red-800',
            'sentinel': 'bg-red-900 text-white'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[severity] || 'bg-gray-100'}`}>{severity}</span>;
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-8 h-8 text-teal-600" />
                        لوحة الجودة وسلامة المرضى
                    </h1>
                    <p className="text-gray-500 mt-1">مراقبة مؤشرات الأداء (KPIs) وتقارير الحوادث (OVR)</p>
                </div>
                <Link
                    to="/ovr/new"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <AlertTriangle className="w-4 h-4" />
                    تبليغ عن حادث جديد
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-white border-r-4 border-r-blue-500">
                    <div className="bg-blue-50 p-3 rounded-full"><FileText className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">إجمالي البلاغات</p>
                        <p className="text-2xl font-bold">{stats?.totalReports || '-'}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white border-r-4 border-r-red-500">
                    <div className="bg-red-50 p-3 rounded-full"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">بلاغات مفتوحة</p>
                        <p className="text-2xl font-bold">{stats?.openReports || '-'}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white border-r-4 border-r-purple-500">
                    <div className="bg-purple-50 p-3 rounded-full"><Users className="w-6 h-6 text-purple-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">نسبة التبليغ المجهول</p>
                        <p className="text-2xl font-bold">{stats?.anonymousRate || '-'}%</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white border-r-4 border-r-green-500">
                    <div className="bg-green-50 p-3 rounded-full"><BarChart2 className="w-6 h-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">متوسط وقت الإغلاق</p>
                        <p className="text-2xl font-bold">{stats?.avgResolutionTimeDays || '-'} يوم</p>
                    </div>
                </Card>
            </div>

            {/* Recent Reports Table */}
            <Card className="overflow-hidden">
                <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">أحدث البلاغات المسجلة</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">عرض الكل</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm">
                                <th className="p-4 font-medium">رقم البلاغ</th>
                                <th className="p-4 font-medium">التاريخ</th>
                                <th className="p-4 font-medium">التصنيف</th>
                                <th className="p-4 font-medium">الوصف</th>
                                <th className="p-4 font-medium">الخطورة</th>
                                <th className="p-4 font-medium">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-xs">{report.id}</td>
                                    <td className="p-4 text-sm">{report.incidentDate}</td>
                                    <td className="p-4 text-sm font-medium">{report.category}</td>
                                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={report.description}>
                                        {report.description}
                                    </td>
                                    <td className="p-4">{getSeverityBadge(report.severity)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${report.status === 'open' ? 'bg-red-50 text-red-700 border-red-200' :
                                                report.status === 'investigating' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                            {report.status === 'open' && <AlertTriangle className="w-3 h-3" />}
                                            {report.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Just Culture Info Section */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">ثقافة العدالة (Just Culture)</h2>
                    <p className="text-teal-100 opacity-90 max-w-2xl">
                        نحن نشجع على الإبلاغ عن الأخطاء الوشيكة (Near Misses) لأنها فرصتنا الذهبية للتعلم ومنع الحوادث المستقبلية.
                        <br />
                        <b>لا عقاب على الخطأ البشري غير المقصود.</b>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm transition-all border border-white/20">
                        سياسة الجودة
                    </button>
                    <button className="bg-white text-teal-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                        تدريب الفريق
                    </button>
                </div>
            </div>
        </div>
    );
};
