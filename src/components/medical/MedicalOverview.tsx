import React from 'react';
import { VitalsMonitorCard } from './VitalsMonitorCard';
import { Card } from '../ui/Card';
import { useBeneficiaries } from '../../hooks/useBeneficiaries';
import { useLocalDataStore } from '../../stores/useLocalDataStore';
import { HeartPulse, Activity, Syringe, AlertTriangle, Users, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MedicalOverviewProps {
    vaccinations?: { id: string; beneficiaryId: string; type: string; date: string }[];
    isolationStats?: { active: number; total: number };
}

export const MedicalOverview: React.FC<MedicalOverviewProps> = ({ vaccinations = [], isolationStats }) => {
    const { data: beneficiaries = [] } = useBeneficiaries();
    const medicalProfiles = useLocalDataStore((s) => s.medicalProfiles);

    // Calculate statistics
    const totalBeneficiaries = beneficiaries.length;
    const activeMedicalCases = medicalProfiles?.length || 0;
    const pendingVaccinations = vaccinations?.length || 0;
    const isolatedCount = isolationStats?.active || 0;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* IoT Smart Vitals Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <VitalsMonitorCard beneficiaryId="CURRENT_USER" />
                </div>
                <div className="md:col-span-2">
                    <div className="bg-gradient-to-r from-[#269798]/10 to-[#0F3144]/10 rounded-xl p-6 h-full flex flex-col justify-center border border-[#269798]/10">
                        <h3 className="text-[#0F3144] font-bold text-lg mb-2">الذكاء الاصطناعي الطبي</h3>
                        <p className="text-[#269798] text-sm">
                            يتم تحليل المؤشرات الحيوية لحظياً عبر خوارزميات الذكاء الاصطناعي للكشف المبكر عن أي تدهور في الحالة الصحية.
                            النظام متصل الآن بأجهزة (IoMT) للمراقبة المستمرة.
                        </p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">القسم الطبي</h1>
                    <p className="text-gray-500 mt-1">نظرة عامة على الحالة الصحية للمستفيدين</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/beneficiaries" className="px-4 py-2 bg-[#269798] text-white rounded-lg hover:bg-[#269798] transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        عرض المستفيدين
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-[#269798] to-[#269798] text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#269798]/10 text-sm">إجمالي المستفيدين</p>
                                <p className="text-3xl font-bold mt-2">{totalBeneficiaries}</p>
                            </div>
                            <Users className="w-12 h-12 text-[#269798]/20 opacity-80" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-[#F7941D] to-[#F7941D] text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#F7941D]/40 text-sm">الملفات الطبية النشطة</p>
                                <p className="text-3xl font-bold mt-2">{activeMedicalCases}</p>
                            </div>
                            <HeartPulse className="w-12 h-12 text-[#F7941D]/60 opacity-80" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-[#2BB574] to-[#2BB574] text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2BB574]/40 text-sm">التطعيمات المجدولة</p>
                                <p className="text-3xl font-bold mt-2">{pendingVaccinations}</p>
                            </div>
                            <Syringe className="w-12 h-12 text-[#2BB574]/60 opacity-80" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-[#DC2626] to-[#DC2626] text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#DC2626]/40 text-sm">حالات العزل</p>
                                <p className="text-3xl font-bold mt-2">{isolatedCount}</p>
                            </div>
                            <AlertTriangle className="w-12 h-12 text-[#DC2626]/60 opacity-80" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="الخدمات الطبية">
                    <div className="p-4 space-y-3">
                        <Link to="/beneficiaries" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-[#269798]/10 text-[#269798] group-hover:bg-[#269798]/20">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">السجلات الطبية</p>
                                <p className="text-sm text-gray-500">عرض وإدارة الملفات الطبية</p>
                            </div>
                        </Link>
                        <Link to="/beneficiaries" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-[#F7941D]/15 text-[#F7941D] group-hover:bg-[#F7941D]/20">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">العلامات الحيوية</p>
                                <p className="text-sm text-gray-500">متابعة المؤشرات الصحية</p>
                            </div>
                        </Link>
                        <Link to="/beneficiaries" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-[#2BB574]/15 text-[#2BB574] group-hover:bg-[#2BB574]/20">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">تقييمات التمريض</p>
                                <p className="text-sm text-gray-500">تقييم القبول والمتابعة</p>
                            </div>
                        </Link>
                    </div>
                </Card>

                <Card title="الأقسام المتخصصة">
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#269798]/10">
                            <span className="text-2xl">🦷</span>
                            <div>
                                <p className="font-medium text-gray-900">صحة الفم والأسنان</p>
                                <p className="text-sm text-gray-500">فحوصات ومتابعة</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FCB614]/10">
                            <span className="text-2xl">🧠</span>
                            <div>
                                <p className="font-medium text-gray-900">الخدمات النفسية</p>
                                <p className="text-sm text-gray-500">تقييم وعلاج</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#DC2626]/10">
                            <span className="text-2xl">💬</span>
                            <div>
                                <p className="font-medium text-gray-900">النطق والتخاطب</p>
                                <p className="text-sm text-gray-500">جلسات وتقييم</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="إحصائيات سريعة">
                    <div className="p-4">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">نسبة التطعيم</span>
                                    <span className="font-medium text-gray-900">85%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#2BB574] rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">الفحوصات الدورية</span>
                                    <span className="font-medium text-gray-900">72%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#269798] rounded-full" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">متابعة الأدوية</span>
                                    <span className="font-medium text-gray-900">95%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#F7941D] rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card title="آخر النشاطات الطبية">
                <div className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-[#269798]/10 flex items-center justify-center">
                                <HeartPulse className="w-5 h-5 text-[#269798]" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">تقييم تمريضي جديد</p>
                                <p className="text-sm text-gray-500">أحمد محمد السيد - قبل 2 ساعة</p>
                            </div>
                            <span className="text-xs bg-[#2BB574]/15 text-[#2BB574] px-2 py-1 rounded-full">مكتمل</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-[#F7941D]/15 flex items-center justify-center">
                                <Syringe className="w-5 h-5 text-[#F7941D]" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">تطعيم موسمي</p>
                                <p className="text-sm text-gray-500">خالد ناصر العتيبي - قبل 4 ساعات</p>
                            </div>
                            <span className="text-xs bg-[#269798]/15 text-[#269798] px-2 py-1 rounded-full">قيد التنفيذ</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-[#FCB614]/15 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-[#FCB614]" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">قياس علامات حيوية</p>
                                <p className="text-sm text-gray-500">فهد راشد الدوسري - قبل 6 ساعات</p>
                            </div>
                            <span className="text-xs bg-[#2BB574]/15 text-[#2BB574] px-2 py-1 rounded-full">مكتمل</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
