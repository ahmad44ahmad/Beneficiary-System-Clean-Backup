import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';

interface QualityChecklistProps {
    preview?: boolean;
}

export const QualityChecklist: React.FC<QualityChecklistProps> = ({ preview }) => {
    const [items, setItems] = useState([
        { id: 1, label: 'نظافة منطقة التحضير', checked: true },
        { id: 2, label: 'ارتداء القفازات والكمامات', checked: true },
        { id: 3, label: 'صلاحية المواد الغذائية', checked: true },
        { id: 4, label: 'نظافة ثلاجات التخزين', checked: false },
        { id: 5, label: 'درجة حرارة التقديم (ساخن > 65)', checked: true },
        { id: 6, label: 'نظافة الأواني والأدوات', checked: true },
    ]);

    const displayItems = preview ? items.slice(0, 4) : items;

    const toggle = (id: number) => {
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    return (
        <Card title="قائمة فحص الجودة اليومي" className="h-full">
            <div className="space-y-3">
                {displayItems.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggle(item.id)}
                    >
                        <span className={`text-sm ${item.checked ? 'text-gray-700' : 'text-gray-500'}`}>{item.label}</span>
                        {item.checked ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                        )}
                    </div>
                ))}
            </div>
            {preview && (
                <div className="mt-4 text-center">
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">عرض القائمة الكاملة</span>
                </div>
            )}
        </Card>
    );
};
