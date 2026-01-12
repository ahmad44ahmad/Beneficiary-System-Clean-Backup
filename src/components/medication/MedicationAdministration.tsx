import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pill, Clock, AlertTriangle, CheckCircle, X, User,
    Activity, Droplet, ThermometerSun, Heart, Search,
    ChevronDown, ChevronUp, Camera, FileText, AlertCircle
} from 'lucide-react';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    route: string;
    frequency: string;
    scheduledTime: string;
    status: 'pending' | 'overdue' | 'administered' | 'skipped' | 'refused';
    beneficiaryName: string;
    beneficiaryId: string;
    room: string;
    preRequirements?: string[];
    allergies?: string[];
    interactions?: string[];
    specialInstructions?: string;
    delayMinutes?: number;
}

const mockMedications: Medication[] = [
    { id: '1', name: 'أنسولين', dosage: '10 وحدات', route: 'حقن تحت الجلد', frequency: 'قبل الوجبات', scheduledTime: '11:00', status: 'pending', beneficiaryName: 'محمد العمري', beneficiaryId: 'B001', room: 'غ-101', preRequirements: ['قياس السكر'], allergies: [], interactions: [], specialInstructions: 'حقن في البطن' },
    { id: '2', name: 'أملوديبين', dosage: '5 ملغ', route: 'فموي', frequency: 'مرة يومياً', scheduledTime: '10:30', status: 'overdue', beneficiaryName: 'فاطمة سعيد', beneficiaryId: 'B002', room: 'غ-102', preRequirements: ['قياس الضغط'], allergies: ['البنسلين'], interactions: [], delayMinutes: 45 },
    { id: '3', name: 'ميتفورمين', dosage: '500 ملغ', route: 'فموي', frequency: 'مرتين يومياً', scheduledTime: '11:30', status: 'pending', beneficiaryName: 'خالد الدوسري', beneficiaryId: 'B003', room: 'غ-107', preRequirements: [], allergies: [], interactions: ['تجنب الكحول'], specialInstructions: 'مع الطعام' },
    { id: '4', name: 'وارفارين', dosage: '2.5 ملغ', route: 'فموي', frequency: 'مرة يومياً', scheduledTime: '12:00', status: 'pending', beneficiaryName: 'نورة محمد', beneficiaryId: 'B004', room: 'غ-104', preRequirements: ['فحص INR أسبوعي'], allergies: [], interactions: ['تجنب فيتامين ك'], specialInstructions: 'مراقبة النزيف' },
];

const STATUS_CONFIG = {
    pending: { color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', label: 'قيد الانتظار' },
    overdue: { color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50', label: 'متأخر' },
    administered: { color: 'green', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50', label: 'تم الإعطاء' },
    skipped: { color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50', label: 'تم التخطي' },
    refused: { color: 'orange', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50', label: 'رفض' },
};

export const MedicationAdministration: React.FC = () => {
    const [medications, setMedications] = useState<Medication[]>(mockMedications);
    const [selectedMed, setSelectedMed] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);
    const [preReqChecked, setPreReqChecked] = useState<Record<string, boolean>>({});
    const [adminNote, setAdminNote] = useState('');

    const pendingCount = medications.filter(m => m.status === 'pending').length;
    const overdueCount = medications.filter(m => m.status === 'overdue').length;

    const filteredMeds = medications.filter(m => {
        const matchesSearch = m.beneficiaryName.includes(searchTerm) || m.name.includes(searchTerm);
        const matchesStatus = showCompleted || m.status === 'pending' || m.status === 'overdue';
        return matchesSearch && matchesStatus;
    });

    const handleAdminister = (medId: string) => {
        setMedications(prev => prev.map(m =>
            m.id === medId ? { ...m, status: 'administered' as const } : m
        ));
        setSelectedMed(null);
        setPreReqChecked({});
        setAdminNote('');
    };

    const handleSkip = (medId: string, reason: string) => {
        setMedications(prev => prev.map(m =>
            m.id === medId ? { ...m, status: 'skipped' as const } : m
        ));
        setSelectedMed(null);
    };

    const handleRefuse = (medId: string) => {
        setMedications(prev => prev.map(m =>
            m.id === medId ? { ...m, status: 'refused' as const } : m
        ));
        setSelectedMed(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Pill className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">شاشة إعطاء الأدوية</h1>
                            <p className="text-slate-400 text-sm">الحقوق الخمسة للإعطاء الآمن</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {overdueCount > 0 && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-2 flex items-center gap-2 animate-pulse">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 font-medium">{overdueCount} متأخر</span>
                            </div>
                        )}
                        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl px-4 py-2">
                            <span className="text-blue-400 font-medium">{pendingCount} قيد الانتظار</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Five Rights Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-4 mb-6 border border-purple-500/30"
            >
                <p className="text-purple-300 text-sm text-center">
                    ✓ المريض الصحيح • ✓ الدواء الصحيح • ✓ الجرعة الصحيحة • ✓ الطريق الصحيح • ✓ الوقت الصحيح
                </p>
            </motion.div>

            {/* Search & Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو الدواء..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                </div>
                <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className={`px-4 py-2 rounded-xl transition-colors ${showCompleted ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    {showCompleted ? 'إخفاء المكتملة' : 'عرض الكل'}
                </button>
            </div>

            {/* Medications List */}
            <div className="space-y-4">
                {filteredMeds.map((med, index) => {
                    const statusConfig = STATUS_CONFIG[med.status];
                    const isExpanded = selectedMed === med.id;
                    const allPreReqsMet = !med.preRequirements?.length || med.preRequirements.every(req => preReqChecked[req]);

                    return (
                        <motion.div
                            key={med.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`rounded-2xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} overflow-hidden ${med.status === 'overdue' ? 'ring-2 ring-red-500/50' : ''}`}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setSelectedMed(isExpanded ? null : med.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                                            <Pill className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-lg">{med.name}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bgColor} text-${statusConfig.color}-400`}>
                                                    {statusConfig.label}
                                                </span>
                                                {med.delayMinutes && (
                                                    <span className="text-red-400 text-xs flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        متأخر {med.delayMinutes} دقيقة
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-sm">{med.dosage} - {med.route}</p>
                                            <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {med.beneficiaryName}
                                                </span>
                                                <span>{med.room}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {med.scheduledTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {med.allergies && med.allergies.length > 0 && (
                                            <div className="bg-red-500/20 p-2 rounded-lg" title="حساسية">
                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                            </div>
                                        )}
                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-700"
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Warnings */}
                                            {(med.allergies?.length || med.interactions?.length) && (
                                                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 space-y-2">
                                                    {med.allergies?.map((allergy, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-red-400">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-sm">حساسية: {allergy}</span>
                                                        </div>
                                                    ))}
                                                    {med.interactions?.map((interaction, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-orange-400">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            <span className="text-sm">{interaction}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Pre-requirements */}
                                            {med.preRequirements && med.preRequirements.length > 0 && (
                                                <div className="bg-slate-800/50 rounded-xl p-4">
                                                    <p className="text-slate-400 text-sm mb-3">متطلبات ما قبل الإعطاء:</p>
                                                    <div className="space-y-2">
                                                        {med.preRequirements.map((req, i) => (
                                                            <label key={i} className="flex items-center gap-3 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={preReqChecked[req] || false}
                                                                    onChange={(e) => setPreReqChecked(prev => ({ ...prev, [req]: e.target.checked }))}
                                                                    className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                                                                />
                                                                <span className={preReqChecked[req] ? 'text-green-400' : 'text-white'}>{req}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Special Instructions */}
                                            {med.specialInstructions && (
                                                <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-3">
                                                    <p className="text-purple-300 text-sm">
                                                        <strong>تعليمات خاصة:</strong> {med.specialInstructions}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {(med.status === 'pending' || med.status === 'overdue') && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAdminister(med.id)}
                                                        disabled={!allPreReqsMet}
                                                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${allPreReqsMet
                                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                        تم الإعطاء
                                                    </button>
                                                    <button
                                                        onClick={() => handleSkip(med.id, 'سبب طبي')}
                                                        className="px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl font-medium transition-colors"
                                                    >
                                                        تخطي
                                                    </button>
                                                    <button
                                                        onClick={() => handleRefuse(med.id)}
                                                        className="px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl font-medium transition-colors"
                                                    >
                                                        رفض
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {filteredMeds.length === 0 && (
                <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">تم إعطاء جميع الأدوية</h3>
                    <p className="text-slate-400">لا توجد أدوية معلقة حالياً</p>
                </div>
            )}
        </div>
    );
};

export default MedicationAdministration;
