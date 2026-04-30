import React, { useState } from 'react';
import {
    AlertOctagon, Users,
    MapPin, Phone, Ambulance, CheckCircle,
    Clock, Power, Radio, Zap
} from 'lucide-react';

// Types
interface Beneficiary {
    id: string;
    name: string;
    room: string;
    wing: string;
    mobility_status: 'bedridden' | 'wheelchair' | 'ambulatory';
    medical_priority: 'critical' | 'stable';
    assigned_staff?: string;
    evacuation_status: 'pending' | 'in_progress' | 'completed';
}

interface StaffMember {
    id: string;
    name: string;
    role: string;
    location: string;
    assigned_task?: string;
    status: 'available' | 'busy' | 'offline';
}

// Evacuation List Component
const EvacuationList: React.FC<{
    beneficiaries: Beneficiary[];
    color: string;
    title: string;
    onAssign: (_beneficiaryId: string, _staffId: string) => void;
}> = ({ beneficiaries, color, title }) => {
    const bgColors = {
        red: 'bg-[#DC2626]/10 border-[#DC2626]',
        yellow: 'bg-[#FCB614]/10 border-[#FCB614]',
        green: 'bg-[#2BB574]/10 border-[#2BB574]',
    };

    const iconColors = {
        red: 'text-[#DC2626]',
        yellow: 'text-[#D67A0A]',
        green: 'text-[#1E9658]',
    };

    return (
        <div className={`${bgColors[color as keyof typeof bgColors]} border-e-4 rounded-xl p-4`}>
            <h3 className={`font-bold text-lg mb-3 ${iconColors[color as keyof typeof iconColors]}`}>
                {title} ({beneficiaries.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {beneficiaries.map(ben => (
                    <div key={ben.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${ben.evacuation_status === 'completed' ? 'bg-[#2BB574]' :
                                ben.evacuation_status === 'in_progress' ? 'bg-[#269798] animate-pulse' :
                                    'bg-gray-300'
                                }`} />
                            <div>
                                <p className="font-bold text-gray-800">{ben.name}</p>
                                <p className="text-xs text-gray-500">
                                    {ben.wing} - الغرفة {ben.room}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {ben.assigned_staff && (
                                <span className="text-xs bg-[#269798]/15 text-[#1B7778] px-2 py-1 rounded">
                                    {ben.assigned_staff}
                                </span>
                            )}
                            {ben.evacuation_status === 'completed' && (
                                <CheckCircle className="w-5 h-5 text-[#1E9658]" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Staff Task Card
const StaffTaskCard: React.FC<{ staff: StaffMember }> = ({ staff }) => {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${staff.status === 'available' ? 'bg-[#2BB574]' :
                        staff.status === 'busy' ? 'bg-[#FCB614] animate-pulse' :
                            'bg-gray-400'
                        }`} />
                    <p className="font-bold text-gray-800">{staff.name}</p>
                </div>
                <span className="text-xs text-gray-500">{staff.role}</span>
            </div>
            {staff.assigned_task && (
                <div className="bg-[#269798]/10 rounded px-2 py-1 text-xs text-[#1B7778]">
                    📍 {staff.assigned_task}
                </div>
            )}
        </div>
    );
};

export const CrisisMode: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showActivation, setShowActivation] = useState(false);

    // Demo data - Replace with Supabase queries
    const [beneficiaries] = useState<Beneficiary[]>([
        // Bedridden (Critical Priority)
        { id: '1', name: 'عبدالله المالكي', room: '101', wing: 'الجناح الشرقي', mobility_status: 'bedridden', medical_priority: 'critical', evacuation_status: 'pending' },
        { id: '2', name: 'فاطمة الغامدي', room: '102', wing: 'الجناح الشرقي', mobility_status: 'bedridden', medical_priority: 'critical', evacuation_status: 'pending' },
        { id: '3', name: 'محمد الزهراني', room: '105', wing: 'الجناح الغربي', mobility_status: 'bedridden', medical_priority: 'stable', evacuation_status: 'pending' },

        // Wheelchair
        { id: '4', name: 'نورة العمري', room: '201', wing: 'الجناح الشمالي', mobility_status: 'wheelchair', medical_priority: 'stable', evacuation_status: 'pending' },
        { id: '5', name: 'سعيد القحطاني', room: '202', wing: 'الجناح الشمالي', mobility_status: 'wheelchair', medical_priority: 'stable', evacuation_status: 'pending' },

        // Ambulatory
        { id: '6', name: 'خالد الشهري', room: '301', wing: 'الجناح الجنوبي', mobility_status: 'ambulatory', medical_priority: 'stable', evacuation_status: 'pending' },
        { id: '7', name: 'مريم البيشي', room: '302', wing: 'الجناح الجنوبي', mobility_status: 'ambulatory', medical_priority: 'stable', evacuation_status: 'pending' },
    ]);

    const [staff] = useState<StaffMember[]>([
        { id: 's1', name: 'أحمد الشهري', role: 'ممرض', location: 'الجناح الشرقي', status: 'available' },
        { id: 's2', name: 'سارة المالكي', role: 'ممرضة', location: 'الجناح الغربي', status: 'available' },
        { id: 's3', name: 'علي الغامدي', role: 'أخصائي طوارئ', location: 'الطابق الأرضي', status: 'available' },
        { id: 's4', name: 'منى القحطاني', role: 'مساعدة تمريض', location: 'الجناح الشمالي', status: 'available' },
    ]);

    const hospitals = [
        { name: 'مستشفى الملك فهد', type: 'الحالات الحرجة', phone: '١٧٧٢٢٢٢٢٢', eta: '١٠ دقائق' },
        { name: 'مستشفى المندب', type: 'الحالات المستقرة', phone: '١٧٧٣٣٣٣٣', eta: '٨ دقائق' },
    ];

    const bedriddenCount = beneficiaries.filter(b => b.mobility_status === 'bedridden').length;
    const wheelchairCount = beneficiaries.filter(b => b.mobility_status === 'wheelchair').length;
    const ambulatoryCount = beneficiaries.filter(b => b.mobility_status === 'ambulatory').length;

    const handleActivation = () => {
        setShowActivation(true);
        let count = 3;
        const timer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                setIsActive(true);
                setShowActivation(false);
                // Play alert sound (optional)
                // new Audio('/alert.mp3').play();
            }
        }, 1000);
    };

    const handleDeactivation = () => {
        if (window.confirm('هل أنت متأكد من إنهاء وضع الطوارئ؟')) {
            setIsActive(false);
        }
    };

    if (!isActive && !showActivation) {
        // Activation Screen
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center" dir="rtl">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-[#DC2626]">
                        <div className="text-center mb-8">
                            <div className="inline-block p-6 bg-[#DC2626]/15 rounded-full mb-4">
                                <AlertOctagon className="w-16 h-16 text-[#DC2626]" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">بروتوكول الطوارئ</h1>
                            <p className="text-gray-600">وضع ساعة الصفر - استناداً على تجربة نجران وجازان</p>
                        </div>

                        <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-[#7F1D1D] mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                عند تفعيل وضع الطوارئ:
                            </h3>
                            <ul className="space-y-2 text-sm text-[#7F1D1D]">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>تحويل الواجهة بالكامل إلى قوائم إخلاء مرمزة بالألوان</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>توزيع المهام تلقائياً على الموظفين حسب الموقع</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>توجيه المستشفيات المستهدفة (الملك فهد للحرجة / المندب للمستقرة)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>تفعيل بروتوكولات الاتصالات والطاقة الاحتياطية</span>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#DC2626]/10 rounded-lg p-4 text-center border-2 border-[#DC2626]">
                                <div className="text-3xl font-bold text-[#DC2626] mb-1">{bedriddenCount}</div>
                                <div className="text-xs text-[#B91C1C]">طريح فراش</div>
                            </div>
                            <div className="bg-[#FCB614]/10 rounded-lg p-4 text-center border-2 border-[#FCB614]">
                                <div className="text-3xl font-bold text-[#D49A0A] mb-1">{wheelchairCount}</div>
                                <div className="text-xs text-[#D49A0A]">كرسي متحرك</div>
                            </div>
                            <div className="bg-[#2BB574]/10 rounded-lg p-4 text-center border-2 border-[#2BB574]">
                                <div className="text-3xl font-bold text-[#1E9658] mb-1">{ambulatoryCount}</div>
                                <div className="text-xs text-[#1E9658]">يمشي</div>
                            </div>
                        </div>

                        <button
                            onClick={handleActivation}
                            className="w-full py-4 bg-gradient-to-r from-[#B91C1C] to-[#B91C1C] text-white font-bold text-lg rounded-xl hover:from-[#B91C1C] hover:to-[#7F1D1D] transition-all shadow-lg flex items-center justify-center gap-3 animate-pulse"
                        >
                            <AlertOctagon className="w-6 h-6" />
                            تفعيل ساعة الصفر
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showActivation) {
        // Countdown Screen
        return (
            <div className="min-h-screen bg-[#B91C1C] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-9xl font-bold mb-4 animate-pulse">
                        {countdown}
                    </div>
                    <p className="text-white text-2xl">تفعيل وضع الطوارئ...</p>
                </div>
            </div>
        );
    }

    // Active Crisis Mode Interface
    return (
        <div className="min-h-screen bg-[#DC2626]/10" dir="rtl">
            {/* Emergency Header */}
            <div className="bg-gradient-to-r from-[#B91C1C] to-[#B91C1C] text-white p-4 sticky top-0 z-50 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="animate-pulse">
                            <Radio className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">وضع الطوارئ النشط</h1>
                            <p className="text-sm text-[#DC2626]/40">بروتوكول نجران - جميع الأنظمة في وضع الإخلاء</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDeactivation}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Power className="w-5 h-5" />
                        إنهاء الوضع
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-4 gap-3">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold">{beneficiaries.filter(b => b.evacuation_status === 'completed').length}/{beneficiaries.length}</div>
                        <div className="text-xs">تم إخلاؤهم</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold">{staff.filter(s => s.status === 'busy').length}/{staff.length}</div>
                        <div className="text-xs">طاقم نشط</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold">
                            <Clock className="w-6 h-6 inline" />
                        </div>
                        <div className="text-xs">10 دقائق مضت</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold">
                            <Ambulance className="w-6 h-6 inline" />
                        </div>
                        <div className="text-xs">٣ إسعافات في الطريق</div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Evacuation Lists - Color Coded */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <EvacuationList
                        beneficiaries={beneficiaries.filter(b => b.mobility_status === 'bedridden')}
                        color="red"
                        title="🔴 طريح فراش (أولوية قصوى)"
                        onAssign={(_benId, _staffId) => { }}
                    />
                    <EvacuationList
                        beneficiaries={beneficiaries.filter(b => b.mobility_status === 'wheelchair')}
                        color="yellow"
                        title="🟡 كرسي متحرك"
                        onAssign={(_benId, _staffId) => { }}
                    />
                    <EvacuationList
                        beneficiaries={beneficiaries.filter(b => b.mobility_status === 'ambulatory')}
                        color="green"
                        title="🟢 يمشي"
                        onAssign={(_benId, _staffId) => { }}
                    />
                </div>

                {/* Hospital Routing */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Ambulance className="w-5 h-5 text-[#DC2626]" />
                        توجيه المستشفيات
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hospitals.map((hospital, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover-lift">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-800">{hospital.name}</h4>
                                    <span className="text-xs bg-[#269798]/15 text-[#1B7778] px-2 py-1 rounded">{hospital.type}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <a href={`tel:${hospital.phone}`} className="hover:text-[#269798]">{hospital.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>وقت الوصول المتوقع: {hospital.eta}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Staff Status */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#269798]" />
                        حالة الطاقم
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {staff.map(s => (
                            <StaffTaskCard key={s.id} staff={s} />
                        ))}
                    </div>
                </div>

                {/* Emergency Checklist */}
                <div className="bg-white rounded-xl p-5 shadow-md">
                    <h3 className="font-bold text-lg mb-4">✅ قائمة الطوارئ</h3>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                            <span className="text-gray-700">تشغيل المولد الاحتياطي</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" className="w-5 h-5" />
                            <span className="text-gray-700">إغلاق الغاز المركزي</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                            <span className="text-gray-700">إخطار الدفاع المدني (تم)</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" className="w-5 h-5" />
                            <span className="text-gray-700">إخطار أهالي المستفيدين</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrisisMode;
