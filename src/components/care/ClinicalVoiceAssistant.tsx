/**
 * ClinicalVoiceAssistant — المساعد الصوتي السريري
 *
 * Records nurse/doctor voice input via the browser microphone,
 * sends it to the voice-to-care-form Edge Function (Anthropic native audio),
 * and displays extracted DailyCareForm data for review before filling the form.
 */

import React, { useCallback } from 'react';
import {
    Mic,
    MicOff,
    Loader2,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    ClipboardCheck,
    Thermometer,
    Heart,
    Activity,
    Droplets,
    Brain,
    Weight,
    Clock,
} from 'lucide-react';
import {
    useVoiceAssistant,
    VoiceExtractedFormData,
} from '../../hooks/useVoiceAssistant';

/** Props for the ClinicalVoiceAssistant component */
interface ClinicalVoiceAssistantProps {
    /** Callback when the user confirms and wants to fill the form with extracted data */
    onFill: (data: VoiceExtractedFormData) => void;
}

/** Arabic labels for mood values */
const MOOD_LABELS: Record<string, string> = {
    stable: 'مستقر',
    happy: 'سعيد / متعاون',
    anxious: 'قلق / متوتر',
    aggressive: 'عدواني',
    depressed: 'مكتئب / منعزل',
    confused: 'مشوش الذهن',
};

/** Arabic labels for mobility values */
const MOBILITY_LABELS: Record<string, string> = {
    active: 'نشيط / طبيعي',
    limited: 'حركة محدودة',
    bedridden: 'ملازم للفراش',
};

/** Format seconds into mm:ss */
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ClinicalVoiceAssistant: React.FC<ClinicalVoiceAssistantProps> = ({
    onFill,
}) => {
    const {
        isRecording,
        isProcessing,
        result,
        error,
        recordingDuration,
        startRecording,
        stopRecording,
        reset,
    } = useVoiceAssistant();

    const handleFill = useCallback(() => {
        if (result) {
            onFill(result);
        }
    }, [result, onFill]);

    return (
        <div
            className="bg-white rounded-xl shadow-lg border border-[#0F3144]/10 overflow-hidden font-readex"
            dir="rtl"
        >
            {/* Header */}
            <div className="bg-gradient-to-l from-[#0A2030] to-[#D49A0A] p-5 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    المساعد الصوتي السريري
                </h3>
                <p className="text-sm opacity-90 mt-1">
                    سجّل ملاحظاتك الصوتية وسيتم استخراج بيانات نموذج الرعاية اليومية
                    تلقائياً
                </p>
            </div>

            <div className="p-6 space-y-5">
                {/* Recording Controls */}
                <div className="flex flex-col items-center gap-4">
                    {/* Main Record Button */}
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={`
                            relative w-24 h-24 rounded-full flex items-center justify-center
                            transition-all duration-300 focus:outline-none focus:ring-4
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${
                                isRecording
                                    ? 'bg-[#DC2626] hover:bg-[#B91C1C] focus:ring-[#DC2626]/20 shadow-lg shadow-red-200'
                                    : isProcessing
                                      ? 'bg-gray-400 cursor-wait'
                                      : 'bg-[#0F3144] hover:bg-[#0A2030] focus:ring-[#0F3144]/20 shadow-lg shadow-indigo-200'
                            }
                        `}
                        aria-label={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-10 w-10 text-white animate-spin" />
                        ) : isRecording ? (
                            <MicOff className="h-10 w-10 text-white" />
                        ) : (
                            <Mic className="h-10 w-10 text-white" />
                        )}

                        {/* Pulse animation ring while recording */}
                        {isRecording && (
                            <>
                                <span className="absolute inset-0 rounded-full bg-[#DC2626] opacity-40 animate-ping" />
                                <span className="absolute inset-[-4px] rounded-full border-2 border-[#DC2626] opacity-60 animate-pulse" />
                            </>
                        )}
                    </button>

                    {/* Status Text */}
                    <div className="text-center">
                        {isRecording && (
                            <div className="flex items-center gap-2 text-[#DC2626] font-semibold">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DC2626]" />
                                </span>
                                جار التسجيل...
                                <span className="font-mono text-sm text-gray-600 me-2" dir="ltr">
                                    {formatDuration(recordingDuration)}
                                </span>
                            </div>
                        )}
                        {isProcessing && (
                            <div className="flex items-center gap-2 text-[#0F3144] font-semibold">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جار تحليل التسجيل الصوتي بالذكاء الاصطناعي...
                            </div>
                        )}
                        {!isRecording && !isProcessing && !result && !error && (
                            <p className="text-gray-500 text-sm">
                                اضغط على الزر لبدء التسجيل الصوتي
                            </p>
                        )}
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-[#DC2626] shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-[#7F1D1D] font-medium text-sm">{error}</p>
                            <button
                                type="button"
                                onClick={reset}
                                className="mt-2 text-sm text-[#DC2626] hover:text-[#7F1D1D] underline flex items-center gap-1"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                إعادة المحاولة
                            </button>
                        </div>
                    </div>
                )}

                {/* Result Preview Card */}
                {result && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center gap-2 text-[#1E9658] font-bold">
                            <CheckCircle2 className="h-5 w-5" />
                            تم استخراج البيانات بنجاح
                        </div>

                        {/* Extracted Data Grid */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {/* Shift */}
                                {result.shift && (
                                    <DataCard
                                        icon={<Clock className="h-4 w-4" />}
                                        label="الوردية"
                                        value={result.shift}
                                        color="purple"
                                    />
                                )}

                                {/* Temperature */}
                                {result.temperature != null && (
                                    <DataCard
                                        icon={<Thermometer className="h-4 w-4" />}
                                        label="الحرارة"
                                        value={`${result.temperature} °C`}
                                        color="red"
                                    />
                                )}

                                {/* Pulse */}
                                {result.pulse != null && (
                                    <DataCard
                                        icon={<Heart className="h-4 w-4" />}
                                        label="النبض"
                                        value={`${result.pulse} BPM`}
                                        color="pink"
                                    />
                                )}

                                {/* Blood Pressure */}
                                {(result.blood_pressure_systolic != null ||
                                    result.blood_pressure_diastolic != null) && (
                                    <DataCard
                                        icon={<Activity className="h-4 w-4" />}
                                        label="ضغط الدم"
                                        value={`${result.blood_pressure_systolic ?? '—'}/${result.blood_pressure_diastolic ?? '—'} mmHg`}
                                        color="blue"
                                    />
                                )}

                                {/* Oxygen Saturation */}
                                {result.oxygen_saturation != null && (
                                    <DataCard
                                        icon={<Droplets className="h-4 w-4" />}
                                        label="الأكسجين"
                                        value={`${result.oxygen_saturation}%`}
                                        color="cyan"
                                    />
                                )}

                                {/* Blood Sugar */}
                                {result.blood_sugar != null && (
                                    <DataCard
                                        icon={<Droplets className="h-4 w-4" />}
                                        label="السكر"
                                        value={`${result.blood_sugar} mg/dL`}
                                        color="orange"
                                    />
                                )}

                                {/* Weight */}
                                {result.weight != null && (
                                    <DataCard
                                        icon={<Weight className="h-4 w-4" />}
                                        label="الوزن"
                                        value={`${result.weight} kg`}
                                        color="green"
                                    />
                                )}

                                {/* Mobility */}
                                {result.mobility_today && (
                                    <DataCard
                                        icon={<Activity className="h-4 w-4" />}
                                        label="الحالة الحركية"
                                        value={MOBILITY_LABELS[result.mobility_today] ?? result.mobility_today}
                                        color="teal"
                                    />
                                )}

                                {/* Mood */}
                                {result.mood && (
                                    <DataCard
                                        icon={<Brain className="h-4 w-4" />}
                                        label="المزاج"
                                        value={MOOD_LABELS[result.mood] ?? result.mood}
                                        color="indigo"
                                    />
                                )}
                            </div>

                            {/* Notes */}
                            {result.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">ملاحظات التمريض:</p>
                                    <p className="text-sm text-gray-800">{result.notes}</p>
                                </div>
                            )}

                            {/* Incidents */}
                            {result.incidents && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-[#DC2626] mb-1">حوادث:</p>
                                    <p className="text-sm text-[#B91C1C]">{result.incidents}</p>
                                </div>
                            )}

                            {/* Followup flag */}
                            {result.requires_followup && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#DC2626]/15 text-[#B91C1C] text-xs font-semibold">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        يحتاج متابعة طبية
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={reset}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <RotateCcw className="h-4 w-4" />
                                تسجيل جديد
                            </button>
                            <button
                                type="button"
                                onClick={handleFill}
                                className="px-6 py-2 bg-gradient-to-r from-[#1E9658] to-[#1B7778] text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2 font-bold"
                            >
                                <ClipboardCheck className="h-5 w-5" />
                                تعبئة النموذج
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  Internal sub-components                                           */
/* ------------------------------------------------------------------ */

/** Color variants for DataCard */
const COLOR_CLASSES: Record<string, string> = {
    red: 'bg-[#DC2626]/10 text-[#B91C1C] border-[#DC2626]/30',
    pink: 'bg-[#DC2626]/10 text-[#B91C1C] border-[#DC2626]/20',
    blue: 'bg-[#269798]/10 text-[#1B7778] border-[#269798]/30',
    cyan: 'bg-[#269798]/10 text-[#1B7778] border-[#269798]/20',
    orange: 'bg-[#F7941D]/10 text-[#D67A0A] border-[#F7941D]/30',
    green: 'bg-[#2BB574]/10 text-[#1E9658] border-[#2BB574]/20',
    teal: 'bg-[#269798]/10 text-[#1B7778] border-[#269798]/20',
    indigo: 'bg-[#0F3144]/5 text-[#0A2030] border-[#0F3144]/30',
    purple: 'bg-[#FCB614]/10 text-[#D49A0A] border-[#FCB614]/20',
};

interface DataCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}

const DataCard: React.FC<DataCardProps> = ({ icon, label, value, color }) => {
    const classes = COLOR_CLASSES[color] ?? COLOR_CLASSES['blue'];
    return (
        <div className={`rounded-lg border p-3 ${classes}`}>
            <div className="flex items-center gap-1.5 text-xs opacity-75 mb-1">
                {icon}
                {label}
            </div>
            <p className="font-semibold text-sm">{value}</p>
        </div>
    );
};
