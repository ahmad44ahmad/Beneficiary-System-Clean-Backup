import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { DailyShiftRecord, IncidentReport, GenderSection } from '../../types';
import { beneficiaries } from '../../data/beneficiaries';
import { DailyShiftForm } from './DailyShiftForm';
import { IncidentReportForm } from '../medical/IncidentReportForm';
import { supabase } from '../../config/supabase';

// Demo data for when Supabase is unavailable (cast as any to avoid complex type requirements)
const demoShiftRecords: any[] = [
    { id: '1', date: new Date().toISOString().split('T')[0], day: 'الأحد', shift: 'first', section: 'male', supervisorName: 'أحمد محمد', beneficiaryStats: { total: 15, present: 14, absent: 1, leave: 0, hospital: 0 }, centerDirectorApproval: true },
    { id: '2', date: new Date().toISOString().split('T')[0], day: 'الأحد', shift: 'second', section: 'male', supervisorName: 'خالد سعود', beneficiaryStats: { total: 15, present: 13, absent: 1, leave: 1, hospital: 0 }, centerDirectorApproval: false },
    { id: '3', date: new Date().toISOString().split('T')[0], day: 'الأحد', shift: 'first', section: 'female', supervisorName: 'نورة أحمد', beneficiaryStats: { total: 12, present: 12, absent: 0, leave: 0, hospital: 0 }, centerDirectorApproval: true },
];

const demoIncidentReports: any[] = [
    { id: '1', date: new Date().toISOString().split('T')[0], beneficiaryId: 'B001', type: 'injury', shift: 'first', description: 'إصابة طفيفة', actionTaken: 'تم معالجة الإصابة وإبلاغ الطبيب', witnesses: 'الممرض أحمد', supervisorName: 'خالد' },
    { id: '2', date: new Date().toISOString().split('T')[0], beneficiaryId: 'B002', type: 'assault', shift: 'second', description: 'مشادة كلامية', actionTaken: 'تم فصل الطرفين وإبلاغ الإدارة', witnesses: 'العامل محمد', supervisorName: 'سعود' },
];

export const DailyFollowUpPanel: React.FC = () => {
    const location = useLocation();
    const { showToast } = useToast();
    const [activeSection, setActiveSection] = useState<GenderSection>('male');
    const [activeTab, setActiveTab] = useState<'shifts' | 'incidents'>('shifts');

    // Data State - Initialize with demo data
    const [shiftRecords, setShiftRecords] = useState<DailyShiftRecord[]>(demoShiftRecords);
    const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(demoIncidentReports);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isCreatingShift, setIsCreatingShift] = useState(false);
    const [isCreatingIncident, setIsCreatingIncident] = useState(false);

    // Fetch data from Supabase
    const fetchData = async () => {
        if (!supabase) {
            console.warn('Supabase not available, using demo data');
            setLoading(false);
            return;
        }

        try {
            // Fetch shift records
            const { data: shifts, error: shiftsError } = await supabase
                .from('daily_care_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (shifts && shifts.length > 0) {
                const transformedShifts: DailyShiftRecord[] = shifts.map((s: any) => ({
                    id: s.id,
                    date: s.log_date,
                    day: new Date(s.log_date).toLocaleDateString('ar-SA', { weekday: 'long' }),
                    shift: s.shift || 'first',
                    section: s.section || 'male',
                    supervisorName: s.staff_name || 'غير محدد',
                    startTime: '08:00', // Default
                    endTime: '16:00', // Default
                    beneficiaryStats: { total: 15, internalVisits: 0, externalVisits: 0, admissions: 0, appointments: 0, emergencies: 0, deaths: 0, injuries: 0, others: '', present: 14, absent: 1, leave: 0, hospital: 0 },
                    staffAttendance: [],
                    serviceStats: [],
                    meals: [],
                    cleaningMaintenance: [],
                    psychologicalStatus: 'stable',
                    socialStatus: 'stable',
                    healthStatus: 'stable',
                    nursingCare: 'routine',
                    handoverTime: '16:00',
                    receivingSupervisor: '',
                    handingOverSupervisor: '',
                    centerDirectorApproval: true
                }));
                setShiftRecords(transformedShifts);
            }

            // Fetch incident reports
            const { data: incidents, error: incidentsError } = await supabase
                .from('incident_reports')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (incidents && incidents.length > 0) {
                const transformedIncidents: IncidentReport[] = incidents.map((i: any) => ({
                    id: i.id,
                    date: i.date,
                    time: '12:00', // Default
                    beneficiaryId: i.beneficiary_id,
                    location: 'غير محدد', // Default
                    type: i.type,
                    shift: i.shift,
                    description: i.description,
                    actionTaken: i.action_taken,
                    witnesses: i.witnesses,
                    staffWitnesses: [], // Default
                    cameraRecordingKept: false, // Default
                    supervisorName: 'المشرف المناوب'
                }));
                setIncidentReports(transformedIncidents);
            } else if (incidentsError) {
                // If table doesn't exist or other error, fallback to demo but log warning
                console.warn('Could not fetch incidents, defaulting to demo data:', incidentsError.message);
                showToast('تعذر تحميل الحوادث من قاعدة البيانات', 'info');
            }

        } catch (err) {
            console.warn('Error fetching data:', err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [location.key]);

    const handleSaveShift = async (data: any) => {
        try {
            if (supabase) {
                const { error } = await supabase.from('daily_care_logs').insert([{
                    log_date: data.date,
                    shift: data.shift,
                    section: data.section,
                    staff_name: data.supervisorName,
                    notes: JSON.stringify(data.beneficiaryStats) // storing stats in notes for now
                }]);

                if (error) throw error;
                fetchData(); // Refresh data
            } else {
                setShiftRecords([data, ...shiftRecords]);
            }
            setIsCreatingShift(false);
        } catch (error) {
            console.error('Error saving shift:', error);
            alert('حدث خطأ أثناء حفظ السجل');
        }
    };

    const handleSaveIncident = async (data: any) => {
        try {
            if (supabase) {
                const { error } = await supabase.from('incident_reports').insert([{
                    date: data.date,
                    beneficiary_id: data.beneficiaryId,
                    type: data.type,
                    shift: data.shift,
                    description: data.description,
                    action_taken: data.actionTaken,
                    witnesses: data.witnesses
                }]);

                if (error) throw error;
                fetchData(); // Refresh data
            } else {
                setIncidentReports([data, ...incidentReports]);
            }
            setIsCreatingIncident(false);
        } catch (error) {
            console.error('Error saving incident:', error);
            // Fallback for demo/development if table missing
            setIncidentReports([data, ...incidentReports]);
            setIsCreatingIncident(false);
            alert('تم الحفظ محلياً (تعذر الحفظ في قاعدة البيانات)');
        }
    };

    const filteredShifts = shiftRecords.filter(r => r.section === activeSection);
    const filteredIncidents = incidentReports;

    const handleExport = (data: any[], filename: string) => {
        if (!data.length) {
            showToast('لا توجد بيانات للتصدير', 'info');
            return;
        }
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                const val = (row as any)[header];
                if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
                return `"${val}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="clothing-panel"> {/* Reusing the panel style for consistency */}
            <div className="panel-header">
                <h2>سجل المتابعة اليومية للخدمات</h2>

                <div className="form-row flex justify-center mb-4">
                    <div className="tabs">
                        <button
                            className={activeSection === 'male' ? 'active' : ''}
                            onClick={() => setActiveSection('male')}
                        >
                            قسم الذكور
                        </button>
                        <button
                            className={activeSection === 'female' ? 'active' : ''}
                            onClick={() => setActiveSection('female')}
                        >
                            قسم الإناث
                        </button>
                    </div>
                </div>

                <div className="tabs">
                    <button className={activeTab === 'shifts' ? 'active' : ''} onClick={() => setActiveTab('shifts')}>سجلات الفترات</button>
                    <button className={activeTab === 'incidents' ? 'active' : ''} onClick={() => setActiveTab('incidents')}>محاضر الوقائع</button>
                </div>
            </div>

            <div className="panel-content">
                {activeTab === 'shifts' && (
                    <div className="tab-section">
                        <div className="actions">
                            <button className="btn-primary" onClick={() => setIsCreatingShift(true)}>إضافة سجل فترة جديد</button>
                            <button className="btn-secondary" onClick={() => handleExport(filteredShifts, `daily_shifts_${activeSection}`)}>تصدير CSV</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>التاريخ</th>
                                    <th>اليوم</th>
                                    <th>الفترة</th>
                                    <th>المشرف</th>
                                    <th>عدد المستفيدين</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShifts.map(record => (
                                    <tr key={record.id}>
                                        <td>{record.date}</td>
                                        <td>{record.day}</td>
                                        <td>
                                            {record.shift === 'first' ? 'الأولى' :
                                                record.shift === 'second' ? 'الثانية' :
                                                    record.shift === 'third' ? 'الثالثة' : 'الرابعة'}
                                        </td>
                                        <td>{record.supervisorName}</td>
                                        <td>{record.beneficiaryStats.total}</td>
                                        <td>{record.centerDirectorApproval ? 'معتمد' : 'مسودة'}</td>
                                    </tr>
                                ))}
                                {filteredShifts.length === 0 && <tr><td colSpan={6}>لا توجد سجلات لهذا القسم</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'incidents' && (
                    <div className="tab-section">
                        <div className="actions">
                            <button className="btn-primary" onClick={() => setIsCreatingIncident(true)}>إضافة محضر واقعة</button>
                            <button className="btn-secondary" onClick={() => handleExport(filteredIncidents, 'incident_reports')}>تصدير CSV</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>التاريخ</th>
                                    <th>المستفيد</th>
                                    <th>نوع الواقعة</th>
                                    <th>الفترة</th>
                                    <th>الإجراء المتخذ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIncidents.map(report => {
                                    const beneficiary = beneficiaries.find(b => b.id === report.beneficiaryId);
                                    return (
                                        <tr key={report.id}>
                                            <td>{report.date}</td>
                                            <td>{beneficiary?.fullName || 'غير معروف'}</td>
                                            <td>
                                                {report.type === 'injury' ? 'إصابة' :
                                                    report.type === 'assault' ? 'اعتداء' :
                                                        report.type === 'escape' ? 'هروب' : report.type}
                                            </td>
                                            <td>{report.shift}</td>
                                            <td>{report.actionTaken.substring(0, 50)}...</td>
                                        </tr>
                                    );
                                })}
                                {filteredIncidents.length === 0 && <tr><td colSpan={5}>لا توجد محاضر وقائع</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreatingShift && (
                <DailyShiftForm
                    beneficiaries={beneficiaries}
                    initialData={{ section: activeSection }}
                    onSave={handleSaveShift}
                    onCancel={() => setIsCreatingShift(false)}
                />
            )}

            {isCreatingIncident && (
                <IncidentReportForm
                    beneficiaries={beneficiaries}
                    onSave={handleSaveIncident}
                    onCancel={() => setIsCreatingIncident(false)}
                />
            )}
        </div>
    );
};
