import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Upload, Camera } from 'lucide-react';

export const ViolationReport: React.FC = () => {
    const [audit, setAudit] = useState({ type: 'hygiene', description: '', severity: 'low' });

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border-red-100 shadow-lg">
                <div className="p-6 border-b border-gray-100 bg-red-50 rounded-t-xl flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">تسجيل مخالفة إعاشة</h3>
                        <p className="text-sm text-gray-500">يتم إرسال التقرير مباشرة لمدير التشغيل والمشرف</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع المخالفة</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                            value={audit.type}
                            onChange={(e) => setAudit({ ...audit, type: e.target.value })}
                        >
                            <option value="hygiene">نظافة العاملين</option>
                            <option value="food_quality">جودة الطعام (طعم/رائحة)</option>
                            <option value="quantity">نقص الكميات</option>
                            <option value="temperature">درجة حرارة الطعام</option>
                            <option value="timing">تأخير في التقديم</option>
                            <option value="other">أخرى</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">درجة الخطورة</label>
                        <div className="flex gap-4">
                            {['low', 'medium', 'high', 'critical'].map(level => (
                                <label key={level} className={`
                                    flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                                    ${audit.severity === level
                                        ? 'bg-red-50 border-red-500 text-red-700 font-bold'
                                        : 'border-gray-200 hover:bg-gray-50'}
                                `}>
                                    <input
                                        type="radio"
                                        name="severity"
                                        value={level}
                                        checked={audit.severity === level}
                                        onChange={(e) => setAudit({ ...audit, severity: e.target.value })}
                                        className="hidden"
                                    />
                                    {level === 'low' && 'منخفضة'}
                                    {level === 'medium' && 'متوسطة'}
                                    {level === 'high' && 'عالية'}
                                    {level === 'critical' && 'حرجة'}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">وصف المخالفة</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 min-h-[100px]"
                            placeholder="اكتب تفاصيل المخالفة هنا..."
                            value={audit.description}
                            onChange={(e) => setAudit({ ...audit, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">إرفاق صور (إثبات)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">اضغط لالتقاط صورة أو رفع ملف</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost">إلغاء</Button>
                        <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white">
                            إرسال التقرير
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
