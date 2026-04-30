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
import { RehabPlanBuilder } from '../rehab/RehabPlanBuilder';
import { SocialResearchWizard } from '../social/SocialResearchWizard';
import {
    User,
    Activity,
    Calendar,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    Heart,
    Users,
    ShieldCheck,
    Zap,
    Shirt
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
        const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
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
                                            ${tag.color === 'red' ? 'bg-[#DC2626]/10 text-[#B91C1C] border-[#DC2626]/30' : ''}
                                            ${tag.color === 'orange' ? 'bg-[#F7941D]/10 text-[#D67A0A] border-[#F7941D]/30' : ''}
                                            ${tag.color === 'blue' ? 'bg-[#269798]/10 text-[#1B7778] border-[#269798]/30' : ''}
                                            ${tag.color === 'purple' ? 'bg-[#FCB614]/10 text-[#D49A0A] border-[#FCB614]/20' : ''}
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
                        <Button variant="outline" size="sm" className="text-[#DC2626] border-[#DC2626]/30 hover:bg-[#DC2626]/10">
                            <AlertTriangle className="w-4 h-4 me-2" />
                            Report Incident
                        </Button>
                        <Button variant="primary" size="sm">
                            <FileText className="w-4 h-4 me-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-6 mt-6 border-b overflow-x-auto">
                    {[
                        { id: 'overview', label: 'نظرة عامة', icon: Activity },
                        { id: 'timeline', label: 'الخط الزمني', icon: Clock },
                        { id: 'medical', label: 'الملف الطبي', icon: Heart },
                        { id: 'social', label: 'الاجتماعي', icon: Users },
                        { id: 'rehab', label: 'خطة التأهيل', icon: CheckCircle },
                        { id: 'empowerment', label: 'التمكين', icon: Zap },
                        { id: 'support', label: 'خدمات الدعم', icon: Shirt },
                        { id: 'quality', label: 'الجودة والمخاطر', icon: ShieldCheck },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`
                                pb-3 px-1 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'border-[#1B7778] text-[#269798]'
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
                        <Card title="ملخص سريع">
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
                                    <p className="text-sm text-gray-600 bg-[#FCB614]/10 p-2 rounded border border-[#FCB614]/10">
                                        {profile.notes}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card title="الحالة النشطة">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-sm text-gray-600">Rehab Plan</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${profile.activeRehabPlan?.status === 'active' ? 'bg-[#2BB574]/15 text-[#1E9658]' : 'bg-gray-100 text-gray-600'}`}>
                                        {profile.activeRehabPlan?.status || 'No Plan'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-sm text-gray-600">Risk Level</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${profile.riskLevel === 'high' ? 'bg-[#DC2626]/15 text-[#B91C1C]' :
                                            profile.riskLevel === 'medium' ? 'bg-[#F7941D]/15 text-[#D67A0A]' : 'bg-[#2BB574]/15 text-[#1E9658]'}
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
                        <DigitalAuditTool />
                    </div>
                )}

                {activeTab === 'empowerment' && (
                    <EmpowermentPlanBuilder
                        initialProfile={profile.empowermentProfile}
                        onSave={() => {}}
                    />
                )}

                {activeTab === 'support' && (
                    <div className="space-y-6">
                        {/* Nutrition Plan */}
                        <Card title="خطة التغذية" className="border-s-4 border-s-green-500">
                            {profile.nutritionPlan ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Diet Type</label>
                                        <p className="font-bold text-gray-800">{profile.nutritionPlan.dietType}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Hydration Goal</label>
                                        <p className="font-bold text-[#269798]">{profile.nutritionPlan.hydrationGoal}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-500">Restrictions</label>
                                        <div className="flex gap-2 mt-1">
                                            {profile.nutritionPlan.restrictions.map((r, i) => (
                                                <span key={i} className="px-2 py-1 bg-[#DC2626]/10 text-[#B91C1C] text-xs rounded border border-[#DC2626]/10">
                                                    {r}
                                                </span>
                                            ))}
                                            {profile.nutritionPlan.restrictions.length === 0 && <span className="text-sm text-gray-400">None</span>}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">لا توجد خطة تغذية مسندة</p>
                            )}
                        </Card>

                        {/* Clothing Requests */}
                        <Card title="الملابس والمتعلقات الشخصية" className="border-s-4 border-s-blue-500">
                            {profile.clothingRequests && profile.clothingRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {profile.clothingRequests.map(req => (
                                        <div key={req.id} className="flex justify-between items-center p-3 bg-white rounded border shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#269798]/10 rounded-full">
                                                    <Shirt className="w-4 h-4 text-[#269798]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{req.item}</p>
                                                    <p className="text-xs text-gray-500">Size: {req.size} • Requested: {req.requestDate}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${req.status === 'pending' ? 'bg-[#FCB614]/10 text-[#D49A0A]' :
                                                    req.status === 'approved' ? 'bg-[#269798]/15 text-[#1B7778]' :
                                                        req.status === 'delivered' ? 'bg-[#2BB574]/15 text-[#1E9658]' : 'bg-gray-100'}
                                            `}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400">
                                    <Shirt className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p>لا توجد طلبات ملابس نشطة</p>
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t flex justify-end">
                                <Button size="sm" variant="outline">Request New Item</Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activeTab === 'medical' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card title="التشخيصات">
                                <ul className="space-y-2">
                                    <li className="p-3 bg-[#DC2626]/10 rounded-lg border border-[#DC2626]/10 flex justify-between">
                                        <span className="font-bold text-gray-800">{profile.medicalProfile?.primaryDiagnosis || 'غير محدد'}</span>
                                        <span className="text-xs bg-[#DC2626]/20 text-[#7F1D1D] px-2 py-0.5 rounded-full">تشخيص أساسي</span>
                                    </li>
                                    {profile.medicalProfile?.secondaryDiagnoses?.map((d, i) => (
                                        <li key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700">
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                            <Card title="الأدوية الحالية">
                                {profile.medicalProfile?.currentMedications?.length ? (
                                    <div className="space-y-2">
                                        {profile.medicalProfile.currentMedications.map((m, i) => (
                                            <div key={i} className="p-3 bg-[#269798]/10 rounded-lg border border-[#269798]/10 flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-[#0F3144]">{m.name}</div>
                                                    <div className="text-xs text-[#1B7778]">{m.dosage} - {m.frequency}</div>
                                                </div>
                                                <Activity className="w-5 h-5 text-[#269798]" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center py-4">لا توجد أدوية مسجلة</p>
                                )}
                            </Card>
                        </div>
                        <Card title="العلامات الحيوية">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-800">{profile.latestMedicalExam?.vitalSigns?.temperature || '-'}</div>
                                    <div className="text-xs text-gray-500">درجة الحرارة</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-800">{profile.latestMedicalExam?.vitalSigns?.bloodPressure || '-'}</div>
                                    <div className="text-xs text-gray-500">ضغط الدم</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-800">{profile.latestMedicalExam?.vitalSigns?.pulse || '-'}</div>
                                    <div className="text-xs text-gray-500">النبض</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-800">{profile.latestMedicalExam?.vitalSigns?.respiration || '-'}</div>
                                    <div className="text-xs text-gray-500">معدل التنفس</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Social Tab */}
                {activeTab === 'social' && (
                    <div className="space-y-6">
                        <SocialResearchWizard />
                    </div>
                )}

                {/* Rehab Tab */}
                {activeTab === 'rehab' && (
                    <RehabPlanBuilder />
                )}
            </div>
        </Modal>
    );
};
