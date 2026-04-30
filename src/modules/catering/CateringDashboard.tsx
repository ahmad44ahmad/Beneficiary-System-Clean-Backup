import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Utensils, AlertTriangle, CheckCircle, Calendar, FileText, Loader2 } from 'lucide-react';
import { MealSchedule } from './MealSchedule';
import { ViolationReport } from './ViolationReport';
import { QualityChecklist } from './QualityChecklist';
import { useCatering } from '../../hooks/useCatering';

export const CateringDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'violations' | 'quality'>('overview');
    const { meals, violations, loading } = useCatering();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-hrsd-primary animate-spin" />
            </div>
        );
    }

    // Stats
    const stats = [
        { label: 'وجبات اليوم', value: meals.filter(m => m.scheduled_date === new Date().toISOString().split('T')[0]).length || '0', icon: Utensils, color: 'text-[#269798]', bg: 'bg-[#269798]/15' },
        { label: 'نسبة الرضا', value: '94%', icon: CheckCircle, color: 'text-[#1E9658]', bg: 'bg-[#2BB574]/15' },
        { label: 'المخالفات', value: violations.filter(v => v.status === 'open').length.toString(), icon: AlertTriangle, color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/15' },
        { label: 'التكلفة اليومية', value: '5,220', unit: 'ر.س', icon: FileText, color: 'text-[#D49A0A]', bg: 'bg-[#FCB614]/15' },
    ];

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Utensils className="w-8 h-8 text-hrsd-primary" />
                        الإعاشة والتغذية
                    </h1>
                    <p className="text-gray-500">مراقبة جودة الغذاء وجداول الوجبات</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab('violations')}>
                        <AlertTriangle className="w-4 h-4 ml-2" />
                        تسجيل مخالفة
                    </Button>
                    <Button variant="primary" onClick={() => setActiveTab('schedule')}>
                        <Calendar className="w-4 h-4 ml-2" />
                        جدول الأسبوع
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b">
                {[
                    { id: 'overview', label: 'نظرة عامة' },
                    { id: 'schedule', label: 'جدول الوجبات' },
                    { id: 'quality', label: 'فحص الجودة' },
                    { id: 'violations', label: 'المخالفات' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === tab.id
                            ? 'border-hrsd-primary text-hrsd-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <Card key={i} className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                            {stat.unit && <span className="text-xs text-gray-500">{stat.unit}</span>}
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MealSchedule preview />
                        <QualityChecklist preview />
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && <MealSchedule />}
            {activeTab === 'quality' && <QualityChecklist />}
            {activeTab === 'violations' && <ViolationReport />}
        </div>
    );
};
