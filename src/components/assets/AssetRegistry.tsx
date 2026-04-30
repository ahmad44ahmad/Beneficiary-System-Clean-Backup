import React, { useState } from 'react';
import { FixedAsset, AssetCategory, AssetCondition } from '../../types/assets';
import { Search, AlertTriangle, Wrench, FileText, MoreVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AssetRegistryProps {
    assets: FixedAsset[];
    onReportFault: (asset: FixedAsset) => void;
}

const categoryLabels: Record<AssetCategory, string> = {
    medical_device: 'أجهزة طبية',
    furniture: 'أثاث وتجهيزات',
    vehicle: 'مركبات',
    electronic: 'إلكترونيات',
    appliance: 'أجهزة كهربائية',
    other: 'أخرى'
};

const conditionColors: Record<AssetCondition, string> = {
    new: 'bg-[#2BB574]/15 text-[#14532D]',
    good: 'bg-[#269798]/15 text-[#1B7778]',
    fair: 'bg-[#FCB614]/10 text-[#D49A0A]',
    poor: 'bg-[#F7941D]/15 text-[#92400E]',
    damaged: 'bg-[#DC2626]/15 text-[#7F1D1D]',
    retired: 'bg-gray-100 text-gray-800'
};

export const AssetRegistry: React.FC<AssetRegistryProps> = ({ assets, onReportFault }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'all'>('all');
    const [conditionFilter, setConditionFilter] = useState<AssetCondition | 'all'>('all');

    const filteredAssets = assets.filter(asset => {
        const matchesSearch =
            asset.name.includes(searchTerm) ||
            asset.assetTag.includes(searchTerm) ||
            asset.location.includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
        const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter;
        return matchesSearch && matchesCategory && matchesCondition;
    });

    return (
        <div className="space-y-4">
            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex-1 w-full md:w-auto relative">
                    <Search className="absolute end-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="بحث برقم الأصل، الاسم، أو الموقع..."
                        className="pe-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        className="border rounded-md p-2 text-sm bg-gray-50"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'all')}
                    >
                        <option value="all">كل التصنيفات</option>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <select
                        className="border rounded-md p-2 text-sm bg-gray-50"
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value as AssetCondition | 'all')}
                    >
                        <option value="all">كل الحالات</option>
                        <option value="new">جديد</option>
                        <option value="good">جيد</option>
                        <option value="fair">متوسط</option>
                        <option value="poor">ضعيف</option>
                        <option value="damaged">تالف (يحتاج صيانة)</option>
                        <option value="retired">مكهن</option>
                    </select>
                </div>
                <Button>
                    <FileText className="w-4 h-4 ms-2" />
                    إضافة أصل جديد
                </Button>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="p-3">رقم الأصل (Tag)</th>
                            <th className="p-3">اسم الأصل</th>
                            <th className="p-3">التصنيف</th>
                            <th className="p-3">الموقع / العهدة</th>
                            <th className="p-3">الحالة</th>
                            <th className="p-3">القيمة</th>
                            <th className="p-3 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredAssets.map(asset => (
                            <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 font-mono text-gray-600">{asset.assetTag}</td>
                                <td className="p-3 font-medium text-gray-900">{asset.name}</td>
                                <td className="p-3 text-gray-600">{categoryLabels[asset.category]}</td>
                                <td className="p-3">
                                    <div className="text-gray-900">{asset.location}</div>
                                    <div className="text-xs text-gray-500">{asset.custody}</div>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[asset.condition]}`}>
                                        {asset.condition === 'damaged' && <AlertTriangle className="w-3 h-3 inline ms-1" />}
                                        {asset.condition.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-600">{asset.value.toLocaleString()} ر.س</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[#D67A0A] border-[#F7941D]/30 hover:bg-[#F7941D]/10"
                                        onClick={() => onReportFault(asset)}
                                        title="إبلاغ عن عطل"
                                    >
                                        <Wrench className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-gray-400">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredAssets.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">
                                    لا توجد أصول مطابقة للبحث
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
