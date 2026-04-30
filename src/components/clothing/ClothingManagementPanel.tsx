import React, { useState } from 'react';
import {
    Package, ClipboardList, Truck, ShoppingCart, Trash2, Warehouse,
    FileText, Plus, Download, Printer
} from 'lucide-react';
import { WardrobeInventory, ClothingNeeds, ClothingDispensation, ClothingProcurement } from '../../types';
import { beneficiaries } from '../../data/beneficiaries';
import { WardrobeInventoryForm } from './WardrobeInventoryForm';
import { ClothingNeedsForm } from './ClothingNeedsForm';
import { ClothingDispensationForm } from './ClothingDispensationForm';
import { ClothingProcurementForm } from './ClothingProcurementForm';
import { ClothingPhaseTracker } from './ClothingPhaseTracker';
import { ClothingCommitteeCard } from './ClothingCommitteeCard';
import { ClothingSeasonalCalendar } from './ClothingSeasonalCalendar';

const TABS = [
    { id: 'inventory', label: 'جرد الخزائن', formNum: '1', icon: Package },
    { id: 'needs', label: 'الاحتياج', formNum: '2,3', icon: ClipboardList },
    { id: 'dispensation', label: 'الصرف الإضافي', formNum: '6,7', icon: Truck },
    { id: 'procurement', label: 'المشتريات', formNum: '4,5', icon: ShoppingCart },
    { id: 'discard', label: 'الإتلاف', formNum: '8,9,11', icon: Trash2 },
    { id: 'warehouse', label: 'جرد المستودع', formNum: '10', icon: Warehouse },
    { id: 'forms', label: 'النماذج', formNum: '', icon: FileText },
];

export const ClothingManagementPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('inventory');

    // Data State
    const [wardrobeInventories, setWardrobeInventories] = useState<WardrobeInventory[]>([]);
    const [needsAssessments, setNeedsAssessments] = useState<ClothingNeeds[]>([]);
    const [dispensations, setDispensations] = useState<ClothingDispensation[]>([]);
    const [procurements, setProcurements] = useState<ClothingProcurement[]>([]);

    // Modal State
    const [isCreatingInventory, setIsCreatingInventory] = useState(false);
    const [isCreatingNeeds, setIsCreatingNeeds] = useState(false);
    const [isCreatingDispensation, setIsCreatingDispensation] = useState(false);
    const [isCreatingProcurement, setIsCreatingProcurement] = useState(false);

    // Stats
    const stats = [
        { label: 'إجمالي الجرد', value: wardrobeInventories.length, icon: Package, bgClass: 'bg-[#269798]/10', iconColor: 'text-[#269798]' },
        { label: 'بيانات الاحتياج', value: needsAssessments.length, icon: ClipboardList, bgClass: 'bg-[#FCB614]/10', iconColor: 'text-[#FCB614]' },
        { label: 'عمليات الصرف', value: dispensations.length, icon: Truck, bgClass: 'bg-[#2BB574]/10', iconColor: 'text-[#2BB574]' },
        { label: 'محاضر الشراء', value: procurements.length, icon: ShoppingCart, bgClass: 'bg-[#269798]/10', iconColor: 'text-[#0F3144]' },
    ];

    // Export function
    const handleExport = (data: Record<string, unknown>[] | WardrobeInventory[] | ClothingNeeds[] | ClothingDispensation[] | ClothingProcurement[], filename: string) => {
        if (!data.length) {
            alert('لا توجد بيانات للتصدير');
            return;
        }
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data) {
            const r = row as Record<string, unknown>;
            const values = headers.map(header => {
                const val = r[header];
                if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
                return `"${val}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getBeneficiaryName = (id?: string) => {
        if (!id) return 'عام';
        return beneficiaries.find(b => b.id === id)?.fullName || 'غير معروف';
    };

    return (
        <div className="p-6 min-h-screen space-y-6" dir="rtl">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-2xl flex items-center justify-center shadow-lg">
                        <Package className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الكسوة والمستودع</h1>
                        <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">
                            ملتزمة بالضوابط التنظيمية لتأمين الكسوة 2020 — وكالة التأهيل والتوجيه الاجتماعي
                        </p>
                    </div>
                </div>
            </div>

            {/* Domain frame — phases, seasons, committee (per ضوابط الكسوة 2020) */}
            <ClothingPhaseTracker currentPhase="phase_2_procurement" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ClothingSeasonalCalendar />
                <ClothingCommitteeCard />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => {
                    const StatIcon = stat.icon;
                    return (
                        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgClass}`}>
                                    <StatIcon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1.5 mb-6 overflow-x-auto">
                {TABS.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                                        whitespace-nowrap transition-all duration-200
                                        ${activeTab === tab.id
                                    ? 'bg-white text-[#269798] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            <TabIcon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.formNum && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-md
                                    ${activeTab === tab.id ? 'bg-[#269798]/10 text-[#269798]' : 'bg-gray-200 text-gray-500'}`}>
                                    {tab.formNum}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreatingInventory(true)}
                                className="px-5 py-2.5 bg-[#269798] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                إضافة جرد جديد
                            </button>
                            <button
                                onClick={() => handleExport(wardrobeInventories, 'wardrobe_inventory')}
                                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                تصدير CSV
                            </button>
                        </div>

                        {wardrobeInventories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">لا يوجد جرد مسجل</h3>
                                <p className="text-sm text-gray-400">ابدأ بإضافة جرد جديد للخزائن</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-l from-[#269798]/5 to-[#0F3144]/5 border-b border-gray-200">
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">المستفيد</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">العام</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">الموسم</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">التاريخ</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">عدد الأصناف</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {wardrobeInventories.map(inv => (
                                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">{getBeneficiaryName(inv.beneficiaryId)}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{inv.year}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{inv.season}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{inv.date}</td>
                                                    <td className="px-5 py-4 text-sm">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#269798]/10 text-[#269798]">
                                                            {inv.items.length}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Needs Tab */}
                {activeTab === 'needs' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreatingNeeds(true)}
                                className="px-5 py-2.5 bg-[#269798] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                إضافة بيان احتياج
                            </button>
                            <button
                                onClick={() => handleExport(needsAssessments, 'clothing_needs')}
                                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                تصدير CSV
                            </button>
                        </div>

                        {needsAssessments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                                <div className="w-20 h-20 bg-[#FCB614]/10 rounded-full flex items-center justify-center mb-4">
                                    <ClipboardList className="w-10 h-10 text-[#FCB614]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد بيانات احتياج</h3>
                                <p className="text-sm text-gray-400">ابدأ بإضافة بيان احتياج جديد</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-l from-[#269798]/5 to-[#0F3144]/5 border-b border-gray-200">
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">القسم</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">العام</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">الموسم</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">عدد الأصناف</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {needsAssessments.map(need => (
                                                <tr key={need.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">{need.gender === 'male' ? 'ذكور' : 'إناث'}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{need.year}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{need.season}</td>
                                                    <td className="px-5 py-4 text-sm">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#269798]/10 text-[#269798]">
                                                            {need.items.length}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                                            ${need.status === 'draft'
                                                                ? 'bg-[#FCB614]/10 text-[#D49A0A]'
                                                                : 'bg-[#2BB574]/10 text-[#2BB574]'}`}>
                                                            {need.status === 'draft' ? 'مسودة' : 'معتمد'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Dispensation Tab */}
                {activeTab === 'dispensation' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreatingDispensation(true)}
                                className="px-5 py-2.5 bg-[#269798] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                صرف إضافي جديد
                            </button>
                            <button
                                onClick={() => handleExport(dispensations, 'clothing_dispensation')}
                                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                تصدير CSV
                            </button>
                        </div>

                        {dispensations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                                <div className="w-20 h-20 bg-[#2BB574]/10 rounded-full flex items-center justify-center mb-4">
                                    <Truck className="w-10 h-10 text-[#2BB574]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد عمليات صرف</h3>
                                <p className="text-sm text-gray-400">ابدأ بإضافة عملية صرف إضافي جديدة</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-l from-[#269798]/5 to-[#0F3144]/5 border-b border-gray-200">
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">المستفيد</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">التاريخ</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">الموسم</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">المستلم</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">عدد الأصناف</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {dispensations.map(disp => (
                                                <tr key={disp.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">{getBeneficiaryName(disp.beneficiaryId)}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{disp.date}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{disp.season}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{disp.receiverName}</td>
                                                    <td className="px-5 py-4 text-sm">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#269798]/10 text-[#269798]">
                                                            {disp.items.length}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Procurement Tab */}
                {activeTab === 'procurement' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreatingProcurement(true)}
                                className="px-5 py-2.5 bg-[#269798] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                إضافة محضر تأمين
                            </button>
                            <button
                                onClick={() => handleExport(procurements, 'clothing_procurement')}
                                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                تصدير CSV
                            </button>
                        </div>

                        {procurements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                                <div className="w-20 h-20 bg-[#269798]/10 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-10 h-10 text-[#269798]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400 mb-2">لا توجد محاضر شراء</h3>
                                <p className="text-sm text-gray-400">ابدأ بإضافة محضر تأمين جديد</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-l from-[#269798]/5 to-[#0F3144]/5 border-b border-gray-200">
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">التاريخ</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">رقم الفاتورة</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">عدد الأصناف</th>
                                                <th className="text-right px-5 py-4 text-sm font-bold text-[#0F3144] whitespace-nowrap">الإجمالي</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {procurements.map(proc => (
                                                <tr key={proc.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-4 text-sm text-gray-600">{proc.date}</td>
                                                    <td className="px-5 py-4 text-sm text-gray-600">{proc.invoiceNumber || '-'}</td>
                                                    <td className="px-5 py-4 text-sm">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#269798]/10 text-[#269798]">
                                                            {proc.items.length}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">{proc.totalAmount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Placeholder Tabs (Discard, Warehouse) */}
                {['discard', 'warehouse'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-100">
                        <div className="w-20 h-20 bg-[#FCB614]/10 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-10 h-10 text-[#FCB614]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">قريباً</h3>
                        <p className="text-sm text-gray-400">سيتم إضافة هذا القسم قريباً</p>
                    </div>
                )}

                {/* Forms Tab */}
                {activeTab === 'forms' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-[#0F3144] mb-4">استمارة حصر احتياج الكسوة (نموذج 18)</h3>
                                    <div className="mb-4 bg-gray-50 border border-gray-100 rounded-xl p-3 flex justify-center">
                                        <img
                                            src="/assets/clothing-needs-form.png"
                                            alt="نموذج حصر الاحتياج"
                                            className="max-h-[400px] object-contain rounded-lg"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <a
                                            href="/assets/clothing-needs-form.png"
                                            download="clothing-needs-form-18.png"
                                            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            تحميل النموذج
                                        </a>
                                        <button
                                            className="px-5 py-2.5 bg-[#269798] text-white rounded-xl font-medium hover:bg-[#0a6465] transition-colors flex items-center gap-2 shadow-sm"
                                            onClick={() => {
                                                const printWindow = window.open('', '_blank');
                                                if (printWindow) {
                                                    printWindow.document.write(`
                                                        <html>
                                                            <head>
                                                                <title>طباعة نموذج</title>
                                                                <style>
                                                                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                                                                    img { max-width: 100%; height: auto; }
                                                                    @media print { img { width: 100%; height: 100%; object-fit: contain; } }
                                                                </style>
                                                            </head>
                                                            <body>
                                                                <img src="/assets/clothing-needs-form.png" onload="window.print();window.close()" />
                                                            </body>
                                                        </html>
                                                    `);
                                                    printWindow.document.close();
                                                }
                                            }}
                                        >
                                            <Printer className="w-4 h-4" />
                                            طباعة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreatingInventory && (
                <WardrobeInventoryForm
                    beneficiaries={beneficiaries}
                    onSave={(data) => {
                        setWardrobeInventories([...wardrobeInventories, data]);
                        setIsCreatingInventory(false);
                    }}
                    onCancel={() => setIsCreatingInventory(false)}
                />
            )}
            {isCreatingNeeds && (
                <ClothingNeedsForm
                    onSave={(data) => {
                        setNeedsAssessments([...needsAssessments, data]);
                        setIsCreatingNeeds(false);
                    }}
                    onCancel={() => setIsCreatingNeeds(false)}
                />
            )}
            {isCreatingDispensation && (
                <ClothingDispensationForm
                    beneficiaries={beneficiaries}
                    onSave={(data) => {
                        setDispensations([...dispensations, data]);
                        setIsCreatingDispensation(false);
                    }}
                    onCancel={() => setIsCreatingDispensation(false)}
                />
            )}
            {isCreatingProcurement && (
                <ClothingProcurementForm
                    onSave={(data) => {
                        setProcurements([...procurements, data]);
                        setIsCreatingProcurement(false);
                    }}
                    onCancel={() => setIsCreatingProcurement(false)}
                />
            )}
        </div>
    );
};
