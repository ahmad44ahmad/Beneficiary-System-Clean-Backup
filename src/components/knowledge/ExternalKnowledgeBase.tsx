import React, { useState } from 'react';
import { ExternalLink, AlertCircle, BookOpen } from 'lucide-react';

export const ExternalKnowledgeBase: React.FC = () => {
    const [url, setUrl] = useState(import.meta.env.VITE_KNOWLEDGE_BASE_URL || '');
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
    };

    if (!url) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] bg-white rounded-xl shadow-sm p-8 text-center" dir="rtl">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">المكتبة الرقمية (Google Drive)</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                    لعرض ملفاتك هنا، يرجى إضافة رابط الملف أو المجلد في إعدادات البيئة `VITE_KNOWLEDGE_BASE_URL`.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-right w-full max-w-lg">
                    <h3 className="font-bold text-sm text-gray-700 mb-2">كيفية الحصول على الرابط:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>اذهب إلى Google Drive وانقر بزر الفأرة الأيمن على الملف/المجلد.</li>
                        <li>اختر <strong>مشاركة (Share)</strong> ← <strong>نشر على الويب (Publish to Web)</strong> أو <strong>مشاركة الرابط (Share Link)</strong>.</li>
                        <li>تأكد من اختيار "أي شخص لديه الرابط يمكنه المشاهدة".</li>
                        <li>انسخ الرابط وأضفه في ملف `.env`.</li>
                    </ol>
                </div>

                {/* Temporary Input for Demo */}
                <div className="mt-8 w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">جرب رابط مباشر الآن:</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.open(url, '_blank')}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200"
                            disabled={!url}
                        >
                            <ExternalLink className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-right"
                            placeholder="https://docs.google.com/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden" dir="rtl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h2 className="font-bold text-gray-800">المكتبة الرقمية</h2>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <span>فتح في نافذة جديدة</span>
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            <div className="flex-1 relative bg-gray-100">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <iframe
                    src={url}
                    className="w-full h-full border-0"
                    onLoad={handleLoad}
                    title="External Knowledge Base"
                    allowFullScreen
                />
            </div>
        </div>
    );
};
