import React, { useState, useMemo } from 'react';
import { governanceStandards } from '../../data/governanceStandards';
import { AuditStandard, AuditResult, AuditStatus } from '../../types/quality';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    ShieldCheck,
    BarChart3,
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

    const getStatusColor = (status?: AuditStatus) => {
        switch (status) {
            case 'compliant': return 'bg-green-100 text-green-700 border-green-200';
            case 'non-compliant': return 'bg-red-100 text-red-700 border-red-200';
            case 'partial': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                        وحدة التدقيق الرقمي الذاتي
                    </h2>
                    <p className="text-gray-600 mt-2">
                        نظام التحقق من الامتثال لمعايير الجودة (ISO 9001) والحوكمة المؤسسية.
                        يضمن هذا النظام "الخيط الذهبي" بين الاستراتيجية والتنفيذ.
                    </p>
                </div>

                <Card className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <span className="text-sm font-medium text-gray-500 mb-2">نسبة الامتثال الكلية</span>
                    <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-600"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * complianceScore) / 100}
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold text-blue-700">{complianceScore}%</span>
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
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${std.weight === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                        ISO {std.clause}
                                                    </span>
                                                    <h4 className="font-medium text-gray-900">{std.title}</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{std.description}</p>
                                                <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                                    <span><strong>متطلب الامتثال:</strong> {std.requirement}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 shrink-0 ml-4">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleAuditCheck(std.id, 'compliant')}
                                                        className={`p-2 rounded-lg border transition-all ${results[std.id]?.status === 'compliant' ? 'bg-green-600 text-white border-green-600' : 'hover:bg-green-50 text-gray-400'}`}
                                                        title="ممتثل"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAuditCheck(std.id, 'non-compliant')}
                                                        className={`p-2 rounded-lg border transition-all ${results[std.id]?.status === 'non-compliant' ? 'bg-red-600 text-white border-red-600' : 'hover:bg-red-50 text-gray-400'}`}
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
                                                <button className="text-blue-600 hover:underline">إرفاق دليل +</button>
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
