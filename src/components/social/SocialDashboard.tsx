import React from 'react';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import { Card } from '../ui/Card';
import { Shirt, Users, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface SocialDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: Partial<UnifiedBeneficiaryProfile>) => void;
}

export const SocialDashboard: React.FC<SocialDashboardProps> = ({ beneficiary }) => {
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200" dir="rtl">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته الاجتماعية</p>
            </div>
        );
    }

    const socialData = beneficiary.social || { caseStudies: [], clothingDistributions: [], activityLog: [] };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-[#FCB614]/10 text-[#D49A0A]">
                            <Shirt size={24} />
                        </div>
                        <div className="ms-4">
                            <p className="text-sm font-medium text-gray-500">الكسوة الموزَّعة</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {socialData.clothingDistributions.reduce((acc, curr) => acc + curr.items.length, 0)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-[#0F3144]/10 text-[#0F3144]">
                            <Users size={24} />
                        </div>
                        <div className="ms-4">
                            <p className="text-sm font-medium text-gray-500">الدعم الاجتماعي</p>
                            <p className="text-lg font-semibold text-gray-900">نشط</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-[#2BB574]/15 text-[#1E9658]">
                            <Calendar size={24} />
                        </div>
                        <div className="ms-4">
                            <p className="text-sm font-medium text-gray-500">الأنشطة</p>
                            <p className="text-lg font-semibold text-gray-900 truncate">
                                الأشغال الفنية
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="توزيع الكسوة">
                    <div className="space-y-4">
                        <p className="text-gray-600 text-sm">يُدار من هنا مخزون الكسوة وعمليات توزيعها على المستفيد.</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Shirt size={16} className="me-2" /> طلب جديد
                            </Button>
                            <Button variant="outline" size="sm">
                                عرض المخزون
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card title="المشاركة في الأنشطة">
                    <div className="space-y-4">
                        <p className="text-gray-600 text-sm">يُسجَّل هنا مستوى مشاركة المستفيد في الأنشطة الرياضية والفنية والاجتماعية.</p>
                        <Button variant="outline" size="sm">
                            <Calendar size={16} className="me-2" /> تسجيل نشاط
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
