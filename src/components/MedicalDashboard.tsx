import React from 'react';
import { AlertTriangle, ShieldAlert, Activity, Syringe, BedDouble } from 'lucide-react';
import { VaccinationRecord, MedicalProfile } from '../types/medical';

interface MedicalDashboardProps {
    vaccinations: VaccinationRecord[];
    isolationStats: {
        totalBeds: number;
        occupiedBeds: number;
        patients: { name: string; reason: string }[];
    };
}

import { beneficiaries } from '../data/beneficiaries';

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ vaccinations, isolationStats }) => {
    const overdueVaccinations = vaccinations.filter(v => v.status === 'Overdue');

    // --- CONTINUITY TEST: Scenario B ---
    const elderlyPatients = beneficiaries.filter(b => b.age >= 60);
    const continuityAnalysis = elderlyPatients.map(p => {
        const isSevere = p.medicalDiagnosis.includes('Severe') || p.medicalDiagnosis.includes('شديد') || p.medicalDiagnosis.includes('Quadriplegia');
        return {
            ...p,
            recommendation: isSevere ? 'RETAIN' : 'TRANSFER',
            reason: isSevere
                ? 'Condition requires specialized medical care not available in Elderly Homes.'
                : 'Standard age progression to Elderly Care.'
        };
    });
    // -----------------------------------

    return (
        <div className="dashboard-panel fade-in">
            <div className="panel-header">
                <h2><Activity className="inline-icon" /> اللوحة الطبية والتمريض</h2>
            </div>

            <div className="dashboard-content-grid">
                {/* Continuity of Care Analysis (New Section) */}
                <div className="dashboard-section col-span-2 bg-blue-50 border border-blue-200">
                    <h3 className="text-blue-800 flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5" />
                        نظام استمرارية الرعاية (Continuity of Care AI)
                    </h3>
                    <div className="space-y-3">
                        {continuityAnalysis.length > 0 ? continuityAnalysis.map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-900">{p.fullName} (Age: {p.age})</h4>
                                    <p className="text-sm text-gray-600">{p.medicalDiagnosis}</p>
                                </div>
                                <div className={`text-left px-4 py-2 rounded-lg border-l-4 ${p.recommendation === 'RETAIN' ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                                    <div className={`font-bold ${p.recommendation === 'RETAIN' ? 'text-green-700' : 'text-yellow-700'}`}>
                                        RECOMMENDATION: {p.recommendation}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{p.reason}</div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic">No elderly patients found for analysis.</p>
                        )}
                    </div>
                </div>

                {/* High Priority Alerts - Vaccinations */}
                <div className="dashboard-section">
                    <h3 className="text-red-600 flex items-center gap-2">
                        <Syringe className="w-5 h-5" />
                        تنبيهات التطعيمات (عالية الأهمية)
                    </h3>
                    {overdueVaccinations.length > 0 ? (
                        <ul className="activity-list">
                            {overdueVaccinations.map(v => (
                                <li key={v.id} className="activity-item border-r-4 border-red-500 pr-3 bg-red-50">
                                    <div className="activity-details">
                                        <span className="font-bold text-red-700">تطعيم متأخر: {v.vaccineName}</span>
                                        <span className="text-sm">المستفيد ID: {v.beneficiaryId}</span>
                                        <span className="text-sm text-red-600">تاريخ الاستحقاق: {v.dueDate}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-green-600 bg-green-50 rounded-lg flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            جميع التطعيمات محدثة.
                        </div>
                    )}
                </div>

                {/* Isolation Ward Status */}
                <div className="dashboard-section">
                    <h3 className="text-orange-600 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        حالة قسم العزل
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="kpi-card bg-gray-50 p-4 rounded-lg text-center">
                            <span className="block text-gray-500 text-sm">السعة الكلية</span>
                            <span className="block text-2xl font-bold">{isolationStats.totalBeds}</span>
                            <BedDouble className="mx-auto mt-2 text-gray-400" />
                        </div>
                        <div className={`kpi-card p-4 rounded-lg text-center ${isolationStats.occupiedBeds > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50'}`}>
                            <span className="block text-gray-500 text-sm">الأسرّة المشغولة</span>
                            <span className={`block text-2xl font-bold ${isolationStats.occupiedBeds > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {isolationStats.occupiedBeds}
                            </span>
                            <Activity className={`mx-auto mt-2 ${isolationStats.occupiedBeds > 0 ? 'text-orange-400' : 'text-green-400'}`} />
                        </div>
                    </div>

                    {isolationStats.patients.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2 text-sm text-gray-700">المرضى المعزولين حالياً:</h4>
                            <ul className="space-y-2">
                                {isolationStats.patients.map((p, idx) => (
                                    <li key={idx} className="bg-white p-2 rounded border border-gray-200 text-sm flex justify-between">
                                        <span>{p.name}</span>
                                        <span className="text-red-500 font-medium">{p.reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
