import React, { useState } from 'react';
import { Beneficiary, TrainingPlanFollowUp } from '../../types';

interface TrainingPlanFollowUpFormProps {
    beneficiary: Beneficiary;
    onSave: (followUp: TrainingPlanFollowUp) => void;
    onCancel: () => void;
}

export const TrainingPlanFollowUpForm: React.FC<TrainingPlanFollowUpFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<TrainingPlanFollowUp>>({
        beneficiaryId: beneficiary.id,
        month: '',
        teamMembers: [],
        skills: [],
        notes: ''
    });

    const [newTeamMember, setNewTeamMember] = useState('');
    const [newSkill, setNewSkill] = useState({ domain: 'independence', skillName: '', status: 'not_mastered' });

    const addTeamMember = () => {
        if (newTeamMember) {
            setFormData(prev => ({
                ...prev,
                teamMembers: [...(prev.teamMembers || []), newTeamMember]
            }));
            setNewTeamMember('');
        }
    };

    const addSkill = () => {
        if (newSkill.skillName) {
            setFormData(prev => ({
                ...prev,
                skills: [...(prev.skills || []), newSkill as any]
            }));
            setNewSkill({ ...newSkill, skillName: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as TrainingPlanFollowUp
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>الاستمارة الشهرية لمتابعة الخطة التدريبية (نموذج 6)</h2>
                <div className="beneficiary-info">
                    <p><strong>المستفيد:</strong> {beneficiary.fullName}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>الشهر</label>
                        <input
                            type="text"
                            value={formData.month}
                            onChange={e => setFormData({ ...formData, month: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <h3>الفريق المشارك</h3>
                        <div className="form-row">
                            <input
                                placeholder="اسم العضو / المسمى الوظيفي"
                                value={newTeamMember}
                                onChange={e => setNewTeamMember(e.target.value)}
                            />
                            <button type="button" onClick={addTeamMember} className="btn-small">إضافة</button>
                        </div>
                        <ul>
                            {formData.teamMembers?.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>

                    <div className="form-section">
                        <h3>المهارات</h3>
                        <div className="form-row">
                            <select
                                value={newSkill.domain}
                                onChange={e => setNewSkill({ ...newSkill, domain: e.target.value })}
                            >
                                <option value="independence">الجانب الاستقلالي</option>
                                <option value="social">الجانب الاجتماعي</option>
                                <option value="rehab">التأهيل والتمكين</option>
                            </select>
                            <input
                                placeholder="المهارة"
                                value={newSkill.skillName}
                                onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
                            />
                            <select
                                value={newSkill.status}
                                onChange={e => setNewSkill({ ...newSkill, status: e.target.value })}
                            >
                                <option value="mastered">يتقن</option>
                                <option value="with_help">يتقن بالمساعدة</option>
                                <option value="not_mastered">لم يتقن</option>
                            </select>
                            <button type="button" onClick={addSkill} className="btn-small">إضافة</button>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>الجانب</th>
                                    <th>المهارة</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.skills?.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.domain === 'independence' ? 'استقلالي' : s.domain === 'social' ? 'اجتماعي' : 'تأهيل'}</td>
                                        <td>{s.skillName}</td>
                                        <td>{s.status === 'mastered' ? 'يتقن' : s.status === 'with_help' ? 'بالمساعدة' : 'لم يتقن'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="form-group">
                        <label>الملاحظات</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ المتابعة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
