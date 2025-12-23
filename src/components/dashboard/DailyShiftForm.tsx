import React, { useState } from 'react';
import { DailyShiftRecord, ShiftPeriod, GenderSection, Beneficiary } from '../../types';

interface DailyShiftFormProps {
    beneficiaries: Beneficiary[];
    onSave: (record: DailyShiftRecord) => void;
    onCancel: () => void;
    initialData?: Partial<DailyShiftRecord>;
}

export const DailyShiftForm: React.FC<DailyShiftFormProps> = ({ beneficiaries, onSave, onCancel, initialData }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState<Partial<DailyShiftRecord>>(initialData || {
        date: new Date().toISOString().split('T')[0],
        shift: 'first',
        section: 'male',
        supervisorName: '',
        startTime: '',
        endTime: '',
        beneficiaryStats: {
            total: beneficiaries.length,
            internalVisits: 0,
            externalVisits: 0,
            admissions: 0,
            appointments: 0,
            emergencies: 0,
            deaths: 0,
            injuries: 0,
            others: ''
        },
        staffAttendance: [
            { category: 'الموظفين الرسميين', total: 0, present: 0, absent: 0 },
            { category: 'الشركة المشغلة (مشرف)', total: 0, present: 0, absent: 0 },
            { category: 'الشركة المشغلة (تمريض)', total: 0, present: 0, absent: 0 },
            { category: 'الشركة المشغلة (رعاية)', total: 0, present: 0, absent: 0 },
            { category: 'الحراسات الأمنية', total: 0, present: 0, absent: 0 },
            { category: 'السائقين', total: 0, present: 0, absent: 0 },
            { category: 'موظفي المطبخ', total: 0, present: 0, absent: 0 },
        ],
        serviceStats: [
            { serviceName: 'العلاج الطبيعي', totalBeneficiaries: 0, attended: 0, absent: 0 },
            { serviceName: 'العلاج الوظيفي', totalBeneficiaries: 0, attended: 0, absent: 0 },
            { serviceName: 'النطق والتخاطب', totalBeneficiaries: 0, attended: 0, absent: 0 },
            { serviceName: 'التعليم', totalBeneficiaries: 0, attended: 0, absent: 0 },
            { serviceName: 'التدريب', totalBeneficiaries: 0, attended: 0, absent: 0 },
            { serviceName: 'الأنشطة الاجتماعية', totalBeneficiaries: 0, attended: 0, absent: 0 },
        ],
        meals: [],
        cleaningMaintenance: [
            { area: 'rooms', status: 'clean', maintenanceRequests: 0, actionTaken: '' },
            { area: 'bathrooms', status: 'clean', maintenanceRequests: 0, actionTaken: '' },
            { area: 'corridors', status: 'clean', maintenanceRequests: 0, actionTaken: '' },
            { area: 'entrances', status: 'clean', maintenanceRequests: 0, actionTaken: '' },
        ],
        psychologicalStatus: '',
        socialStatus: '',
        healthStatus: '',
        nursingCare: '',
        handoverTime: '',
        receivingSupervisor: '',
        handingOverSupervisor: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as DailyShiftRecord
        });
    };

    const updateStaffStats = (index: number, field: string, value: any) => {
        const newStats = [...(formData.staffAttendance || [])];
        newStats[index] = { ...newStats[index], [field]: value };
        setFormData({ ...formData, staffAttendance: newStats });
    };

    const updateServiceStats = (index: number, field: string, value: any) => {
        const newStats = [...(formData.serviceStats || [])];
        newStats[index] = { ...newStats[index], [field]: value };
        setFormData({ ...formData, serviceStats: newStats });
    };

    const updateCleaningStats = (index: number, field: string, value: any) => {
        const newStats = [...(formData.cleaningMaintenance || [])];
        newStats[index] = { ...newStats[index], [field]: value };
        setFormData({ ...formData, cleaningMaintenance: newStats });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large" style={{ maxWidth: '1200px' }}>
                <div className="modal-header">
                    <h2>سجل المتابعة اليومية للفترات</h2>
                    <div className="tabs">
                        <button type="button" className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>معلومات الفترة</button>
                        <button type="button" className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>الخدمات والأنشطة</button>
                        <button type="button" className={activeTab === 'meals' ? 'active' : ''} onClick={() => setActiveTab('meals')}>الوجبات</button>
                        <button type="button" className={activeTab === 'status' ? 'active' : ''} onClick={() => setActiveTab('status')}>أوضاع المستفيدين</button>
                        <button type="button" className={activeTab === 'hygiene' ? 'active' : ''} onClick={() => setActiveTab('hygiene')}>النظافة والصيانة</button>
                        <button type="button" className={activeTab === 'handover' ? 'active' : ''} onClick={() => setActiveTab('handover')}>التسليم والاستلام</button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="daily-shift-form">
                    {activeTab === 'info' && (
                        <div className="form-section">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>التاريخ</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>اليوم</label>
                                    <input type="text" value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })} placeholder="مثال: الأحد" />
                                </div>
                                <div className="form-group">
                                    <label>الفترة</label>
                                    <select value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value as ShiftPeriod })}>
                                        <option value="first">الأولى (6ص - 12:30م)</option>
                                        <option value="second">الثانية (12:30م - 7:30م)</option>
                                        <option value="third">الثالثة (7م - 1ص)</option>
                                        <option value="fourth">الرابعة (12:30ص - 6:30ص)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>القسم</label>
                                    <select value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value as GenderSection })}>
                                        <option value="male">ذكور</option>
                                        <option value="female">إناث</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>مشرف الفترة</label>
                                    <input type="text" value={formData.supervisorName} onChange={e => setFormData({ ...formData, supervisorName: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>وقت البداية</label>
                                    <input type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>وقت النهاية</label>
                                    <input type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                                </div>
                            </div>

                            <h3>إحصائيات المستفيدين</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <label>العدد الكلي</label>
                                    <input type="number" value={formData.beneficiaryStats?.total} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, total: Number(e.target.value) } })} />
                                </div>
                                <div className="stat-item">
                                    <label>زيارات داخلية</label>
                                    <input type="number" value={formData.beneficiaryStats?.internalVisits} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, internalVisits: Number(e.target.value) } })} />
                                </div>
                                <div className="stat-item">
                                    <label>زيارات خارجية</label>
                                    <input type="number" value={formData.beneficiaryStats?.externalVisits} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, externalVisits: Number(e.target.value) } })} />
                                </div>
                                <div className="stat-item">
                                    <label>تنويم</label>
                                    <input type="number" value={formData.beneficiaryStats?.admissions} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, admissions: Number(e.target.value) } })} />
                                </div>
                                <div className="stat-item">
                                    <label>مواعيد</label>
                                    <input type="number" value={formData.beneficiaryStats?.appointments} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, appointments: Number(e.target.value) } })} />
                                </div>
                                <div className="stat-item">
                                    <label>طوارئ</label>
                                    <input type="number" value={formData.beneficiaryStats?.emergencies} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, emergencies: Number(e.target.value) } })} />
                                </div>
                                <div className="stat-item">
                                    <label>إصابات</label>
                                    <input type="number" value={formData.beneficiaryStats?.injuries} onChange={e => setFormData({ ...formData, beneficiaryStats: { ...formData.beneficiaryStats!, injuries: Number(e.target.value) } })} />
                                </div>
                            </div>

                            <h3>إحصائيات العاملين</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>الفئة</th>
                                        <th>العدد الكلي</th>
                                        <th>الحضور</th>
                                        <th>الغياب</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.staffAttendance?.map((staff, index) => (
                                        <tr key={index}>
                                            <td>{staff.category}</td>
                                            <td><input type="number" className="table-input" value={staff.total} onChange={e => updateStaffStats(index, 'total', Number(e.target.value))} /></td>
                                            <td><input type="number" className="table-input" value={staff.present} onChange={e => updateStaffStats(index, 'present', Number(e.target.value))} /></td>
                                            <td><input type="number" className="table-input" value={staff.absent} onChange={e => updateStaffStats(index, 'absent', Number(e.target.value))} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="form-section">
                            <h3>الخدمات الداخلية (للفترات الصباحية)</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>الخدمة</th>
                                        <th>عدد المستفيدين</th>
                                        <th>الحضور</th>
                                        <th>الغياب</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.serviceStats?.map((service, index) => (
                                        <tr key={index}>
                                            <td>{service.serviceName}</td>
                                            <td><input type="number" className="table-input" value={service.totalBeneficiaries} onChange={e => updateServiceStats(index, 'totalBeneficiaries', Number(e.target.value))} /></td>
                                            <td><input type="number" className="table-input" value={service.attended} onChange={e => updateServiceStats(index, 'attended', Number(e.target.value))} /></td>
                                            <td><input type="number" className="table-input" value={service.absent} onChange={e => updateServiceStats(index, 'absent', Number(e.target.value))} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'meals' && (
                        <div className="form-section">
                            <p className="hint">يرجى تسجيل تفاصيل الوجبات المقدمة خلال هذه الفترة.</p>
                            {/* Simplified Meal Input - In a real app, this would be dynamic based on shift */}
                            <div className="form-group">
                                <label>ملاحظات الوجبات</label>
                                <textarea
                                    className="large-textarea"
                                    placeholder="سجل هنا تفاصيل الوجبات، الأصناف، وأسماء المشرفين..."
                                    rows={6}
                                // In a real implementation, we would map this to the meals array structure
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <div className="form-section">
                            <div className="form-group">
                                <label>أوضاع المستفيدين السلوكية والنفسية</label>
                                <textarea
                                    className="large-textarea"
                                    value={formData.psychologicalStatus}
                                    onChange={e => setFormData({ ...formData, psychologicalStatus: e.target.value })}
                                    rows={5}
                                    placeholder="سجل الملاحظات السلوكية والنفسية..."
                                />
                            </div>
                            <div className="form-group">
                                <label>أوضاع المستفيدين الاجتماعية (فترات الراحة/النوم)</label>
                                <textarea
                                    className="large-textarea"
                                    value={formData.socialStatus}
                                    onChange={e => setFormData({ ...formData, socialStatus: e.target.value })}
                                    rows={5}
                                    placeholder="سجل الملاحظات الاجتماعية، انتظام النوم، الزيارات..."
                                />
                            </div>
                            <div className="form-group">
                                <label>أوضاع المستفيدين الصحية والتمريضية</label>
                                <textarea
                                    className="large-textarea"
                                    value={formData.healthStatus}
                                    onChange={e => setFormData({ ...formData, healthStatus: e.target.value })}
                                    rows={5}
                                    placeholder="سجل الملاحظات الصحية، الرعاية التمريضية، العزل..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'hygiene' && (
                        <div className="form-section">
                            <h3>أعمال النظافة والصيانة</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>المكان</th>
                                        <th>الحالة</th>
                                        <th>طلبات الصيانة</th>
                                        <th>الإجراء المتخذ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.cleaningMaintenance?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item.area === 'rooms' ? 'الغرف' :
                                                    item.area === 'bathrooms' ? 'دورات المياه' :
                                                        item.area === 'corridors' ? 'الممرات' : 'المداخل'}
                                            </td>
                                            <td>
                                                <select
                                                    className="table-input"
                                                    value={item.status}
                                                    onChange={e => updateCleaningStats(index, 'status', e.target.value)}
                                                >
                                                    <option value="clean">نظيف</option>
                                                    <option value="needs_attention">يحتاج تنظيف</option>
                                                </select>
                                            </td>
                                            <td><input type="number" className="table-input" value={item.maintenanceRequests} onChange={e => updateCleaningStats(index, 'maintenanceRequests', Number(e.target.value))} /></td>
                                            <td><input type="text" className="table-input" value={item.actionTaken} onChange={e => updateCleaningStats(index, 'actionTaken', e.target.value)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'handover' && (
                        <div className="form-section">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>وقت التسليم</label>
                                    <input type="time" value={formData.handoverTime} onChange={e => setFormData({ ...formData, handoverTime: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>المشرف المسلم (الحالي)</label>
                                    <input type="text" value={formData.handingOverSupervisor} onChange={e => setFormData({ ...formData, handingOverSupervisor: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>المشرف المستلم (القادم)</label>
                                    <input type="text" value={formData.receivingSupervisor} onChange={e => setFormData({ ...formData, receivingSupervisor: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ السجل</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
