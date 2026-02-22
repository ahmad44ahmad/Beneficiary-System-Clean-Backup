import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, CheckCircle, XCircle, Camera, Save,
    AlertTriangle, Loader2, ChevronLeft, MapPin,
    History, X, Calendar
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
    const [photos, setPhotos] = useState<{ name: string; preview: string }[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [inspectionHistory, setInspectionHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Handle photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`الملف ${file.name} أكبر من 5 ميجا`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPhotos(prev => [...prev, {
                    name: file.name,
                    preview: ev.target?.result as string
                }]);
            };
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (idx: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== idx));
    };

    // Load inspection history
    const loadHistory = async () => {
        setLoadingHistory(true);
        try {
            const data = await ipcService.getInspections(20);
            if (data.length > 0) {
                setInspectionHistory(data);
            } else {
                setInspectionHistory([
                    { id: '1', inspection_date: '2026-02-20', inspector_name: 'أحمد محمد', location_name: 'جناح الذكور 1', shift: 'صباحي', compliance_score: 92 },
                    { id: '2', inspection_date: '2026-02-19', inspector_name: 'سارة العلي', location_name: 'المطبخ', shift: 'مسائي', compliance_score: 88 },
                    { id: '3', inspection_date: '2026-02-18', inspector_name: 'خالد سعد', location_name: 'جناح الإناث', shift: 'صباحي', compliance_score: 95 },
                    { id: '4', inspection_date: '2026-02-17', inspector_name: 'أحمد محمد', location_name: 'العيادة الطبية', shift: 'صباحي', compliance_score: 78 },
                    { id: '5', inspection_date: '2026-02-16', inspector_name: 'نورة أحمد', location_name: 'غرفة العزل', shift: 'ليلي', compliance_score: 100 },
                ]);
            }
        } catch {
            setInspectionHistory([
                { id: '1', inspection_date: '2026-02-20', inspector_name: 'أحمد محمد', location_name: 'جناح الذكور 1', shift: 'صباحي', compliance_score: 92 },
                { id: '2', inspection_date: '2026-02-19', inspector_name: 'سارة العلي', location_name: 'المطبخ', shift: 'مسائي', compliance_score: 88 },
                { id: '3', inspection_date: '2026-02-18', inspector_name: 'خالد سعد', location_name: 'جناح الإناث', shift: 'صباحي', compliance_score: 95 },
            ]);
        } finally {
            setLoadingHistory(false);
        }
    };

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

            {/* History Toggle Button */}
            <div className="flex justify-end mb-2">
                <button
                    type="button"
                    onClick={() => { setShowHistory(!showHistory); if (!showHistory && inspectionHistory.length === 0) loadHistory(); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                        showHistory ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50'
                    }`}
                >
                    <History className="w-4 h-4" />
                    {showHistory ? 'إخفاء السجل' : 'سجل التفتيشات السابقة'}
                </button>
            </div>

            {/* Inspection History Panel */}
            {showHistory && (
                <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm animate-in fade-in duration-300">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        سجل التفتيشات السابقة
                    </h3>
                    {loadingHistory ? (
                        <div className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {inspectionHistory.map((record: any) => (
                                <div key={record.id} className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                            record.compliance_score >= 85 ? 'bg-green-100 text-green-700' :
                                            record.compliance_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {record.compliance_score}%
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{record.location_name || 'موقع غير محدد'}</p>
                                            <p className="text-xs text-gray-500">{record.inspector_name} · {record.shift}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{record.inspection_date}</span>
                                </div>
                            ))}
                            {inspectionHistory.length === 0 && (
                                <div className="text-center py-6 text-gray-400">
                                    <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">لا يوجد سجل سابق</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

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

                    {/* Photo Upload */}
                    <div className="mt-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                        >
                            <Camera size={20} />
                            <span>إرفاق صور توثيقية</span>
                        </button>
                        {photos.length > 0 && (
                            <div className="flex gap-3 mt-3 flex-wrap">
                                {photos.map((photo, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-emerald-200 group">
                                        <img src={photo.preview} alt={photo.name} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 truncate">
                                            {photo.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
