import React, { useEffect, useState } from 'react';
import {
    FileText,
    AlertTriangle,
    BarChart2,
    Shield,
    Users,
    CheckCircle2
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
            'near_miss': 'bg-[#FCB614]/10 text-[#FCB614]',
            'minor': 'bg-[#2BB574]/15 text-[#0F3144]',
            'moderate': 'bg-[#F7941D]/15 text-[#0F3144]',
            'major': 'bg-[#DC2626]/15 text-[#7F1D1D]',
            'sentinel': 'bg-[#7F1D1D] text-white'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[severity] || 'bg-gray-100'}`}>{severity}</span>;
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-8 h-8 text-[#269798]" />
                        لوحة الجودة وسلامة المستفيدين
                    </h1>
                    <p className="text-gray-500 mt-1">مراقبة مؤشرات الأداء (KPIs) وتقارير الحوادث (OVR)</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        to="/quality/ncr-capa"
                        className="bg-[#0F3144] text-white px-4 py-2 rounded-lg hover:bg-[#1a5270] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        سجل NCR/CAPA
                    </Link>
                    <Link
                        to="/ovr/new"
                        className="bg-[#DC2626] text-white px-4 py-2 rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        تبليغ عن حادث جديد
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-white border-e-4 border-e-blue-500">
                    <div className="bg-[#269798]/10 p-3 rounded-full"><FileText className="w-6 h-6 text-[#269798]" /></div>
                    <div>
                        <p className="text-sm text-gray-500">إجمالي البلاغات</p>
                        <p className="text-2xl font-bold">{stats?.totalReports || '-'}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white border-e-4 border-e-red-500">
                    <div className="bg-[#DC2626]/10 p-3 rounded-full"><AlertTriangle className="w-6 h-6 text-[#DC2626]" /></div>
                    <div>
                        <p className="text-sm text-gray-500">بلاغات مفتوحة</p>
                        <p className="text-2xl font-bold">{stats?.openReports || '-'}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white border-e-4 border-e-purple-500">
                    <div className="bg-[#FCB614]/10 p-3 rounded-full"><Users className="w-6 h-6 text-[#FCB614]" /></div>
                    <div>
                        <p className="text-sm text-gray-500">نسبة التبليغ المجهول</p>
                        <p className="text-2xl font-bold">{stats?.anonymousRate || '-'}%</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-white border-e-4 border-e-green-500">
                    <div className="bg-[#2BB574]/10 p-3 rounded-full"><BarChart2 className="w-6 h-6 text-[#2BB574]" /></div>
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
                    <button className="text-sm text-[#269798] hover:text-[#269798]">عرض الكل</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-[14px]">
                                <th className="p-4 font-semibold">رقم البلاغ</th>
                                <th className="p-4 font-semibold">التاريخ</th>
                                <th className="p-4 font-semibold">التصنيف</th>
                                <th className="p-4 font-semibold">الوصف</th>
                                <th className="p-4 font-semibold">الخطورة</th>
                                <th className="p-4 font-semibold">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-[13px] font-semibold text-gray-900">{report.id}</td>
                                    <td className="p-4 text-[14px]">{report.incidentDate}</td>
                                    <td className="p-4 text-[14px] font-medium">{report.category}</td>
                                    <td className="p-4 text-[14px] text-gray-600 max-w-xs truncate" title={report.description}>
                                        {report.description}
                                    </td>
                                    <td className="p-4">{getSeverityBadge(report.severity)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-md border ${report.status === 'open' ? 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30' :
                                                report.status === 'investigating' ? 'bg-[#269798]/10 text-[#269798] border-[#269798]/30' :
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
            <div className="bg-[#0F3144] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">ثقافة العدالة (Just Culture)</h2>
                    <p className="text-[#269798]/10 opacity-90 max-w-2xl">
                        نحن نشجع على الإبلاغ عن الأخطاء الوشيكة (Near Misses) لأنها فرصتنا الذهبية للتعلم ومنع الحوادث المستقبلية.
                        <br />
                        <b>لا عقاب على الخطأ البشري غير المقصود.</b>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm transition-all border border-white/20">
                        سياسة الجودة
                    </button>
                    <button className="bg-white text-[#0F3144] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                        تدريب الفريق
                    </button>
                </div>
            </div>
        </div>
    );
};
