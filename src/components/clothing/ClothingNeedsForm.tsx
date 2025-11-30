import React, { useState } from 'react';
import { ClothingNeeds, ClothingSeason } from '../../types';
import { ClothingItemTable } from './ClothingItemTable';

interface ClothingNeedsFormProps {
    onSave: (needs: ClothingNeeds) => void;
    onCancel: () => void;
}

export const ClothingNeedsForm: React.FC<ClothingNeedsFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ClothingNeeds>>({
        gender: 'male',
        year: new Date().getFullYear().toString(),
        season: 'summer',
        items: [],
        notes: '',
        status: 'draft'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as ClothingNeeds
        });
    };

    // Predefined items based on gender (Model 2 vs 3)
    const loadTemplate = (gender: 'male' | 'female') => {
        const maleItems = ['ثوب', 'شماغ', 'عقال', 'طاقية', 'سروال طويل', 'سروال قصير', 'فنيلة داخلية', 'بجامة داخلية', 'جاكيت', 'سديرية', 'فروة', 'شرابات', 'جزم', 'نعال', 'شبشب', 'بدلة رياضية', 'جينز', 'تي شيرت', 'منشفة كبيرة', 'منشفة صغيرة', 'روب حمام', 'قبعة', 'قفاز'];
        const femaleItems = ['قميص بيت', 'جلابية', 'عباية', 'بلوزة', 'تنورة', 'نقاب', 'بنطلون', 'شال', 'فستان', 'جزمة', 'فنيلة داخلية', 'شبشب', 'سروال قصير', 'بدلة رياضية', 'سروال طويل', 'صدرية خاصة', 'سنتيانة', 'جاكيت', 'بجامة شتوية', 'منشفة كبيرة', 'منشفة صغيرة', 'قبعة / قفاز', 'روب حمام', 'شرابات'];

        const items = (gender === 'male' ? maleItems : femaleItems).map(name => ({
            itemName: name,
            quantity: 0,
            size: '',
            notes: ''
        }));
        setFormData({ ...formData, gender, items });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <h2>نموذج (2/3) بيان احتياج المقيمين من الكسوة</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>القسم</label>
                            <select
                                value={formData.gender}
                                onChange={e => {
                                    const g = e.target.value as 'male' | 'female';
                                    setFormData({ ...formData, gender: g });
                                    loadTemplate(g);
                                }}
                            >
                                <option value="male">قسم الذكور (نموذج 2)</option>
                                <option value="female">قسم الإناث (نموذج 3)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>العام</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>نوع الكسوة</label>
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
                        <div className="section-header">
                            <h3>الأصناف المطلوبة</h3>
                            <button type="button" className="btn-secondary small" onClick={() => loadTemplate(formData.gender as 'male' | 'female')}>تحميل الأصناف الافتراضية</button>
                        </div>
                        <ClothingItemTable
                            items={formData.items || []}
                            onChange={items => setFormData({ ...formData, items })}
                            columns={[
                                { key: 'itemName', label: 'الصنف' },
                                { key: 'quantity', label: 'العدد', type: 'number', width: '80px' },
                                { key: 'size', label: 'المقاسات', width: '150px' },
                                { key: 'notes', label: 'ملاحظات' }
                            ]}
                        />
                    </div>

                    <div className="form-group">
                        <label>ملاحظات عامة</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ الاحتياج</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
