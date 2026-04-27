import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video, Calendar, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface FeedPost {
    id: string;
    type: 'image' | 'video' | 'milestone';
    author: { name: string; role: string; avatar: string };
    content: string;
    mediaUrl?: string;
    timestamp: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
    approvalStatus: ApprovalStatus;
    approvedBy?: string;
    approvedAt?: string;
}

const MOCK_POSTS: FeedPost[] = [
    {
        id: '1',
        type: 'image',
        author: { name: 'سارة الأحمد', role: 'الأخصائية الاجتماعية', avatar: '👩‍⚕️' },
        content: 'قضى أبو سعد وقتاً ممتعاً اليوم في ورشة الرسم. أبدع في استخدام الألوان المائية وكان سعيداً جداً بالإنجاز.',
        mediaUrl: 'bg-gradient-to-br from-indigo-100 to-purple-100',
        timestamp: 'منذ ٢ ساعة',
        likes: 12,
        comments: 3,
        approvalStatus: 'approved',
        approvedBy: 'مدير المركز',
        approvedAt: 'منذ ١ ساعة',
    },
    {
        id: '2',
        type: 'milestone',
        author: { name: 'د. فيصل المالكي', role: 'طبيب المركز', avatar: '👨‍⚕️' },
        content: 'تحسّن ملحوظ في استجابة العضلات بعد جلسات التأهيل المكثّفة هذا الأسبوع.',
        timestamp: 'أمس',
        likes: 24,
        comments: 5,
        approvalStatus: 'approved',
        approvedBy: 'مدير المركز',
        approvedAt: 'أمس',
    },
    {
        id: '3',
        type: 'video',
        author: { name: 'نورة السعيد', role: 'مشرفة الأنشطة', avatar: '🧕' },
        content: 'مقتطفات من حفل اليوم الوطني بالمركز — احتفلنا في أجواء عائلية جميلة.',
        mediaUrl: 'bg-gradient-to-br from-green-100 to-emerald-100',
        timestamp: 'منذ ٣ أيام',
        likes: 45,
        comments: 8,
        approvalStatus: 'approved',
        approvedBy: 'مدير المركز',
        approvedAt: 'منذ ٣ أيام',
    },
    {
        id: '4',
        type: 'video',
        author: { name: 'الممرضة عبير الشهري', role: 'تمريض', avatar: '👩‍⚕️' },
        content: 'مقطع قصير لأبو سعد وهو يتدرّب على الإمساك بكوب الماء بشكل مستقل — للأسرة فقط.',
        mediaUrl: 'bg-gradient-to-br from-amber-100 to-orange-100',
        timestamp: 'منذ ٣٠ دقيقة',
        likes: 0,
        comments: 0,
        approvalStatus: 'pending',
    },
];

interface FamilyMediaFeedProps {
    /** عرض قائمة الاعتماد للمدير. الافتراضي true (للديمو). */
    showApprovalQueue?: boolean;
}

export const FamilyMediaFeed: React.FC<FamilyMediaFeedProps> = ({ showApprovalQueue = true }) => {
    const [posts, setPosts] = useState(MOCK_POSTS);

    const handleLike = (id: string) => {
        setPosts(posts.map(p => p.id === id
            ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
            : p));
    };

    const handleApprove = (id: string) => {
        setPosts(prev => prev.map(p => p.id === id
            ? { ...p, approvalStatus: 'approved', approvedBy: 'مدير المركز', approvedAt: 'الآن' }
            : p));
    };

    const handleReject = (id: string) => {
        setPosts(prev => prev.map(p => p.id === id
            ? { ...p, approvalStatus: 'rejected', approvedBy: 'مدير المركز', approvedAt: 'الآن' }
            : p));
    };

    const pendingPosts = posts.filter(p => p.approvalStatus === 'pending');
    const visiblePosts = posts.filter(p => p.approvalStatus === 'approved');

    return (
        <div className="space-y-6 max-w-2xl mx-auto">

            {/* Director Approval Queue */}
            {showApprovalQueue && pendingPosts.length > 0 && (
                <Card className="p-5 border-amber-200 bg-amber-50/50">
                    <div className="flex items-start gap-3 mb-4">
                        <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-amber-900">قائمة اعتماد الإدارة</h3>
                            <p className="text-xs text-amber-700">لا تُرسَل أي رسالة للأسرة قبل اعتماد المدير</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {pendingPosts.map(post => (
                            <div key={post.id} className="bg-white border border-amber-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Clock className="w-3.5 h-3.5" />
                                        {post.timestamp}
                                        <span>•</span>
                                        <span>{post.author.name}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">قيد الاعتماد</span>
                                </div>
                                <p className="text-sm text-slate-700 mb-3">{post.content}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(post.id)}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> اعتماد وإرسال
                                    </button>
                                    <button
                                        onClick={() => handleReject(post.id)}
                                        className="px-4 py-2 bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-700 text-slate-600 rounded-lg text-sm font-medium flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> رفض
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* New Post Input */}
            <Card className="p-4 bg-white shadow-sm border-blue-100">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">👨‍👩‍👦</div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="اكتب تعليقاً أو استفساراً..."
                            className="w-full bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <div className="flex gap-4 mt-3 text-gray-500 text-sm">
                            <button className="flex items-center gap-1 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
                                <ImageIcon className="w-4 h-4" />
                                <span>صورة</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors">
                                <Video className="w-4 h-4" />
                                <span>فيديو</span>
                            </button>
                            <span className="text-[11px] text-amber-700 mr-auto self-center">يلزم اعتماد المدير قبل الإرسال</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Approved Feed */}
            {visiblePosts.map(post => (
                <Card key={post.id} className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 border flex items-center justify-center text-xl shadow-sm">
                                {post.author.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{post.author.name}</h4>
                                <p className="text-xs text-blue-600 font-medium">{post.author.role}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{post.timestamp}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:bg-gray-50 p-1 rounded-full" title="خيارات إضافية">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-4 pb-2">
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {post.mediaUrl && (
                        <div className={`mt-2 h-64 w-full ${post.mediaUrl} flex items-center justify-center group cursor-pointer relative`}>
                            {post.type === 'video' ? (
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Video className="w-6 h-6 text-gray-800 ms-1" />
                                </div>
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-400/50" />
                            )}
                        </div>
                    )}

                    {post.type === 'milestone' && (
                        <div className="mx-4 mt-2 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-3">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-bold text-yellow-800 text-sm">إنجاز جديد!</p>
                                <p className="text-xs text-yellow-700">تم تحديث سجل الإنجازات في ملف التمكين</p>
                            </div>
                        </div>
                    )}

                    <div className="px-4 pt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 border-t mt-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>مُعتمَد من {post.approvedBy} {post.approvedAt && `— ${post.approvedAt}`}</span>
                    </div>

                    <div className="p-4 flex items-center justify-between border-t mt-1">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                                title="إعجاب"
                            >
                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors" title="تعليق">
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors" title="مشاركة">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
