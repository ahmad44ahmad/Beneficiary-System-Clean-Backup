import React, { useState, useEffect } from 'react';
import { Beneficiary, VocationalEvaluation } from '../../types';

interface VocationalEvaluationFormProps {
    beneficiary: Beneficiary;
    onSave: (evaluation: VocationalEvaluation) => void;
    onCancel: () => void;
}

export const VocationalEvaluationForm: React.FC<VocationalEvaluationFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<VocationalEvaluation>>({
        beneficiaryId: beneficiary.id,
        profession: '',
        evaluatorName: '',
        date: new Date().toISOString().split('T')[0],
        scores: {
            enthusiasm: 0,
            responsibility: 0,
            communication: 0,
            behavior: 0,
            resourcefulness: 0,
            relationshipWithSuperiors: 0,
            acceptingDirections: 0,
            executionSkill: 0,
            overcomingDifficulties: 0,
            timeliness: 0,
            attendance: 0,
            futurePotential: 0
        },
        totalScore: 0
    });

    useEffect(() => {
        if (formData.scores) {
            const total = Object.values(formData.scores).reduce((a, b) => (a as number) + (b as number), 0);
            setFormData(prev => ({ ...prev, totalScore: total }));
        }
    }, [formData.scores]);

    const handleScoreChange = (key: keyof typeof formData.scores, value: number) => {
        setFormData(prev => ({
            ...prev,
            scores: {
                ...prev.scores!,
                [key]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as VocationalEvaluation
        });
    };

    const renderScoreInput = (label: string, key: keyof typeof formData.scores) => (
        <div className="form-group score-input">
            <label>{label} (1-5)</label>
            <input
                type="number"
                min="1"
                max="5"
                value={formData.scores![key]}
                onChange={e => handleScoreChange(key, parseInt(e.target.value, 10) || 0)}
                required
            />
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>استمارة قياس أداء المتدربين (نموذج 11)</h2>
                <div className="beneficiary-info">
                    <p><strong>المتدرب:</strong> {beneficiary.fullName}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>مهنة التدريب</label>
                            <input
                                type="text"
                                value={formData.profession}
                                onChange={e => setFormData({ ...formData, profession: e.target.value })}
                                required
                            />
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

                    <div className="scores-section">
                        <h3>السمات الشخصية</h3>
                        {renderScoreInput('لديه حماس ودافعية للعمل', 'enthusiasm')}
                        {renderScoreInput('تقدير المسؤولية', 'responsibility')}
                        {renderScoreInput('القدرة على إقامة اتصالات فعالة', 'communication')}
                        {renderScoreInput('السلوك العام مقبول اجتماعياً', 'behavior')}
                        {renderScoreInput('حسن التصرف في المواقف', 'resourcefulness')}
                        {renderScoreInput('العلاقة مع الرؤساء', 'relationshipWithSuperiors')}
                        {renderScoreInput('تقبل التوجيهات', 'acceptingDirections')}

                        <h3>مهارات العمل</h3>
                        {renderScoreInput('المهارة في تنفيذ الأعمال', 'executionSkill')}
                        {renderScoreInput('القدرة على التغلب على الصعوبات', 'overcomingDifficulties')}
                        {renderScoreInput('إنجاز العمل في الوقت المحدد', 'timeliness')}
                        {renderScoreInput('المحافظة على أوقات العمل', 'attendance')}
                        {renderScoreInput('إمكانية تحمل مهام أخرى مستقبلاً', 'futurePotential')}
                    </div>

                    <div className="total-score">
                        <strong>المجموع الكلي: {formData.totalScore} / 60</strong>
                    </div>

                    <div className="form-group">
                        <label>اسم المقيم</label>
                        <input
                            type="text"
                            value={formData.evaluatorName}
                            onChange={e => setFormData({ ...formData, evaluatorName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ التقييم</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
