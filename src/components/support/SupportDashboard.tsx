import React, { useState } from 'react';
import { CustodyPanel } from './CustodyPanel';
import { MaintenancePanel } from './MaintenancePanel';
import { Card } from '../ui/Card';
import {
    Wallet,
    Wrench,
    Box,
    PieChart,
    Building2,
    Briefcase
} from 'lucide-react';

export const SupportDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'custody' | 'maintenance'>('overview');

    // Mock Stats
    const stats = {
        totalAssets: 1450,
        assetsValue: 2500000,
        activeMaintenance: 5,
        criticalMaintenance: 1,
        activeCustody: 88
    };

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">الخدمات المساندة والمالية</h1>
                    <p className="text-gray-500 mt-1">إدارة الأصول، العهد، والصيانة والمرافق</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-teal-50 text-teal-700 font-bold border-b-2 border-teal-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                    <PieChart className="w-4 h-4" />
                    لوحة المعلومات
                </button>
                <button
                    onClick={() => setActiveTab('custody')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'custody' ? 'bg-teal-50 text-teal-700 font-bold border-b-2 border-teal-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                    <Box className="w-4 h-4" />
                    العهد والمستودعات
                </button>
                <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'maintenance' ? 'bg-teal-50 text-teal-700 font-bold border-b-2 border-teal-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                    <Wrench className="w-4 h-4" />
                    طلبات الصيانة
                </button>
            </div>

            {/* Content Content */}
            <div className="animate-in fade-in duration-500">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-6 border-r-4 border-r-blue-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">إجمالي الأصول</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{stats.totalAssets}</h3>
                                        <p className="text-xs text-gray-400 mt-2">قطعة مسجلة</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                        <Box className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-r-4 border-r-teal-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">قيمة الأصول</p>
                                        <h3 className="text-3xl font-bold text-gray-800">2.5M</h3>
                                        <p className="text-xs text-gray-400 mt-2">ريال سعودي</p>
                                    </div>
                                    <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-r-4 border-r-orange-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">في الصيانة</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{stats.activeMaintenance}</h3>
                                        <p className="text-xs text-red-500 mt-2">{stats.criticalMaintenance} طلب حرج</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                                        <Wrench className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-r-4 border-r-purple-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">عهد الموظفين</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{stats.activeCustody}</h3>
                                        <p className="text-xs text-gray-400 mt-2">عهدة نشطة</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Recent Activity / Quick Actions Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-gray-500" />
                                    حالة المباني والمرافق
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                                        <span className="font-medium text-gray-700">المبنى الرئيسي (الإدارة)</span>
                                        <span className="text-green-700 text-sm font-bold">ممتاز 100%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-100">
                                        <span className="font-medium text-gray-700">مبنى الضيافة (أ)</span>
                                        <span className="text-yellow-700 text-sm font-bold">يحتاج صيانة طفيفة</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                                        <span className="font-medium text-gray-700">المسجد والساحات</span>
                                        <span className="text-green-700 text-sm font-bold">ممتاز 100%</span>
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-xl p-6 text-white flex flex-col justify-center items-center text-center">
                                <Wrench className="w-16 h-16 mb-4 opacity-80" />
                                <h3 className="text-2xl font-bold mb-2">الإبلاغ السريع</h3>
                                <p className="opacity-90 max-w-sm mb-6">
                                    يمكنك الإبلاغ عن الأعطال الطارئة في المباني أو الأجهزة الطبية مباشرة من هنا ليتم توجيهها للفريق المختص.
                                </p>
                                <button className="bg-white text-teal-800 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-colors w-full md:w-auto">
                                    + بلاغ صيانة طارئ
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'custody' && <CustodyPanel />}
                {activeTab === 'maintenance' && <MaintenancePanel />}
            </div>
        </div>
    );
};
