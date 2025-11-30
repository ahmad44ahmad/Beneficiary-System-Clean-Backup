import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, FileText, Calendar, Clock, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { beneficiaries } from '../../data/beneficiaries';

export const SocialDashboard: React.FC = () => {
    const navigate = useNavigate();
    // const { beneficiaries } = useApp(); // Removed as it's not in context yet

    // Mock Data for Social KPIs
    const stats = {
        totalBeneficiaries: beneficiaries.length,
        pendingResearches: 5,
        activeLeaves: 3,
        visitsToday: 12
    };

    const recentActivities = [
        { id: 1, type: 'research', title: 'تم إكمال البحث الاجتماعي', beneficiary: 'أحمد محمد', time: 'منذ ساعتين' },
        { id: 2, type: 'leave', title: 'طلب إجازة جديد', beneficiary: 'خالد علي', time: 'منذ 4 ساعات' },
        { id: 3, type: 'visit', title: 'زيارة عائلية', beneficiary: 'سعيد حسن', time: 'منذ 5 ساعات' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">الخدمات الاجتماعية</h1>
                    <p className="text-gray-500">نظرة عامة على الأنشطة والحالات الاجتماعية</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/social/search')}>
                        <Search className="w-4 h-4 ml-2" />
                        بحث متقدم
                    </Button>
                    <Button onClick={() => navigate('/social/research/new')}>
                        <Plus className="w-4 h-4 ml-2" />
                        بحث اجتماعي جديد
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-r-4 border-r-primary-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">إجمالي المستفيدين</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalBeneficiaries}</h3>
                        </div>
                        <div className="p-3 bg-primary-50 rounded-full">
                            <Users className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-r-4 border-r-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">بحوث معلقة</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingResearches}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full">
                            <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-r-4 border-r-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">إجازات نشطة</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.activeLeaves}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <Clock className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-r-4 border-r-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">زيارات اليوم</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.visitsToday}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">آخر النشاطات</h3>
                            <Button variant="ghost" size="sm">عرض الكل</Button>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className={`p-2 rounded-full shrink-0 ${activity.type === 'research' ? 'bg-primary-100 text-primary-600' :
                                            activity.type === 'leave' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                            {activity.type === 'research' ? <FileText className="w-4 h-4" /> :
                                                activity.type === 'leave' ? <Clock className="w-4 h-4" /> :
                                                    <Users className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-xs text-gray-500">المستفيد: {activity.beneficiary}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Links */}
                <div>
                    <Card className="h-full">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">روابط سريعة</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/social/leaves')}>
                                <Clock className="w-4 h-4 ml-2 text-gray-500" />
                                إدارة الإجازات
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/social/visits')}>
                                <Users className="w-4 h-4 ml-2 text-gray-500" />
                                سجل الزيارات
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/social/activities')}>
                                <Calendar className="w-4 h-4 ml-2 text-gray-500" />
                                البرامج والأنشطة
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/social/reports')}>
                                <FileText className="w-4 h-4 ml-2 text-gray-500" />
                                التقارير الاجتماعية
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
