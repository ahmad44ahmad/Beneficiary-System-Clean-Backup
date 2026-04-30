import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Pill, Clock, AlertTriangle, CheckCircle, User,
    Search, FileDown,
    ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

/**
 * Medication Administration — Phase 2G.
 * Brand level: Default (light mode).
 *
 * Per HRSD Brand Guidelines:
 * - Light surface; navy headings; cool-gray body.
 * - Status palette: HRSD teal/green/gold + semantic red exception (life-safety).
 * - Maximum 3 brand colors + 1 semantic per surface.
 * - Five Rights banner uses HRSD navy/gold (no purple).
 */

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
    administeredBy?: string;
    administeredAt?: string; // ISO
}

const mockMedications: Medication[] = [
    { id: '1', name: 'أنسولين', dosage: '10 وحدات', route: 'حقن تحت الجلد', frequency: 'قبل الوجبات', scheduledTime: '11:00', status: 'pending', beneficiaryName: 'محمد العمري', beneficiaryId: 'B001', room: 'غ-101', preRequirements: ['قياس السكر'], allergies: [], interactions: [], specialInstructions: 'حقن في البطن' },
    { id: '2', name: 'أملوديبين', dosage: '5 ملغ', route: 'فموي', frequency: 'مرة يومياً', scheduledTime: '10:30', status: 'overdue', beneficiaryName: 'فاطمة سعيد', beneficiaryId: 'B002', room: 'غ-102', preRequirements: ['قياس الضغط'], allergies: ['البنسلين'], interactions: [], delayMinutes: 45 },
    { id: '3', name: 'ميتفورمين', dosage: '500 ملغ', route: 'فموي', frequency: 'مرتين يومياً', scheduledTime: '11:30', status: 'pending', beneficiaryName: 'خالد الدوسري', beneficiaryId: 'B003', room: 'غ-107', preRequirements: [], allergies: [], interactions: ['تجنب الكحول'], specialInstructions: 'مع الطعام' },
    { id: '4', name: 'وارفارين', dosage: '2.5 ملغ', route: 'فموي', frequency: 'مرة يومياً', scheduledTime: '12:00', status: 'pending', beneficiaryName: 'نورة محمد', beneficiaryId: 'B004', room: 'غ-104', preRequirements: ['فحص INR أسبوعي'], allergies: [], interactions: ['تجنب فيتامين ك'], specialInstructions: 'مراقبة النزيف' },
];

/**
 * Status → HRSD-compliant tones.
 * - pending:      teal (informational)
 * - overdue:      semantic red (life-safety — overdue medication is critical)
 * - administered: green (success)
 * - skipped:      gold (warning)
 * - refused:      orange (elevated, non-critical)
 */
const STATUS_CONFIG = {
    pending:      { bgColor: 'bg-[#269798]/10', borderColor: 'border-[#269798]/40', textColor: 'text-[#269798]', label: 'قيد الانتظار' },
    overdue:      { bgColor: 'bg-[#DC2626]/10', borderColor: 'border-[#DC2626]/40', textColor: 'text-[#DC2626]', label: 'متأخر' },
    administered: { bgColor: 'bg-[#2BB574]/10', borderColor: 'border-[#2BB574]/40', textColor: 'text-[#2BB574]', label: 'تم الإعطاء' },
    skipped:      { bgColor: 'bg-[#FCB614]/10', borderColor: 'border-[#FCB614]/40', textColor: 'text-[#FCB614]', label: 'تم التخطي' },
    refused:      { bgColor: 'bg-[#F7941D]/10', borderColor: 'border-[#F7941D]/40', textColor: 'text-[#F7941D]', label: 'رفض' },
};

export const MedicationAdministration: React.FC = () => {
    const [medications, setMedications] = useState<Medication[]>(mockMedications);
    const [selectedMed, setSelectedMed] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);
    const [preReqChecked, setPreReqChecked] = useState<Record<string, boolean>>({});

    const pendingCount = medications.filter(m => m.status === 'pending').length;
    const overdueCount = medications.filter(m => m.status === 'overdue').length;

    const filteredMeds = medications.filter(m => {
        const matchesSearch = m.beneficiaryName.includes(searchTerm) || m.name.includes(searchTerm);
        const matchesStatus = showCompleted || m.status === 'pending' || m.status === 'overdue';
        return matchesSearch && matchesStatus;
    });

    const handleAdminister = (medId: string) => {
        const nowIso = new Date().toISOString();
        setMedications(prev => prev.map(m =>
            m.id === medId
                ? { ...m, status: 'administered' as const, administeredBy: 'الممرضة عبير الشهري', administeredAt: nowIso }
                : m
        ));
        setSelectedMed(null);
        setPreReqChecked({});
    };

    const handleExport = () => {
        // Print to PDF via the browser's print dialog (Save as PDF).
        window.print();
    };

    const handleSkip = (medId: string, _reason: string) => {
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
        <div className="min-h-screen bg-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-hrsd-navy rounded-2xl flex items-center justify-center">
                            <Pill className="w-7 h-7 text-hrsd-gold" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-hrsd-navy">شاشة إعطاء الأدوية</h1>
                            <p className="text-hrsd-cool-gray text-sm">الحقوق الخمسة للإعطاء الآمن</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {overdueCount > 0 && (
                            <div className="bg-[#DC2626]/10 border border-[#DC2626]/40 rounded-xl px-4 py-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                                <span className="text-[#DC2626] font-medium">{overdueCount} متأخر</span>
                            </div>
                        )}
                        <div className="bg-[#269798]/10 border border-[#269798]/40 rounded-xl px-4 py-2">
                            <span className="text-[#269798] font-medium">{pendingCount} قيد الانتظار</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="bg-[#2BB574]/10 hover:bg-[#2BB574]/15 border border-[#2BB574]/40 rounded-xl px-4 py-2 flex items-center gap-2 text-[#2BB574] transition-colors font-medium"
                            title="تصدير سجل الأدوية بصيغة PDF"
                        >
                            <FileDown className="w-5 h-5" />
                            <span>تصدير PDF</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Five Rights banner — HRSD navy with gold accent (was off-palette purple). */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-hrsd-navy rounded-2xl p-4 mb-6"
            >
                <p className="text-hrsd-gold text-sm text-center font-medium">
                    ✓ المستفيد الصحيح · ✓ الدواء الصحيح · ✓ الجرعة الصحيحة · ✓ الطريق الصحيح · ✓ الوقت الصحيح
                </p>
            </motion.div>

            {/* Search + Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hrsd-cool-gray" />
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو الدواء…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl pe-10 ps-4 py-3 text-hrsd-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/30 focus:border-hrsd-teal"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowCompleted(!showCompleted)}
                    className={`px-4 py-3 rounded-xl transition-colors font-medium ${
                        showCompleted
                            ? 'bg-hrsd-navy text-white'
                            : 'bg-white border border-gray-300 text-hrsd-cool-gray hover:bg-gray-50'
                    }`}
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
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`rounded-2xl border-2 bg-white ${statusConfig.borderColor} overflow-hidden`}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setSelectedMed(isExpanded ? null : med.id)}
                            >
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                                            <Pill className={`w-6 h-6 ${statusConfig.textColor}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-hrsd-navy text-lg">{med.name}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                    {statusConfig.label}
                                                </span>
                                                {med.delayMinutes && (
                                                    <span className="text-[#DC2626] text-xs flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        متأخر {med.delayMinutes} دقيقة
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-hrsd-cool-gray text-sm">{med.dosage} · {med.route}</p>
                                            <div className="flex items-center gap-3 mt-1 text-hrsd-cool-gray text-sm flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span className="text-hrsd-navy font-medium">{med.beneficiaryName}</span>
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
                                            <div className="bg-[#DC2626]/10 p-2 rounded-lg" title="حساسية">
                                                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                                            </div>
                                        )}
                                        {isExpanded ? <ChevronUp className="w-5 h-5 text-hrsd-cool-gray" /> : <ChevronDown className="w-5 h-5 text-hrsd-cool-gray" />}
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
                                        className="border-t border-gray-200"
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Warnings */}
                                            {(med.allergies?.length || med.interactions?.length) && (
                                                <div className="bg-[#DC2626]/5 border border-[#DC2626]/30 rounded-xl p-3 space-y-2">
                                                    {med.allergies?.map((allergy, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-[#DC2626]">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-sm">حساسية: {allergy}</span>
                                                        </div>
                                                    ))}
                                                    {med.interactions?.map((interaction, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-[#F7941D]">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            <span className="text-sm">{interaction}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Pre-requirements */}
                                            {med.preRequirements && med.preRequirements.length > 0 && (
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <p className="text-hrsd-navy text-sm font-medium mb-3">متطلبات ما قبل الإعطاء:</p>
                                                    <div className="space-y-2">
                                                        {med.preRequirements.map((req, i) => (
                                                            <label key={i} className="flex items-center gap-3 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={preReqChecked[req] || false}
                                                                    onChange={(e) => setPreReqChecked(prev => ({ ...prev, [req]: e.target.checked }))}
                                                                    className="w-5 h-5 rounded border-gray-300 text-[#269798] focus:ring-[#269798]/30"
                                                                />
                                                                <span className={preReqChecked[req] ? 'text-[#2BB574]' : 'text-hrsd-navy'}>{req}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Special Instructions — gold accent (was off-palette purple). */}
                                            {med.specialInstructions && (
                                                <div className="bg-[#FCB614]/10 border border-[#FCB614]/30 rounded-xl p-3">
                                                    <p className="text-[#FCB614] text-sm">
                                                        <strong>تعليمات خاصة:</strong> {med.specialInstructions}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Administration record */}
                                            {med.status === 'administered' && med.administeredBy && (
                                                <div className="bg-[#2BB574]/10 border border-[#2BB574]/30 rounded-xl p-3 text-[#2BB574] text-sm space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>تم إعطاء الجرعة بواسطة <strong>{med.administeredBy}</strong></span>
                                                    </div>
                                                    {med.administeredAt && (
                                                        <div className="flex items-center gap-2 text-[#2BB574]/85">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>
                                                                {new Date(med.administeredAt).toLocaleString('ar-SA', {
                                                                    year: 'numeric', month: 'long', day: 'numeric',
                                                                    hour: '2-digit', minute: '2-digit',
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {(med.status === 'pending' || med.status === 'overdue') && (
                                                <div className="flex gap-3 flex-wrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAdminister(med.id)}
                                                        disabled={!allPreReqsMet}
                                                        className={`flex-1 min-w-[140px] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                                                            allPreReqsMet
                                                                ? 'bg-[#2BB574] hover:bg-[#2BB574] text-white'
                                                                : 'bg-gray-200 text-hrsd-cool-gray cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                        تم الإعطاء
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSkip(med.id, 'سبب طبي')}
                                                        className="px-4 py-3 bg-[#FCB614]/10 hover:bg-[#FCB614]/15 text-[#FCB614] border border-[#FCB614]/30 rounded-xl font-medium transition-colors"
                                                    >
                                                        تخطي
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRefuse(med.id)}
                                                        className="px-4 py-3 bg-[#F7941D]/10 hover:bg-[#F7941D]/15 text-[#F7941D] border border-[#F7941D]/30 rounded-xl font-medium transition-colors"
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
                    <CheckCircle className="w-16 h-16 text-[#2BB574] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-hrsd-navy mb-2">تم إعطاء جميع الأدوية</h3>
                    <p className="text-hrsd-cool-gray">لا توجد أدوية معلقة حالياً</p>
                </div>
            )}
        </div>
    );
};

export default MedicationAdministration;
