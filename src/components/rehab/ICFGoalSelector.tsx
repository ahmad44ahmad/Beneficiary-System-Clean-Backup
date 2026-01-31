/**
 * ICF Goal Selector Component
 * محدد أهداف التصنيف الدولي للأداء
 */

import React, { useState, useMemo } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import {
    ICF_CODES,
    ICF_QUALIFIERS,
    ICF_CATEGORY_LABELS,
    getICFCodesByCategory,
    type ICFCode,
    type ICFCategory,
    type ICFQualifier
} from '../../data/domain-assets';

export interface SelectedICFGoal {
    code: string;
    qualifier: ICFQualifier;
    arabicLabel: string;
}

interface ICFGoalSelectorProps {
    selectedGoals: SelectedICFGoal[];
    onChange: (goals: SelectedICFGoal[]) => void;
    maxGoals?: number;
    disabled?: boolean;
}

export const ICFGoalSelector: React.FC<ICFGoalSelectorProps> = ({
    selectedGoals,
    onChange,
    maxGoals = 10,
    disabled = false
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<ICFCategory | null>(null);
    const [tempQualifier, setTempQualifier] = useState<ICFQualifier>(2);

    const groupedCodes = useMemo(() => getICFCodesByCategory(), []);

    const filteredCodes = useMemo(() => {
        if (!searchQuery.trim()) return groupedCodes;

        const query = searchQuery.toLowerCase();
        const result: Record<ICFCategory, ICFCode[]> = {} as Record<ICFCategory, ICFCode[]>;

        Object.entries(groupedCodes).forEach(([category, codes]) => {
            const filtered = codes.filter(
                code =>
                    code.arabicLabel.includes(query) ||
                    code.englishLabel.toLowerCase().includes(query) ||
                    code.code.toLowerCase().includes(query)
            );
            if (filtered.length > 0) {
                result[category as ICFCategory] = filtered;
            }
        });

        return result;
    }, [searchQuery, groupedCodes]);

    const handleSelectCode = (code: ICFCode) => {
        if (selectedGoals.length >= maxGoals) return;
        if (selectedGoals.some(g => g.code === code.code)) return;

        const newGoal: SelectedICFGoal = {
            code: code.code,
            qualifier: tempQualifier,
            arabicLabel: code.arabicLabel
        };

        onChange([...selectedGoals, newGoal]);
    };

    const handleRemoveGoal = (code: string) => {
        onChange(selectedGoals.filter(g => g.code !== code));
    };

    const handleUpdateQualifier = (code: string, qualifier: ICFQualifier) => {
        onChange(
            selectedGoals.map(g =>
                g.code === code ? { ...g, qualifier } : g
            )
        );
    };

    const isCodeSelected = (code: string) => selectedGoals.some(g => g.code === code);

    return (
        <div className="w-full" dir="rtl">
            {/* Selected Goals */}
            {selectedGoals.length > 0 && (
                <div className="mb-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        الأهداف المحددة ({selectedGoals.length}/{maxGoals})
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {selectedGoals.map(goal => (
                            <div
                                key={goal.code}
                                className="flex items-center gap-2 bg-[#148287]/10 border border-[#148287]/30 rounded-lg px-3 py-2"
                            >
                                <span className="text-sm font-medium text-[#14415A]">
                                    {goal.arabicLabel}
                                </span>
                                <select
                                    value={goal.qualifier}
                                    onChange={(e) => handleUpdateQualifier(goal.code, Number(e.target.value) as ICFQualifier)}
                                    className="text-xs bg-white border border-gray-200 rounded px-2 py-1"
                                    disabled={disabled}
                                    title="تغيير مستوى الصعوبة"
                                    aria-label="مستوى الصعوبة"
                                >
                                    {Object.entries(ICF_QUALIFIERS).map(([value, { label }]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGoal(goal.code)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    disabled={disabled}
                                    title="إزالة الهدف"
                                    aria-label="إزالة الهدف"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selector Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-colors ${isOpen ? 'border-[#148287]' : 'border-gray-200'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
                >
                    <span className="text-gray-600">
                        {selectedGoals.length === 0
                            ? 'اختر أهداف ICF...'
                            : `تم اختيار ${selectedGoals.length} هدف`}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="بحث عن رمز ICF..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#148287]"
                                />
                            </div>
                        </div>

                        {/* Default Qualifier Selector */}
                        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">مستوى الصعوبة الافتراضي:</span>
                                <select
                                    value={tempQualifier}
                                    onChange={(e) => setTempQualifier(Number(e.target.value) as ICFQualifier)}
                                    className="text-xs bg-white border border-gray-200 rounded px-2 py-1"
                                    title="مستوى الصعوبة الافتراضي"
                                    aria-label="مستوى الصعوبة الافتراضي"
                                >
                                    {Object.entries(ICF_QUALIFIERS).map(([value, { label }]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="max-h-64 overflow-y-auto">
                            {Object.entries(filteredCodes).map(([category, codes]) => (
                                <div key={category}>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedCategory(
                                            expandedCategory === category ? null : category as ICFCategory
                                        )}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-100"
                                    >
                                        <span className="font-medium text-[#14415A]">
                                            {ICF_CATEGORY_LABELS[category as ICFCategory]} ({codes.length})
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedCategory === category ? 'rotate-180' : ''
                                            }`} />
                                    </button>

                                    {expandedCategory === category && (
                                        <div className="divide-y divide-gray-50">
                                            {codes.map(code => {
                                                const isSelected = isCodeSelected(code.code);
                                                return (
                                                    <button
                                                        key={code.code}
                                                        type="button"
                                                        onClick={() => !isSelected && handleSelectCode(code)}
                                                        disabled={isSelected || selectedGoals.length >= maxGoals}
                                                        className={`w-full flex items-center justify-between px-4 py-2 text-right transition-colors ${isSelected
                                                            ? 'bg-[#148287]/5 cursor-not-allowed'
                                                            : 'hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-mono text-gray-400">{code.code}</span>
                                                                <span className="text-sm text-gray-800">{code.arabicLabel}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-400">{code.englishLabel}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="w-4 h-4 text-[#2DB473]" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {Object.keys(filteredCodes).length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                    لا توجد نتائج للبحث
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-[#148287] text-white rounded-lg text-sm hover:bg-[#0f6b6f] transition-colors"
                            >
                                تم
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ICFGoalSelector;
