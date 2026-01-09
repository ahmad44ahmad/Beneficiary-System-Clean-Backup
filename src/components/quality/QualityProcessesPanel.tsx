import React, { useState, useMemo } from 'react';
import { qualityProcesses } from '../../data/qualityProcesses';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, Filter, BarChart2, Users, Clock, ArrowRight, X } from 'lucide-react';

export const QualityProcessesPanel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
    const [selectedProcess, setSelectedProcess] = useState<any>(null);

    // Filter Logic
    const filteredProcesses = useMemo(() => {
        return qualityProcesses.filter(p => {
            const matchesSearch = p.name.includes(searchTerm) || p.department.includes(searchTerm);
            const matchesDep = selectedDepartment === 'All' || p.department === selectedDepartment;
            return matchesSearch && matchesDep;
        });
    }, [searchTerm, selectedDepartment]);

    // Analytics derived from data
    const departmentCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        qualityProcesses.forEach(p => {
            counts[p.department] = (counts[p.department] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, []);

    const departments = useMemo(() => ['All', ...Array.from(new Set(qualityProcesses.map(p => p.department)))], []);

    return (
        <div className="space-y-6">
            {/* Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-teal-50 to-white border-teal-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-teal-900 mb-2">توزيع العمليات</h3>
                            <p className="text-sm text-teal-700">
                                توازن في توزيع العمليات مع هيمنة للأقسام التشغيلية (العلاج الطبي، الخدمات).
                            </p>
                        </div>
                        <div className="p-3 bg-teal-100 rounded-lg">
                            <BarChart2 className="w-6 h-6 text-teal-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-hrsd-teal/10 to-white border-hrsd-teal/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-hrsd-navy mb-2">المسؤوليات</h3>
                            <p className="text-sm text-hrsd-teal-dark">
                                تركيز المسؤولية في القيادات لضمان جودة التطبيق وتوحيد المعايير.
                            </p>
                        </div>
                        <div className="p-3 bg-hrsd-teal/10 rounded-lg">
                            <Users className="w-6 h-6 text-hrsd-teal" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-hrsd-gold/10 to-white border-hrsd-gold/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-hrsd-navy mb-2">طبيعة العمليات</h3>
                            <p className="text-sm text-hrsd-gold-dark">
                                48 عملية (38%) هي عمليات يومية ومستمرة، مما يعكس النشاط التشغيلي المكثف.
                            </p>
                        </div>
                        <div className="p-3 bg-hrsd-gold/10 rounded-lg">
                            <Clock className="w-6 h-6 text-hrsd-gold-dark" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Visual Chart: Top Departments */}
            <Card className="p-6 bg-white">
                <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع العمليات حسب القسم (أعلى 10)</h3>
                <div className="space-y-3">
                    {departmentCounts.slice(0, 10).map(([dep, count], idx) => (
                        <div key={dep} className="flex items-center gap-4">
                            <div className="w-32 text-sm text-gray-600 font-medium truncate" title={dep}>{dep}</div>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${idx === 0 ? 'bg-teal-500' : 'bg-teal-400 opacity-90'}`}
                                    style={{ width: `${(count / departmentCounts[0][1]) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-8 text-sm font-bold text-gray-700">{count}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="بحث عن عملية، قسم..."
                        className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-gray-500 w-5 h-5" />
                    <select
                        className="p-2 border rounded-lg outline-none bg-gray-50 text-sm w-full"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        {departments.map(d => (
                            <option key={d} value={d}>{d === 'All' ? 'جميع الأقسام' : d}</option>
                        ))}
                    </select>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    عدد العمليات: <span className="font-bold text-teal-600">{filteredProcesses.length}</span> / {qualityProcesses.length}
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">القسم</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">اسم العملية</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">المسؤول</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">التكرار</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProcesses.map((process, idx) => (
                                <tr key={process.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{process.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{process.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{process.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{process.responsible}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${process.frequency === 'يومي' || process.frequency === 'مستمر'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {process.frequency}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => setSelectedProcess(process)}
                                            className="text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                                        >
                                            التفاصيل <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedProcess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">{selectedProcess.name}</h2>
                            <button onClick={() => setSelectedProcess(null)} className="text-gray-400 hover:text-red-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="text-xs text-gray-500 font-bold block mb-1">القسم</label>
                                    <p className="text-sm font-medium">{selectedProcess.department}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="text-xs text-gray-500 font-bold block mb-1">المسؤول</label>
                                    <p className="text-sm font-medium">{selectedProcess.responsible}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="text-xs text-gray-500 font-bold block mb-1">التكرار</label>
                                    <p className="text-sm font-medium">{selectedProcess.frequency}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="text-xs text-gray-500 font-bold block mb-1">المدة الزمنية</label>
                                    <p className="text-sm font-medium">{selectedProcess.duration}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                    المدخلات والمخرجات
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-teal-100 p-3 rounded bg-teal-50/50">
                                        <label className="block text-xs font-bold text-teal-700 mb-1">المدخلات</label>
                                        <p className="text-sm">{selectedProcess.inputs}</p>
                                    </div>
                                    <div className="border border-teal-100 p-3 rounded bg-teal-50/50">
                                        <label className="block text-xs font-bold text-teal-700 mb-1">المخرجات</label>
                                        <p className="text-sm">{selectedProcess.outputs}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                    مؤشرات الأداء (KPIs)
                                </h4>
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-gray-700">{selectedProcess.kpi}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedProcess(null)}>إغلاق</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
