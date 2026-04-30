import React, { useState } from 'react';
import { AssetItem, CustodyRecord, MOCK_ASSETS, MOCK_CUSTODY } from '../../types/support';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
    Box,
    User,
    Search,
    Plus,
    Package
} from 'lucide-react';

export const CustodyPanel: React.FC = () => {
    const [assets] = useState<AssetItem[]>(MOCK_ASSETS);
    const [custodyRecords] = useState<CustodyRecord[]>(MOCK_CUSTODY);
    const [activeTab, setActiveTab] = useState<'inventory' | 'custody'>('custody');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAssets = assets.filter(a =>
        a.name.includes(searchTerm) || a.sku.includes(searchTerm)
    );

    const filteredCustody = custodyRecords.filter(c =>
        c.assetName.includes(searchTerm) || c.assignedTo.includes(searchTerm)
    );

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('custody')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'custody' ? 'bg-white shadow text-[#1B7778]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        سجل العهد (لمن سلمت؟)
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'inventory' ? 'bg-white shadow text-[#1B7778]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        المخزون والأصول
                    </button>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="بحث برقم التسلسل، الاسم..."
                            className="w-full pe-9 ps-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#269798] outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="bg-[#1B7778] hover:bg-[#1B7778] text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {activeTab === 'custody' ? 'تسليم عهدة' : 'إضافة أصل'}
                    </Button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'custody' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCustody.map(record => (
                        <Card key={record.id} className="p-4 border-e-4 border-e-teal-500">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#269798]/10 rounded-lg text-[#1B7778]">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{record.assignedTo}</h4>
                                        <p className="text-xs text-gray-500">{record.type === 'personal' ? 'عهدة شخصية' : 'عهدة قسم'}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${record.status === 'active' ? 'bg-[#2BB574]/15 text-[#1E9658]' : 'bg-gray-100 text-gray-700'}`}>
                                    {record.status === 'active' ? 'نشطة' : 'مرتجعة'}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-3 rounded border border-gray-100 mb-3">
                                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-gray-400" />
                                    {record.assetName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">تاريخ الاستلام: {record.assignDate}</p>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="w-full text-xs h-8">نقل العهدة</Button>
                                <Button variant="outline" className="w-full text-xs h-8 text-[#DC2626] hover:bg-[#DC2626]/10 hover:text-[#B91C1C]">إخلاء طرف</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4">الأصل</th>
                                <th className="p-4">الرقم التسلسلي</th>
                                <th className="p-4">الفئة</th>
                                <th className="p-4">الموقع</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        {asset.name}
                                    </td>
                                    <td className="p-4 text-gray-600 fontFamily-mono">{asset.sku}</td>
                                    <td className="p-4 text-gray-600">
                                        {asset.category === 'electronic' ? 'إلكترونيات' :
                                            asset.category === 'medical_device' ? 'أجهزة طبية' : 'أثاث'}
                                    </td>
                                    <td className="p-4 text-gray-600">{asset.location}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${asset.state === 'good' || asset.state === 'new' ? 'bg-[#2BB574]/15 text-[#1E9658]' :
                                                asset.state === 'fair' ? 'bg-[#FCB614]/10 text-[#D49A0A]' : 'bg-[#DC2626]/15 text-[#B91C1C]'
                                            }`}>
                                            {asset.state === 'new' ? 'جديد' :
                                                asset.state === 'good' ? 'جيد' :
                                                    asset.state === 'fair' ? 'متوسط' : 'تالف'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-[#1B7778] hover:text-[#0F3144] text-xs font-bold">عرض التفاصيل</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
