import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Syringe, ChevronLeft, Plus, Search, Filter,
    CheckCircle, AlertCircle, Clock, Calendar,
    User, Users, RefreshCw, Download
} from 'lucide-react';
import { ipcService, Immunization } from '../../services/ipcService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Vaccine Types
const VACCINE_TYPES = [
    { code: 'HBV', name: 'التهاب الكبد B', name_ar: 'التهاب الكبد الوبائي ب', doses: 3 },
    { code: 'FLU', name: 'الإنفلونزا', name_ar: 'الأنفلونزا الموسمية', doses: 1 },
    { code: 'COVID', name: 'COVID-19', name_ar: 'كوفيد-19', doses: 2 },
    { code: 'TDAP', name: 'الكزاز والدفتيريا', name_ar: 'الكزاز والخناق والسعال الديكي', doses: 1 },
    { code: 'MMR', name: 'الحصبة', name_ar: 'الحصبة والنكاف والحصبة الألمانية', doses: 2 },
    { code: 'VAR', name: 'جدري الماء', name_ar: 'الحماق', doses: 2 },
    { code: 'PNEU', name: 'المكورات الرئوية', name_ar: 'التهاب الرئة', doses: 1 },
];

// Demo Data
const DEMO_IMMUNIZATIONS: Immunization[] = [
    { id: '1', person_type: 'staff', staff_name: 'أحمد محمد', vaccine_code: 'HBV', vaccine_name: 'التهاب الكبد B', dose_number: 3, total_doses: 3, date_administered: '2025-06-15', immunity_status: 'immune', adverse_reaction: false },
    { id: '2', person_type: 'staff', staff_name: 'فاطمة علي', vaccine_code: 'HBV', vaccine_name: 'التهاب الكبد B', dose_number: 2, total_doses: 3, date_administered: '2025-09-01', next_due_date: '2026-03-01', immunity_status: 'pending', adverse_reaction: false },
    { id: '3', person_type: 'staff', staff_name: 'خالد سعد', vaccine_code: 'FLU', vaccine_name: 'الإنفلونزا', dose_number: 1, total_doses: 1, date_administered: '2025-10-15', immunity_status: 'immune', adverse_reaction: false },
    { id: '4', person_type: 'beneficiary', beneficiary_id: 'b1', vaccine_code: 'COVID', vaccine_name: 'كوفيد-19', dose_number: 2, total_doses: 2, date_administered: '2025-04-20', immunity_status: 'immune', adverse_reaction: false },
    { id: '5', person_type: 'staff', staff_name: 'نورة أحمد', vaccine_code: 'HBV', vaccine_name: 'التهاب الكبد B', dose_number: 1, total_doses: 3, date_administered: '2025-11-01', next_due_date: '2026-01-01', immunity_status: 'pending', adverse_reaction: false },
    { id: '6', person_type: 'staff', staff_name: 'محمد العتيبي', vaccine_code: 'TDAP', vaccine_name: 'الكزاز', dose_number: 1, total_doses: 1, date_administered: '2024-06-01', immunity_status: 'expired', adverse_reaction: false },
];

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        immune: 'bg-green-100 text-green-700 border-green-300',
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        expired: 'bg-red-100 text-red-700 border-red-300',
        non_responder: 'bg-gray-100 text-gray-700 border-gray-300',
        declined: 'bg-gray-100 text-gray-600 border-gray-300',
    };

    const labels: Record<string, string> = {
        immune: '✅ محصّن',
        pending: '⏳ قيد الاكتمال',
        expired: '⚠️ منتهي',
        non_responder: 'غير مستجيب',
        declined: 'رفض',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm border ${styles[status] || styles.pending}`}>
            {labels[status] || status}
        </span>
    );
};

export const ImmunizationTracker: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [immunizations, setImmunizations] = useState<Immunization[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'staff' | 'beneficiary'>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await ipcService.getImmunizations();
            setImmunizations(data.length > 0 ? data : DEMO_IMMUNIZATIONS);
        } catch {
            setImmunizations(DEMO_IMMUNIZATIONS);
        } finally {
            setLoading(false);
        }
    };

    // Filter and search
    const filteredData = immunizations.filter(imm => {
        if (filterType !== 'all' && imm.person_type !== filterType) return false;
        if (filterStatus !== 'all' && imm.immunity_status !== filterStatus) return false;
        if (searchTerm) {
            const name = imm.staff_name || imm.beneficiary_id || '';
            if (!name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        }
        return true;
    });

    // Stats
    const stats = {
        total: immunizations.length,
        immune: immunizations.filter(i => i.immunity_status === 'immune').length,
        pending: immunizations.filter(i => i.immunity_status === 'pending').length,
        expired: immunizations.filter(i => i.immunity_status === 'expired').length,
        dueThisMonth: immunizations.filter(i => {
            if (!i.next_due_date) return false;
            const due = new Date(i.next_due_date);
            const now = new Date();
            return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
        }).length,
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل سجل التحصينات..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/ipc')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Syringe className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">سجل التحصينات</h1>
                        <p className="text-gray-500">متابعة حالة المناعة للموظفين والمستفيدين</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        تحديث
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        تسجيل تحصين
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-blue-500">
                    <p className="text-gray-500 text-sm">إجمالي السجلات</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-green-500">
                    <p className="text-gray-500 text-sm">محصّن بالكامل</p>
                    <p className="text-2xl font-bold text-green-600">{stats.immune}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-yellow-500">
                    <p className="text-gray-500 text-sm">قيد الاكتمال</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-red-500">
                    <p className="text-gray-500 text-sm">منتهي الصلاحية</p>
                    <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-orange-500">
                    <p className="text-gray-500 text-sm">مستحق هذا الشهر</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.dueThisMonth}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="بحث بالاسم..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg transition-all ${filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilterType('staff')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${filterType === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                        <Users className="w-4 h-4" />
                        الموظفين
                    </button>
                    <button
                        onClick={() => setFilterType('beneficiary')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${filterType === 'beneficiary' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                        <User className="w-4 h-4" />
                        المستفيدين
                    </button>
                </div>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="all">جميع الحالات</option>
                    <option value="immune">محصّن</option>
                    <option value="pending">قيد الاكتمال</option>
                    <option value="expired">منتهي</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-600">الاسم</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">النوع</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">اللقاح</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">الجرعة</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">تاريخ التطعيم</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">الجرعة التالية</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(imm => (
                                <tr key={imm.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {imm.staff_name || `مستفيد #${imm.beneficiary_id?.slice(-4)}`}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${imm.person_type === 'staff' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                                            {imm.person_type === 'staff' ? 'موظف' : 'مستفيد'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{imm.vaccine_name}</td>
                                    <td className="px-4 py-3 text-gray-600">{imm.dose_number}/{imm.total_doses}</td>
                                    <td className="px-4 py-3 text-gray-600">{imm.date_administered}</td>
                                    <td className="px-4 py-3">
                                        {imm.next_due_date ? (
                                            <span className="flex items-center gap-1 text-orange-600">
                                                <Calendar className="w-4 h-4" />
                                                {imm.next_due_date}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={imm.immunity_status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Syringe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>لا توجد سجلات مطابقة</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImmunizationTracker;
