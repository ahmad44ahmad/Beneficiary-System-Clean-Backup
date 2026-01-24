import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

interface BeneficiaryFiltersProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    wing?: string;
    health_status?: 'stable' | 'needs_attention' | 'critical' | 'all';
    ipc_status?: 'safe' | 'monitor' | 'alert' | 'all';
    empowerment_status?: 'active' | 'inactive' | 'all';
}

export const BeneficiaryFilters: React.FC<BeneficiaryFiltersProps> = ({
    onSearch,
    onFilterChange
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        wing: 'all',
        health_status: 'all',
        ipc_status: 'all',
        empowerment_status: 'all'
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value } as FilterState;
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            wing: 'all',
            health_status: 'all',
            ipc_status: 'all',
            empowerment_status: 'all'
        } as FilterState;
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

    return (
        <div className="space-y-4" dir="rtl">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="ابحث عن مستفيد بالاسم..."
                        className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 focus:border-hrsd-teal text-hierarchy-body"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-colors ${showFilters || activeFiltersCount > 0
                        ? 'bg-hrsd-teal text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="text-hierarchy-small font-medium">
                        فلترة {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </span>
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="hrsd-card animate-slide-down">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-hierarchy-subheading text-gray-800 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-hrsd-teal" />
                            خيارات الفلترة
                        </h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-hierarchy-small text-hrsd-orange hover:underline flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                مسح الفلاتر
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Wing Filter */}
                        <div>
                            <label className="text-hierarchy-label text-gray-600 block mb-2">
                                الجناح
                            </label>
                            <select
                                value={filters.wing}
                                onChange={(e) => handleFilterChange('wing', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small"
                            >
                                <option value="all">الكل</option>
                                <option value="east">الجناح الشرقي</option>
                                <option value="west">الجناح الغربي</option>
                                <option value="north">الجناح الشمالي</option>
                                <option value="south">الجناح الجنوبي</option>
                            </select>
                        </div>

                        {/* Health Status Filter */}
                        <div>
                            <label className="text-hierarchy-label text-gray-600 block mb-2">
                                الحالة الصحية
                            </label>
                            <select
                                value={filters.health_status}
                                onChange={(e) => handleFilterChange('health_status', e.target.value as any)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small"
                            >
                                <option value="all">الكل</option>
                                <option value="stable">مستقر</option>
                                <option value="needs_attention">يحتاج متابعة</option>
                                <option value="critical">حرج</option>
                            </select>
                        </div>

                        {/* IPC Status Filter */}
                        <div>
                            <label className="text-hierarchy-label text-gray-600 block mb-2">
                                حالة IPC
                            </label>
                            <select
                                value={filters.ipc_status}
                                onChange={(e) => handleFilterChange('ipc_status', e.target.value as any)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small"
                            >
                                <option value="all">الكل</option>
                                <option value="safe">آمن</option>
                                <option value="monitor">مراقبة</option>
                                <option value="alert">تنبيه</option>
                            </select>
                        </div>

                        {/* Empowerment Status Filter */}
                        <div>
                            <label className="text-hierarchy-label text-gray-600 block mb-2">
                                حالة التمكين
                            </label>
                            <select
                                value={filters.empowerment_status}
                                onChange={(e) => handleFilterChange('empowerment_status', e.target.value as any)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/50 text-hierarchy-small"
                            >
                                <option value="all">الكل</option>
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeneficiaryFilters;
