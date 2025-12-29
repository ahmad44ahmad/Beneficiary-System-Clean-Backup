import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Trash2,
    Plus,
    ArrowLeft,
    Recycle,
    AlertTriangle,
    FileText,
    Calendar,
    Save
} from 'lucide-react';

interface WasteRecord {
    id: string;
    record_date: string;
    waste_type: string;
    source_location: string;
    quantity: number;
    unit: string;
    disposal_method: string;
    contractor_name: string;
}

export const WasteManagement: React.FC = () => {
    const [records, setRecords] = useState<WasteRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        record_date: new Date().toISOString().split('T')[0],
        waste_type: 'general',
        source_location: '',
        quantity: 0,
        unit: 'kg',
        disposal_method: 'landfill',
        contractor_name: '',
        notes: ''
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('om_waste_records')
            .select('*')
            .order('record_date', { ascending: false })
            .limit(50);

        if (!error) setRecords(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('om_waste_records')
            .insert([formData]);

        if (!error) {
            setShowForm(false);
            fetchRecords();
            setFormData({
                record_date: new Date().toISOString().split('T')[0],
                waste_type: 'general',
                source_location: '',
                quantity: 0,
                unit: 'kg',
                disposal_method: 'landfill',
                contractor_name: '',
                notes: ''
            });
        }
    };

    const wasteTypes = [
        { value: 'general', label: 'نفايات عامة', color: 'bg-gray-500' },
        { value: 'recyclable', label: 'قابلة للتدوير', color: 'bg-green-500' },
        { value: 'hazardous', label: 'خطرة', color: 'bg-red-500' },
        { value: 'electronic', label: 'إلكترونية', color: 'bg-blue-500' },
        { value: 'confidential', label: 'سرية', color: 'bg-purple-500' }
    ];

    const disposalMethods = [
        { value: 'landfill', label: 'ردم' },
        { value: 'recycling', label: 'إعادة تدوير' },
        { value: 'incineration', label: 'حرق' },
        { value: 'special_treatment', label: 'معالجة خاصة' },
        { value: 'reuse', label: 'إعادة استخدام' }
    ];

    // Calculate monthly totals
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyRecords = records.filter(r => r.record_date.startsWith(currentMonth));
    const monthlyTotal = monthlyRecords.reduce((sum, r) => sum + (r.quantity || 0), 0);

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
                        <Trash2 className="w-7 h-7" />
                        إدارة المخلفات
                    </h1>
                    <p className="text-gray-500 mt-1">تتبع وتوثيق جميع أنواع المخلفات</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 flex items-center gap-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    تسجيل مخلفات
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <Trash2 className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{monthlyTotal} كجم</p>
                            <p className="text-sm text-gray-500">إجمالي هذا الشهر</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Recycle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {monthlyRecords.filter(r => r.waste_type === 'recyclable').reduce((sum, r) => sum + r.quantity, 0)} كجم
                            </p>
                            <p className="text-sm text-gray-500">مُعاد تدويرها</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {monthlyRecords.filter(r => r.waste_type === 'hazardous').reduce((sum, r) => sum + r.quantity, 0)} كجم
                            </p>
                            <p className="text-sm text-gray-500">مخلفات خطرة</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{monthlyRecords.length}</p>
                            <p className="text-sm text-gray-500">عدد السجلات</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-lg">سجل المخلفات</h2>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
                ) : records.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Trash2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>لا توجد سجلات</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3 text-right">التاريخ</th>
                                <th className="p-3 text-right">النوع</th>
                                <th className="p-3 text-right">المصدر</th>
                                <th className="p-3 text-center">الكمية</th>
                                <th className="p-3 text-center">طريقة التخلص</th>
                                <th className="p-3 text-right">المقاول</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="p-3">{new Date(record.record_date).toLocaleDateString('ar-SA')}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${wasteTypes.find(w => w.value === record.waste_type)?.color
                                            }`}>
                                            {wasteTypes.find(w => w.value === record.waste_type)?.label}
                                        </span>
                                    </td>
                                    <td className="p-3">{record.source_location}</td>
                                    <td className="p-3 text-center font-medium">{record.quantity} {record.unit}</td>
                                    <td className="p-3 text-center">
                                        {disposalMethods.find(d => d.value === record.disposal_method)?.label}
                                    </td>
                                    <td className="p-3">{record.contractor_name || '-'}</td>
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
                            <Trash2 className="w-6 h-6 text-hrsd-primary" />
                            تسجيل مخلفات جديدة
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">التاريخ</label>
                                    <input
                                        type="date"
                                        value={formData.record_date}
                                        onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">نوع المخلفات</label>
                                    <select
                                        value={formData.waste_type}
                                        onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {wasteTypes.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">مصدر المخلفات</label>
                                    <input
                                        type="text"
                                        value={formData.source_location}
                                        onChange={(e) => setFormData({ ...formData, source_location: e.target.value })}
                                        placeholder="مثال: مبنى الإدارة"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-1">الكمية</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-sm font-medium mb-1">الوحدة</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        >
                                            <option value="kg">كجم</option>
                                            <option value="ton">طن</option>
                                            <option value="liter">لتر</option>
                                            <option value="unit">وحدة</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">طريقة التخلص</label>
                                    <select
                                        value={formData.disposal_method}
                                        onChange={(e) => setFormData({ ...formData, disposal_method: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {disposalMethods.map(d => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">اسم المقاول</label>
                                    <input
                                        type="text"
                                        value={formData.contractor_name}
                                        onChange={(e) => setFormData({ ...formData, contractor_name: e.target.value })}
                                        placeholder="اختياري"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}
                                />
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
                                    className="px-6 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WasteManagement;
