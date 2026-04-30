import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeftRight, Clock, AlertTriangle, CheckCircle, Pill,
    Heart, Mic, Plus, X, ChevronDown, ChevronUp,
    User, Activity, FileText, Send
} from 'lucide-react';
import { shiftService } from '../../services/shiftService';
import { ShiftHandoverItem, ShiftCategory, ShiftSummary } from '../../types/shift';

const CATEGORY_CONFIG = {
    critical: { icon: AlertTriangle, color: 'text-[#DC2626]', bgColor: 'bg-[#DC2626]/20', borderColor: 'border-[#DC2626]/50', label: 'حرج' },
    medication: { icon: Pill, color: 'text-[#FCB614]', bgColor: 'bg-[#FCB614]/20', borderColor: 'border-[#FCB614]/50', label: 'أدوية' },
    care: { icon: Heart, color: 'text-[#DC2626]', bgColor: 'bg-[#DC2626]/20', borderColor: 'border-[#DC2626]/50', label: 'رعاية' },
    pending: { icon: Clock, color: 'text-[#FCB614]', bgColor: 'bg-[#FCB614]/20', borderColor: 'border-[#FCB614]/50', label: 'معلق' },
};

const initialSummary: ShiftSummary = {
    shiftType: 'morning',
    startTime: '--:--',
    endTime: '--:--',
    staffName: 'جاري التحميل...',
    totalBeneficiaries: 0,
    medicationsGiven: 0,
    incidentsReported: 0,
    assessmentsCompleted: 0,
};

export const ShiftHandover: React.FC = () => {
    const [items, setItems] = useState<ShiftHandoverItem[]>([]);
    const [summary, setSummary] = useState<ShiftSummary>(initialSummary);
    const [selectedCategory, setSelectedCategory] = useState<ShiftCategory | 'all'>('all');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItem, setNewItem] = useState({ category: 'care' as ShiftCategory, title: '', description: '', beneficiaryName: '' });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [fetchedItems, fetchedSummary] = await Promise.all([
                shiftService.getShiftItems('morning'), // Defaulting to morning for now
                shiftService.getShiftSummary('morning')
            ]);
            setItems(fetchedItems);
            setSummary(fetchedSummary);
        } catch (error) {
            console.error('Failed to load shift data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        selectedCategory === 'all' || item.category === selectedCategory
    );

    const categoryCounts = {
        critical: items.filter(i => i.category === 'critical').length,
        medication: items.filter(i => i.category === 'medication').length,
        care: items.filter(i => i.category === 'care').length,
        pending: items.filter(i => i.category === 'pending').length,
    };

    const handleAddItem = async () => {
        if (!newItem.title || !newItem.description) return;

        try {
            const addedItem = await shiftService.addShiftItem({
                ...newItem,
                priority: 'medium',
                shift_type: summary.shiftType,
                status: 'active',
                created_by: 'المستخدم الحالي' // In a real app, get from auth context
            });

            setItems(prev => [addedItem, ...prev]);
            setNewItem({ category: 'care', title: '', description: '', beneficiaryName: '' });
            setIsAddingItem(false);
        } catch (error) {
            console.error('Failed to add item', error);
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            await shiftService.deleteShiftItem(id);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const getShiftLabel = (type: string) => {
        switch (type) {
            case 'morning': return 'الوردية الصباحية';
            case 'evening': return 'الوردية المسائية';
            case 'night': return 'الوردية الليلية';
            default: return '';
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-white text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#FCB614] to-[#F7941D] rounded-2xl flex items-center justify-center shadow-lg">
                            <ArrowLeftRight className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">تسليم الوردية الذكية</h1>
                            <p className="text-hrsd-cool-gray text-sm">{getShiftLabel(summary.shiftType)} • {summary.startTime} - {summary.endTime}</p>
                        </div>
                    </div>
                    {!isConfirmed ? (
                        <button
                            onClick={() => setIsConfirmed(true)}
                            className="px-6 py-3 bg-gradient-to-r from-[#2BB574] to-[#2BB574] rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <CheckCircle className="w-5 h-5" />
                            تأكيد الاستلام
                        </button>
                    ) : (
                        <div className="px-6 py-3 bg-[#2BB574]/20 text-[#2BB574] border border-[#2BB574]/50 rounded-xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            تم تأكيد الاستلام
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Shift Summary */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-[#0F3144]/30 to-[#0F3144]/30 rounded-2xl p-6 mb-6 border border-[#FCB614]/30"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#FCB614]" />
                        ملخص الوردية
                    </h3>
                    <span className="text-hrsd-cool-gray text-sm">بواسطة: {summary.staffName}</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/50 rounded-xl p-4 text-center">
                        <User className="w-6 h-6 text-[#269798] mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.totalBeneficiaries}</p>
                        <p className="text-hrsd-cool-gray text-sm">مستفيد</p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4 text-center">
                        <Pill className="w-6 h-6 text-[#FCB614] mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.medicationsGiven}</p>
                        <p className="text-hrsd-cool-gray text-sm">دواء أُعطي</p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4 text-center">
                        <AlertTriangle className="w-6 h-6 text-[#DC2626] mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.incidentsReported}</p>
                        <p className="text-hrsd-cool-gray text-sm">حادثة</p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4 text-center">
                        <Activity className="w-6 h-6 text-[#2BB574] mx-auto mb-2" />
                        <p className="text-2xl font-bold">{summary.assessmentsCompleted}</p>
                        <p className="text-hrsd-cool-gray text-sm">تقييم</p>
                    </div>
                </div>
            </motion.div>

            {/* Category Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${selectedCategory === 'all' ? 'bg-[#269798] text-white' : 'bg-white text-hrsd-cool-gray'}`}
                >
                    الكل ({items.length})
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key as ShiftCategory)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${selectedCategory === key ? `${config.bgColor} ${config.color}` : 'bg-white text-hrsd-cool-gray'}`}
                    >
                        <config.icon className="w-4 h-4" />
                        {config.label} ({categoryCounts[key as ShiftCategory]})
                    </button>
                ))}
                <button
                    onClick={() => setIsAddingItem(true)}
                    className="px-4 py-2 rounded-xl bg-[#2BB574]/20 text-[#2BB574] flex items-center gap-2 hover:bg-[#2BB574]/30 transition-colors me-auto"
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
                        className="bg-white/50 rounded-2xl p-6 mb-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">إضافة بند جديد</h3>
                            <button onClick={() => setIsAddingItem(false)} className="p-2 hover:bg-gray-50 rounded-lg" title="إغلاق" aria-label="إغلاق">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => setNewItem(prev => ({ ...prev, category: key as ShiftCategory }))}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${newItem.category === key ? `${config.bgColor} ${config.color} border ${config.borderColor}` : 'bg-gray-50 text-hrsd-cool-gray'}`}
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
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#FCB614]"
                            />
                            <textarea
                                placeholder="التفاصيل..."
                                value={newItem.description}
                                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#FCB614] h-24 resize-none"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddItem}
                                    className="flex-1 py-3 bg-[#FCB614] hover:bg-[#FCB614] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                    إضافة
                                </button>
                                <button className="p-3 bg-gray-50 hover:bg-gray-200 rounded-xl transition-colors" title="تسجيل صوتي">
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
                    // Provide defaults for created_at and created_by if missing
                    const timeString = item.created_at ? new Date(item.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : '--:--';

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
                                                    <span className="px-2 py-0.5 rounded text-xs bg-[#DC2626]/30 text-[#DC2626]">عاجل</span>
                                                )}
                                            </div>
                                            <p className="text-hrsd-cool-gray text-sm mt-1">{item.description}</p>
                                            <div className="flex items-center gap-3 mt-2 text-hrsd-cool-gray text-xs">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {timeString}
                                                </span>
                                                <span>بواسطة: {item.created_by}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                                            className="p-2 hover:bg-gray-50/50 rounded-lg transition-colors text-hrsd-cool-gray hover:text-[#DC2626]"
                                            title="حذف البند"
                                            aria-label="حذف البند"
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
                    className="fixed bottom-6 start-6 end-6 bg-[#2BB574] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3"
                >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">تم تأكيد استلام الوردية بنجاح</span>
                </motion.div>
            )}
        </div>
    );
};

export default ShiftHandover;
