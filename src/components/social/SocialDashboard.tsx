import React, { useState } from 'react';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import { Card } from '../ui/Card';
import { Shirt, Users, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface SocialDashboardProps {
    beneficiary?: UnifiedBeneficiaryProfile | null;
    onUpdate?: (data: any) => void;
}

export const SocialDashboard: React.FC<SocialDashboardProps> = ({ beneficiary, onUpdate }) => {
    // Handle case where beneficiary is not provided
    if (!beneficiary) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">يرجى اختيار مستفيد لعرض بياناته الاجتماعية</p>
            </div>
        );
    }

    // Mock data access for Social/Activities
    const socialData = beneficiary.social || { caseStudies: [], clothingDistributions: [], activityLog: [] };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <Shirt size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Clothing Items</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {socialData.clothingDistributions.reduce((acc, curr) => acc + curr.items.length, 0)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <Users size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Social Support</p>
                            <p className="text-lg font-semibold text-gray-900">Active</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Calendar size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Activities</p>
                            <p className="text-lg font-semibold text-gray-900 truncate">
                                Arts & Crafts
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions for Clothing & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Clothing Distribution">
                    <div className="space-y-4">
                        <p className="text-gray-600 text-sm">Manage inventory and distribution of clothing for the beneficiary.</p>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                                <Shirt size={16} className="mr-2" /> New Request
                            </Button>
                            <Button variant="outline" size="sm">
                                View Inventory
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card title="Activity Participation">
                    <div className="space-y-4">
                        <p className="text-gray-600 text-sm">Log participation in center activities (Sports, Art, Social).</p>
                        <Button variant="outline" size="sm">
                            <Calendar size={16} className="mr-2" /> Log Activity
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
