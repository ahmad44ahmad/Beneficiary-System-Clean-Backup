import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, ChevronLeft, CheckCircle, Clock,
    AlertCircle, XCircle, RefreshCw, FileCheck
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ISOClause {
    iso_clause: string;
    requirement_ar: string;
    category: string;
    status: 'not_started' | 'in_progress' | 'implemented' | 'verified' | 'non_conformity';
    compliance_percentage: number;
    priority: string;
    responsible_department: string;
    next_audit_date?: string;
}

export const ISOComplianceTracker: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clauses, setClauses] = useState<ISOClause[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Demo data
    const demoData: ISOClause[] = [
        { iso_clause: '4.1', requirement_ar: 'فهم المنظمة وسياقها', category: 'Leadership', status: 'implemented', compliance_percentage: 80, priority: 'high', responsible_department: 'الإدارة' },
        { iso_clause: '4.2', requirement_ar: 'فهم احتياجات الأطراف المعنية', category: 'Leadership', status: 'implemented', compliance_percentage: 75, priority: 'high', responsible_department: 'الإدارة' },
        { iso_clause: '5.1', requirement_ar: 'القيادة والالتزام', category: 'Leadership', status: 'in_progress', compliance_percentage: 60, priority: 'critical', responsible_department: 'مدير المركز' },
        { iso_clause: '5.2', requirement_ar: 'السياسة', category: 'Leadership', status: 'verified', compliance_percentage: 90, priority: 'high', responsible_department: 'الجودة' },
        { iso_clause: '6.1', requirement_ar: 'الإجراءات لمعالجة المخاطر والفرص', category: 'Planning', status: 'in_progress', compliance_percentage: 50, priority: 'critical', responsible_department: 'الجودة' },
        { iso_clause: '7.1', requirement_ar: 'الموارد', category: 'Support', status: 'not_started', compliance_percentage: 30, priority: 'high', responsible_department: 'الموارد البشرية' },
        { iso_clause: '7.2', requirement_ar: 'الكفاءة', category: 'Support', status: 'in_progress', compliance_percentage: 45, priority: 'medium', responsible_department: 'التدريب' },
        { iso_clause: '8.1', requirement_ar: 'التخطيط والتحكم التشغيلي', category: 'Operation', status: 'in_progress', compliance_percentage: 55, priority: 'high', responsible_department: 'التشغيل' },
        { iso_clause: '8.4', requirement_ar: 'خطط استمرارية الأعمال', category: 'Operation', status: 'not_started', compliance_percentage: 20, priority: 'critical', responsible_department: 'الطوارئ', next_audit_date: '2026-03-01' },
        { iso_clause: '9.1', requirement_ar: 'المراقبة والقياس والتحليل', category: 'Evaluation', status: 'in_progress', compliance_percentage: 40, priority: 'medium', responsible_department: 'الجودة' },
        { iso_clause: '10.1', requirement_ar: 'عدم المطابقة والإجراء التصحيحي', category: 'Improvement', status: 'not_started', compliance_percentage: 15, priority: 'high', responsible_department: 'الجودة' },
    ];

    useEffect(() => {
        const fetchClauses = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('iso_compliance_checklist')
                .select('*')
                .order('iso_clause', { ascending: true });

            if (error || !data || data.length === 0) {
                setClauses(demoData);
            } else {
                setClauses(data);
            }
            setLoading(false);
        };
        fetchClauses();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle className="w-5 h-5 text-hrsd-green" />;
            case 'implemented': return <CheckCircle className="w-5 h-5 text-hrsd-teal" />;
            case 'in_progress': return <Clock className="w-5 h-5 text-hrsd-gold" />;
            case 'non_conformity': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'موثق';
            case 'implemented': return 'مطبق';
            case 'in_progress': return 'قيد التنفيذ';
            case 'non_conformity': return 'عدم مطابقة';
            default: return 'لم يبدأ';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-hrsd-green';
            case 'implemented': return 'bg-hrsd-teal';
            case 'in_progress': return 'bg-hrsd-gold';
            case 'non_conformity': return 'bg-red-500';
            default: return 'bg-gray-300';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical': return 'badge-danger';
            case 'high': return 'badge-warning';
            default: return 'badge-info';
        }
    };

    // Calculate overall compliance
    const overallCompliance = Math.round(
        clauses.reduce((sum, c) => sum + c.compliance_percentage, 0) / clauses.length
    );

    // Status summary for pie chart
    const statusSummary = clauses.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = [
        { name: 'موثق', value: statusSummary.verified || 0, color: 'rgb(45, 180, 115)' },
        { name: 'مطبق', value: statusSummary.implemented || 0, color: 'rgb(20, 130, 135)' },
        { name: 'قيد التنفيذ', value: statusSummary.in_progress || 0, color: 'rgb(250, 180, 20)' },
        { name: 'لم يبدأ', value: statusSummary.not_started || 0, color: 'rgb(209, 213, 219)' },
        { name: 'عدم مطابقة', value: statusSummary.non_conformity || 0, color: 'rgb(239, 68, 68)' },
    ].filter(d => d.value > 0);

    const categories = ['all', ...new Set(clauses.map(c => c.category))];
    const filteredClauses = selectedCategory === 'all'
        ? clauses
        : clauses.filter(c => c.category === selectedCategory);

    const criticalItems = clauses.filter(c => c.priority === 'critical' && c.status !== 'verified');

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-navy to-hrsd-teal rounded-xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">مؤشر الامتثال ISO 22301</h1>
                        <p className="text-hierarchy-small text-gray-500">قياس التوافق مع متطلبات استمرارية الأعمال</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mr-auto p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hrsd-teal"></div>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-2xl p-6 text-white">
                            <FileCheck className="w-8 h-8 mb-2" />
                            <p className="text-5xl font-bold">{overallCompliance}%</p>
                            <p className="text-sm text-white/80">نسبة الامتثال الإجمالية</p>
                            <div className="mt-4 bg-white/20 rounded-full h-3">
                                <div
                                    className="bg-white rounded-full h-3 transition-all"
                                    style={{ width: `${overallCompliance}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="hrsd-card">
                            <h4 className="text-hierarchy-small text-gray-500 mb-3">توزيع الحالات</h4>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                {pieData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span>{item.name} ({item.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hrsd-card">
                            <h4 className="text-hierarchy-small text-gray-500 mb-3">⚠️ بنود حرجة تحتاج انتباه</h4>
                            {criticalItems.length > 0 ? (
                                <div className="space-y-2">
                                    {criticalItems.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="p-2 bg-red-50 rounded-lg text-sm">
                                            <span className="font-bold">{item.iso_clause}</span>: {item.requirement_ar}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-4">لا توجد بنود حرجة</p>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-4 flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat
                                        ? 'bg-hrsd-teal text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat === 'all' ? 'الكل' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Clauses List */}
                    <div className="hrsd-card">
                        <div className="space-y-3">
                            {filteredClauses.map((clause, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(clause.status)}
                                            <div>
                                                <p className="font-bold">البند {clause.iso_clause}</p>
                                                <p className="text-sm text-gray-600">{clause.requirement_ar}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={getPriorityBadge(clause.priority)}>
                                                {clause.priority === 'critical' ? 'حرج' : clause.priority === 'high' ? 'عالي' : 'متوسط'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${getStatusColor(clause.status)}`}
                                                style={{ width: `${clause.compliance_percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium min-w-[50px]">{clause.compliance_percentage}%</span>
                                        <span className="text-xs text-gray-500">{clause.responsible_department}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ISOComplianceTracker;
