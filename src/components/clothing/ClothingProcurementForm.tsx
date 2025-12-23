import React, { useState } from 'react';
import { ClothingProcurement } from '../../types';

interface ClothingProcurementFormProps {
    onSave: (data: ClothingProcurement) => void;
    onCancel: () => void;
}

export const ClothingProcurementForm: React.FC<ClothingProcurementFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ClothingProcurement>>({
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        items: [],
        totalAmount: 0,
        committeeMembers: []
    });

    const [currentItem, setCurrentItem] = useState({ item: '', quantity: 0, invoiceNo: '', amount: 0 });

    const addItem = () => {
        if (!currentItem.item) return;
        const newItems = [...(formData.items || []), currentItem];
        const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
        setFormData({ ...formData, items: newItems, totalAmount: total });
        setCurrentItem({ item: '', quantity: 0, invoiceNo: '', amount: 0 });
    };

    const removeItem = (index: number) => {
        const newItems = (formData.items || []).filter((_, i) => i !== index);
        const total = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
        setFormData({ ...formData, items: newItems, totalAmount: total });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as ClothingProcurement
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <h2>نموذج (4) محضر تأمين مشتريات الكسوة</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>التاريخ</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>رقم الفاتورة المجمعة (إن وجد)</label>
                            <input
                                type="text"
                                value={formData.invoiceNumber}
                                onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>الأصناف المشتراة</h3>
                        <div className="form-row" style={{ alignItems: 'flex-end' }}>
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>الصنف</label>
                                <input
                                    type="text"
                                    value={currentItem.item}
                                    onChange={e => setCurrentItem({ ...currentItem, item: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>العدد</label>
                                <input
                                    type="number"
                                    value={currentItem.quantity}
                                    onChange={e => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label>رقم الفاتورة</label>
                                <input
                                    type="text"
                                    value={currentItem.invoiceNo}
                                    onChange={e => setCurrentItem({ ...currentItem, invoiceNo: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>المبلغ</label>
                                <input
                                    type="number"
                                    value={currentItem.amount}
                                    onChange={e => setCurrentItem({ ...currentItem, amount: Number(e.target.value) })}
                                />
                            </div>
                            <button type="button" onClick={addItem} className="btn-secondary">إضافة</button>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>الصنف</th>
                                    <th>العدد</th>
                                    <th>رقم الفاتورة</th>
                                    <th>المبلغ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.item}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.invoiceNo}</td>
                                        <td>{item.amount}</td>
                                        <td><button type="button" onClick={() => removeItem(index)} className="btn-icon delete">×</button></td>
                                    </tr>
                                ))}
                                <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                                    <td colSpan={3}>الإجمالي</td>
                                    <td>{formData.totalAmount}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ المحضر</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
