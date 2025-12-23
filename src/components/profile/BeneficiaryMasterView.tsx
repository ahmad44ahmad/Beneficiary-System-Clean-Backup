import React, { useState } from 'react';
import { useUnifiedProfile } from '../../hooks/useUnifiedProfile';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { UnifiedTimeline } from './UnifiedTimeline';
import { GlobalAlerts } from '../common/GlobalAlerts';
import { RiskRegister } from '../quality/RiskRegister';
import { DigitalAuditTool } from '../quality/DigitalAuditTool';
import { EmpowermentPlanBuilder } from '../empowerment/EmpowermentPlanBuilder';
import {
    User,
    Activity,
    Calendar,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    Heart,
    Shield,
    Users,
    X,
    ShieldCheck,
    Zap,
    Shirt,
    Utensils
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface BeneficiaryMasterViewProps {
    beneficiaryId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const BeneficiaryMasterView: React.FC<BeneficiaryMasterViewProps> = ({
    beneficiaryId,
    isOpen,
    onClose
}) => {
    const profile = useUnifiedProfile(beneficiaryId);
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'medical' | 'social' | 'rehab' | 'quality' | 'empowerment' | 'support'>('overview');

    if (!profile) return null;

    // Helper to render dynamic icons
    const renderIcon = (iconName?: string, className?: string) => {
        if (!iconName) return null;
        const Icon = (LucideIcons as any)[iconName];
        return Icon ? <Icon className={className} /> : null;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
            {/* Global Alerts System */}
            <GlobalAlerts profile={profile} />

            {/* Header Section - Always Visible */}
            <div className="bg-white border-b pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {profile.fullName}
                                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    ID: {profile.id}
                                </span>
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Age: {profile.age}</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Room: {profile.roomNumber || 'N/A'}</span>
                            </div>

                            {/* Smart Tags Row */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {profile.smartTags.map(tag => (
                                    <span
                                        key={tag.id}
                                        className={`
                                            inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${tag.color === 'red' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                            ${tag.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                                            ${tag.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                            ${tag.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                            ${tag.color === 'gray' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
                                        `}
                                        title={tag.description}
                                    >
                                        {renderIcon(tag.icon, "w-3 h-3")}
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Report Incident
                        </Button>
                        <Button variant="primary" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-6 mt-6 border-b overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: Activity },
                        { id: 'timeline', label: 'Timeline', icon: Clock },
                        { id: 'medical', label: 'Medical File', icon: Heart },
                        { id: 'social', label: 'Social', icon: Users },
                        { id: 'rehab', label: 'Rehab Plan', icon: CheckCircle },
                        { id: 'empowerment', label: 'Empowerment', icon: Zap },
                        { id: 'support', label: 'Support Services', icon: Shirt },
                        { id: 'quality', label: 'Quality & Risk', icon: ShieldCheck },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                pb-3 px-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] bg-gray-50 p-4 rounded-lg">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Quick Summary">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Medical Diagnosis</label>
                                    <p className="font-medium">{profile.medicalDiagnosis}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Social Status</label>
                                    <p className="font-medium">{profile.socialStatus}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Key Notes</label>
                                    <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100">
                                        {profile.notes}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card title="Active Status">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-sm text-gray-600">Rehab Plan</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${profile.activeRehabPlan?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {profile.activeRehabPlan?.status || 'No Plan'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-sm text-gray-600">Risk Level</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${profile.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                                            profile.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}
                                    `}>
                                        {profile.riskLevel.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'timeline' && <UnifiedTimeline profile={profile} />}

                {activeTab === 'quality' && (
                    <div className="space-y-6">
                        <RiskRegister profile={profile} />
                        <DigitalAuditTool profile={profile} />
                    </div>
                )}

                {activeTab === 'empowerment' && (
                    <EmpowermentPlanBuilder profile={profile} />
                )}

                {activeTab === 'support' && (
                    <div className="space-y-6">
                        {/* Nutrition Plan */}
                        <Card title="Nutrition Plan" className="border-l-4 border-l-green-500">
                            {profile.nutritionPlan ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Diet Type</label>
                                        <p className="font-bold text-gray-800">{profile.nutritionPlan.dietType}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Hydration Goal</label>
                                        <p className="font-bold text-blue-600">{profile.nutritionPlan.hydrationGoal}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-500">Restrictions</label>
                                        <div className="flex gap-2 mt-1">
                                            {profile.nutritionPlan.restrictions.map((r, i) => (
                                                <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100">
                                                    {r}
                                                </span>
                                            ))}
                                            {profile.nutritionPlan.restrictions.length === 0 && <span className="text-sm text-gray-400">None</span>}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No nutrition plan assigned.</p>
                            )}
                        </Card>

                        {/* Clothing Requests */}
                        <Card title="Clothing & Personal Items" className="border-l-4 border-l-blue-500">
                            {profile.clothingRequests && profile.clothingRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {profile.clothingRequests.map(req => (
                                        <div key={req.id} className="flex justify-between items-center p-3 bg-white rounded border shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-full">
                                                    <Shirt className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{req.item}</p>
                                                    <p className="text-xs text-gray-500">Size: {req.size} • Requested: {req.requestDate}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                        req.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}
                                            `}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400">
                                    <Shirt className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p>No active clothing requests</p>
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t flex justify-end">
                                <Button size="sm" variant="outline">Request New Item</Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {(activeTab === 'medical' || activeTab === 'social' || activeTab === 'rehab') && (
                    <div className="text-center py-12 text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Detailed view for {activeTab} is under construction for this demo.</p>
                        <p className="text-sm">Please check the "Overview", "Quality", "Empowerment", or "Support" tabs.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
