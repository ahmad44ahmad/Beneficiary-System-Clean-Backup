import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeftRight, Clock, AlertTriangle, CheckCircle, Pill,
    Heart, MessageSquare, Mic, Plus, X, ChevronDown, ChevronUp,
    User, Shield, Utensils, Activity, FileText, Send
} from 'lucide-react';

type HandoverItemCategory = 'critical' | 'medication' | 'care' | 'pending';

interface HandoverItem {
    id: string;
    category: HandoverItemCategory;
    title: string;
    description: string;
    beneficiaryName?: string;
    beneficiaryId?: string;
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
    createdBy: string;
    isVoiceNote?: boolean;
}

interface ShiftSummary {
    shiftType: 'morning' | 'evening' | 'night';
    startTime: string;
    endTime: string;
    staffName: string;
    totalBeneficiaries: number;
    medicationsGiven: number;
    incidentsReported: number;
    assessmentsCompleted: number;
}

const CATEGORY_CONFIG = {
    critical: { icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50', label: 'حرج' },
    medication: { icon: Pill, color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50', label: 'أدوية' },
    care: { icon: Heart, color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/50', label: 'رعاية' },
    pending: { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50', label: 'معلق' },
};

const mockShiftSummary: ShiftSummary = {
    shiftType: 'morning',
    startTime: '07:00',
    endTime: '15:00',
    staffName: 'نايف الغامدي',
    totalBeneficiaries: 145,
    medicationsGiven: 48,
    incidentsReported: 1,
    assessmentsCompleted: 32,
};

const mockHandoverItems: HandoverItem[] = [
    { id: '1', category: 'critical', title: 'مستفيد بحالة غير مستقرة', description: 'محمد العمري - حرارة مرتفعة 38.5، يحتاج مراقبة كل ساعة', beneficiaryName: 'محمد العمري', beneficiaryId: 'B001', priority: 'high', createdAt: '14:30', createdBy: 'نايف الغامدي' },
    { id: '2', category: 'medication', title: 'تأجيل دواء', description: 'دواء الضغط لفاطمة سعيد - أُجل لموعد المساء بسبب الإجراء الطبي', beneficiaryName: 'فاطمة سعيد', beneficiaryId: 'B002', priority: 'medium', createdAt: '13:45', createdBy: 'نايف الغامدي' },
    { id: '3', category: 'care', title: 'طلب خاص للتغذية', description: 'خالد الدوسري طلب تغيير نوع الوجبة - تم التنسيق مع المطبخ', beneficiaryName: 'خالد الدوسري', beneficiaryId: 'B003', priority: 'low', createdAt: '12:00', createdBy: 'نايف الغامدي' },
    { id: '4', category: 'pending', title: 'فحص مخبري معلق', description: 'نتائج فحص الدم لنورة محمد - متوقع وصولها قبل المغرب', beneficiaryName: 'نورة محمد', beneficiaryId: 'B004', priority: 'medium', createdAt: '11:30', createdBy: 'نايف الغامدي' },
    { id: '5', category: 'critical', title: 'سقوط بسيط - مراقبة', description: 'سعود العتيبي سقط صباحاً - فحص طبي تم ولا توجد إصابات، يحتاج مراقبة 24 ساعة', beneficiaryName: 'سعود العتيبي', beneficiaryId: 'B005', priority: 'high', createdAt: '10:15', createdBy: 'نايف الغامدي' },
];

export const ShiftHandover: React.FC = () => {
    const [items, setItems] = useState<HandoverItem[]>(mockHandoverItems);
    const [summary] = useState<ShiftSummary>(mockShiftSummary);
    const [selectedCategory, setSelectedCategory] = useState<HandoverItemCategory | 'all'>('all');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItem, setNewItem] = useState({ category: 'care' as HandoverItemCategory, title: '', description: '', beneficiaryName: '' });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const filteredItems = items.filter(item =>
        selectedCategory === 'all' || item.category === selectedCategory
    );

    const categoryCounts = {
        critical: items.filter(i => i.category === 'critical').length,
        medication: items.filter(i => i.category === 'medication').length,
        care: items.filter(i => i.category === 'care').length,
        pending: items.filter(i => i.category === 'pending').length,
    };

    const handleAddItem = () => {
        if (!newItem.title || !newItem.description) return;
        const item: HandoverItem = {
            id: Date.now().toString(),
            ...newItem,
            priority: 'medium',
            createdAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            createdBy: 'المستخدم الحالي',
        };
        setItems(prev => [item, ...prev]);
        setNewItem({ category: 'care', title: '', description: '', beneficiaryName: '' });
        setIsAddingItem(false);
    };

    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const getShiftLabel = (type: string) => {
        switch (type) {
            case 'morning': return 'الوردية الصباحية';
            case 'evening': return 'الوردية المسائية';
            case 'night': return 'الوردية الليلية';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <ArrowLeftRight className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">تسليم الوردية الذكية</h1>
                            <p className="text-slate-400 text-sm">{getShiftLabel(summary.shiftType)} • {summary.startTime} - {summary.endTime}</p>
                        </div>
                    </div>
                    {!isConfirmed && (
                        <button
                            onClick={() => setIsConfirmed(true)}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <CheckCircle className="w-5 h-5" />
                            تأكيد الاستلام
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Shift Summary */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 mb-6 border border-amber-500/30"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-400" />
                        ملخص الوردية
                    </h3>
                    <span className="text-slate-400 text-sm">بواسطة: {summary.staffName}</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <User className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.totalBeneficiaries}</p>
                        <p className="text-slate-400 text-sm">مستفيد</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <Pill className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.medicationsGiven}</p>
                        <p className="text-slate-400 text-sm">دواء أُعطي</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.incidentsReported}</p>
                        <p className="text-slate-400 text-sm">حادثة</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.assessmentsCompleted}</p>
                        <p className="text-slate-400 text-sm">تقييم</p>
                    </div>
                </div>
            </motion.div>

            {/* Category Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    الكل ({items.length})
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key as HandoverItemCategory)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${selectedCategory === key ? `${config.bgColor} ${config.color}` : 'bg-slate-800 text-slate-400'}`}
                    >
                        <config.icon className="w-4 h-4" />
                        {config.label} ({categoryCounts[key as HandoverItemCategory]})
                    </button>
                ))}
                <button
                    onClick={() => setIsAddingItem(true)}
                    className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 flex items-center gap-2 hover:bg-green-500/30 transition-colors mr-auto"
                >
                    <Plus className="w-4 h-4" />
                    إضافة بند
                </button>
            </div>

            {/* Add New Item Form */}
            <AnimatePresence>
                {isAddingItem && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">إضافة بند جديد</h3>
                            <button onClick={() => setIsAddingItem(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => setNewItem(prev => ({ ...prev, category: key as HandoverItemCategory }))}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${newItem.category === key ? `${config.bgColor} ${config.color} border ${config.borderColor}` : 'bg-slate-700 text-slate-400'}`}
                                    >
                                        <config.icon className="w-4 h-4" />
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="عنوان البند..."
                                value={newItem.title}
                                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                            <textarea
                                placeholder="التفاصيل..."
                                value={newItem.description}
                                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 h-24 resize-none"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddItem}
                                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                    إضافة
                                </button>
                                <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors" title="تسجيل صوتي">
                                    <Mic className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Handover Items */}
            <div className="space-y-3">
                {filteredItems.map((item, index) => {
                    const config = CATEGORY_CONFIG[item.category];
                    const isExpanded = expandedItem === item.id;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} overflow-hidden`}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                                            <config.icon className={`w-5 h-5 ${config.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white">{item.title}</h4>
                                                <span className={`px-2 py-0.5 rounded text-xs ${config.bgColor} ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                {item.priority === 'high' && (
                                                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/30 text-red-300">عاجل</span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                                            <div className="flex items-center gap-3 mt-2 text-slate-500 text-xs">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {item.createdAt}
                                                </span>
                                                <span>بواسطة: {item.createdBy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-500 hover:text-red-400"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Confirmation Banner */}
            {isConfirmed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-6 left-6 right-6 bg-green-500 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3"
                >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">تم تأكيد استلام الوردية بنجاح</span>
                </motion.div>
            )}
        </div>
    );
};

export default ShiftHandover;
