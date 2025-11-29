import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest, LeaveRequestStatus, LeaveRequestAction } from '../../types/social';
import { Beneficiary } from '../../types';
import { beneficiaries as initialBeneficiaries } from '../../data/beneficiaries';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Check, X, AlertTriangle, Clock, FileText, Activity, Plus } from 'lucide-react';
import { cn } from '../ui/Button';

// Mock Medical Data for "Smart Integration"
const mockMedicalStatus: Record<string, { infection: boolean; unstableVitals: boolean; notes: string }> = {
    '1': { infection: false, unstableVitals: false, notes: 'Stable' }, // Ahmed
    '2': { infection: true, unstableVitals: true, notes: 'Suspected Influenza, High Fever' }, // Khalid (Risk!)
};

export const LeaveRequestFlow: React.FC = () => {
    const { currentUser } = useApp();
    const [requests, setRequests] = useState<LeaveRequest[]>([
        {
            id: 'LR-001',
            beneficiaryId: '1',
            beneficiaryName: 'أحمد محمد',
            requestDate: '2023-11-28',
            type: 'home_visit',
            startDate: '2023-12-01',
            endDate: '2023-12-03',
            durationDays: 2,
            guardianName: 'محمد أحمد',
            guardianPhone: '0500000000',
            reason: 'زيارة عائلية نهاية الأسبوع',
            status: 'PENDING_MEDICAL',
            history: [
                {
                    actionBy: 'sw-1',
                    actionByName: 'سارة الأحمد (أخصائية)',
                    role: 'social_worker',
                    actionDate: '2023-11-28T10:00:00Z',
                    action: 'request',
                    notes: 'تم التواصل مع الولي وتأكيد الموعد'
                }
            ]
        }
    ]);

    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const [actionNote, setActionNote] = useState('');

    // Form State
    const [newRequestData, setNewRequestData] = useState<Partial<LeaveRequest>>({
        type: 'home_visit',
        startDate: '',
        endDate: '',
        reason: '',
        guardianName: '',
        guardianPhone: ''
    });
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');

    const handleCreateRequest = () => {
        if (!selectedBeneficiaryId || !currentUser) return;
        const beneficiary = initialBeneficiaries.find(b => b.id === selectedBeneficiaryId);
        if (!beneficiary) return;

        // --- PROTECTION SHIELD: Scenario A ---
        if (beneficiary.guardianRelation === 'State Ward' || beneficiary.socialStatus.includes('يتيم')) {
            alert("⚠️ تنبيه أمني عالي الخطورة: هذا المستفيد (يتيم/تحت رعاية الدولة). لا يمكن إنشاء طلب خروج أو زيارة إلا بموجب أمر قضائي أو موافقة المدير العام المباشرة.\n\nتم إيقاف العملية لحماية المستفيد.");
            return;
        }
        // -------------------------------------

        const newRequest: LeaveRequest = {
            id: `LR-${Date.now()}`,
            beneficiaryId: beneficiary.id,
            beneficiaryName: beneficiary.fullName,
            requestDate: new Date().toISOString().split('T')[0],
            type: newRequestData.type as any,
            startDate: newRequestData.startDate!,
            endDate: newRequestData.endDate!,
            durationDays: 2, // Calculate diff
            guardianName: newRequestData.guardianName!,
            guardianPhone: newRequestData.guardianPhone!,
            reason: newRequestData.reason!,
            status: 'PENDING_MEDICAL', // Social worker creates it, goes to Medical
            history: [
                {
                    actionBy: currentUser.id,
                    actionByName: currentUser.name,
                    role: currentUser.role as any,
                    actionDate: new Date().toISOString(),
                    action: 'request',
                    notes: 'تم إنشاء الطلب'
                }
            ]
        };

        setRequests([newRequest, ...requests]);
        setIsNewRequestOpen(false);
        setNewRequestData({});
        setSelectedBeneficiaryId('');
    };

    const handleApprove = (request: LeaveRequest) => {
        if (!currentUser) return;

        let nextStatus: LeaveRequestStatus = request.status;
        let medicalClearance = request.medicalClearance;

        if (currentUser.role === 'doctor' && request.status === 'PENDING_MEDICAL') {
            nextStatus = 'PENDING_DIRECTOR';
            medicalClearance = {
                clearedBy: currentUser.id,
                clearedAt: new Date().toISOString(),
                isFit: true,
                precautions: actionNote
            };
        } else if (currentUser.role === 'admin' && request.status === 'PENDING_DIRECTOR') { // Admin acts as Director for demo
            nextStatus = 'APPROVED';
        }

        const updatedRequest: LeaveRequest = {
            ...request,
            status: nextStatus,
            medicalClearance,
            history: [
                ...request.history,
                {
                    actionBy: currentUser.id,
                    actionByName: currentUser.name,
                    role: currentUser.role as any,
                    actionDate: new Date().toISOString(),
                    action: 'approve',
                    notes: actionNote
                }
            ]
        };

        setRequests(requests.map(r => r.id === request.id ? updatedRequest : r));
        setSelectedRequest(null);
        setActionNote('');
    };

    const handleReject = (request: LeaveRequest) => {
        if (!currentUser) return;
        const updatedRequest: LeaveRequest = {
            ...request,
            status: 'REJECTED',
            history: [
                ...request.history,
                {
                    actionBy: currentUser.id,
                    actionByName: currentUser.name,
                    role: currentUser.role as any,
                    actionDate: new Date().toISOString(),
                    action: 'reject',
                    notes: actionNote
                }
            ]
        };
        setRequests(requests.map(r => r.id === request.id ? updatedRequest : r));
        setSelectedRequest(null);
        setActionNote('');
    };

    const getStatusBadge = (status: LeaveRequestStatus) => {
        const styles = {
            PENDING_SOCIAL: 'bg-gray-100 text-gray-800',
            PENDING_MEDICAL: 'bg-blue-100 text-blue-800',
            PENDING_DIRECTOR: 'bg-purple-100 text-purple-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            ACTIVE: 'bg-green-500 text-white',
            COMPLETED: 'bg-gray-500 text-white',
            OVERDUE: 'bg-red-500 text-white',
        };
        const labels = {
            PENDING_SOCIAL: 'بانتظار الاجتماعي',
            PENDING_MEDICAL: 'بانتظار الطبي',
            PENDING_DIRECTOR: 'بانتظار المدير',
            APPROVED: 'معتمد',
            REJECTED: 'مرفوض',
            ACTIVE: 'نشط (خارج المركز)',
            COMPLETED: 'مكتمل',
            OVERDUE: 'متأخر',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
    };

    // Filter requests based on role
    const visibleRequests = requests.filter(r => {
        if (currentUser?.role === 'social_worker') return true; // See all
        if (currentUser?.role === 'doctor') return r.status === 'PENDING_MEDICAL' || r.status === 'APPROVED';
        if (currentUser?.role === 'admin') return true; // Director sees all
        return false;
    });

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">إدارة طلبات الإجازات</h2>
                {currentUser?.role === 'social_worker' && (
                    <Button onClick={() => setIsNewRequestOpen(true)}>
                        <Plus className="w-4 h-4 ml-2" />
                        طلب جديد
                    </Button>
                )}
            </div>

            <div className="grid gap-4">
                {visibleRequests.map(request => (
                    <Card key={request.id} className="p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{request.beneficiaryName}</h3>
                                <div className="text-sm text-gray-500 flex gap-2">
                                    <span>{request.type === 'home_visit' ? 'زيارة منزلية' : request.type}</span>
                                    <span>•</span>
                                    <span>{request.durationDays} أيام</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {getStatusBadge(request.status)}
                            <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                التفاصيل / إجراء
                            </Button>
                        </div>
                    </Card>
                ))}
                {visibleRequests.length === 0 && (
                    <div className="text-center py-10 text-gray-500">لا توجد طلبات حالياً</div>
                )}
            </div>

            {/* New Request Modal */}
            <Modal isOpen={isNewRequestOpen} onClose={() => setIsNewRequestOpen(false)} title="طلب إجازة جديد">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">المستفيد</label>
                        <select
                            className="w-full border rounded-md p-2"
                            value={selectedBeneficiaryId}
                            onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                        >
                            <option value="">اختر مستفيد...</option>
                            {initialBeneficiaries.map(b => (
                                <option key={b.id} value={b.id}>{b.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="تاريخ الخروج" value={newRequestData.startDate} onChange={e => setNewRequestData({ ...newRequestData, startDate: e.target.value })} />
                        <Input type="date" label="تاريخ العودة" value={newRequestData.endDate} onChange={e => setNewRequestData({ ...newRequestData, endDate: e.target.value })} />
                    </div>
                    <Input label="اسم الولي/المرافق" value={newRequestData.guardianName} onChange={e => setNewRequestData({ ...newRequestData, guardianName: e.target.value })} />
                    <Input label="رقم التواصل" value={newRequestData.guardianPhone} onChange={e => setNewRequestData({ ...newRequestData, guardianPhone: e.target.value })} />
                    <Input label="سبب الزيارة" value={newRequestData.reason} onChange={e => setNewRequestData({ ...newRequestData, reason: e.target.value })} />

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsNewRequestOpen(false)}>إلغاء</Button>
                        <Button onClick={handleCreateRequest} disabled={!selectedBeneficiaryId}>إنشاء الطلب</Button>
                    </div>
                </div>
            </Modal>

            {/* Approval/Details Modal */}
            <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="تفاصيل الطلب واتخاذ القرار">
                {selectedRequest && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">المستفيد:</span> <span className="font-bold">{selectedRequest.beneficiaryName}</span></div>
                                <div><span className="text-gray-500">النوع:</span> {selectedRequest.type}</div>
                                <div><span className="text-gray-500">المدة:</span> {selectedRequest.startDate} إلى {selectedRequest.endDate}</div>
                                <div><span className="text-gray-500">الولي:</span> {selectedRequest.guardianName} ({selectedRequest.guardianPhone})</div>
                            </div>
                        </div>

                        {/* Medical Warning (Smart Integration) */}
                        {currentUser?.role === 'doctor' && selectedRequest.status === 'PENDING_MEDICAL' && (
                            <div className={`p-4 rounded-lg border ${mockMedicalStatus[selectedRequest.beneficiaryId]?.infection ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    <Activity className="w-5 h-5" />
                                    الحالة الطبية (تحقق تلقائي)
                                </h4>
                                {mockMedicalStatus[selectedRequest.beneficiaryId]?.infection ? (
                                    <div className="text-red-700">
                                        <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> <strong>تحذير:</strong> يوجد اشتباه عدوى أو حالة غير مستقرة.</div>
                                        <p className="mt-1 text-sm">{mockMedicalStatus[selectedRequest.beneficiaryId]?.notes}</p>
                                    </div>
                                ) : (
                                    <div className="text-green-700">
                                        <div className="flex items-center gap-2"><Check className="w-4 h-4" /> الحالة مستقرة. لا توجد موانع طبية ظاهرة.</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Audit Trail */}
                        <div>
                            <h4 className="font-bold text-sm text-gray-700 mb-2">سجل المتابعة (Audit Trail)</h4>
                            <div className="border-l-2 border-gray-200 pr-4 space-y-4">
                                {selectedRequest.history.map((action, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -right-[21px] top-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                                        <p className="text-sm font-semibold">{action.actionByName} <span className="text-xs font-normal text-gray-500">({action.role})</span></p>
                                        <p className="text-xs text-gray-400">{new Date(action.actionDate).toLocaleString('ar-SA')}</p>
                                        <p className="text-sm mt-1">{action.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Area */}
                        {((currentUser?.role === 'doctor' && selectedRequest.status === 'PENDING_MEDICAL') ||
                            (currentUser?.role === 'admin' && selectedRequest.status === 'PENDING_DIRECTOR')) && (
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium mb-2">ملاحظات القرار</label>
                                    <textarea
                                        className="w-full border rounded-md p-2 h-24 mb-4"
                                        placeholder="اكتب ملاحظاتك الطبية أو الإدارية هنا..."
                                        value={actionNote}
                                        onChange={(e) => setActionNote(e.target.value)}
                                    />
                                    <div className="flex gap-3">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedRequest)}>
                                            <Check className="w-4 h-4 ml-2" />
                                            موافقة واعتماد
                                        </Button>
                                        <Button className="flex-1" variant="danger" onClick={() => handleReject(selectedRequest)}>
                                            <X className="w-4 h-4 ml-2" />
                                            رفض الطلب
                                        </Button>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </Modal>
        </div>
    );
};
