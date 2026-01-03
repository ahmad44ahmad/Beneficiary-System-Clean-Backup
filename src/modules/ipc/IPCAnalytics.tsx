import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, RefreshCw, Calendar, TrendingUp,
    AlertTriangle, MapPin, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { ipcService } from '../../services/ipcService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// HRSD 2025 Colors
const COLORS = {
    primary: '#007E4E',
    secondary: '#D4AF37',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#0EA5E9',
};

const PIE_COLORS = ['#22C55E', '#F59E0B', '#DC2626', '#0EA5E9', '#8B5CF6'];

// Demo data for charts
const WEEKLY_COMPLIANCE_DATA = [
    { week: 'الأسبوع 1', compliance: 82, incidents: 4, inspections: 12 },
    { week: 'الأسبوع 2', compliance: 85, incidents: 3, inspections: 14 },
    { week: 'الأسبوع 3', compliance: 84, incidents: 2, inspections: 15 },
    { week: 'الأسبوع 4', compliance: 87, incidents: 2, inspections: 16 },
    { week: 'الأسبوع 5', compliance: 89, incidents: 1, inspections: 14 },
    { week: 'الأسبوع 6', compliance: 91, incidents: 1, inspections: 15 },
];

const INCIDENT_BY_CATEGORY = [
    { name: 'عدوى تنفسية', value: 35, color: '#DC2626' },
    { name: 'عدوى بولية', value: 25, color: '#F59E0B' },
    { name: 'عدوى جلدية', value: 20, color: '#0EA5E9' },
    { name: 'وخز إبرة', value: 12, color: '#8B5CF6' },
    { name: 'أخرى', value: 8, color: '#6B7280' },
];

const LOCATION_COMPLIANCE = [
    { location: 'جناح الذكور 1', compliance: 92, risk: 'low' },
    { location: 'جناح الذكور 2', compliance: 88, risk: 'low' },
    { location: 'جناح الإناث', compliance: 85, risk: 'medium' },
    { location: 'العيادة الطبية', compliance: 78, risk: 'high' },
    { location: 'المطبخ', compliance: 95, risk: 'low' },
    { location: 'غرفة العزل', compliance: 98, risk: 'low' },
];

const MONTHLY_TREND = [
    { month: 'يوليو', handHygiene: 75, ppe: 80, waste: 85 },
    { month: 'أغسطس', handHygiene: 78, ppe: 82, waste: 87 },
    { month: 'سبتمبر', handHygiene: 82, ppe: 85, waste: 88 },
    { month: 'أكتوبر', handHygiene: 85, ppe: 88, waste: 90 },
    { month: 'نوفمبر', handHygiene: 88, ppe: 90, waste: 92 },
    { month: 'ديسمبر', handHygiene: 91, ppe: 92, waste: 94 },
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border text-right" style={{ direction: 'rtl' }}>
                <p className="font-bold text-gray-800 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {entry.value}{typeof entry.value === 'number' && entry.value <= 100 ? '%' : ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const IPCAnalytics: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل التحليلات..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/ipc')} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">تحليلات مكافحة العدوى</h1>
                        <p className="text-gray-500">رؤى متقدمة ومؤشرات الأداء</p>
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    {/* Date Range Selector */}
                    <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
                        {['week', 'month', 'quarter', 'year'].map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-3 py-1.5 rounded-md text-sm transition-all ${dateRange === range
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {range === 'week' ? 'أسبوع' : range === 'month' ? 'شهر' : range === 'quarter' ? 'ربع' : 'سنة'}
                            </button>
                        ))}
                    </div>
                    <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        تحديث
                    </button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Compliance Trend Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        اتجاه الامتثال الأسبوعي
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={WEEKLY_COMPLIANCE_DATA}>
                            <defs>
                                <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                            <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="compliance"
                                stroke="#22C55E"
                                strokeWidth={3}
                                fill="url(#colorCompliance)"
                                name="نسبة الامتثال"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Incidents by Category Pie Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-red-600" />
                        توزيع الحالات حسب النوع
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={INCIDENT_BY_CATEGORY}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {INCIDENT_BY_CATEGORY.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Location Compliance Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        الامتثال حسب الموقع
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={LOCATION_COMPLIANCE} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="location" type="category" width={100} tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="compliance"
                                name="نسبة الامتثال"
                                radius={[0, 4, 4, 0]}
                            >
                                {LOCATION_COMPLIANCE.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.compliance >= 90 ? '#22C55E' : entry.compliance >= 80 ? '#F59E0B' : '#DC2626'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Trend Line Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        اتجاه الامتثال حسب الفئة
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={MONTHLY_TREND}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="handHygiene"
                                stroke="#0EA5E9"
                                strokeWidth={2}
                                dot={{ fill: '#0EA5E9', r: 4 }}
                                name="نظافة الأيدي"
                            />
                            <Line
                                type="monotone"
                                dataKey="ppe"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ fill: '#8B5CF6', r: 4 }}
                                name="معدات الوقاية"
                            />
                            <Line
                                type="monotone"
                                dataKey="waste"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={{ fill: '#F59E0B', r: 4 }}
                                name="إدارة النفايات"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alert Locations */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    المواقع التي تحتاج اهتماماً
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {LOCATION_COMPLIANCE.filter(l => l.compliance < 85).map((loc, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold text-gray-800">{loc.location}</p>
                                <p className="text-sm text-yellow-700">امتثال: {loc.compliance}%</p>
                            </div>
                            <button className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                                عرض
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IPCAnalytics;
