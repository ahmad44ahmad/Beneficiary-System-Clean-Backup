import React, { useState } from 'react';
import { mockAssets, mockTickets } from '../data/assets';
import { AssetRegistry } from '../components/assets/AssetRegistry';
import { InventoryPanel } from '../components/dashboard/InventoryPanel'; // Reusing existing component
import { inventoryItems } from '../data/inventory'; // Existing data
import { Card } from '../components/ui/Card';
import {
    LayoutGrid,
    Box,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Package
} from 'lucide-react';

export const SupportDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'consumables' | 'maintenance'>('dashboard');

    // Metrics Calculation
    const totalAssets = mockAssets.length;
    const totalValue = mockAssets.reduce((sum, a) => sum + a.value, 0);
    const damagedAssets = mockAssets.filter(a => a.condition === 'damaged').length;
    const openTickets = mockTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const criticalTickets = mockTickets.filter(t => t.priority === 'critical' || t.priority === 'high').length;

    // Handlers
    const handleReportFault = (asset: any) => {
        alert(`Opening ticket for: ${asset.name}`);
        // Logic to open ticket modal would go here
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Box className="w-8 h-8 text-indigo-600" />
                    بوابة الخدمات المساندة والأصول
                </h1>
                <p className="text-gray-500 mt-1">نظام إدارة الأصول الثابتة، المخزون، والصيانة (SPGA Compliant)</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b mb-6">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'dashboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    لوحة المؤشرات
                </button>
                <button
                    onClick={() => setActiveTab('assets')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'assets' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    سجل الأصول الثابتة
                </button>
                <button
                    onClick={() => setActiveTab('consumables')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'consumables' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    المخزون والكسوة
                </button>
                <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'maintenance' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    طلبات الصيانة
                    {openTickets > 0 && <span className="mr-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{openTickets}</span>}
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* 1. DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="p-6 border-r-4 border-r-indigo-500 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">إجمالي الأصول</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{totalAssets}</h3>
                                    </div>
                                    <Box className="w-8 h-8 text-indigo-100" />
                                </div>
                                <div className="mt-4 text-xs text-gray-400">
                                    القيمة: {totalValue.toLocaleString()} ر.س
                                </div>
                            </Card>

                            <Card className="p-6 border-r-4 border-r-orange-500 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">تذاكر الصيانة المفتوحة</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{openTickets}</h3>
                                    </div>
                                    <Wrench className="w-8 h-8 text-orange-100" />
                                </div>
                                <div className="mt-4 text-xs text-orange-600 font-medium">
                                    {criticalTickets} تذاكر ذات أولوية عالية
                                </div>
                            </Card>

                            <Card className="p-6 border-r-4 border-r-red-500 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">أصول تالفة / معطلة</p>
                                        <h3 className="text-3xl font-bold text-red-600">{damagedAssets}</h3>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-red-100" />
                                </div>
                                <div className="mt-4 text-xs text-red-500">
                                    تتطلب إجراء (إصلاح أو تكهين)
                                </div>
                            </Card>

                            <Card className="p-6 border-r-4 border-r-green-500 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">حالة المخزون</p>
                                        <h3 className="text-3xl font-bold text-gray-900">مستقر</h3>
                                    </div>
                                    <Package className="w-8 h-8 text-green-100" />
                                </div>
                                <div className="mt-4 text-xs text-green-600">
                                    تم تحديث الجرد الأسبوعي
                                </div>
                            </Card>
                        </div>

                        {/* Recent Tickets Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6 bg-white shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Wrench className="w-5 h-5 text-gray-500" />
                                    آخر بلاغات الصيانة
                                </h3>
                                <div className="space-y-4">
                                    {mockTickets.slice(0, 5).map(ticket => (
                                        <div key={ticket.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${ticket.status === 'open' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-sm text-gray-900">{ticket.assetName}</span>
                                                    <span className="text-xs text-gray-500">{new Date(ticket.reportedAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{ticket.issueDescription}</p>
                                                <div className="mt-2 flex gap-2">
                                                    <span className="text-[10px] px-2 py-0.5 bg-white border rounded text-gray-500">
                                                        بواسطة: {ticket.reportedBy}
                                                    </span>
                                                    {ticket.priority === 'high' && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold">
                                                            عاجل
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="p-6 bg-white shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all text-center group" onClick={() => setActiveTab('assets')}>
                                        <Box className="w-8 h-8 mx-auto mb-2 text-indigo-500 group-hover:scale-110 transition-transform" />
                                        <span className="block text-sm font-medium text-gray-700">إضافة أصل جديد</span>
                                    </button>
                                    <button className="p-4 border rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all text-center group">
                                        <Wrench className="w-8 h-8 mx-auto mb-2 text-orange-500 group-hover:scale-110 transition-transform" />
                                        <span className="block text-sm font-medium text-gray-700">فتح بلاغ صيانة</span>
                                    </button>
                                    <button className="p-4 border rounded-xl hover:bg-green-50 hover:border-green-200 transition-all text-center group" onClick={() => setActiveTab('consumables')}>
                                        <Package className="w-8 h-8 mx-auto mb-2 text-green-500 group-hover:scale-110 transition-transform" />
                                        <span className="block text-sm font-medium text-gray-700">صرف مواد (كسوة)</span>
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 2. ASSETS REGISTRY VIEW */}
                {activeTab === 'assets' && (
                    <AssetRegistry assets={mockAssets} onReportFault={handleReportFault} />
                )}

                {/* 3. CONSUMABLES (Existing Inventory) */}
                {activeTab === 'consumables' && (
                    <InventoryPanel inventory={inventoryItems} />
                )}

                {/* 4. MAINTENANCE VIEW (Placeholder) */}
                {activeTab === 'maintenance' && (
                    <div className="text-center py-10 bg-white rounded-lg border border-dashed">
                        <Wrench className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">نظام تذاكر الصيانة</h3>
                        <p className="text-gray-500 mt-2">سيتم عرض جدول التذاكر التفصيلي هنا...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
