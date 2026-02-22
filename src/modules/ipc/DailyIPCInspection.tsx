import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, CheckCircle, XCircle, Camera, Save,
    AlertTriangle, Loader2, ChevronLeft, MapPin
} from 'lucide-react';
import { ipcService, Location, ChecklistTemplate } from '../../services/ipcService';

// Checklist Item Interface
interface ChecklistItem {
    id: string;
    label: string;
    category: string;
    weight: number;
    isCompliant: boolean | null;
}

// Category Labels
const CATEGORIES: Record<string, { label: string; icon: string }> = {
    '5_moments': { label: 'اللحظات الخمس لنظافة الأيدي', icon: '🖐️' },
    'supplies': { label: 'المستلزمات', icon: '🧴' },
    'ppe': { label: 'معدات الوقاية الشخصية', icon: '🧤' },
    'waste': { label: 'إدارة النفايات', icon: '🗑️' },
    'environment': { label: 'البيئة', icon: '🏥' },
};

export const DailyIPCInspection: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [locations, setLocations] = useState<Location[]>([]);
    const [_templates, setTemplates] = useState<ChecklistTemplate[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedShift, setSelectedShift] = useState<string>('صباحي');
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [notes, setNotes] = useState('');
    const [correctiveActions, setCorrectiveActions] = useState('');
    const [inspectorName, setInspectorName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [complianceScore, setComplianceScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [locs, temps] = await Promise.all([
                    ipcService.getLocations(),
                    ipcService.getChecklistTemplates()
                ]);
                setLocations(locs);
                setTemplates(temps);

                // Initialize checklist from first template
                if (temps.length > 0) {
                    const template = temps[0];
                    const items: ChecklistItem[] = Object.entries(template.checklist_items).map(([id, item]) => ({
                        id,
                        label: item.ar,
                        category: item.category,
                        weight: item.weight,
                        isCompliant: null
                    }));
                    setChecklist(items);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate compliance score
    useEffect(() => {
        const answered = checklist.filter(item => item.isCompliant !== null);
        const compliant = checklist.filter(item => item.isCompliant === true);

        setAnsweredCount(answered.length);

        if (answered.length > 0) {
            const totalWeight = checklist.reduce((sum, item) => sum + item.weight, 0);
            const achievedWeight = compliant.reduce((sum, item) => sum + item.weight, 0);
            setComplianceScore(Math.round((achievedWeight / totalWeight) * 100));
        } else {
            setComplianceScore(0);
        }
    }, [checklist]);

    // Toggle item compliance
    const handleToggle = useCallback((id: string, value: boolean) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, isCompliant: value } : item
        ));
    }, []);

    // Submit inspection
    const handleSubmit = async () => {
        if (!selectedLocation) {
            alert('الرجاء اختيار الموقع');
            return;
        }
        if (!inspectorName.trim()) {
            alert('الرجاء إدخال اسم المفتش');
            return;
        }

        if (answeredCount < checklist.length) {
            if (!confirm(`لم تُجب على جميع البنود (${answeredCount}/${checklist.length}). هل تريد المتابعة؟`)) {
                return;
            }
        }

        setSubmitting(true);
        try {
            const checklistData = checklist.reduce((acc, item) => ({
                ...acc,
                [item.id]: item.isCompliant
            }), {});

            const result = await ipcService.saveInspection({
                inspector_name: inspectorName,
                location_id: selectedLocation,
                shift: selectedShift,
                checklist_data: checklistData,
                non_compliance_details: notes || undefined,
                corrective_actions: correctiveActions || undefined,
                inspection_date: new Date().toISOString().split('T')[0],
                inspection_time: new Date().toTimeString().split(' ')[0],
            });

            if (result.success) {
                alert('✅ تم حفظ تقرير التفتيش بنجاح');
                navigate('/ipc');
            } else {
                alert('❌ حدث خطأ أثناء الحفظ');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('❌ حدث خطأ أثناء الحفظ');
        } finally {
            setSubmitting(false);
        }
    };

    // Group checklist by category
    const groupedChecklist = Object.entries(CATEGORIES).map(([key, cat]) => ({
        category: key,
        ...cat,
        items: checklist.filter(item => item.category === key)
    })).filter(group => group.items.length > 0);

    // Score color
    const getScoreColor = () => {
        if (complianceScore >= 85) return 'text-green-600 border-green-500';
        if (complianceScore >= 60) return 'text-yellow-600 border-yellow-500';
        return 'text-red-600 border-red-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">جاري تحميل نموذج التفتيش...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/ipc')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <Shield className="w-10 h-10" />
                        <div>
                            <h1 className="text-2xl font-bold">جولة مكافحة العدوى</h1>
                            <p className="text-white/80 text-sm mt-1">التفتيش اليومي - معايير BICSL</p>
                        </div>
                    </div>

                    {/* Compliance Score Circle */}
                    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 bg-white ${getScoreColor()}`}>
                        <span className="text-2xl font-bold">{complianceScore}</span>
                        <span className="text-xs">%</span>
                    </div>
                </div>
            </div>

            {/* Inspector & Location Selection */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Inspector Name */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            اسم المفتش <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={inspectorName}
                            onChange={(e) => setInspectorName(e.target.value)}
                            placeholder="أدخل اسمك"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            <MapPin className="w-4 h-4 inline ml-1" />
                            الموقع <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="">-- اختر الموقع --</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.is_high_risk && '⚠️ '}{loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Shift */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">الوردية</label>
                        <div className="flex gap-2">
                            {['صباحي', 'مسائي', 'ليلي'].map(shift => (
                                <button
                                    key={shift}
                                    onClick={() => setSelectedShift(shift)}
                                    className={`flex-1 py-3 px-2 rounded-xl font-medium transition-all text-sm ${selectedShift === shift
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                                        }`}
                                >
                                    {shift}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist by Category */}
            <div className="space-y-4 mb-6">
                {groupedChecklist.map(group => (
                    <div key={group.category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Category Header */}
                        <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100">
                            <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                                <span className="text-xl">{group.icon}</span>
                                {group.label}
                            </h3>
                        </div>

                        {/* Category Items */}
                        <div className="divide-y divide-gray-100">
                            {group.items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-gray-700 flex-1 ml-4">{item.label}</span>

                                    <div className="flex gap-2">
                                        {/* Compliant Button */}
                                        <button
                                            onClick={() => handleToggle(item.id, true)}
                                            className={`p-2.5 rounded-full transition-all duration-200 ${item.isCompliant === true
                                                    ? 'bg-green-500 text-white ring-2 ring-offset-2 ring-green-500 scale-110'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                                                }`}
                                            title="ممتثل"
                                        >
                                            <CheckCircle size={22} />
                                        </button>

                                        {/* Non-Compliant Button */}
                                        <button
                                            onClick={() => handleToggle(item.id, false)}
                                            className={`p-2.5 rounded-full transition-all duration-200 ${item.isCompliant === false
                                                    ? 'bg-red-500 text-white ring-2 ring-offset-2 ring-red-500 scale-110'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                                                }`}
                                            title="غير ممتثل"
                                        >
                                            <XCircle size={22} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes Section (when non-compliant items exist) */}
            {complianceScore < 100 && (
                <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        تفاصيل المخالفات
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[100px] resize-none"
                        placeholder="صف المخالفات المكتشفة بالتفصيل..."
                    />

                    <label className="block text-gray-700 font-semibold mb-2 mt-4">
                        الإجراءات التصحيحية الفورية
                    </label>
                    <textarea
                        value={correctiveActions}
                        onChange={(e) => setCorrectiveActions(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[80px] resize-none"
                        placeholder="ما الإجراءات التي تم اتخاذها فوراً؟"
                    />

                    {/* Attach Photos Button */}
                    <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-medium mt-4">
                        <Camera size={20} />
                        <span>إرفاق صور توثيقية</span>
                    </button>
                </div>
            )}

            {/* Progress Bar & Submit */}
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky bottom-4">
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>تقدم التفتيش</span>
                        <span>{answeredCount} / {checklist.length} بند</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${(answeredCount / checklist.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !selectedLocation || !inspectorName.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>جاري الحفظ...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>اعتماد التقرير وحفظ البيانات</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DailyIPCInspection;
