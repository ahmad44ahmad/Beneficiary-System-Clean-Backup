import React, { useState } from 'react';
import { SocialActivityPlan } from '../../types';

interface SocialActivityPlanFormProps {
    onSave: (plan: SocialActivityPlan) => void;
    onCancel: () => void;
}

export const SocialActivityPlanForm: React.FC<SocialActivityPlanFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SocialActivityPlan>>({
        year: '',
        centerName: '',
        activityType: '',
        supervisor: '',
        generalGoal: '',
        detailedGoals: '',
        targetGroup: 'employees',
        isLinkedToCoreGoals: false,
        isLinkedToOperationalPlan: false,
        supportSource: 'none',
        cost: '',
        expectedOutputs: '',
        executionTimeStart: '',
        executionTimeEnd: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as SocialActivityPlan
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>الخطة السنوية للأنشطة الاجتماعية (نموذج 1)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>خطة العام المالي (هـ / م)</label>
                        <input
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>مركز التأهيل الشامل</label>
                        <input
                            type="text"
                            name="centerName"
                            value={formData.centerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>نوع النشاط</label>
                            <input
                                type="text"
                                name="activityType"
                                value={formData.activityType}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>مشرف النشاط</label>
                            <input
                                type="text"
                                name="supervisor"
                                value={formData.supervisor}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>الهدف العام للنشاط</label>
                        <textarea
                            name="generalGoal"
                            value={formData.generalGoal}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>الأهداف التفصيلية للنشاط</label>
                        <textarea
                            name="detailedGoals"
                            value={formData.detailedGoals}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>تنفيذ النشاط (الفئة المستهدفة)</label>
                        <select name="targetGroup" value={formData.targetGroup} onChange={handleChange}>
                            <option value="employees">موظفي المركز</option>
                            <option value="external">جهة خارجية</option>
                            <option value="both">كلاهما</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isLinkedToCoreGoals"
                                    checked={formData.isLinkedToCoreGoals}
                                    onChange={handleChange}
                                />
                                مرتبط بأهداف القسم الأساسية
                            </label>
                        </div>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isLinkedToOperationalPlan"
                                    checked={formData.isLinkedToOperationalPlan}
                                    onChange={handleChange}
                                />
                                مرتبط بالخطة التشغيلية
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>مصادر دعم النشاط</label>
                        <select name="supportSource" value={formData.supportSource} onChange={handleChange}>
                            <option value="budget">بند الميزانية</option>
                            <option value="extra">دعم إضافي</option>
                            <option value="none">لا يحتاج تكلفة</option>
                        </select>
                    </div>

                    {formData.supportSource !== 'none' && (
                        <div className="form-group">
                            <label>مبلغ التكلفة (ريال)</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>المخرجات المتوقعة</label>
                        <textarea
                            name="expectedOutputs"
                            value={formData.expectedOutputs}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>وقت التنفيذ (من)</label>
                            <input
                                type="date"
                                name="executionTimeStart"
                                value={formData.executionTimeStart}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>وقت التنفيذ (إلى)</label>
                            <input
                                type="date"
                                name="executionTimeEnd"
                                value={formData.executionTimeEnd}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ الخطة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
