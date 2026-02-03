import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';

interface FeedPost {
    id: string;
    type: 'image' | 'video' | 'milestone';
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    content: string;
    mediaUrl?: string; // Placeholder color or URL
    timestamp: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
}

const MOCK_POSTS: FeedPost[] = [
    {
        id: '1',
        type: 'image',
        author: { name: 'سارة الأحمد', role: 'الأخصائية الاجتماعية', avatar: '👩‍⚕️' },
        content: 'قضينا وقتاً ممتعاً اليوم في ورشة الرسم! عبد الله أبدع في استخدام الألوان المائية وكان سعيداً جداً بالإنجاز. 🎨✨',
        mediaUrl: 'bg-gradient-to-br from-indigo-100 to-purple-100',
        timestamp: 'منذ 2 ساعة',
        likes: 12,
        comments: 3
    },
    {
        id: '2',
        type: 'milestone',
        author: { name: 'د. فيصل المالكي', role: 'طبيب المركز', avatar: '👨‍⚕️' },
        content: 'خبر رائع! تحسن ملحوظ في استجابة العضلات بعد جلسات العلاج الطبيعي المكثفة هذا الأسبوع. ماشاء الله تبارك الله. 💪',
        timestamp: 'أمس',
        likes: 24,
        comments: 5
    },
    {
        id: '3',
        type: 'video',
        author: { name: 'نورة السعيد', role: 'مشرفة الأنشطة', avatar: '🧕' },
        content: 'مقتطفات من حفل اليوم الوطني بالمركز 🇸🇦 احتفلنا سوياً في أجواء عائلية جميلة.',
        mediaUrl: 'bg-gradient-to-br from-green-100 to-emerald-100',
        timestamp: 'منذ 3 أيام',
        likes: 45,
        comments: 8
    }
];

export const FamilyMediaFeed: React.FC = () => {
    const [posts, setPosts] = useState(MOCK_POSTS);

    const handleLike = (id: string) => {
        setPosts(posts.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                    isLiked: !p.isLiked
                };
            }
            return p;
        }));
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* New Post Input (Read Only for Family) */}
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
                        </div>
                    </div>
                </div>
            </Card>

            {/* Feed */}
            {posts.map(post => (
                <Card key={post.id} className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
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
                        <button className="text-gray-400 hover:bg-gray-50 p-1 rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-2">
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Media Placeholder */}
                    {post.mediaUrl && (
                        <div className={`mt-2 h-64 w-full ${post.mediaUrl} flex items-center justify-center group cursor-pointer relative`}>
                            {post.type === 'video' ? (
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Video className="w-6 h-6 text-gray-800 ml-1" />
                                </div>
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-400/50" />
                            )}
                        </div>
                    )}

                    {/* Special Milestone Style */}
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

                    {/* Actions */}
                    <div className="p-4 flex items-center justify-between border-t mt-2">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
