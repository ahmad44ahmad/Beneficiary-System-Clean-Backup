import React from 'react';
import { Beneficiary, InventoryItem } from '../../types';
import { Card } from '../ui/Card';
import { Users, Home, Car, AlertTriangle, Activity, UserPlus } from 'lucide-react';

interface DashboardPanelProps {
    beneficiaries: Beneficiary[];
    inventory: InventoryItem[];
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ beneficiaries, inventory }) => {
    // 1. KPI Calculations
    const totalBeneficiaries = beneficiaries.length;
    const activeCases = beneficiaries.filter(b => b.status === 'active').length;
    const lowStockItems = inventory.filter(item => item.quantity < 10).length;
    const externalVisits = 3; // Mock data

    // 2. Data for Distribution
    const diagnosisDistribution = beneficiaries.reduce((acc, curr) => {
        const diagnosis = curr.medicalDiagnosis || 'غير محدد';
        acc[diagnosis] = (acc[diagnosis] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topDiagnoses = Object.entries(diagnosisDistribution)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5);

    // 3. Recent Activities
    const recentEnrollments = [...beneficiaries]
        .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">لوحة القياس والتحكم</h1>
                    <p className="text-gray-500">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-r-4 border-r-primary-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">إجمالي المستفيدين</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalBeneficiaries}</h3>
                            <span className="text-xs text-primary-600 font-medium">ملف نشط</span>
                        </div>
                        <div className="p-3 bg-primary-50 rounded-full">
                            <Users className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-r-4 border-r-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">المتواجدون حالياً</p>
                            <h3 className="text-2xl font-bold text-gray-900">{activeCases - externalVisits}</h3>
                            <span className="text-xs text-green-600 font-medium">داخل المركز</span>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <Home className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-r-4 border-r-secondary-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">زيارات خارجية</p>
                            <h3 className="text-2xl font-bold text-gray-900">{externalVisits}</h3>
                            <span className="text-xs text-secondary-600 font-medium">إجازات / مستشفيات</span>
                        </div>
                        <div className="p-3 bg-secondary-50 rounded-full">
                            <Car className="w-6 h-6 text-secondary-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-r-4 border-r-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">تنبيهات المخزون</p>
                            <h3 className="text-2xl font-bold text-gray-900">{lowStockItems}</h3>
                            <span className="text-xs text-red-600 font-medium">أصناف قاربت على النفاذ</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Section */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">توزيع الحالات حسب التشخيص الطبي</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {topDiagnoses.map(([label, value]) => (
                                <div key={label} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{label}</span>
                                        <span className="text-gray-500">{value} حالة</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                            style={{ width: `${((value as number) / (totalBeneficiaries as number)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Recent Activity Section */}
                <div>
                    <Card className="h-full">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">آخر المستفيدين المسجلين</h3>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-4">
                                {recentEnrollments.map(b => (
                                    <li key={b.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="p-2 bg-white rounded-full shadow-sm text-primary-600">
                                            <UserPlus className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{b.fullName}</p>
                                            <p className="text-xs text-gray-500 mt-1">{b.enrollmentDate}</p>
                                        </div>
                                    </li>
                                ))}
                                {recentEnrollments.length === 0 && (
                                    <li className="text-center text-gray-500 py-4">لا توجد بيانات حديثة</li>
                                )}
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
