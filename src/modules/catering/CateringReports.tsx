import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Calendar, FileText, Printer, ChevronLeft, Download, Users, Layers, Scale, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { TabButton } from '../../components/common/TabButton';
import { usePrint } from '../../hooks/usePrint';
import { useExport } from '../../hooks/useExport';
import { useToast } from '../../context/ToastContext';

type Gender = 'male' | 'female';
type DayOfWeek = 'السبت' | 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

// Demo data based on the provided spreadsheet (مركز التأهيل الشامل بالباحة - أكتوبر 2023)
const DEMO_BENEFICIARIES = [
    'ابراهيم احمد عمر الفقيه الحضريتي',
    'ابراهيم محمد رافع علي ال فلتان الشمراني',
    'احمد سالم سويد سالم ال خفير',
    'احمد محمد غرم احمد الزهراني',
    'احمد مسفر سعيد مسفر ال طريس الغامدي',
    'الحميدي حمدان زيد زياد الصاعدي',
    'امجد محمد احمد مقايص',
    'تركي ظافر العلياني',
    'ثامر نايف احمد محمد العبدلي المالكي',
    'حسن صالح علي عبد الله ال مصلح',
    'حسن احمد محمد العمري',
    'خالد العمري',
    'سالم ناصر سالم علي ال صعدي الشهري',
    'سعد علي فايز غانم ال هزاع القرني',
    'محمد عبد الله مسفر مفرح ال مفرح الغامدي',
];

const generateDemoAttendance = () => {
    return DEMO_BENEFICIARIES.map((name, idx) => {
        // October 2023: Days 5-31 attendance (matching spreadsheet)
        const days = Array(31).fill(false);
        for (let i = 4; i < 31; i++) { // Days 5-31
            days[i] = true;
        }
        return {
            id: idx + 1,
            real_id: `demo-${idx}`,
            name: name,
            days: days
        };
    });
};

export const CateringReports: React.FC = () => {
    const navigate = useNavigate();
    const { printTable, isPrinting } = usePrint();
    const { exportToExcel, isExporting } = useExport();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'attendance' | 'daily_log' | 'summary'>('attendance');
    const [selectedGender, setSelectedGender] = useState<Gender>('male');
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>('السبت');
    const [usingDemoData, setUsingDemoData] = useState(false);

    // State for Attendance
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Column definitions for export
    const ATTENDANCE_COLUMNS = [
        { key: 'id', header: 'م' },
        { key: 'name', header: 'الاسم' },
        { key: 'totalDays', header: 'أيام الحضور' }
    ];

    // Prepare export data with attendance summary
    const getExportData = () => attendanceData.map(row => ({
        ...row,
        totalDays: row.days.filter((d: boolean) => d).length
    }));

    // Export handlers
    const handlePrint = () => {
        if (attendanceData.length === 0) {
            showToast('لا توجد بيانات للطباعة', 'error');
            return;
        }
        printTable(getExportData(), ATTENDANCE_COLUMNS, {
            title: `تقرير حضور الإعاشة - ${selectedGender === 'male' ? 'ذكور' : 'إناث'}`,
            subtitle: `التاريخ: ${new Date().toLocaleDateString('ar-SA')}`
        });
        showToast('تم فتح نافذة الطباعة', 'success');
    };

    const handleExportExcel = () => {
        if (attendanceData.length === 0) {
            showToast('لا توجد بيانات للتصدير', 'error');
            return;
        }
        exportToExcel(getExportData(), ATTENDANCE_COLUMNS, {
            filename: `حضور_الإعاشة_${selectedGender === 'male' ? 'ذكور' : 'إناث'}`
        });
        showToast(`تم تصدير ${attendanceData.length} سجل إلى Excel`, 'success');
    };

    // Fetch Attendance Data
    useEffect(() => {
        if (activeTab === 'attendance') {
            fetchAttendance();
        }
    }, [activeTab, selectedGender]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            if (!supabase) {
                setAttendanceData(generateDemoAttendance());
                setUsingDemoData(true);
                return;
            }

            const genderArabic = selectedGender === 'male' ? 'ذكر' : 'أنثى';

            // 1. Get Beneficiaries
            const { data: bens, error: benError } = await supabase
                .from('beneficiaries')
                .select('id, full_name, file_number')
                .eq('gender', genderArabic)
                .order('full_name');

            if (benError || !bens || bens.length === 0) {
                if (import.meta.env.DEV) {
                    console.log('[CateringReports] Using demo data - no beneficiaries found');
                }
                setAttendanceData(generateDemoAttendance());
                setUsingDemoData(true);
                return;
            }

            // 2. Get Logs for this month
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

            const benIds = bens.map(b => b.id);
            const { data: logs, error: logsError } = await supabase
                .from('daily_meals')
                .select('beneficiary_id, meal_date')
                .in('beneficiary_id', benIds)
                .gte('meal_date', startOfMonth)
                .lte('meal_date', endOfMonth);

            if (logsError) {
                if (import.meta.env.DEV) {
                    console.log('[CateringReports] Using demo data - daily_meals error');
                }
                setAttendanceData(generateDemoAttendance());
                setUsingDemoData(true);
                return;
            }

            // 3. Process Data
            const processed = bens.map((ben, idx) => {
                const days = Array(31).fill(false);
                const benLogs = logs?.filter(l => l.beneficiary_id === ben.id) || [];

                benLogs.forEach(log => {
                    const day = new Date(log.meal_date).getDate();
                    if (day >= 1 && day <= 31) {
                        days[day - 1] = true;
                    }
                });

                return {
                    id: idx + 1,
                    real_id: ben.id,
                    name: ben.full_name,
                    days: days
                };
            });

            setAttendanceData(processed);
            setUsingDemoData(false);

        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('[CateringReports] Error, using demo data:', err);
            }
            setAttendanceData(generateDemoAttendance());
            setUsingDemoData(true);
        } finally {
            setLoading(false);
        }
    };

    // Expanded Mock Data for Daily Log Items (Matching the "Heavy" Spreadsheet structure)
    const dailyItems = [
        {
            section: 'وجبة الإفطار', items: [
                { name: 'فول', unit: 'كجم', nursery: { prescribed: 2, disbursed: 2 }, adults: { prescribed: 10, disbursed: 10 } },
                { name: 'تميس', unit: 'عدد', nursery: { prescribed: 10, disbursed: 10 }, adults: { prescribed: 50, disbursed: 50 } },
                { name: 'عدس', unit: 'كجم', nursery: { prescribed: 3, disbursed: 3 }, adults: { prescribed: 12, disbursed: 12 } },
                { name: 'جبن سائل', unit: 'كجم', nursery: { prescribed: 2, disbursed: 2 }, adults: { prescribed: 8, disbursed: 8 } },
                { name: 'حلاوة طحينية', unit: 'كجم', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 5, disbursed: 5 } },
                { name: 'مربى', unit: 'كجم', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 5, disbursed: 5 } },
                { name: 'عسل', unit: 'كجم', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 5, disbursed: 5 } },
                { name: 'بيض مسلوق', unit: 'عدد', nursery: { prescribed: 20, disbursed: 20 }, adults: { prescribed: 100, disbursed: 100 } },
                { name: 'حليب طازج', unit: 'لتر', nursery: { prescribed: 15, disbursed: 15 }, adults: { prescribed: 60, disbursed: 60 } },
                { name: 'شاي', unit: 'كيلو', nursery: { prescribed: 0.5, disbursed: 0.5 }, adults: { prescribed: 2, disbursed: 2 } },
                { name: 'خبز صامولي', unit: 'عدد', nursery: { prescribed: 20, disbursed: 20 }, adults: { prescribed: 100, disbursed: 100 } },
            ]
        },
        {
            section: 'وجبة الغداء', items: [
                { name: 'أرز بشاور', unit: 'كجم', nursery: { prescribed: 8, disbursed: 8 }, adults: { prescribed: 35, disbursed: 35 } },
                { name: 'دجاج', unit: 'حبة', nursery: { prescribed: 10, disbursed: 10 }, adults: { prescribed: 45, disbursed: 45 } },
                { name: 'لحم حاشي', unit: 'كجم', nursery: { prescribed: 0, disbursed: 0 }, adults: { prescribed: 0, disbursed: 0 } },
                { name: 'إيدام خضار مشكل', unit: 'كجم', nursery: { prescribed: 5, disbursed: 5 }, adults: { prescribed: 20, disbursed: 20 } },
                { name: 'سلطة خضراء', unit: 'كجم', nursery: { prescribed: 4, disbursed: 4 }, adults: { prescribed: 15, disbursed: 15 } },
                { name: 'فاكهة (برتقال/تفاح)', unit: 'حبة', nursery: { prescribed: 20, disbursed: 20 }, adults: { prescribed: 80, disbursed: 80 } },
                { name: 'لبن', unit: 'لتر', nursery: { prescribed: 5, disbursed: 5 }, adults: { prescribed: 20, disbursed: 20 } },
                { name: 'عصير طازج', unit: 'لتر', nursery: { prescribed: 5, disbursed: 5 }, adults: { prescribed: 20, disbursed: 20 } },
            ]
        },
        {
            section: 'وجبة العشاء (نواشف + غير نواشف)', items: [
                { name: 'مكرونة بالبشاميل', unit: 'كجم', nursery: { prescribed: 6, disbursed: 6 }, adults: { prescribed: 25, disbursed: 25 } },
                { name: 'فاصوليا حمراء', unit: 'كجم', nursery: { prescribed: 3, disbursed: 3 }, adults: { prescribed: 12, disbursed: 12 } },
                { name: 'تونة', unit: 'علبة', nursery: { prescribed: 5, disbursed: 5 }, adults: { prescribed: 20, disbursed: 20 } },
                { name: 'زيتون', unit: 'كجم', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 4, disbursed: 4 } },
                { name: 'جبن شيدر', unit: 'كجم', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 5, disbursed: 5 } },
                { name: 'زبادي', unit: 'علبة', nursery: { prescribed: 20, disbursed: 20 }, adults: { prescribed: 80, disbursed: 80 } },
            ]
        },
        {
            section: 'وجبة المكمل الغذائي (Special Diets)', items: [
                { name: 'حليب بدياشور', unit: 'علبة', nursery: { prescribed: 5, disbursed: 5 }, adults: { prescribed: 0, disbursed: 0 } },
                { name: 'انشور', unit: 'علبة', nursery: { prescribed: 0, disbursed: 0 }, adults: { prescribed: 10, disbursed: 10 } },
                { name: 'بسكويت مخصص', unit: 'كرتون', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 2, disbursed: 2 } },
            ]
        },
        {
            section: 'المواد الإضافية ومواد النظافة', items: [
                { name: 'سائل غسيل الأواني', unit: 'جالون', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 4, disbursed: 4 } },
                { name: 'كلور', unit: 'جالون', nursery: { prescribed: 0.5, disbursed: 0.5 }, adults: { prescribed: 2, disbursed: 2 } },
                { name: 'أكياس نفايات', unit: 'رطة', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 3, disbursed: 3 } },
                { name: 'مناديل سفرة', unit: 'كرتون', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 5, disbursed: 5 } },
                { name: 'قفازات طبخ', unit: 'كرتون', nursery: { prescribed: 1, disbursed: 1 }, adults: { prescribed: 2, disbursed: 2 } },
            ]
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#14415A]">جداول الإعاشة (مستخرجة)</h1>
                    <p className="text-gray-600">مركز التأهيل الشامل بالباحة</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/catering')}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        عودة
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={isPrinting || attendanceData.length === 0}
                        className="px-4 py-2 bg-[#148287] text-white rounded-lg hover:bg-[#0e6b6f] flex items-center gap-2 disabled:opacity-50"
                        aria-label="طباعة التقرير"
                    >
                        <Printer className="w-5 h-5" />
                        طباعة
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={isExporting || attendanceData.length === 0}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-2 disabled:opacity-50"
                        aria-label="تصدير إلى Excel"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        تصدير Excel
                    </button>
                </div>
            </header>

            {/* Main Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2">
                <TabButton
                    active={activeTab === 'attendance'}
                    onClick={() => setActiveTab('attendance')}
                    label="حضور وغياب"
                    icon={Users}
                />
                <TabButton
                    active={activeTab === 'daily_log'}
                    onClick={() => setActiveTab('daily_log')}
                    label="اليوميات (الكميات)"
                    icon={Scale}
                />
                <TabButton
                    active={activeTab === 'summary'}
                    onClick={() => setActiveTab('summary')}
                    label="الخلاصة"
                    icon={Layers}
                />
            </div>

            {/* Sub-Filters (Gender/Day) */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <label className="font-bold text-[#14415A]">القسم:</label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setSelectedGender('male')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedGender === 'male' ? 'bg-white text-[#14415A] shadow-sm' : 'text-gray-500'}`}
                        >
                            ذكور
                        </button>
                        <button
                            onClick={() => setSelectedGender('female')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedGender === 'female' ? 'bg-white text-[#14415A] shadow-sm' : 'text-gray-500'}`}
                        >
                            إناث
                        </button>
                    </div>
                </div>

                {activeTab === 'daily_log' && (
                    <div className="flex items-center gap-2">
                        <label className="font-bold text-[#14415A]">اليوم:</label>
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                            className="bg-gray-50 border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-[#F5961E] focus:border-[#F5961E]"
                        >
                            {['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* ATTENDANCE VIEW */}
            {activeTab === 'attendance' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[300px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <LoadingSpinner size="md" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse text-xs">
                                <thead className="bg-[#14415A] text-white">
                                    <tr>
                                        <th className="p-2 border border-white/10 w-10">م</th>
                                        <th className="p-2 border border-white/10 w-48 text-right px-4">الاسم</th>
                                        {Array.from({ length: 30 }, (_, i) => (
                                            <th key={i} className="p-2 border border-white/10 w-8">{i + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="p-2 border border-gray-100 font-bold text-gray-400">{row.id}</td>
                                            <td className="p-2 border border-gray-100 text-right px-4 font-medium">{row.name}</td>
                                            {row.days.map((present: boolean, idx: number) => (
                                                <td key={idx} className="p-2 border border-gray-100">
                                                    <div className={`w-4 h-4 rounded-full mx-auto ${present ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                        {present ? '✓' : ''}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}{/* DAILY LOG VIEW (Complex Table) */}
            {activeTab === 'daily_log' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border border-gray-300">
                            <thead>
                                {/* Top Header Group */}
                                <tr className="bg-[#14415A] text-white">
                                    <th colSpan={3} className="p-3 border border-white/20">الكميات المقررة</th>
                                    <th rowSpan={2} className="p-3 border border-white/20 bg-[#148287] w-48">المادة</th>
                                    <th colSpan={3} className="p-3 border border-white/20">الكميات المنصرفة</th>
                                </tr>
                                {/* Sub Header Group */}
                                <tr className="bg-gray-100 text-gray-700 text-sm font-bold">
                                    <th className="p-2 border border-gray-300">قسم الحضانة</th>
                                    <th className="p-2 border border-gray-300">قسم الكبار</th>
                                    <th className="p-2 border border-gray-300">المجموع</th>
                                    <th className="p-2 border border-gray-300">وزن (كجم)</th>
                                    <th className="p-2 border border-gray-300">وزن (جرام)</th>
                                    <th className="p-2 border border-gray-300">البيان</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dailyItems.map((section, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="bg-yellow-50">
                                            <td colSpan={7} className="p-3 text-right font-bold text-[#F5961E] border border-gray-200">
                                                {section.section}
                                            </td>
                                        </tr>
                                        {section.items.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="hover:bg-gray-50">
                                                {/* Prescribed */}
                                                <td className="p-3 border border-gray-200">{item.nursery.prescribed}</td>
                                                <td className="p-3 border border-gray-200">{item.adults.prescribed}</td>
                                                <td className="p-3 border border-gray-200 font-bold bg-gray-50">
                                                    {item.nursery.prescribed + item.adults.prescribed}
                                                </td>

                                                {/* Item Name */}
                                                <td className="p-3 border-x-4 border-gray-300 font-bold text-[#14415A]">
                                                    {item.name} <span className="text-xs text-gray-400 font-normal">({item.unit})</span>
                                                </td>

                                                {/* Disbursed */}
                                                <td className="p-3 border border-gray-200 font-bold text-blue-700">
                                                    {item.nursery.disbursed + item.adults.disbursed}
                                                </td>
                                                <td className="p-3 border border-gray-200 text-gray-400">-</td>
                                                <td className="p-3 border border-gray-200 text-xs text-gray-500">تم الصرف</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div className="mt-8 grid grid-cols-3 gap-8 text-center print:mt-12 break-inside-avoid">
                        <div className="border-t-2 border-gray-300 pt-4">
                            <p className="font-bold text-[#14415A] mb-2">أخصائي التغذية</p>
                            <p className="text-gray-500">..................</p>
                        </div>
                        <div className="border-t-2 border-gray-300 pt-4">
                            <p className="font-bold text-[#14415A] mb-2">ممثل الشركة المتعهدة</p>
                            <p className="text-gray-500">..................</p>
                        </div>
                        <div className="border-t-2 border-gray-300 pt-4">
                            <p className="font-bold text-[#14415A] mb-2">لجنة استلام الإعاشة</p>
                            <p className="text-gray-500">..................</p>
                        </div>
                    </div>
                </div>
            )}

            {/* SUMMARY VIEW */}
            {activeTab === 'summary' && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <h2 className="text-xl font-bold text-[#14415A] mb-4">خلاصة شهر (ديسمبر)</h2>
                    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="border rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">قسم الذكور</h3>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">إجمالي الوجبات</span>
                                <span className="font-bold">1,240</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">أيام الحضور الكامل</span>
                                <span className="font-bold text-green-600">22 يوم</span>
                            </div>
                        </div>
                        <div className="border rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">قسم الإناث</h3>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">إجمالي الوجبات</span>
                                <span className="font-bold">980</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">أيام الحضور الكامل</span>
                                <span className="font-bold text-green-600">25 يوم</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

// TabButton imported from shared components
