import React, { useState } from 'react';
import { Beneficiary, ClothingDispensation, ClothingSeason } from '../../types';
import { ClothingItemTable } from './ClothingItemTable';

interface ClothingDispensationFormProps {
    beneficiaries: Beneficiary[];
    onSave: (data: ClothingDispensation) => void;
    onCancel: () => void;
}

export const ClothingDispensationForm: React.FC<ClothingDispensationFormProps> = ({ beneficiaries, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ClothingDispensation>>({
        beneficiaryId: '',
        date: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear().toString(),
        season: 'summer',
        items: [],
        receiverName: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.beneficiaryId) {
            alert('الرجاء اختيار المستفيد');
            return;
        }
        onSave({
            id: Date.now().toString(),
            ...formData as ClothingDispensation
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <h2>نموذج (6/7) بيان صرف احتياج إضافي للمقيم/ـة</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>المستفيد</label>
                            <select
                                value={formData.beneficiaryId}
                                onChange={e => setFormData({ ...formData, beneficiaryId: e.target.value })}
                                required
                            >
                                <option value="">اختر المستفيد</option>
                                {beneficiaries.map(b => (
                                    <option key={b.id} value={b.id}>{b.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>التاريخ</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>العام</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>الموسم</label>
                            <select
                                value={formData.season}
                                onChange={e => setFormData({ ...formData, season: e.target.value as ClothingSeason })}
                            >
                                <option value="summer">كسوة الصيف</option>
                                <option value="winter">كسوة الشتاء</option>
                                <option value="eid_fitr">عيد الفطر</option>
                                <option value="eid_adha">عيد الأضحى</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>الأصناف المصروفة</h3>
                        <ClothingItemTable
                            items={formData.items || []}
                            onChange={items => setFormData({ ...formData, items })}
                            columns={[
                                { key: 'itemName', label: 'الصنف' },
                                { key: 'quantity', label: 'العدد', type: 'number', width: '80px' },
                                { key: 'notes', label: 'ملاحظات' }
                            ]}
                        />
                    </div>

                    <div className="form-group">
                        <label>اسم المستلم</label>
                        <input
                            type="text"
                            value={formData.receiverName}
                            onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                            placeholder="اسم الموظف أو المستفيد المستلم"
                        />
                    </div>

                    <div className="form-group">
                        <label>ملاحظات</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ الصرف</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
