import React, { useState } from 'react';
import { useUnifiedProfile } from '../../hooks/useUnifiedProfile';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { UnifiedTimeline } from './UnifiedTimeline';
import { GlobalAlerts } from '../common/GlobalAlerts';
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
    Zap // Added Zap icon
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
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'medical' | 'social' | 'rehab' | 'quality' | 'empowerment'>('overview');

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
                            Incident
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <Activity className="w-4 h-4 mr-2" />
                            Vitals
                        </Button>
                        <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Note
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-6 mt-6 border-b border-gray-100">
                    {['overview', 'timeline', 'medical', 'social', 'rehab', 'quality', 'empowerment'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`
                                pb-2 text-sm font-medium capitalize transition-colors relative
                                ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
                            `}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] bg-gray-50/50 p-1 rounded-lg">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Recent Vitals
                            </h3>
                            {profile.latestMedicalExam ? (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-blue-50 p-2 rounded">
                                        <span className="block text-gray-500 text-xs">BP</span>
                                        <span className="font-bold text-blue-700">{profile.latestMedicalExam.vitalSigns.bloodPressure}</span>
                                    </div>
                                    <div className="bg-red-50 p-2 rounded">
                                        <span className="block text-gray-500 text-xs">Pulse</span>
                                        <span className="font-bold text-red-700">{profile.latestMedicalExam.vitalSigns.pulse}</span>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded">
                                        <span className="block text-gray-500 text-xs">Temp</span>
                                        <span className="font-bold text-green-700">{profile.latestMedicalExam.vitalSigns.temperature}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No recent vitals recorded.</p>
                            )}
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-500" />
                                Active Rehab Plan
                            </h3>
                            {profile.activeRehabPlan ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Status</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                            {profile.activeRehabPlan.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="block font-medium text-gray-900 mb-1">Goals Progress:</span>
                                        {profile.activeRehabPlan.goals.slice(0, 3).map(g => (
                                            <div key={g.id} className="flex items-center justify-between mb-1">
                                                <span className="truncate w-32">{g.title}</span>
                                                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${g.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-400 text-sm mb-2">No active plan.</p>
                                    <Button size="sm" variant="outline">Create Plan</Button>
                                </div>
                            )}
                        </Card>

                        <Card className="p-4 md:col-span-2">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Recent Incidents / Logs
                            </h3>
                            <div className="space-y-2">
                                {profile.incidents.length > 0 ? profile.incidents.slice(0, 3).map(inc => (
                                    <div key={inc.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors">
                                        <div className="mt-1">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{inc.type} - {inc.location}</p>
                                            <p className="text-xs text-gray-500">{inc.date} at {inc.time}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 text-sm italic">No recent incidents.</p>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Beneficiary History</h3>
                        <UnifiedTimeline profile={profile} />
                    </div>
                )}

                {activeTab === 'quality' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <DigitalAuditTool />
                    </div>
                )}

                {activeTab === 'empowerment' && (
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <EmpowermentPlanBuilder
                            initialProfile={profile.empowermentProfile}
                            onSave={(newProfile) => console.log('Saving Empowerment Profile:', newProfile)}
                        />
                    </div>
                )}

                {/* Other tabs placeholders */}
                {(activeTab === 'medical' || activeTab === 'social' || activeTab === 'rehab') && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <FileText className="w-8 h-8 mb-2 opacity-50" />
                        <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} details view coming soon.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
