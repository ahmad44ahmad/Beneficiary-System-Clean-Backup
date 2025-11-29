import React, { useState } from 'react';
import { Beneficiary, WardrobeInventory, ClothingNeeds, ClothingDispensation, ClothingProcurement } from '../types';
import { beneficiaries } from '../data/beneficiaries';
import { WardrobeInventoryForm } from './WardrobeInventoryForm';
import { ClothingNeedsForm } from './ClothingNeedsForm';
import { ClothingDispensationForm } from './ClothingDispensationForm';
import { ClothingProcurementForm } from './ClothingProcurementForm';

export const ClothingManagementPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState('inventory');

    // Data State
    const [wardrobeInventories, setWardrobeInventories] = useState<WardrobeInventory[]>([]);
    const [needsAssessments, setNeedsAssessments] = useState<ClothingNeeds[]>([]);
    const [dispensations, setDispensations] = useState<ClothingDispensation[]>([]);
    const [procurements, setProcurements] = useState<ClothingProcurement[]>([]);

    // Modal State
    const [isCreatingInventory, setIsCreatingInventory] = useState(false);
    const [isCreatingNeeds, setIsCreatingNeeds] = useState(false);
    const [isCreatingDispensation, setIsCreatingDispensation] = useState(false);
    const [isCreatingProcurement, setIsCreatingProcurement] = useState(false);

    // Export function
    const handleExport = (data: any[], filename: string) => {
        if (!data.length) {
            alert('لا توجد بيانات للتصدير');
            return;
        }
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                const val = (row as any)[header];
                if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
                return `"${val}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getBeneficiaryName = (id?: string) => {
        if (!id) return 'عام';
        return beneficiaries.find(b => b.id === id)?.fullName || 'غير معروف';
    };

    return (
        <div className="clothing-panel">
            <div className="panel-header">
                <h2>إدارة الكسوة والمستودع</h2>
                <div className="tabs">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>جرد الخزائن (1)</button>
                    <button className={activeTab === 'needs' ? 'active' : ''} onClick={() => setActiveTab('needs')}>الاحتياج (2,3)</button>
                    <button className={activeTab === 'dispensation' ? 'active' : ''} onClick={() => setActiveTab('dispensation')}>الصرف الإضافي (6,7)</button>
                    <button className={activeTab === 'procurement' ? 'active' : ''} onClick={() => setActiveTab('procurement')}>المشتريات (4,5)</button>
                    <button className={activeTab === 'discard' ? 'active' : ''} onClick={() => setActiveTab('discard')}>الإتلاف (8,9,11)</button>
                    <button className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => setActiveTab('warehouse')}>جرد المستودع (10)</button>
                </div>
            </div>

            <div className="panel-content">
                {activeTab === 'inventory' && (
                    <div className="tab-section">
                        <div className="actions">
                            <button className="btn-primary" onClick={() => setIsCreatingInventory(true)}>إضافة جرد جديد</button>
                            <button className="btn-secondary" onClick={() => handleExport(wardrobeInventories, 'wardrobe_inventory')}>تصدير CSV</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>المستفيد</th>
                                    <th>العام</th>
                                    <th>الموسم</th>
                                    <th>التاريخ</th>
                                    <th>عدد الأصناف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wardrobeInventories.map(inv => (
                                    <tr key={inv.id}>
                                        <td>{getBeneficiaryName(inv.beneficiaryId)}</td>
                                        <td>{inv.year}</td>
                                        <td>{inv.season}</td>
                                        <td>{inv.date}</td>
                                        <td>{inv.items.length}</td>
                                    </tr>
                                ))}
                                {wardrobeInventories.length === 0 && <tr><td colSpan={5}>لا توجد بيانات</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'needs' && (
                    <div className="tab-section">
                        <div className="actions">
                            <button className="btn-primary" onClick={() => setIsCreatingNeeds(true)}>إضافة بيان احتياج</button>
                            <button className="btn-secondary" onClick={() => handleExport(needsAssessments, 'clothing_needs')}>تصدير CSV</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>القسم</th>
                                    <th>العام</th>
                                    <th>الموسم</th>
                                    <th>عدد الأصناف</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {needsAssessments.map(need => (
                                    <tr key={need.id}>
                                        <td>{need.gender === 'male' ? 'ذكور' : 'إناث'}</td>
                                        <td>{need.year}</td>
                                        <td>{need.season}</td>
                                        <td>{need.items.length}</td>
                                        <td>{need.status === 'draft' ? 'مسودة' : 'معتمد'}</td>
                                    </tr>
                                ))}
                                {needsAssessments.length === 0 && <tr><td colSpan={5}>لا توجد بيانات</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'dispensation' && (
                    <div className="tab-section">
                        <div className="actions">
                            <button className="btn-primary" onClick={() => setIsCreatingDispensation(true)}>صرف إضافي جديد</button>
                            <button className="btn-secondary" onClick={() => handleExport(dispensations, 'clothing_dispensation')}>تصدير CSV</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>المستفيد</th>
                                    <th>التاريخ</th>
                                    <th>الموسم</th>
                                    <th>المستلم</th>
                                    <th>عدد الأصناف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dispensations.map(disp => (
                                    <tr key={disp.id}>
                                        <td>{getBeneficiaryName(disp.beneficiaryId)}</td>
                                        <td>{disp.date}</td>
                                        <td>{disp.season}</td>
                                        <td>{disp.receiverName}</td>
                                        <td>{disp.items.length}</td>
                                    </tr>
                                ))}
                                {dispensations.length === 0 && <tr><td colSpan={5}>لا توجد بيانات</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'procurement' && (
                    <div className="tab-section">
                        <div className="actions">
                            <button className="btn-primary" onClick={() => setIsCreatingProcurement(true)}>إضافة محضر تأمين</button>
                            <button className="btn-secondary" onClick={() => handleExport(procurements, 'clothing_procurement')}>تصدير CSV</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>التاريخ</th>
                                    <th>رقم الفاتورة</th>
                                    <th>عدد الأصناف</th>
                                    <th>الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody>
                                {procurements.map(proc => (
                                    <tr key={proc.id}>
                                        <td>{proc.date}</td>
                                        <td>{proc.invoiceNumber || '-'}</td>
                                        <td>{proc.items.length}</td>
                                        <td>{proc.totalAmount}</td>
                                    </tr>
                                ))}
                                {procurements.length === 0 && <tr><td colSpan={4}>لا توجد بيانات</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {['discard', 'warehouse', 'committee'].includes(activeTab) && (
                    <div className="placeholder-content">
                        <p>سيتم إضافة النماذج قريباً...</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreatingInventory && (
                <WardrobeInventoryForm
                    beneficiaries={beneficiaries}
                    onSave={(data) => {
                        setWardrobeInventories([...wardrobeInventories, data]);
                        setIsCreatingInventory(false);
                    }}
                    onCancel={() => setIsCreatingInventory(false)}
                />
            )}
            {isCreatingNeeds && (
                <ClothingNeedsForm
                    onSave={(data) => {
                        setNeedsAssessments([...needsAssessments, data]);
                        setIsCreatingNeeds(false);
                    }}
                    onCancel={() => setIsCreatingNeeds(false)}
                />
            )}
            {isCreatingDispensation && (
                <ClothingDispensationForm
                    beneficiaries={beneficiaries}
                    onSave={(data) => {
                        setDispensations([...dispensations, data]);
                        setIsCreatingDispensation(false);
                    }}
                    onCancel={() => setIsCreatingDispensation(false)}
                />
            )}
            {isCreatingProcurement && (
                <ClothingProcurementForm
                    onSave={(data) => {
                        setProcurements([...procurements, data]);
                        setIsCreatingProcurement(false);
                    }}
                    onCancel={() => setIsCreatingProcurement(false)}
                />
            )}
        </div>
    );
};
