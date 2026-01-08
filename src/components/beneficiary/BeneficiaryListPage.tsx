import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Plus, RefreshCw, Grid, List,
    ChevronLeft, Activity
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { BeneficiaryCard } from './BeneficiaryCard';
import { BeneficiaryFilters, FilterState } from './BeneficiaryFilters';

interface Beneficiary {
    id: string;
    name: string;
    age: number;
    room: string;
    wing: string;
    admission_date: string;
    status: 'stable' | 'needs_attention' | 'critical';
    ipc_status: 'safe' | 'monitor' | 'alert';
    latest_goal?: string;
    avatar_url?: string;
}

export const BeneficiaryListPage: React.FC = () => {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({});

    // Demo data - Replace with actual Supabase fetch
    useEffect(() => {
        const fetchBeneficiaries = async () => {
            setLoading(true);

            // Try to fetch from Supabase first
            const { data, error } = await supabase
                .from('beneficiaries')
                .select('*')
                .order('name', { ascending: true });

            if (error || !data || data.length === 0) {
                // Use demo data if no Supabase data
                const demoData: Beneficiary[] = [
                    { id: '1', name: 'عبدالله محمد المالكي', age: 34, room: '101', wing: 'east', admission_date: '2024-01-15', status: 'stable', ipc_status: 'safe', latest_goal: 'تعلم الوضوء بشكل مستقل' },
                    { id: '2', name: 'فاطمة أحمد الغامدي', age: 28, room: '102', wing: 'east', admission_date: '2024-02-20', status: 'needs_attention', ipc_status: 'monitor', latest_goal: 'المشاركة في الأنشطة الجماعية' },
                    { id: '3', name: 'محمد علي الزهراني', age: 45, room: '105', wing: 'west', admission_date: '2023-06-10', status: 'stable', ipc_status: 'safe', latest_goal: 'تحسين مهارات التواصل' },
                    { id: '4', name: 'نورة سعيد العمري', age: 31, room: '201', wing: 'north', admission_date: '2024-03-05', status: 'critical', ipc_status: 'alert', latest_goal: 'متابعة الحالة الصحية' },
                    { id: '5', name: 'سعيد خالد القحطاني', age: 52, room: '202', wing: 'north', admission_date: '2023-09-12', status: 'stable', ipc_status: 'safe', latest_goal: 'الاعتماد على النفس في الأكل' },
                    { id: '6', name: 'خالد عبدالله الشهري', age: 29, room: '301', wing: 'south', admission_date: '2024-01-28', status: 'needs_attention', ipc_status: 'monitor', latest_goal: 'تقليل السلوكيات العدوانية' },
                    { id: '7', name: 'مريم ناصر البيشي', age: 35, room: '302', wing: 'south', admission_date: '2023-11-03', status: 'stable', ipc_status: 'safe', latest_goal: 'تحسين النوم الليلي' },
                    { id: '8', name: 'أحمد يوسف الحارثي', age: 41, room: '103', wing: 'east', admission_date: '2024-04-10', status: 'stable', ipc_status: 'safe', latest_goal: 'المشي بدون مساعدة' },
                    { id: '9', name: 'سارة محمد العتيبي', age: 26, room: '203', wing: 'north', admission_date: '2024-02-14', status: 'stable', ipc_status: 'safe', latest_goal: 'تعلم القراءة الأساسية' },
                    { id: '10', name: 'علي حسن الدوسري', age: 38, room: '104', wing: 'east', admission_date: '2023-08-22', status: 'needs_attention', ipc_status: 'monitor', latest_goal: 'إدارة نوبات القلق' },
                    { id: '11', name: 'هند عبدالرحمن السلمي', age: 33, room: '303', wing: 'south', admission_date: '2024-03-18', status: 'stable', ipc_status: 'safe', latest_goal: 'تحسين التفاعل الاجتماعي' },
                    { id: '12', name: 'عمر فهد المطيري', age: 47, room: '106', wing: 'west', admission_date: '2023-05-07', status: 'stable', ipc_status: 'safe', latest_goal: 'الحفاظ على الوزن المثالي' },
                ];
                setBeneficiaries(demoData);
                setFilteredBeneficiaries(demoData);
            } else {
                // Transform Supabase data to match our interface
                const transformed = data.map(b => ({
                    id: b.id,
                    name: b.name || 'غير معروف',
                    age: b.age || calculateAge(b.date_of_birth),
                    room: b.room_number || 'N/A',
                    wing: b.wing || 'east',
                    admission_date: b.admission_date || b.created_at,
                    status: b.health_status || 'stable',
                    ipc_status: b.ipc_status || 'safe',
                    latest_goal: b.latest_goal,
                    avatar_url: b.avatar_url
                }));
                setBeneficiaries(transformed);
                setFilteredBeneficiaries(transformed);
            }

            setLoading(false);
        };

        fetchBeneficiaries();
    }, []);

    const calculateAge = (dateOfBirth: string | null): number => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birth = new Date(dateOfBirth);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Apply filters and search
    useEffect(() => {
        let result = [...beneficiaries];

        // Apply search
        if (searchQuery) {
            result = result.filter(b =>
                b.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filters
        if (filters.wing && filters.wing !== 'all') {
            result = result.filter(b => b.wing === filters.wing);
        }
        if (filters.health_status && filters.health_status !== 'all') {
            result = result.filter(b => b.status === filters.health_status);
        }
        if (filters.ipc_status && filters.ipc_status !== 'all') {
            result = result.filter(b => b.ipc_status === filters.ipc_status);
        }

        setFilteredBeneficiaries(result);
    }, [beneficiaries, searchQuery, filters]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    const getWingName = (wing: string) => {
        const wings: Record<string, string> = {
            east: 'الشرقي',
            west: 'الغربي',
            north: 'الشمالي',
            south: 'الجنوبي'
        };
        return wings[wing] || wing;
    };

    // Statistics
    const stats = {
        total: beneficiaries.length,
        stable: beneficiaries.filter(b => b.status === 'stable').length,
        needsAttention: beneficiaries.filter(b => b.status === 'needs_attention').length,
        critical: beneficiaries.filter(b => b.status === 'critical').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-hierarchy-title text-gray-900">قائمة المستفيدين</h1>
                            <p className="text-hierarchy-small text-gray-500">
                                إجمالي {stats.total} مستفيد • {stats.stable} مستقر • {stats.needsAttention} يحتاج متابعة • {stats.critical} حرج
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            title="تحديث"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={() => navigate('/beneficiaries/new')}
                            className="px-4 py-2 bg-hrsd-teal text-white rounded-lg flex items-center gap-2 hover:bg-hrsd-teal-dark transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">إضافة مستفيد</span>
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="hrsd-card-stat border-l-hrsd-teal">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-hrsd-teal" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-hierarchy-label text-gray-500">إجمالي</p>
                            </div>
                        </div>
                    </div>
                    <div className="hrsd-card-stat border-l-hrsd-green">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-hrsd-green" />
                            <div>
                                <p className="text-2xl font-bold text-hrsd-green">{stats.stable}</p>
                                <p className="text-hierarchy-label text-gray-500">مستقر</p>
                            </div>
                        </div>
                    </div>
                    <div className="hrsd-card-stat border-l-hrsd-gold">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-hrsd-gold" />
                            <div>
                                <p className="text-2xl font-bold text-hrsd-gold">{stats.needsAttention}</p>
                                <p className="text-hierarchy-label text-gray-500">متابعة</p>
                            </div>
                        </div>
                    </div>
                    <div className="hrsd-card-stat border-l-red-500">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                                <p className="text-hierarchy-label text-gray-500">حرج</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <BeneficiaryFilters
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-hierarchy-small text-gray-600">
                    عرض {filteredBeneficiaries.length} من أصل {beneficiaries.length} مستفيد
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hrsd-teal"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredBeneficiaries.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-hierarchy-heading text-gray-500 mb-2">لا توجد نتائج</h3>
                    <p className="text-hierarchy-small text-gray-400">
                        جرب تعديل معايير البحث أو الفلترة
                    </p>
                </div>
            )}

            {/* Beneficiary Grid/List */}
            {!loading && filteredBeneficiaries.length > 0 && (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'space-y-3'
                }>
                    {filteredBeneficiaries.map(beneficiary => (
                        <BeneficiaryCard
                            key={beneficiary.id}
                            id={beneficiary.id}
                            name={beneficiary.name}
                            age={beneficiary.age}
                            room={beneficiary.room}
                            wing={getWingName(beneficiary.wing)}
                            admission_date={beneficiary.admission_date}
                            status={beneficiary.status}
                            ipc_status={beneficiary.ipc_status}
                            latest_goal={beneficiary.latest_goal}
                            avatar_url={beneficiary.avatar_url}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BeneficiaryListPage;
