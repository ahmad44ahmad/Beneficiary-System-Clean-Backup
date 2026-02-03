import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Users, Target, Calendar, Activity,
    Heart, ChevronLeft, MessageCircle, Phone,
    Image, FileText, Star, Bell, Settings,
    TrendingUp, Clock, Smile, Video, Headphones
} from 'lucide-react';
import { FamilyMediaFeed } from '../../components/family/FamilyMediaFeed';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { empowermentService, RehabGoal, REHAB_DOMAINS } from '../../services/empowermentService';

// Demo Family Member Data
const FAMILY_MEMBER = {
    name: 'أبو محمد العمري',
    relation: 'والد',
    beneficiary_name: 'محمد أحمد العمري',
    beneficiary_photo: null,
    last_visit: '2025-12-28',
    next_visit: '2026-01-10',
};

// Recent Updates Demo
const RECENT_UPDATES = [
    { id: '1', type: 'progress', message: 'تحسن في المشي - وصل لـ 35 متر', date: '2025-12-30', icon: TrendingUp },
    { id: '2', type: 'activity', message: 'شارك في جلسة علاج طبيعي جماعية', date: '2025-12-29', icon: Activity },
    { id: '3', type: 'social', message: 'تفاعل إيجابي مع زملائه في الغداء', date: '2025-12-28', icon: Smile },
    { id: '4', type: 'health', message: 'فحص طبي دوري - كل المؤشرات جيدة', date: '2025-12-27', icon: Heart },
];

// Gallery Demo
const GALLERY_IMAGES = [
    { id: '1', caption: 'جلسة العلاج الطبيعي', date: '2025-12-29' },
    { id: '2', caption: 'نشاط صباحي', date: '2025-12-25' },
    { id: '3', caption: 'احتفال عيد الميلاد', date: '2025-12-20' },
];

// Progress Card
const ProgressCard: React.FC<{ goal: RehabGoal }> = ({ goal }) => {
    const domain = REHAB_DOMAINS.find(d => d.value === goal.domain);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{domain?.icon || '🎯'}</span>
                <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{goal.goal_title}</p>
                    <p className="text-xs text-gray-500">{domain?.label}</p>
                </div>
            </div>
            <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">التقدم</span>
                    <span className="font-bold text-emerald-600">{goal.progress_percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${goal.progress_percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export const FamilyPortal: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState<RehabGoal[]>([]);
    const [activeTab, setActiveTab] = useState<'updates' | 'goals' | 'gallery' | 'messages'>('updates');

    useEffect(() => {
        const fetchData = async () => {
            const data = await empowermentService.getGoals();
            setGoals(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل بوابة الأسرة..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-700 p-6 pb-20 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <Home className="w-8 h-8" />
                    <div>
                        <h1 className="text-xl font-bold">بوابة الأسرة</h1>
                        <p className="text-white/80 text-sm">متابعة تقدم {FAMILY_MEMBER.beneficiary_name}</p>
                    </div>
                </div>
            </div>

            {/* Beneficiary Card */}
            <div className="px-4 -mt-14">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                            {FAMILY_MEMBER.beneficiary_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-800">{FAMILY_MEMBER.beneficiary_name}</h2>
                            <p className="text-sm text-gray-500">
                                مرحباً {FAMILY_MEMBER.name} ({FAMILY_MEMBER.relation})
                            </p>
                        </div>
                        <button className="p-2 bg-blue-100 rounded-full">
                            <Settings className="w-5 h-5 text-blue-600" />
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="bg-emerald-50 rounded-xl p-3 text-center">
                            <TrendingUp className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                            <p className="text-lg font-bold text-emerald-700">{goals.filter(g => g.status === 'in_progress').length}</p>
                            <p className="text-xs text-emerald-600">أهداف نشطة</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <Calendar className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                            <p className="text-sm font-bold text-blue-700">{FAMILY_MEMBER.next_visit}</p>
                            <p className="text-xs text-blue-600">الزيارة القادمة</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                            <Star className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                            <p className="text-lg font-bold text-purple-700">
                                {Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / (goals.length || 1))}%
                            </p>
                            <p className="text-xs text-purple-600">متوسط التقدم</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: Quick Action & Media Feed Section */}
            <div className="px-4 mt-6">
                <div className="flex gap-3 mb-6">
                    <button className="flex-1 py-3 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
                        <Video className="w-5 h-5" />
                        <span className="font-bold">حجز مكالمة فيديو</span>
                    </button>
                    <button className="flex-1 py-3 bg-white text-gray-700 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                        <Headphones className="w-5 h-5 text-gray-400" />
                        <span>طلب دعم</span>
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                        يوميات {FAMILY_MEMBER.beneficiary_name.split(' ')[0]}
                    </h3>
                    <FamilyMediaFeed />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-4 mt-6 overflow-x-auto pb-2">
                {[
                    { key: 'updates', label: 'التحديثات', icon: Bell },
                    { key: 'goals', label: 'الأهداف', icon: Target },
                    { key: 'gallery', label: 'الصور', icon: Image },
                    { key: 'messages', label: 'الرسائل', icon: MessageCircle },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === tab.key
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-600 border hover:border-blue-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="px-4 py-4">
                {/* Updates Tab */}
                {activeTab === 'updates' && (
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">آخر التحديثات</h3>
                        {RECENT_UPDATES.map(update => (
                            <div key={update.id} className="bg-white rounded-xl p-4 shadow-sm border mb-3 flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <update.icon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800">{update.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{update.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Goals Tab */}
                {activeTab === 'goals' && (
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">الأهداف التأهيلية</h3>
                        {goals.map(goal => (
                            <ProgressCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">ألبوم الصور</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {GALLERY_IMAGES.map(img => (
                                <div key={img.id} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl aspect-square flex items-center justify-center">
                                    <div className="text-center">
                                        <Image className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                                        <p className="text-xs text-gray-600">{img.caption}</p>
                                        <p className="text-xs text-gray-400">{img.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">التواصل مع المركز</h3>
                        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                            <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 mb-4">لا توجد رسائل جديدة</p>
                            <div className="flex gap-3 justify-center">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                    <MessageCircle className="w-4 h-4" />
                                    إرسال رسالة
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
                                    <Phone className="w-4 h-4" />
                                    اتصال
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyPortal;
