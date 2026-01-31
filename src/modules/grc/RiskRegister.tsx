import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../config/supabase';
import {
    AlertTriangle,
    Plus,
    ArrowLeft,
    Search,
    Filter,
    Eye,
    Edit,
    CheckCircle2,
    XCircle,
    Clock,
    Target,
    Save
} from 'lucide-react';



interface Risk {
    id: string;
    title: string;
    description: string;
    category: string;
    probability: number;
    impact: number;
    risk_score: number;
    status: string;
    owner: string;
    mitigation_plan: string;
    review_date: string;
    created_at: string;
    updated_at: string;
}

// Helper to calculate risk level from score
const getRiskLevel = (score: number): string => {
    if (score >= 20) return 'critical';
    if (score >= 12) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
};

const RISK_CATEGORIES = [
    { id: 'operational', name: 'تشغيلية' },
    { id: 'financial', name: 'مالية' },
    { id: 'compliance', name: 'امتثال' },
    { id: 'strategic', name: 'استراتيجية' },
    { id: 'reputational', name: 'سمعة' },
    { id: 'safety', name: 'سلامة' },
];

export const RiskRegister: React.FC = () => {
    const location = useLocation();
    const { showToast } = useToast();
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        risk_code: `RISK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        title_ar: '',
        description: '',
        category_id: 'operational',
        likelihood: 3,
        impact: 3,
        risk_owner: '',
        response_strategy: 'mitigate',
        mitigation_action: '',
        status: 'identified'
    });

    // Refetch when navigating to this page (location.key changes)
    useEffect(() => {
        fetchRisks();
    }, [location.key]);

    const fetchRisks = async () => {
        setLoading(true);

        // Fallback demo data if Supabase is unavailable
        const demoRisks: Risk[] = [
            { id: '1', title: 'مخاطر السقوط للمستفيدين', description: 'خطر سقوط المستفيدين كبار السن', category: 'safety', probability: 4, impact: 4, risk_score: 16, status: 'mitigating', owner: 'مدير السلامة', mitigation_plan: 'تركيب قضبان الأمان', review_date: '2025-02-01', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', title: 'مخاطر الحريق', description: 'خطر نشوب حريق في المبنى', category: 'safety', probability: 3, impact: 5, risk_score: 15, status: 'mitigating', owner: 'فريق الطوارئ', mitigation_plan: 'صيانة أنظمة الإطفاء', review_date: '2025-02-15', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '3', title: 'نقص الكوادر التمريضية', description: 'عدم كفاية الطاقم التمريضي', category: 'operational', probability: 3, impact: 4, risk_score: 12, status: 'identified', owner: 'الموارد البشرية', mitigation_plan: 'التوظيف والتدريب', review_date: '2025-03-01', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '4', title: 'مخاطر العدوى', description: 'انتشار العدوى بين المستفيدين', category: 'compliance', probability: 3, impact: 4, risk_score: 12, status: 'mitigating', owner: 'فريق IPC', mitigation_plan: 'بروتوكولات مكافحة العدوى', review_date: '2025-02-10', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '5', title: 'تأخر الصيانة', description: 'عدم صيانة المعدات في وقتها', category: 'operational', probability: 2, impact: 3, risk_score: 6, status: 'accepted', owner: 'إدارة المرافق', mitigation_plan: 'جدولة الصيانة الدورية', review_date: '2025-04-01', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ];

        if (!supabase) {
            console.warn('Supabase not available, using demo data');
            setRisks(demoRisks);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('grc_risks')
                .select('*')
                .order('risk_score', { ascending: false });

            if (error) {
                console.warn('Error fetching risks:', error.message);
                setRisks(demoRisks);
            } else {
                setRisks(data && data.length > 0 ? data : demoRisks);
            }
        } catch (err) {
            console.warn('Failed to fetch risks:', err);
            setRisks(demoRisks);
        }

        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('grc_risks')
            .insert([formData]);

        if (!error) {
            setShowForm(false);
            fetchRisks();
            showToast('تم تسجيل الخطر بنجاح', 'success');
            // Reset form
            setFormData({
                ...formData,
                risk_code: `RISK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
                title_ar: '',
                description: '',
                mitigation_action: ''
            });
        } else {
            showToast('حدث خطأ أثناء حفظ الخطر', 'error');
        }
    };

    const getRiskLevelBadge = (level: string) => {
        const config: Record<string, { bg: string; text: string; label: string }> = {
            critical: { bg: 'bg-red-600', text: 'text-white', label: 'حرج' },
            high: { bg: 'bg-orange-500', text: 'text-white', label: 'عالي' },
            medium: { bg: 'bg-yellow-400', text: 'text-gray-800', label: 'متوسط' },
            low: { bg: 'bg-green-500', text: 'text-white', label: 'منخفض' }
        };
        const { bg, text, label } = config[level] || config.low;
        return <span className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>{label}</span>;
    };

    const getStatusBadge = (status: string) => {
        const labels: Record<string, string> = {
            identified: 'تم التحديد',
            analyzing: 'قيد التحليل',
            mitigating: 'قيد المعالجة',
            monitoring: 'تحت المراقبة',
            closed: 'مغلق',
            escalated: 'تم التصعيد'
        };
        const colors: Record<string, string> = {
            identified: 'bg-blue-100 text-blue-800',
            analyzing: 'bg-purple-100 text-purple-800',
            mitigating: 'bg-amber-100 text-amber-800',
            monitoring: 'bg-cyan-100 text-cyan-800',
            closed: 'bg-green-100 text-green-800',
            escalated: 'bg-red-100 text-red-800'
        };
        return <span className={`px-2 py-1 rounded text-xs ${colors[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
    };

    const filteredRisks = risks.filter(risk => {
        const matchesSearch = risk.title?.includes(searchTerm) || risk.id?.includes(searchTerm);
        const matchesLevel = filterLevel === 'all' || getRiskLevel(risk.risk_score) === filterLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/grc" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        العودة للحوكمة
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-[rgb(20,65,90)]">
                        <AlertTriangle className="w-7 h-7 text-[rgb(245,150,30)]" />
                        سجل المخاطر
                    </h1>
                    <p className="text-gray-500 mt-1">تسجيل وتتبع ومعالجة المخاطر المؤسسية</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-5 py-2.5 text-white rounded-xl flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity bg-[rgb(245,150,30)]"
                >
                    <Plus className="w-5 h-5" />
                    تسجيل خطر جديد
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="البحث بالعنوان أو الرمز..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(20,130,135)]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl"
                        title="فلتر مستوى الخطر"
                        aria-label="فلتر مستوى الخطر"
                    >
                        <option value="all">جميع المستويات</option>
                        <option value="critical">حرج</option>
                        <option value="high">عالي</option>
                        <option value="medium">متوسط</option>
                        <option value="low">منخفض</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg text-center border-r-4 border-[rgb(20,65,90)]">
                    <p className="text-3xl font-bold text-[rgb(20,65,90)]">{risks.length}</p>
                    <p className="text-sm text-gray-500">إجمالي المخاطر</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center border-r-4 border-red-500">
                    <p className="text-3xl font-bold text-red-600">{risks.filter(r => getRiskLevel(r.risk_score) === 'critical').length}</p>
                    <p className="text-sm text-gray-500">حرجة</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center border-r-4 border-[rgb(245,150,30)]">
                    <p className="text-3xl font-bold text-[rgb(245,150,30)]">{risks.filter(r => getRiskLevel(r.risk_score) === 'high').length}</p>
                    <p className="text-sm text-gray-500">عالية</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center border-r-4 border-[rgb(250,180,20)]">
                    <p className="text-3xl font-bold text-[rgb(250,180,20)]">{risks.filter(r => getRiskLevel(r.risk_score) === 'medium').length}</p>
                    <p className="text-sm text-gray-500">متوسطة</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center border-r-4 border-[rgb(45,180,115)]">
                    <p className="text-3xl font-bold text-[rgb(45,180,115)]">{risks.filter(r => getRiskLevel(r.risk_score) === 'low').length}</p>
                    <p className="text-sm text-gray-500">منخفضة</p>
                </div>
            </div>

            {/* Risks Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="py-12 text-center text-gray-400">جاري التحميل...</div>
                ) : filteredRisks.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                        <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>لا توجد مخاطر مسجلة</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="text-gray-600 text-sm bg-[rgb(20,65,90)]/10">
                            <tr>
                                <th className="p-4 text-right">الرمز</th>
                                <th className="p-4 text-right">العنوان</th>
                                <th className="p-4 text-center">الاحتمال × التأثير</th>
                                <th className="p-4 text-center">المستوى</th>
                                <th className="p-4 text-center">الحالة</th>
                                <th className="p-4 text-right">المسؤول</th>
                                <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRisks.map((risk) => (
                                <tr key={risk.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-sm">{risk.id?.slice(0, 8) || 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{risk.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{risk.description}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">
                                            {risk.probability} × {risk.impact} = <strong>{risk.risk_score}</strong>
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">{getRiskLevelBadge(getRiskLevel(risk.risk_score))}</td>
                                    <td className="p-4 text-center">{getStatusBadge(risk.status)}</td>
                                    <td className="p-4 text-sm">{risk.owner || '-'}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-[rgb(20,130,135)]" title="عرض">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-[rgb(245,150,30)]" title="تعديل">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Risk Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[rgb(20,65,90)]">
                            <AlertTriangle className="w-6 h-6 text-[rgb(245,150,30)]" />
                            تسجيل خطر جديد
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">رمز الخطر</label>
                                    <input
                                        type="text"
                                        value={formData.risk_code}
                                        readOnly
                                        className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 font-mono"
                                        title="رمز الخطر"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">الفئة</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-xl"
                                        title="فئة الخطر"
                                        aria-label="فئة الخطر"
                                    >
                                        {RISK_CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">عنوان الخطر *</label>
                                <input
                                    type="text"
                                    value={formData.title_ar}
                                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                                    placeholder="مثال: تعطل نظام الإطفاء الرئيسي"
                                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[rgb(20,130,135)]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الوصف</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-xl"
                                    rows={3}
                                    title="وصف الخطر"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">الاحتمالية (1-5)</label>
                                    <select
                                        value={formData.likelihood}
                                        onChange={(e) => setFormData({ ...formData, likelihood: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 border rounded-xl"
                                        title="احتمالية حدوث الخطر"
                                        aria-label="احتمالية حدوث الخطر"
                                    >
                                        <option value={1}>1 - نادر جداً</option>
                                        <option value={2}>2 - نادر</option>
                                        <option value={3}>3 - ممكن</option>
                                        <option value={4}>4 - محتمل</option>
                                        <option value={5}>5 - مؤكد تقريباً</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">التأثير (1-5)</label>
                                    <select
                                        value={formData.impact}
                                        onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 border rounded-xl"
                                        title="تأثير الخطر"
                                        aria-label="تأثير الخطر"
                                    >
                                        <option value={1}>1 - ضئيل</option>
                                        <option value={2}>2 - طفيف</option>
                                        <option value={3}>3 - متوسط</option>
                                        <option value={4}>4 - كبير</option>
                                        <option value={5}>5 - كارثي</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">درجة الخطر</label>
                                    <div
                                        className={`w-full px-4 py-2.5 border rounded-xl text-center font-bold text-xl text-white ${(formData.likelihood * formData.impact) >= 20 ? 'bg-[#dc2626]' :
                                            (formData.likelihood * formData.impact) >= 12 ? 'bg-[rgb(245,150,30)]' :
                                                (formData.likelihood * formData.impact) >= 6 ? 'bg-[rgb(250,180,20)]' :
                                                    'bg-[rgb(45,180,115)]'
                                            }`}
                                    >
                                        {formData.likelihood * formData.impact}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">استراتيجية الاستجابة</label>
                                    <select
                                        value={formData.response_strategy}
                                        onChange={(e) => setFormData({ ...formData, response_strategy: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-xl"
                                        title="استراتيجية الاستجابة للخطر"
                                        aria-label="استراتيجية الاستجابة للخطر"
                                    >
                                        <option value="avoid">تجنب</option>
                                        <option value="mitigate">تخفيف</option>
                                        <option value="transfer">نقل</option>
                                        <option value="accept">قبول</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">مسؤول الخطر</label>
                                    <input
                                        type="text"
                                        value={formData.risk_owner}
                                        onChange={(e) => setFormData({ ...formData, risk_owner: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-xl"
                                        title="مسؤول الخطر"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">إجراء التخفيف</label>
                                <textarea
                                    value={formData.mitigation_action}
                                    onChange={(e) => setFormData({ ...formData, mitigation_action: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-xl"
                                    rows={2}
                                    title="إجراء التخفيف"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-white rounded-xl flex items-center gap-2 bg-[rgb(20,130,135)]"
                                >
                                    <Save className="w-4 h-4" />
                                    حفظ الخطر
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskRegister;
