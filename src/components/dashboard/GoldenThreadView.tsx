import React, { useState } from 'react';
import {
    Network,
    ChevronDown,
    ChevronLeft,
    Target,
    Building2,
    Users,
    CheckCircle2,
    Share2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { getGovernanceTree, StrategicGoal } from '../../services/governanceService';

export const GoldenThreadView: React.FC = () => {
    const [tree] = useState<StrategicGoal[]>(getGovernanceTree());

    // Recursive component to render tree nodes
    const TreeNode: React.FC<{ node: StrategicGoal; depth: number }> = ({ node, depth }) => {
        const [isExpanded, setIsExpanded] = useState(true);

        const getIcon = (level: string) => {
            switch (level) {
                case 'national': return <Target className="w-5 h-5 text-[#0F3144]" />;
                case 'ministry': return <Building2 className="w-5 h-5 text-[#269798]" />;
                case 'department': return <Users className="w-5 h-5 text-[#1B7778]" />;
                case 'operational': return <CheckCircle2 className="w-5 h-5 text-[#1E9658]" />;
                default: return <Target className="w-5 h-5" />;
            }
        };

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'on_track': return 'bg-[#2BB574]/15 text-[#1E9658] border-[#2BB574]/20';
                case 'at_risk': return 'bg-[#FCB614]/15 text-[#D49A0A] border-[#FCB614]/30';
                case 'delayed': return 'bg-[#DC2626]/15 text-[#B91C1C] border-[#DC2626]/30';
                default: return 'bg-gray-100 text-gray-700';
            }
        };

        return (
            <div className="relative">
                {/* Connecting Line (Vertical) */}
                {depth > 0 && (
                    <div
                        className="absolute right-[-24px] top-0 bottom-0 w-px bg-gray-200"
                        style={{ height: node.children ? '100%' : '50%' }} // Stop line halfway for leaf nodes
                    />
                )}

                {/* Connecting Line (Horizontal) to Parent */}
                {depth > 0 && (
                    <div className="absolute right-[-24px] top-8 w-6 h-px bg-gray-200" />
                )}

                <div
                    className={`
                        relative mb-4 p-4 rounded-xl border-s-4 shadow-sm bg-white transition-all
                        ${depth === 0 ? 'border-s-indigo-500 mb-8' : ''}
                        ${depth === 1 ? 'border-s-blue-500 me-8' : ''}
                        ${depth === 2 ? 'border-s-teal-500 me-16' : ''}
                        ${depth === 3 ? 'border-s-green-500 me-24' : ''}
                    `}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-1 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                {node.children ? (
                                    isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <div className="w-4 h-4" /> // Spacer
                                )}
                            </button>

                            <div className="bg-gray-50 p-2 rounded-lg">
                                {getIcon(node.level)}
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800">{node.title}</h4>
                                <p className="text-sm text-gray-500 mt-1 mb-2">{node.description}</p>

                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(node.status)}`}>
                                        {node.status === 'on_track' ? 'منتظم' : node.status === 'at_risk' ? 'خطر' : 'متأخر'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">
                                        الإنجاز: {node.progress}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar (Mini) */}
                        <div className="w-24 mt-2 hidden sm:block">
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${node.progress >= 80 ? 'bg-[#2BB574]' :
                                            node.progress >= 50 ? 'bg-[#FCB614]' : 'bg-[#DC2626]'
                                        }`}
                                    style={{ width: `${node.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render Children */}
                {isExpanded && node.children && (
                    <div className="border-e border-gray-100 pe-6 me-6"> {/* Indent Children */}
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500" dir="rtl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Network className="w-8 h-8 text-[#0F3144]" />
                        الحوكمة: الخيط الذهبي (The Golden Thread)
                    </h1>
                    <p className="text-gray-500 mt-1">تتبع المواءمة الاستراتيجية من رؤية 2030 وصولاً للمهام اليومية</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                        <Share2 className="w-4 h-4" />
                        مشاركة
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0F3144] text-white rounded-lg text-sm font-medium hover:bg-[#0A2030] shadow-sm">
                        + هدف جديد
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {tree.map(rootNode => (
                    <TreeNode key={rootNode.id} node={rootNode} depth={0} />
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-[#0F3144]/5 border-[#0F3144]/10">
                    <h3 className="font-bold text-[#0A2030] mb-2">الرؤية الوطنية</h3>
                    <p className="text-sm text-[#0A2030] opacity-80">المستوى الاستراتيجي الأعلى. يحدد التوجه العام للدولة (مثل رؤية 2030).</p>
                </Card>
                <Card className="p-6 bg-[#269798]/10 border-[#269798]/10">
                    <h3 className="font-bold text-[#0F3144] mb-2">أهداف المركز</h3>
                    <p className="text-sm text-[#1B7778] opacity-80">ترجمة الرؤية إلى أهداف تشغيلية خاصة بالمركز والأقسام.</p>
                </Card>
                <Card className="p-6 bg-[#2BB574]/10 border-[#2BB574]/10">
                    <h3 className="font-bold text-[#14532D] mb-2">الخطط الفردية</h3>
                    <p className="text-sm text-[#1E9658] opacity-80">المهام اليومية مع المستفيدين. يجب أن ترتبط بهدف أعلى.</p>
                </Card>
            </div>
        </div>
    );
};
