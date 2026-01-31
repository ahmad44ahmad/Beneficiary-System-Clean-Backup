import React, { useState, useEffect } from 'react';
import {
    TrendingUp, AlertTriangle, FileSearch, MapPin,
    Clock, Building2, Users, Car, Home, Wrench,
    ArrowRight, ChevronDown, ChevronUp, BarChart3
} from 'lucide-react';
import { supabase } from '../../config/supabase';

// HRSD Colors
const HRSD = {
    orange: 'rgb(245, 150, 30)',
    gold: 'rgb(250, 180, 20)',
    green: 'rgb(45, 180, 115)',
    teal: 'rgb(20, 130, 135)',
    navy: 'rgb(20, 65, 90)',
};

// Evasion Pattern Analysis from Claude Opus
const evasionPatterns = {
    forward_escape: {
        label: 'هروب للأمام',
        count: 9,
        percentage: 52.9,
        color: 'bg-orange-500',
        phrases: [
            'مرتبط بمشروع قادم',
            'جاري العمل على الموضوع',
            'بانتظار قرار الإدارة',
            'تحت الإجراء والمتابعة',
            'سيتم إحاطتكم لاحقاً'
        ],
        widthClass: 'w-[52.9%]'
    },
    misdirection: {
        label: 'تحويل لجهة أخرى',
        count: 3,
        percentage: 17.6,
        color: 'bg-red-500',
        phrases: [
            'هذا من اختصاص جهة أخرى',
            'تم تحويله للجهة المختصة',
            'حسب كود البناء لا يلزم'
        ],
        widthClass: 'w-[17.6%]'
    },
    false_promise: {
        label: 'وعد كاذب',
        count: 1,
        percentage: 5.9,
        color: 'bg-purple-500',
        phrases: [
            'تم الحل مؤقتاً',
            'معالجة مؤقتة'
        ],
        widthClass: 'w-[5.9%]'
    },
    silence: {
        label: 'صمت وتجاهل',
        count: 2,
        percentage: 11.8,
        color: 'bg-gray-500',
        phrases: [
            'لم يرد رد',
            'تم تقديم إيضاح فقط'
        ],
        widthClass: 'w-[11.8%]'
    }
};

// Al-Baha Specific Gaps
const albahaGaps = [
    {
        type: 'infrastructure',
        icon: Building2,
        title: 'عدم وجود قاعة متعددة الاستخدام',
        comparison: 'مراكز الرياض وجدة تتوفر فيها قاعات متعددة الأغراض',
        impact: 'تقييد الأنشطة الترفيهية والتأهيلية',
        years: 2
    },
    {
        type: 'infrastructure',
        icon: Wrench,
        title: 'مشاكل إنشائية - المبنى عمره 13 سنة',
        comparison: 'مراكز جازان والمدينة تعاني أيضاً',
        impact: 'عدم الحصول على شهادة السلامة',
        years: 5
    },
    {
        type: 'staffing',
        icon: Users,
        title: 'نقص حاد في الكوادر خاصة القسم النسائي',
        comparison: 'مراكز الإحساء، المدينة، مكة، نجران تعاني من نفس النقص',
        impact: 'عدم تغطية الفترات المسائية',
        years: 3
    },
    {
        type: 'geographic',
        icon: MapPin,
        title: 'بُعد المنطقة - صعوبة الفحص الفني',
        comparison: 'يتطلب السفر للطائف لإجراء الفحص',
        impact: 'تأخر في صيانة السيارات وتجديد الرخص',
        years: 1
    },
    {
        type: 'services',
        icon: Home,
        title: 'خدمات غير متوفرة بالباحة',
        comparison: 'مراكز الرياض وجدة تتوفر فيها خدمات رقمية وأنظمة أفضل',
        impact: 'تفاوت في جودة الخدمة بين المناطق',
        years: null
    }
];

// Key Statistics
const summaryStats = {
    total_issues: 17,
    critical_issues: 3,
    high_severity: 4,
    medium_severity: 8,
    low_severity: 2,
    issues_over_2_years: 5,
    issues_over_1_year: 10,
    average_pending_days: 385,
    resolved: 0
};

export const AccountabilityAnalysis: React.FC = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>('patterns');
    const [gapsData, setGapsData] = useState<any[]>([]);

    useEffect(() => {
        fetchGapsData();
    }, []);

    const fetchGapsData = async () => {
        const { data } = await supabase
            .from('accountability_gaps')
            .select('*')
            .order('days_pending', { ascending: false });
        if (data) setGapsData(data);
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FileSearch className="w-8 h-8 text-[#148287]" />
                    تحليل فجوة المساءلة الشامل
                </h1>
                <p className="text-gray-500 mt-1 mr-11">
                    مركز التأهيل الشامل للذكور بالباحة • تاريخ التحليل: 2025-12-30
                </p>
            </div>

            {/* Summary Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-red-500">
                    <div className="text-3xl font-bold text-red-600">{summaryStats.critical_issues}</div>
                    <div className="text-sm text-gray-500">قضايا حرجة</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-orange-500">
                    <div className="text-3xl font-bold text-orange-600">{summaryStats.high_severity}</div>
                    <div className="text-sm text-gray-500">عالية الخطورة</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-yellow-500">
                    <div className="text-3xl font-bold text-yellow-600">{summaryStats.issues_over_2_years}</div>
                    <div className="text-sm text-gray-500">أكثر من سنتين</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-blue-500">
                    <div className="text-3xl font-bold text-blue-600">{summaryStats.average_pending_days}</div>
                    <div className="text-sm text-gray-500">متوسط أيام الانتظار</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-r-4 border-gray-500">
                    <div className="text-3xl font-bold text-gray-600">{summaryStats.resolved}</div>
                    <div className="text-sm text-gray-500">تم حلها</div>
                </div>
            </div>

            {/* Evasion Patterns Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSection('patterns')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#20655A]/20">
                            <BarChart3 className="w-6 h-6 text-[#F5961E]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">تحليل أنماط التنصل</h3>
                            <p className="text-sm text-gray-500">52.9% هروب للأمام • 17.6% تحويل لجهة أخرى</p>
                        </div>
                    </div>
                    {expandedSection === 'patterns' ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandedSection === 'patterns' && (
                    <div className="p-6 border-t bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(evasionPatterns).map(([key, pattern]) => (
                                <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${pattern.color}`}></span>
                                            <span className="font-bold text-gray-800">{pattern.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900">{pattern.count}</span>
                                            <span className="text-sm text-gray-500">({pattern.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${pattern.color} ${(pattern as any).widthClass}`}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium mb-2">العبارات الشائعة:</p>
                                        {pattern.phrases.map((phrase, i) => (
                                            <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                                                <span className="text-gray-300">•</span>
                                                <span>"{phrase}"</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Al-Baha Specific Gaps */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSection('albaha')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#148287]/20">
                            <MapPin className="w-6 h-6 text-[#148287]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">خصوصية الباحة</h3>
                            <p className="text-sm text-gray-500">6 فجوات خاصة بطبيعة المنطقة</p>
                        </div>
                    </div>
                    {expandedSection === 'albaha' ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandedSection === 'albaha' && (
                    <div className="p-6 border-t">
                        <div className="space-y-4">
                            {albahaGaps.map((gap, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-gray-100 shrink-0">
                                            <gap.icon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 mb-2">{gap.title}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    <ArrowRight className="w-4 h-4" />
                                                    <span>مقارنة: {gap.comparison}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span>الأثر: {gap.impact}</span>
                                                </div>
                                            </div>
                                            {gap.years && (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>معلقة منذ {gap.years} {gap.years === 1 ? 'سنة' : 'سنوات'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Critical Findings */}
            <div className="bg-gradient-to-l from-red-600 to-red-500 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    النتائج الأكثر خطورة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm opacity-80 mb-1">أخطر فجوة</div>
                        <div className="font-bold">غياب نظام الرش الآلي وشهادة السلامة</div>
                        <div className="text-sm opacity-80 mt-1">يهدد حياة 253 مستفيداً</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm opacity-80 mb-1">أطول قضية معلقة</div>
                        <div className="font-bold">تأخر صرف الطلبات على GRP</div>
                        <div className="text-sm opacity-80 mt-1">880 يوماً (منذ أغسطس 2023)</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm opacity-80 mb-1">أكثر أنماط التنصل</div>
                        <div className="font-bold">الهروب للأمام (Forward Escape)</div>
                        <div className="text-sm opacity-80 mt-1">52.9% من الحالات</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-sm opacity-80 mb-1">فجوة توثيقية</div>
                        <div className="font-bold">الفترة 2020-2023</div>
                        <div className="text-sm opacity-80 mt-1">لا توجد زيارات إشرافية موثقة</div>
                    </div>
                </div>
            </div>

            {/* Positive Achievements */}
            <div className="mt-6 bg-gradient-to-l from-green-600 to-green-500 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    الإنجازات الإيجابية (للتوازن)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                        🥇 المركز الأول في كرة الطاولة الزوجي
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                        💼 توظيف مستفيدين بجمعية سعي
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                        📚 دليل العناية الشخصية معمم وطنياً
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                        🤝 7 شراكات مجتمعية فاعلة
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                        ✅ معالجة 7/14 ملاحظة من المراجعة الداخلية
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-sm">
                        🏆 خطة تنفيذية شاملة لـ ISO 9001:2015
                    </div>
                </div>
            </div>
        </div>
    );
};
