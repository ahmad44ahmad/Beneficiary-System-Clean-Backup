import React, { useState } from 'react';
import { SocialActivityDocumentation } from '../../types';

interface SocialActivityDocumentationFormProps {
    onSave: (doc: SocialActivityDocumentation) => void;
    onCancel: () => void;
}

interface Participant {
    name: string;
    job: string;
    task: string;
}

export const SocialActivityDocumentationForm: React.FC<SocialActivityDocumentationFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SocialActivityDocumentation>>({
        activityName: '',
        date: '',
        type: '',
        supervisor: '',
        internalParticipants: [],
        externalParticipants: [],
        approvalHead: false,
        approvalSupervisor: false,
        approvalDirector: false
    });

    const [newInternal, setNewInternal] = useState<Participant>({ name: '', job: '', task: '' });
    const [newExternal, setNewExternal] = useState<Participant>({ name: '', job: '', task: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addInternalParticipant = () => {
        if (newInternal.name) {
            setFormData(prev => ({
                ...prev,
                internalParticipants: [...(prev.internalParticipants || []), newInternal]
            }));
            setNewInternal({ name: '', job: '', task: '' });
        }
    };

    const addExternalParticipant = () => {
        if (newExternal.name) {
            setFormData(prev => ({
                ...prev,
                externalParticipants: [...(prev.externalParticipants || []), newExternal]
            }));
            setNewExternal({ name: '', job: '', task: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as SocialActivityDocumentation
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>توثيق النشاط (نموذج 2)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>اسم النشاط</label>
                            <input
                                type="text"
                                name="activityName"
                                value={formData.activityName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>نوعه</label>
                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>التاريخ</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>مشرف الوحدة</label>
                            <input
                                type="text"
                                name="supervisor"
                                value={formData.supervisor}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="participants-section">
                        <h3>المشاركون من داخل المركز</h3>
                        <div className="form-row">
                            <input placeholder="الاسم" value={newInternal.name} onChange={e => setNewInternal({ ...newInternal, name: e.target.value })} />
                            <input placeholder="الوظيفة" value={newInternal.job} onChange={e => setNewInternal({ ...newInternal, job: e.target.value })} />
                            <input placeholder="المهمة" value={newInternal.task} onChange={e => setNewInternal({ ...newInternal, task: e.target.value })} />
                            <button type="button" onClick={addInternalParticipant} className="btn-small">إضافة</button>
                        </div>
                        <ul>
                            {formData.internalParticipants?.map((p, i) => (
                                <li key={i}>{p.name} - {p.job} ({p.task})</li>
                            ))}
                        </ul>
                    </div>

                    <div className="participants-section">
                        <h3>المشاركون من خارج المركز</h3>
                        <div className="form-row">
                            <input placeholder="الاسم" value={newExternal.name} onChange={e => setNewExternal({ ...newExternal, name: e.target.value })} />
                            <input placeholder="الوظيفة" value={newExternal.job} onChange={e => setNewExternal({ ...newExternal, job: e.target.value })} />
                            <input placeholder="المهمة" value={newExternal.task} onChange={e => setNewExternal({ ...newExternal, task: e.target.value })} />
                            <button type="button" onClick={addExternalParticipant} className="btn-small">إضافة</button>
                        </div>
                        <ul>
                            {formData.externalParticipants?.map((p, i) => (
                                <li key={i}>{p.name} - {p.job} ({p.task})</li>
                            ))}
                        </ul>
                    </div>

                    <div className="approvals-section">
                        <h3>الاعتمادات</h3>
                        <div className="form-row">
                            <label>
                                <input
                                    type="checkbox"
                                    name="approvalHead"
                                    checked={formData.approvalHead}
                                    onChange={handleChange}
                                />
                                رئيس القسم
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="approvalSupervisor"
                                    checked={formData.approvalSupervisor}
                                    onChange={handleChange}
                                />
                                مشرف قسم الخدمات الاجتماعية
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="approvalDirector"
                                    checked={formData.approvalDirector}
                                    onChange={handleChange}
                                />
                                مدير مركز التأهيل الشامل
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ التوثيق</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
