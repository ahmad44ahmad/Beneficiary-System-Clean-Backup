import React from 'react';
import { PrintLayout } from './PrintLayout';
import { mockAudits, mockCAPAs } from '../../data/quality';
import { CheckCircle, XCircle } from 'lucide-react';

export const ISOComplianceReport: React.FC = () => {
    // Aggregating Data
    const totalAudits = mockAudits.length;
    const totalFindings = mockAudits.reduce((acc, audit) => acc + audit.findings.length, 0);
    const compliantFindings = mockAudits.reduce((acc, audit) => acc + audit.findings.filter(f => f.isCompliant).length, 0);
    const complianceRate = Math.round((compliantFindings / totalFindings) * 100);

    const openCAPAs = mockCAPAs.filter(c => c.status !== 'closed').length;

    return (
        <PrintLayout
            title="تقرير الامتثال لمعيار ISO 9001:2015"
            subtitle="تقرير التدقيق الداخلي وحالة الإجراءات التصحيحية"
        >
            {/* Executive Summary */}
            <div className="mb-8 p-4 bg-gray-50 border rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">الملخص التنفيذي</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">نسبة الامتثال العام</p>
                        <p className={`text-2xl font-bold ${complianceRate >= 85 ? 'text-green-600' : 'text-red-600'}`}>{complianceRate}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">عدد حالات عدم المطابقة</p>
                        <p className="text-2xl font-bold text-orange-600">{totalFindings - compliantFindings}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">الإجراءات التصحيحية المفتوحة</p>
                        <p className="text-2xl font-bold text-blue-600">{openCAPAs}</p>
                    </div>
                </div>
            </div>

            {/* Detailed Audit Findings */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-4">1. تفاصيل التدقيق الداخلي</h3>
                {mockAudits.map(audit => (
                    <div key={audit.id} className="mb-6">
                        <div className="bg-gray-100 p-2 rounded-t-lg flex justify-between text-sm font-bold">
                            <span>{audit.title}</span>
                            <span>{audit.date}</span>
                        </div>
                        <table className="w-full text-sm border border-t-0">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border p-2 text-right">المجال / القسم</th>
                                    <th className="border p-2 text-right">المعيار (ISO Clause)</th>
                                    <th className="border p-2 text-center">الحالة</th>
                                    <th className="border p-2 text-right">الدليل / الملاحظات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audit.findings.map(finding => (
                                    <tr key={finding.id}>
                                        <td className="border p-2">{finding.area}</td>
                                        <td className="border p-2">{finding.criterion}</td>
                                        <td className="border p-2 text-center">
                                            {finding.isCompliant ? (
                                                <span className="flex items-center justify-center gap-1 text-green-700 font-medium">
                                                    <CheckCircle className="w-4 h-4" /> مطابق
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1 text-red-700 font-medium">
                                                    <XCircle className="w-4 h-4" /> غير مطابق
                                                </span>
                                            )}
                                        </td>
                                        <td className="border p-2 text-gray-600">{finding.evidence || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Corrective Actions Matrix */}
            <div>
                <h3 className="font-bold text-gray-800 mb-4">2. سجل الإجراءات التصحيحية (CAPA Log)</h3>
                <table className="w-full text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border p-2 text-right">وصف المشكلة</th>
                            <th className="border p-2 text-right">الإجراء المتخذ</th>
                            <th className="border p-2 text-right">المسؤول</th>
                            <th className="border p-2 text-center">تاريخ الاستحقاق</th>
                            <th className="border p-2 text-center">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockCAPAs.map(capa => (
                            <tr key={capa.id}>
                                <td className="border p-2">{capa.description}</td>
                                <td className="border p-2 text-gray-600">{capa.actionTaken || 'بانتظار التنفيذ'}</td>
                                <td className="border p-2">{capa.assignedTo}</td>
                                <td className="border p-2 text-center">{capa.dueDate}</td>
                                <td className="border p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${capa.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {capa.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PrintLayout>
    );
};
