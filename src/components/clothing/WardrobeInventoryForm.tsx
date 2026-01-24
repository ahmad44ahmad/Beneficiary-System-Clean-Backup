import React, { useState } from 'react';
import { Beneficiary, WardrobeInventory, ClothingSeason } from '../../types';
import { ClothingItemTable } from './ClothingItemTable';

interface WardrobeInventoryFormProps {
    beneficiaries: Beneficiary[];
    onSave: (inventory: WardrobeInventory) => void;
    onCancel: () => void;
}

export const WardrobeInventoryForm: React.FC<WardrobeInventoryFormProps> = ({ beneficiaries, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<WardrobeInventory>>({
        beneficiaryId: '',
        year: new Date().getFullYear(),
        season: 'summer',
        items: [],
        date: new Date().toISOString().split('T')[0],
        socialSupervisor: '',
        servicesSupervisor: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.beneficiaryId) {
            alert('الرجاء اختيار المستفيد');
            return;
        }
        onSave({
            id: Date.now().toString(),
            ...formData as WardrobeInventory
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <h2>نموذج (1) جرد القطع في خزانة ملابس المقيم</h2>
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
                            <label>العام</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>الموسم / المناسبة</label>
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
                        <h3>الأصناف</h3>
                        <ClothingItemTable
                            items={formData.items || []}
                            onChange={items => setFormData({ ...formData, items })}
                            columns={[
                                { key: 'itemId', label: 'الصنف' },
                                { key: 'size', label: 'المقاس', width: '80px' },
                                { key: 'quantity', label: 'العدد في الخزانة', type: 'number', width: '100px' },
                                { key: 'damagedCount', label: 'التالف', type: 'number', width: '80px' },
                                { key: 'replacementCount', label: 'الاستبدال', type: 'number', width: '80px' },
                                { key: 'reason', label: 'السبب' }
                            ]}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>المراقب الاجتماعي</label>
                            <input
                                type="text"
                                value={formData.socialSupervisor}
                                onChange={e => setFormData({ ...formData, socialSupervisor: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>مشرف الخدمات الاجتماعية</label>
                            <input
                                type="text"
                                value={formData.servicesSupervisor}
                                onChange={e => setFormData({ ...formData, servicesSupervisor: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ الجرد</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
