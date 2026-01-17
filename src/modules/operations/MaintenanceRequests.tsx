import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Wrench,
    Plus,
    ArrowLeft,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Filter,
    Search,
    Eye,
    Edit,
    Printer,
    FileSpreadsheet
} from 'lucide-react';
import { usePrint } from '../../hooks/usePrint';
import { useExport } from '../../hooks/useExport';
import { useToast } from '../../context/ToastContext';

interface MaintenanceRequest {
    id: string;
    request_number: string;
    asset_id: string;
    request_type: string;
    priority: string;
    title: string;
    description: string;
    status: string;
    reported_date: string;
    target_completion: string;
    estimated_cost: number;
    asset?: { name_ar: string; asset_code: string };
}

export const MaintenanceRequests: React.FC = () => {
    const { printTable, isPrinting } = usePrint();
    const { exportToExcel, isExporting } = useExport();
    const { showToast } = useToast();

    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        request_number: `MR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        title: '',
        description: '',
        request_type: 'corrective',
        priority: 'medium',
        target_completion: '',
        estimated_cost: 0
    });

    // Column definitions for export
    const REQUEST_COLUMNS = [
        { key: 'request_number', header: 'رقم الطلب' },
        { key: 'title', header: 'العنوان' },
        { key: 'request_type', header: 'النوع' },
        { key: 'priority', header: 'الأولوية' },
        { key: 'status', header: 'الحالة' },
        { key: 'reported_date', header: 'التاريخ' }
    ];

    // Export handlers
    const handlePrint = () => {
        if (requests.length === 0) {
            showToast('لا توجد بيانات للطباعة', 'error');
            return;
        }
        printTable(requests, REQUEST_COLUMNS, {
            title: 'طلبات الصيانة',
            subtitle: `التاريخ: ${new Date().toLocaleDateString('ar-SA')}`
        });
        showToast('تم فتح نافذة الطباعة', 'success');
    };

    const handleExportExcel = () => {
        if (requests.length === 0) {
            showToast('لا توجد بيانات للتصدير', 'error');
            return;
        }
        exportToExcel(requests, REQUEST_COLUMNS, { filename: 'طلبات_الصيانة' });
        showToast(`تم تصدير ${requests.length} طلب إلى Excel`, 'success');
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('om_maintenance_requests')
            .select(`
                *,
                asset:om_assets(name_ar, asset_code)
            `)
            .order('created_at', { ascending: false });

        if (!error) setRequests(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('om_maintenance_requests')
            .insert([formData]);

        if (!error) {
            setShowForm(false);
            fetchRequests();
        }
    };

    const typeLabels: Record<string, string> = {
        corrective: 'تصحيحية',
        preventive: 'وقائية',
        emergency: 'طارئة',
        improvement: 'تحسينية'
    };

    const priorityLabels: Record<string, string> = {
        low: 'منخفضة',
        medium: 'متوسطة',
        high: 'عالية',
        critical: 'حرجة'
    };

    const statusLabels: Record<string, string> = {
        pending: 'قيد الانتظار',
        approved: 'معتمد',
        in_progress: 'قيد التنفيذ',
        on_hold: 'معلق',
        completed: 'مكتمل',
        cancelled: 'ملغي',
        rejected: 'مرفوض'
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.title.includes(searchTerm) || req.request_number.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/operations" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        العودة للتشغيل والصيانة
                    </Link>
                    <h1 className="text-2xl font-bold text-hrsd-primary flex items-center gap-3">
                        <Wrench className="w-7 h-7" />
                        طلبات الصيانة
                    </h1>
                    <p className="text-gray-500 mt-1">إدارة وتتبع طلبات الصيانة والإصلاح</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 flex items-center gap-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    طلب صيانة جديد
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="البحث بالعنوان أو رقم الطلب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hrsd-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg"
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="approved">معتمد</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="completed">مكتمل</option>
                    </select>
                </div>
                {/* Export Toolbar */}
                <div className="flex items-center gap-2 border-r pr-3">
                    <button
                        onClick={handleExportExcel}
                        disabled={isExporting || requests.length === 0}
                        className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 flex items-center gap-2 text-sm disabled:opacity-50"
                        aria-label="تصدير إلى Excel"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={isPrinting || requests.length === 0}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm disabled:opacity-50"
                        aria-label="طباعة"
                    >
                        <Printer className="w-4 h-4" />
                        طباعة
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
                    <p className="text-sm text-gray-500">إجمالي الطلبات</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
                    <p className="text-sm text-gray-500">قيد الانتظار</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-indigo-600">{requests.filter(r => r.status === 'in_progress').length}</p>
                    <p className="text-sm text-gray-500">قيد التنفيذ</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'completed').length}</p>
                    <p className="text-sm text-gray-500">مكتملة</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-red-600">{requests.filter(r => r.priority === 'critical').length}</p>
                    <p className="text-sm text-gray-500">حرجة</p>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Wrench className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>لا توجد طلبات صيانة</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-4 text-right">رقم الطلب</th>
                                <th className="p-4 text-right">العنوان</th>
                                <th className="p-4 text-center">النوع</th>
                                <th className="p-4 text-center">الأولوية</th>
                                <th className="p-4 text-center">الحالة</th>
                                <th className="p-4 text-right">التاريخ</th>
                                <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-sm">{req.request_number}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{req.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{req.description}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                            {typeLabels[req.request_type]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(req.priority)}`}>
                                            {priorityLabels[req.priority]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(req.status)}`}>
                                            {statusLabels[req.status]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(req.reported_date).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-amber-600">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Wrench className="w-6 h-6 text-hrsd-primary" />
                            طلب صيانة جديد
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">رقم الطلب</label>
                                <input
                                    type="text"
                                    value={formData.request_number}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">عنوان الطلب *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="مثال: إصلاح مكيف غرفة 101"
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الوصف</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">نوع الصيانة</label>
                                    <select
                                        value={formData.request_type}
                                        onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {Object.entries(typeLabels).map(([k, v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">الأولوية</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {Object.entries(priorityLabels).map(([k, v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">تاريخ الإنجاز المتوقع</label>
                                    <input
                                        type="date"
                                        value={formData.target_completion}
                                        onChange={(e) => setFormData({ ...formData, target_completion: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">التكلفة التقديرية</label>
                                    <input
                                        type="number"
                                        value={formData.estimated_cost}
                                        onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90"
                                >
                                    إرسال الطلب
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceRequests;
