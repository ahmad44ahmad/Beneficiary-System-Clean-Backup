import * as React from 'react';
import { useState } from 'react';
import { VisitLog, Beneficiary } from '../../types';

interface VisitLogPanelProps {
    beneficiary: Beneficiary;
    logs: VisitLog[];
    onAddLog: (log: VisitLog) => void;
}

export const VisitLogPanel: React.FC<VisitLogPanelProps> = ({ beneficiary, logs, onAddLog }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newLog, setNewLog] = useState<Partial<VisitLog>>({
        type: 'internal',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        visitorName: '',
        relation: '',
        notes: '',
        employeeName: ''
    });

    const relevantLogs = logs.filter(log => log.beneficiaryId === beneficiary.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLog.type && newLog.date && newLog.time && newLog.notes && newLog.employeeName) {
            const log: VisitLog = {
                id: `log_${Date.now()}`,
                beneficiaryId: beneficiary.id,
                type: newLog.type as any,
                date: newLog.date,
                time: newLog.time,
                visitorName: newLog.visitorName,
                relation: newLog.relation,
                notes: newLog.notes,
                employeeName: newLog.employeeName
            };
            onAddLog(log);
            setIsAdding(false);
            setNewLog({
                type: 'internal',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                visitorName: '',
                relation: '',
                notes: '',
                employeeName: ''
            });
        }
    };

    return (
        <div className="detail-card">
            <div className="detail-card-header">
                <h3>سجل المتابعة والزيارات</h3>
                <button className="button-primary" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'إلغاء' : 'إضافة سجل'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="visit-log-form">
                    <div className="form-grid-col-2">
                        <div className="form-group">
                            <label>نوع السجل</label>
                            <select
                                value={newLog.type}
                                onChange={e => setNewLog({ ...newLog, type: e.target.value as any })}
                                required
                            >
                                <option value="internal">زيارة داخلية</option>
                                <option value="external">زيارة خارجية</option>
                                <option value="phone">اتصال هاتفي</option>
                                <option value="behavioral">ملاحظة سلوكية</option>
                                <option value="emergency">حدث طارئ</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>التاريخ</label>
                            <input type="date" value={newLog.date} onChange={e => setNewLog({ ...newLog, date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>الوقت</label>
                            <input type="time" value={newLog.time} onChange={e => setNewLog({ ...newLog, time: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>الموظف المسؤول</label>
                            <input type="text" value={newLog.employeeName} onChange={e => setNewLog({ ...newLog, employeeName: e.target.value })} required />
                        </div>
                    </div>

                    {(newLog.type === 'internal' || newLog.type === 'external' || newLog.type === 'phone') && (
                        <div className="form-grid-col-2">
                            <div className="form-group">
                                <label>اسم الزائر/المتصل</label>
                                <input type="text" value={newLog.visitorName} onChange={e => setNewLog({ ...newLog, visitorName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>صلة القرابة</label>
                                <input type="text" value={newLog.relation} onChange={e => setNewLog({ ...newLog, relation: e.target.value })} />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>الملاحظات</label>
                        <textarea value={newLog.notes} onChange={e => setNewLog({ ...newLog, notes: e.target.value })} rows={3} required></textarea>
                    </div>

                    <button type="submit" className="button-primary">حفظ السجل</button>
                </form>
            )}

            <div className="visit-log-list">
                {relevantLogs.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>النوع</th>
                                <th>التاريخ</th>
                                <th>الوقت</th>
                                <th>التفاصيل</th>
                                <th>الموظف</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relevantLogs.map(log => (
                                <tr key={log.id} className={log.type === 'emergency' ? 'row-emergency' : ''}>
                                    <td>
                                        {log.type === 'internal' && 'زيارة داخلية'}
                                        {log.type === 'external' && 'زيارة خارجية'}
                                        {log.type === 'phone' && 'اتصال هاتفي'}
                                        {log.type === 'behavioral' && 'ملاحظة سلوكية'}
                                        {log.type === 'emergency' && 'حدث طارئ'}
                                    </td>
                                    <td>{log.date}</td>
                                    <td>{log.time}</td>
                                    <td>
                                        {log.visitorName && <div><strong>الزائر:</strong> {log.visitorName} ({log.relation})</div>}
                                        <div>{log.notes}</div>
                                    </td>
                                    <td>{log.employeeName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>لا توجد سجلات متابعة لهذا المستفيد.</p>
                )}
            </div>
        </div>
    );
};
