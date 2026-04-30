import React, { useState, useMemo } from 'react';
import { governanceStandards } from '../../data/governanceStandards';
import { AuditStandard, AuditResult, AuditStatus } from '../../types/quality';
import { Card } from '../ui/Card';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    ShieldCheck,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export const DigitalAuditTool: React.FC = () => {
    const [results, setResults] = useState<Record<string, AuditResult>>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Group standards by category
    const groupedStandards = useMemo(() => {
        const groups: Record<string, AuditStandard[]> = {};
        governanceStandards.forEach(std => {
            if (!groups[std.category]) groups[std.category] = [];
            groups[std.category].push(std);
        });
        return groups;
    }, []);

    // Calculate Compliance Score
    const complianceScore = useMemo(() => {
        const total = governanceStandards.length;
        if (total === 0) return 0;

        const compliantCount = (Object.values(results) as AuditResult[]).filter(r => r.status === 'compliant').length;
        return Math.round((compliantCount / total) * 100);
    }, [results]);

    const handleAuditCheck = (standardId: string, status: AuditStatus) => {
        setResults(prev => ({
            ...prev,
            [standardId]: {
                standardId,
                status,
                auditorName: 'Current User', // Replace with actual user context
                date: new Date().toISOString()
            }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header & Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-[#269798]" />
                        وحدة التدقيق الرقمي الذاتي
                    </h2>
                    <p className="text-gray-600 mt-2">
                        نظام التحقق من الامتثال لمعايير الجودة (ISO 9001) والحوكمة المؤسسية.
                        يضمن هذا النظام "الخيط الذهبي" بين الاستراتيجية والتنفيذ.
                    </p>
                </div>

                <Card className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#269798]/10 to-white border-[#269798]/10">
                    <span className="text-sm font-medium text-gray-500 mb-2">نسبة الامتثال الكلية</span>
                    <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#269798]"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * complianceScore) / 100}
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold text-[#1B7778]">{complianceScore}%</span>
                    </div>
                    <div className="mt-3 text-xs text-center px-2 py-1 bg-white rounded-full border shadow-sm">
                        {complianceScore >= 80 ? 'مستوى متميز (EFQM)' : complianceScore >= 50 ? 'مستوى مقبول' : 'مخاطر عالية'}
                    </div>
                </Card>
            </div>

            {/* Audit Categories */}
            <div className="space-y-4">
                {Object.entries(groupedStandards).map(([category, standards]: [string, AuditStandard[]]) => (
                    <Card key={category} className="overflow-hidden border shadow-sm">
                        <div
                            className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                        >
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-500" />
                                {category}
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    {standards.filter(s => results[s.id]?.status === 'compliant').length} / {standards.length} مكتمل
                                </div>
                                {expandedCategory === category ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>

                        {expandedCategory === category && (
                            <div className="p-4 divide-y divide-gray-100">
                                {standards.map(std => (
                                    <div key={std.id} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${std.weight === 'critical' ? 'bg-[#DC2626]/15 text-[#B91C1C]' : 'bg-[#269798]/10 text-[#1B7778]'}`}>
                                                        ISO {std.clause}
                                                    </span>
                                                    <h4 className="font-medium text-gray-900">{std.title}</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{std.description}</p>
                                                <div className="bg-[#269798]/10 p-2 rounded text-xs text-[#1B7778] flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                                    <span><strong>متطلب الامتثال:</strong> {std.requirement}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 shrink-0 ms-4">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleAuditCheck(std.id, 'compliant')}
                                                        className={`p-2 rounded-lg border transition-all ${results[std.id]?.status === 'compliant' ? 'bg-[#1E9658] text-white border-[#1E9658]' : 'hover:bg-[#2BB574]/10 text-gray-400'}`}
                                                        title="ممتثل"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAuditCheck(std.id, 'non-compliant')}
                                                        className={`p-2 rounded-lg border transition-all ${results[std.id]?.status === 'non-compliant' ? 'bg-[#B91C1C] text-white border-[#B91C1C]' : 'hover:bg-[#DC2626]/10 text-gray-400'}`}
                                                        title="غير ممتثل"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Evidence Section (Mock) */}
                                        {results[std.id] && (
                                            <div className="mt-2 text-xs flex justify-between items-center text-gray-500">
                                                <span>تم التدقيق بواسطة: {results[std.id].auditorName}</span>
                                                <button className="text-[#269798] hover:underline">إرفاق دليل +</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
