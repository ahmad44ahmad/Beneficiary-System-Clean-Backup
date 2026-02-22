import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Syringe, ChevronLeft, Plus, Search,
    Calendar,
    User, Users, RefreshCw
} from 'lucide-react';
import { ipcService, Immunization } from '../../services/ipcService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

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

// Add Vaccination Modal
const AddVaccinationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Immunization>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [personType, setPersonType] = useState<'staff' | 'beneficiary'>('staff');
    const [staffName, setStaffName] = useState('');
    const [beneficiaryId, setBeneficiaryId] = useState('');
    const [vaccineCode, setVaccineCode] = useState('');
    const [doseNumber, setDoseNumber] = useState(1);
    const [dateAdministered, setDateAdministered] = useState(new Date().toISOString().split('T')[0]);
    const [adverseReaction, setAdverseReaction] = useState(false);
    const [reactionNotes, setReactionNotes] = useState('');
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const selectedVaccine = VACCINE_TYPES.find(v => v.code === vaccineCode);

    const handleSubmit = async () => {
        if (!vaccineCode) { alert('الرجاء اختيار اللقاح'); return; }
        if (personType === 'staff' && !staffName.trim()) { alert('الرجاء إدخال اسم الموظف'); return; }
        if (personType === 'beneficiary' && !beneficiaryId.trim()) { alert('الرجاء إدخال رقم المستفيد'); return; }

        setSaving(true);
        const totalDoses = selectedVaccine?.doses || 1;
        const isComplete = doseNumber >= totalDoses;

        const data: Partial<Immunization> = {
            person_type: personType,
            staff_name: personType === 'staff' ? staffName : undefined,
            beneficiary_id: personType === 'beneficiary' ? beneficiaryId : undefined,
            vaccine_code: vaccineCode,
            vaccine_name: selectedVaccine?.name_ar || selectedVaccine?.name || '',
            dose_number: doseNumber,
            total_doses: totalDoses,
            date_administered: dateAdministered,
            immunity_status: isComplete ? 'immune' : 'pending',
            adverse_reaction: adverseReaction,
            next_due_date: !isComplete ? (() => {
                const d = new Date(dateAdministered);
                d.setMonth(d.getMonth() + 2);
                return d.toISOString().split('T')[0];
            })() : undefined,
        };

        await onSave(data);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b bg-blue-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <Syringe className="w-6 h-6 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-800">تسجيل تحصين جديد</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Person Type */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">نوع الشخص</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPersonType('staff')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                    personType === 'staff' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                موظف
                            </button>
                            <button
                                type="button"
                                onClick={() => setPersonType('beneficiary')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                    personType === 'beneficiary' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                مستفيد
                            </button>
                        </div>
                    </div>

                    {/* Name / ID */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            {personType === 'staff' ? 'اسم الموظف' : 'رقم المستفيد'}
                        </label>
                        {personType === 'staff' ? (
                            <input
                                type="text"
                                value={staffName}
                                onChange={e => setStaffName(e.target.value)}
                                placeholder="أدخل اسم الموظف"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <input
                                type="text"
                                value={beneficiaryId}
                                onChange={e => setBeneficiaryId(e.target.value)}
                                placeholder="أدخل رقم المستفيد"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        )}
                    </div>

                    {/* Vaccine Selection */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">اللقاح</label>
                        <div className="grid grid-cols-2 gap-2">
                            {VACCINE_TYPES.map(vaccine => (
                                <button
                                    key={vaccine.code}
                                    type="button"
                                    onClick={() => {
                                        setVaccineCode(vaccine.code);
                                        setDoseNumber(1);
                                    }}
                                    className={`p-3 rounded-xl border-2 text-right transition-all ${
                                        vaccineCode === vaccine.code
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="font-medium text-sm">{vaccine.name_ar}</div>
                                    <div className="text-xs text-gray-500 mt-1">{vaccine.code} · {vaccine.doses} جرعة</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dose Number & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">رقم الجرعة</label>
                            <select
                                value={doseNumber}
                                onChange={e => setDoseNumber(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {Array.from({ length: selectedVaccine?.doses || 3 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>الجرعة {n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">تاريخ التطعيم</label>
                            <input
                                type="date"
                                value={dateAdministered}
                                onChange={e => setDateAdministered(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Adverse Reaction */}
                    <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl cursor-pointer">
                        <input
                            type="checkbox"
                            checked={adverseReaction}
                            onChange={e => setAdverseReaction(e.target.checked)}
                            className="w-5 h-5 rounded text-red-500 focus:ring-red-500"
                        />
                        <span className="font-medium text-red-800">تم رصد رد فعل تحسسي</span>
                    </label>
                    {adverseReaction && (
                        <textarea
                            value={reactionNotes}
                            onChange={e => setReactionNotes(e.target.value)}
                            placeholder="صف رد الفعل التحسسي..."
                            className="w-full p-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none min-h-[70px] resize-none text-sm"
                        />
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                حفظ التحصين
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ImmunizationTracker: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [immunizations, setImmunizations] = useState<Immunization[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'staff' | 'beneficiary'>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [_showAddModal, setShowAddModal] = useState(false);

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

    const handleSaveVaccination = async (data: Partial<Immunization>) => {
        try {
            const newRecord: Immunization = {
                id: `new-${Date.now()}`,
                person_type: data.person_type || 'staff',
                staff_name: data.staff_name,
                beneficiary_id: data.beneficiary_id,
                vaccine_code: data.vaccine_code || '',
                vaccine_name: data.vaccine_name || '',
                dose_number: data.dose_number || 1,
                total_doses: data.total_doses || 1,
                date_administered: data.date_administered || new Date().toISOString().split('T')[0],
                immunity_status: data.immunity_status || 'pending',
                adverse_reaction: data.adverse_reaction || false,
                next_due_date: data.next_due_date,
            };
            setImmunizations(prev => [newRecord, ...prev]);
            setShowAddModal(false);
            try {
                await ipcService.saveImmunization(newRecord);
            } catch {
                // Demo mode fallback
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل سجل التحصينات..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Add Vaccination Modal */}
            <AddVaccinationModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleSaveVaccination}
            />
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
