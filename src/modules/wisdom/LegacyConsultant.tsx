import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Brain, Send, User, Sparkles } from 'lucide-react';
import { useWisdom } from '../../hooks/useWisdom';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'system';
    timestamp: Date;
}

export const LegacyConsultant: React.FC = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: 'أهلاً بك يا بني. أنا هنا لأنقل لك خبرات العقود الماضية. كيف تعامل المدير السابق مع الأزمات؟ اسألني عن تجارب المؤسسين.',
            sender: 'system',
            timestamp: new Date()
        }
    ]);

    const { searchWisdom, markUseful, results, loading } = useWisdom();

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: query,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);

        await searchWisdom(query);
        setQuery('');
    };

    // React to results change to add system messages
    React.useEffect(() => {
        if (results.length > 0) {
            const systemMsgs: ChatMessage[] = results.map((r, i) => ({
                id: `sys-${Date.now()}-${i}`,
                text: `${r.answer} (المصدر: ${r.source})`,
                sender: 'system',
                timestamp: new Date()
            }));
            setMessages(prev => [...prev, ...systemMsgs]);
        } else if (loading) {
            // Optional: Loading state
        }
    }, [results]);

    return (
        <Card className="h-[600px] flex flex-col overflow-hidden border-orange-200">
            <div className="bg-gradient-to-br from-hrsd-blue to-hrsd-teal p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    استشر الحكمة المؤسسية
                </h2>
                <div className="bg-white/10 rounded-lg p-3 text-sm text-white/90">
                    "اسألني عن تجارب المؤسسين في الأزمات، نقص الكوادر، رمضان، أو أي تحدٍّ واجهته المراكز سابقاً"
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${msg.sender === 'user' ? 'bg-gray-200' : 'bg-orange-100'}
                        `}>
                            {msg.sender === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Brain className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div className={`
                            max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                            ${msg.sender === 'user'
                                ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                : 'bg-orange-50 border border-orange-100 text-gray-800 rounded-tr-none shadow-sm'}
                        `}>
                            {msg.text}
                            <div className="text-[10px] text-gray-400 mt-1 opacity-70">
                                {msg.timestamp.toLocaleTimeString('ar-SA')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="كيف تعامل المدير السابق مع...؟"
                        className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-primary/50"
                    />
                    <button
                        onClick={handleSend}
                        className="p-3 bg-hrsd-primary text-white rounded-xl hover:bg-hrsd-primary/90 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Card>
    );
};
