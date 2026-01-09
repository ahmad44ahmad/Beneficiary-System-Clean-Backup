import React from 'react';
import { Card } from '../ui/Card';
import { useUnifiedData } from '../../context/UnifiedDataContext';
import { Users, Shirt, Calendar, Heart, FileText, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SocialOverview: React.FC = () => {
    const { beneficiaries, socialActivityPlans, socialActivityDocs } = useUnifiedData();

    const totalBeneficiaries = beneficiaries.length;
    const activePlans = socialActivityPlans?.length || 0;
    const documentedActivities = socialActivityDocs?.length || 0;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">الخدمات الاجتماعية</h1>
                    <p className="text-gray-500 mt-1">إدارة الأنشطة والخدمات الاجتماعية للمستفيدين</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/social/leaves" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        طلبات الإجازات
                    </Link>
                    <Link to="/social/research/new" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        بحث اجتماعي جديد
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="gradient-ipc text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">إجمالي المستفيدين</p>
                                <p className="text-3xl font-bold mt-2">{totalBeneficiaries}</p>
                            </div>
                            <Users className="w-12 h-12 text-white/60" />
                        </div>
                    </div>
                </Card>

                <Card className="gradient-warning text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">خطط الأنشطة</p>
                                <p className="text-3xl font-bold mt-2">{activePlans}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-white/60" />
                        </div>
                    </div>
                </Card>

                <Card className="gradient-success text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">الأنشطة الموثقة</p>
                                <p className="text-3xl font-bold mt-2">{documentedActivities}</p>
                            </div>
                            <FileText className="w-12 h-12 text-white/60" />
                        </div>
                    </div>
                </Card>

                <Card className="gradient-primary text-white">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">طلبات معلقة</p>
                                <p className="text-3xl font-bold mt-2">3</p>
                            </div>
                            <Clock className="w-12 h-12 text-white/60" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="إدارة الإجازات">
                    <div className="p-4 space-y-3">
                        <Link to="/social/leaves" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-teal-100 text-teal-600 group-hover:bg-teal-200">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">طلبات الإجازات</p>
                                <p className="text-sm text-gray-500">إدارة ومتابعة الطلبات</p>
                            </div>
                        </Link>
                        <Link to="/social/research/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">البحث الاجتماعي</p>
                                <p className="text-sm text-gray-500">إعداد بحث جديد</p>
                            </div>
                        </Link>
                    </div>
                </Card>

                <Card title="الأنشطة والفعاليات">
                    <div className="p-4 space-y-3">
                        <Link to="/social/activities" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200">
                                <Heart className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">الأنشطة الاجتماعية</p>
                                <p className="text-sm text-gray-500">تخطيط وتوثيق الأنشطة</p>
                            </div>
                        </Link>
                        <Link to="/clothing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200">
                                <Shirt className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">توزيع الملابس</p>
                                <p className="text-sm text-gray-500">إدارة المخزون والتوزيع</p>
                            </div>
                        </Link>
                    </div>
                </Card>

                <Card title="التواصل والمتابعة">
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">التواصل مع الأسر</p>
                                <p className="text-sm text-gray-500">متابعة الزيارات والاتصالات</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">الإرشاد الأسري</p>
                                <p className="text-sm text-gray-500">جلسات الدعم والتوجيه</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card title="آخر النشاطات الاجتماعية">
                <div className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">طلب إجازة جديد</p>
                                <p className="text-sm text-gray-500">أحمد محمد السيد - زيارة عائلية</p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">قيد المراجعة</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">نشاط رياضي</p>
                                <p className="text-sm text-gray-500">مشاركة 15 مستفيد</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">مكتمل</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">بحث اجتماعي</p>
                                <p className="text-sm text-gray-500">خالد ناصر العتيبي - مكتمل</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">موثق</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
