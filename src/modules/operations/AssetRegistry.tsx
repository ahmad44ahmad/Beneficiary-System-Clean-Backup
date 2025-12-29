import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    ArrowLeft,
    AlertTriangle,
    CheckCircle2,
    Wrench,
    XCircle
} from 'lucide-react';

interface Asset {
    id: string;
    asset_code: string;
    name_ar: string;
    category_id: string;
    building: string;
    status: string;
    condition: string;
    acquisition_date: string;
    current_book_value: number;
}

export const AssetRegistry: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('om_assets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching assets:', error);
        } else {
            setAssets(data || []);
        }
        setLoading(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'under_maintenance': return <Wrench className="w-4 h-4 text-amber-500" />;
            case 'out_of_service': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'disposed': return <XCircle className="w-4 h-4 text-gray-400" />;
            default: return null;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            active: 'نشط',
            under_maintenance: 'تحت الصيانة',
            out_of_service: 'خارج الخدمة',
            disposed: 'تم التخلص منه',
            transferred: 'تم نقله'
        };
        return labels[status] || status;
    };

    const getConditionBadge = (condition: string) => {
        const styles: Record<string, string> = {
            excellent: 'bg-green-100 text-green-800',
            good: 'bg-blue-100 text-blue-800',
            fair: 'bg-yellow-100 text-yellow-800',
            poor: 'bg-orange-100 text-orange-800',
            unusable: 'bg-red-100 text-red-800'
        };
        const labels: Record<string, string> = {
            excellent: 'ممتاز',
            good: 'جيد',
            fair: 'مقبول',
            poor: 'ضعيف',
            unusable: 'غير صالح'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[condition] || 'bg-gray-100'}`}>
                {labels[condition] || condition}
            </span>
        );
    };

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name_ar.includes(searchTerm) ||
            asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
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
                        <Building2 className="w-7 h-7" />
                        سجل الأصول
                    </h1>
                    <p className="text-gray-500 mt-1">إدارة وتتبع جميع أصول المركز</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 flex items-center gap-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    إضافة أصل جديد
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو الرمز..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hrsd-primary focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hrsd-primary"
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="under_maintenance">تحت الصيانة</option>
                        <option value="out_of_service">خارج الخدمة</option>
                        <option value="disposed">تم التخلص منه</option>
                    </select>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-blue-600">{assets.filter(a => a.status === 'active').length}</p>
                    <p className="text-sm text-gray-500">أصول نشطة</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-amber-600">{assets.filter(a => a.status === 'under_maintenance').length}</p>
                    <p className="text-sm text-gray-500">تحت الصيانة</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-red-600">{assets.filter(a => a.status === 'out_of_service').length}</p>
                    <p className="text-sm text-gray-500">خارج الخدمة</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-hrsd-primary">
                        {assets.reduce((sum, a) => sum + (a.current_book_value || 0), 0).toLocaleString()} ر.س
                    </p>
                    <p className="text-sm text-gray-500">إجمالي القيمة</p>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
                ) : filteredAssets.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>لا توجد أصول مسجلة</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 text-hrsd-primary hover:underline"
                        >
                            إضافة أول أصل
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-4 text-right">رمز الأصل</th>
                                <th className="p-4 text-right">اسم الأصل</th>
                                <th className="p-4 text-center">الموقع</th>
                                <th className="p-4 text-center">الحالة</th>
                                <th className="p-4 text-center">الحالة الفنية</th>
                                <th className="p-4 text-right">القيمة الدفترية</th>
                                <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-sm">{asset.asset_code}</td>
                                    <td className="p-4 font-medium">{asset.name_ar}</td>
                                    <td className="p-4 text-center text-sm text-gray-600">{asset.building || '-'}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {getStatusIcon(asset.status)}
                                            <span className="text-sm">{getStatusLabel(asset.status)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        {asset.condition && getConditionBadge(asset.condition)}
                                    </td>
                                    <td className="p-4 text-right font-medium">
                                        {asset.current_book_value?.toLocaleString() || '-'} ر.س
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-amber-600">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Modal Placeholder */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">إضافة أصل جديد</h2>
                        <p className="text-gray-500 mb-6">سيتم تفعيل هذه الميزة قريباً</p>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetRegistry;
