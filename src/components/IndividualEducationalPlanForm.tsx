import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, IndividualEducationalPlan } from '../types';

interface IndividualEducationalPlanFormProps {
    beneficiary: Beneficiary;
    onSave: (plan: IndividualEducationalPlan) => void;
    onCancel: () => void;
}

export const IndividualEducationalPlanForm: React.FC<IndividualEducationalPlanFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<IndividualEducationalPlan, 'id' | 'beneficiaryId'>>({
        planDate: new Date().toISOString().split('T')[0],
        teacherName: '',
        currentPerformanceLevel: '',
        longTermGoals: [''],
        shortTermGoals: [{ goal: '', criteria: '', evaluationMethod: '', targetDate: '' }],
        evaluation: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLongTermGoalChange = (index: number, value: string) => {
        const newGoals = [...formData.longTermGoals];
        newGoals[index] = value;
        setFormData(prev => ({ ...prev, longTermGoals: newGoals }));
    };

    const addLongTermGoal = () => {
        setFormData(prev => ({ ...prev, longTermGoals: [...prev.longTermGoals, ''] }));
    };

    const removeLongTermGoal = (index: number) => {
        const newGoals = formData.longTermGoals.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, longTermGoals: newGoals }));
    };

    const handleShortTermGoalChange = (index: number, field: string, value: string) => {
        const newGoals = [...formData.shortTermGoals];
        newGoals[index] = { ...newGoals[index], [field]: value };
        setFormData(prev => ({ ...prev, shortTermGoals: newGoals }));
    };

    const addShortTermGoal = () => {
        setFormData(prev => ({
            ...prev,
            shortTermGoals: [...prev.shortTermGoals, { goal: '', criteria: '', evaluationMethod: '', targetDate: '' }]
        }));
    };

    const removeShortTermGoal = (index: number) => {
        const newGoals = formData.shortTermGoals.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, shortTermGoals: newGoals }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPlan: IndividualEducationalPlan = {
            id: `iep_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            ...formData
        };
        onSave(newPlan);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>الخطة التربوية الفردية (نموذج ٩ & ٤٦)</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>العمر:</strong> {beneficiary.age}</p>
                            <p><strong>مستوى الذكاء:</strong> {beneficiary.iqLevel}</p>
                        </div>

                        <div className="form-grid-col-2">
                            <div className="form-group">
                                <label htmlFor="teacherName">اسم المعلم/المعد</label>
                                <input type="text" id="teacherName" name="teacherName" value={formData.teacherName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="planDate">تاريخ الخطة</label>
                                <input type="date" id="planDate" name="planDate" value={formData.planDate} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="currentPerformanceLevel">مستوى الأداء الحالي</label>
                            <textarea id="currentPerformanceLevel" name="currentPerformanceLevel" value={formData.currentPerformanceLevel} onChange={handleChange} rows={4} required></textarea>
                        </div>

                        <fieldset>
                            <legend>الأهداف طويلة المدى</legend>
                            {formData.longTermGoals.map((goal, index) => (
                                <div key={index} className="dynamic-list-item">
                                    <input
                                        type="text"
                                        value={goal}
                                        onChange={e => handleLongTermGoalChange(index, e.target.value)}
                                        placeholder={`هدف طويل المدى ${index + 1}`}
                                        required
                                    />
                                    {formData.longTermGoals.length > 1 && (
                                        <button type="button" className="remove-item-button" onClick={() => removeLongTermGoal(index)}>&times;</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-item-button" onClick={addLongTermGoal}>+ إضافة هدف</button>
                        </fieldset>

                        <fieldset>
                            <legend>الأهداف قصيرة المدى</legend>
                            {formData.shortTermGoals.map((goal, index) => (
                                <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                    <div className="form-grid-col-2">
                                        <div className="form-group">
                                            <label>الهدف</label>
                                            <input type="text" value={goal.goal} onChange={e => handleShortTermGoalChange(index, 'goal', e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>معيار التحقق</label>
                                            <input type="text" value={goal.criteria} onChange={e => handleShortTermGoalChange(index, 'criteria', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>أسلوب التقييم</label>
                                            <input type="text" value={goal.evaluationMethod} onChange={e => handleShortTermGoalChange(index, 'evaluationMethod', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>تاريخ التحقيق المتوقع</label>
                                            <input type="date" value={goal.targetDate} onChange={e => handleShortTermGoalChange(index, 'targetDate', e.target.value)} />
                                        </div>
                                    </div>
                                    {formData.shortTermGoals.length > 1 && (
                                        <button type="button" className="remove-item-button" onClick={() => removeShortTermGoal(index)} style={{ marginTop: '0.5rem' }}>حذف الهدف</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-item-button" onClick={addShortTermGoal}>+ إضافة هدف قصير المدى</button>
                        </fieldset>

                        <div className="form-group">
                            <label htmlFor="evaluation">التقييم والملاحظات الختامية</label>
                            <textarea id="evaluation" name="evaluation" value={formData.evaluation} onChange={handleChange} rows={3}></textarea>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ الخطة</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
