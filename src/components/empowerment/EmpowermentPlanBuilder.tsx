import React, { useState } from 'react';
import { EmpowermentProfile } from '../../types/unified';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
    Target,
    Zap,
    ArrowRight,
    Check,
    Lightbulb
} from 'lucide-react';

interface EmpowermentPlanBuilderProps {
    initialProfile?: EmpowermentProfile;
    onSave: (profile: EmpowermentProfile) => void;
}

export const EmpowermentPlanBuilder: React.FC<EmpowermentPlanBuilderProps> = ({ initialProfile, onSave }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Partial<EmpowermentProfile>>(initialProfile || {
        readinessLevel: 'preparation',
        strengths: [],
        aspirations: [],
        hobbies: [],
        skills: [],
        goals: [],
        currentTracks: []
    });

    const [newStrength, setNewStrength] = useState('');
    const [newAspiration, setNewAspiration] = useState('');

    const handleAddStrength = () => {
        if (newStrength.trim()) {
            setProfile(prev => ({ ...prev, strengths: [...(prev.strengths || []), newStrength.trim()] }));
            setNewStrength('');
        }
    };

    const handleAddAspiration = () => {
        if (newAspiration.trim()) {
            setProfile(prev => ({ ...prev, aspirations: [...(prev.aspirations || []), newAspiration.trim()] }));
            setNewAspiration('');
        }
    };

    const suggestedTracks = [
        { name: 'التصميم الجرافيكي', icon: '🎨', match: 'إبداعي' },
        { name: 'صيانة الحاسب', icon: '💻', match: 'تقني' },
        { name: 'فنون الطهي', icon: '🍳', match: 'عملي' },
        { name: 'البستنة', icon: '🌱', match: 'بيئي' }
    ];

    const renderStep1_Discovery = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" dir="rtl">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#FCB614]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-[#FCB614]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">اكتشف إمكاناتك</h3>
                <p className="text-gray-500">ما الذي تُجيده؟ وما الذي تستمتع به؟</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border-[#269798]/10 bg-[#269798]/10/50">
                    <h4 className="font-bold text-[#0F3144] mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> نقاط القوة
                    </h4>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            placeholder="مثلاً: صبور، مبدع..."
                            value={newStrength}
                            onChange={(e) => setNewStrength(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddStrength()}
                        />
                        <Button size="sm" onClick={handleAddStrength}>إضافة</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.strengths?.map((s, i) => (
                            <span key={i} className="bg-white text-[#269798] px-3 py-1 rounded-full text-sm shadow-sm border border-[#269798]/10 flex items-center gap-1">
                                {s} <button onClick={() => setProfile(prev => ({ ...prev, strengths: prev.strengths?.filter((_, idx) => idx !== i) }))} className="hover:text-[#DC2626] ms-1">×</button>
                            </span>
                        ))}
                    </div>
                </Card>

                <Card className="p-4 border-[#FCB614]/10 bg-[#FCB614]/10/50">
                    <h4 className="font-bold text-[#0F3144] mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" /> التطلّعات
                    </h4>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            placeholder="مثلاً: الحصول على عمل، تعلّم الرسم..."
                            value={newAspiration}
                            onChange={(e) => setNewAspiration(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddAspiration()}
                        />
                        <Button size="sm" onClick={handleAddAspiration}>إضافة</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.aspirations?.map((s, i) => (
                            <span key={i} className="bg-white text-[#FCB614] px-3 py-1 rounded-full text-sm shadow-sm border border-[#FCB614]/10 flex items-center gap-1">
                                {s} <button onClick={() => setProfile(prev => ({ ...prev, aspirations: prev.aspirations?.filter((_, idx) => idx !== i) }))} className="hover:text-[#DC2626] ms-1">×</button>
                            </span>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderStep2_Pathways = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" dir="rtl">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">المسارات المقترحة</h3>
                <p className="text-gray-500">بناءً على نقاط القوة، إليك مسارات تأهيلية مقترحة</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedTracks.map((track) => (
                    <div key={track.name} className="border rounded-xl p-4 hover:border-[#269798] hover:shadow-md transition-all cursor-pointer bg-white group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{track.icon}</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-[#269798] transition-colors">{track.name}</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">المطابقة: {track.match}</span>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-[#269798] group-hover:bg-[#269798]/10 flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-[#269798]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep3_Goals = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" dir="rtl">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#2BB574]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-[#2BB574]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">حدِّد الهدف الأول</h3>
                <p className="text-gray-500">يجب أن يكون الهدف ذكياً (محدد، قابل للقياس، قابل للتحقيق، واقعي، مرتبط بزمن)</p>
            </div>

            <Card className="p-6 max-w-lg mx-auto border-[#2BB574]/10 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الهدف</label>
                        <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="مثلاً: إتمام دورة الحاسب الأساسية" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الإنجاز</label>
                            <input type="date" className="w-full border rounded-lg px-4 py-2" title="تاريخ الإنجاز" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                            <select className="w-full border rounded-lg px-4 py-2" title="تصنيف الهدف">
                                <option>تطوير المهارات</option>
                                <option>التوظيف</option>
                                <option>التعليم</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden max-w-4xl mx-auto my-8" dir="rtl">
            {/* Wizard Header */}
            <div className="bg-gradient-to-r from-[#269798] to-[#FCB614] p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="w-6 h-6 text-[#FCB614]" />
                    بناء خطة التمكين
                </h2>
                <p className="text-[#269798]/40 mt-1">بناء مستقبل قائم على القدرة، لا على الإعاقة</p>

                {/* Progress Steps */}
                <div className="flex items-center mt-6 gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-white text-[#269798]' : 'bg-[#0F3144]/50 text-[#269798]/60'}`}>
                                {step > i ? <Check className="w-5 h-5" /> : i}
                            </div>
                            {i < 3 && <div className={`w-12 h-1 bg-[#0F3144]/50 mx-2 ${step > i ? 'bg-white/50' : ''}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Wizard Content */}
            <div className="p-8 min-h-[400px]">
                {step === 1 && renderStep1_Discovery()}
                {step === 2 && renderStep2_Pathways()}
                {step === 3 && renderStep3_Goals()}
            </div>

            {/* Wizard Footer */}
            <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                >
                    السابق
                </Button>

                {step < 3 ? (
                    <Button onClick={() => setStep(s => Math.min(3, s + 1))}>
                        الخطوة التالية <ArrowRight className="w-4 h-4 ms-2" />
                    </Button>
                ) : (
                    <Button onClick={() => onSave(profile as EmpowermentProfile)} className="bg-[#2BB574] hover:bg-[#2BB574] text-white">
                        إنهاء وحفظ الخطة <Check className="w-4 h-4 ms-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};
