import React, { useState, useEffect, useMemo } from 'react';
import { useUser, UserRole } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { useUnifiedData } from '../../context/UnifiedDataContext';
import { RehabPlan, SmartGoal, GoalType } from '../../types/rehab';
import { Beneficiary } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ICFGoalSelector, type SelectedICFGoal } from './ICFGoalSelector';
import {
    Brain,
    Target,
    CheckCircle,
    Plus,
    Activity,
    Save,
    FileText,
    ShieldAlert,
    Crosshair
} from 'lucide-react';

// --- Hook: useSmartSuggestions ---
const useSmartSuggestions = (beneficiary: Beneficiary | null) => {
    return useMemo(() => {
        const suggestions: { type: GoalType; title: string; reason: string }[] = [];

        if (!beneficiary) return suggestions;

        // Rule A: Medical -> Rehab
        if (beneficiary.medicalDiagnosis?.includes('Cerebral Palsy') || beneficiary.medicalDiagnosis?.includes('شلل')) {
            suggestions.push({
                type: 'physiotherapy',
                title: 'تحسين المدى الحركي (ROM)',
                reason: 'بناءً على التشخيص الطبي: شلل/إعاقة حركية'
            });
        }

        if (beneficiary.medicalDiagnosis?.includes('Speech') || beneficiary.medicalDiagnosis?.includes('نطق')) {
            suggestions.push({
                type: 'medical', // Or speech therapy if type exists
                title: 'جلسات تخاطب مكثفة',
                reason: 'بناءً على التشخيص الطبي: صعوبات نطق'
            });
        }

        // Rule B: Social -> Support
        if (beneficiary.socialStatus === 'Low Income' || beneficiary.notes?.includes('دخل محدود')) {
            suggestions.push({
                type: 'social',
                title: 'دراسة طلب أجهزة تعويضية',
                reason: 'دمج البيانات: دخل محدود + احتياج محتمل'
            });
        }

        // Rule C: Age based
        if (beneficiary.age < 18) {
            suggestions.push({
                type: 'social',
                title: 'دمج في برامج التعليم الخاص',
                reason: 'السن يسمح بالدمج التعليمي'
            });
        }

        return suggestions;
    }, [beneficiary]);
};

export const RehabPlanBuilder: React.FC = () => {
    const { currentUser, hasPermission } = useUser();
    const { showToast } = useToast();
    const { beneficiaries } = useUnifiedData();

    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
    const selectedBeneficiary = useMemo(() => beneficiaries.find(b => b.id === selectedBeneficiaryId) || null, [beneficiaries, selectedBeneficiaryId]);

    // Plan State
    const [plan, setPlan] = useState<Partial<RehabPlan>>({
        status: 'draft',
        goals: [],
        approvals: [
            { role: 'doctor', status: 'pending' },
            { role: 'social_worker', status: 'pending' },
            { role: 'director', status: 'pending' },
        ]
    });

    // ICF Goals State
    const [icfGoals, setIcfGoals] = useState<SelectedICFGoal[]>([]);

    const suggestions = useSmartSuggestions(selectedBeneficiary);

    // Load Context on Selection
    useEffect(() => {
        if (selectedBeneficiary) {
            setPlan(prev => ({
                ...prev,
                beneficiaryId: selectedBeneficiary.id,
                beneficiaryName: selectedBeneficiary.fullName,
                medicalContext: { diagnosis: selectedBeneficiary.medicalDiagnosis, needs: [] }, // Simplified for now
                socialContext: { economicStatus: selectedBeneficiary.socialStatus, riskLevel: 'medium' }, // Defaulting risk
                goals: [] // Reset goals on new selection
            }));
        }
    }, [selectedBeneficiary]);

    const addGoal = (suggestion?: { type: GoalType; title: string }) => {
        if (!selectedBeneficiaryId) {
            showToast('يرجى اختيار مستفيد أولاً', 'error');
            return;
        }

        const newGoal: SmartGoal = {
            id: `goal-${Date.now()}`,
            type: suggestion?.type || 'medical',
            title: suggestion?.title || '',
            measureOfSuccess: '',
            targetDate: '',
            progress: 0,
            status: 'pending',
            assignedTo: currentUser?.name || 'Unassigned'
        };

        setPlan(prev => ({
            ...prev,
            goals: [...(prev.goals || []), newGoal]
        }));

        if (suggestion) {
            showToast('تم إضافة المقترح بنجاح', 'success');
        }
    };

    const updateGoal = (id: string, updates: Partial<SmartGoal>) => {
        setPlan(prev => ({
            ...prev,
            goals: prev.goals?.map(g => g.id === id ? { ...g, ...updates } : g)
        }));
    };

    const removeGoal = (id: string) => {
        setPlan(prev => ({
            ...prev,
            goals: prev.goals?.filter(g => g.id !== id)
        }));
        showToast('تم حذف الهدف', 'info');
    };

    const handleApprove = (role: string) => {
        // RBAC Check
        const requiredRole = role as UserRole;
        if (!hasPermission(requiredRole) && currentUser.role !== 'admin') {
            showToast(`عذراً، فقط ${role} يمكنه اعتماد هذه الخطوة`, 'error');
            return;
        }

        setPlan(prev => ({
            ...prev,
            approvals: prev.approvals?.map(a =>
                a.role === role
                    ? { ...a, status: 'approved', approvedBy: currentUser?.name, approvedAt: new Date().toISOString() }
                    : a
            )
        }));
        showToast('تم الاعتماد بنجاح', 'success');
    };

    const handleSave = () => {
        if (!plan.beneficiaryId) {
            showToast('لا يمكن حفظ خطة فارغة', 'error');
            return;
        }
        // In a real app, this would call an API
        showToast('تم حفظ مسودة الخطة بنجاح', 'success');
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in">
            {/* Top Bar */}
            <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                        الخطة التأهيلية الذكية (Smart IRP)
                    </h1>
                    <p className="text-xs text-gray-500">نظام دعم القرار القائم على دمج البيانات</p>
                </div>
                <div className="w-72">
                    <select
                        className="w-full border rounded-md p-2 bg-gray-50 text-sm"
                        value={selectedBeneficiaryId}
                        onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                        title="اختر مستفيد"
                        aria-label="اختر مستفيد لبدء الخطة التأهيلية"
                    >
                        <option value="">اختر مستفيد لبدء الخطة...</option>
                        {beneficiaries.map(b => (
                            <option key={b.id} value={b.id}>{b.fullName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="flex-1 grid grid-cols-12 gap-0 bg-gray-50 overflow-hidden">

                {/* LEFT PANEL: Context & Suggestions (3 cols) */}
                <div className="col-span-3 border-l bg-white p-4 overflow-y-auto">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        السياق والمقترحات
                    </h3>

                    {selectedBeneficiary ? (
                        <div className="space-y-6">
                            {/* Context Summary */}
                            <div className="space-y-3 text-sm">
                                <div className="bg-primary-50 p-3 rounded-lg border border-primary-100">
                                    <span className="text-primary-500 block text-xs mb-1">التشخيص الطبي</span>
                                    <span className="font-medium text-gray-900">{selectedBeneficiary.medicalDiagnosis}</span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                    <span className="text-green-600 block text-xs mb-1">الوضع الاجتماعي</span>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-900">{selectedBeneficiary.socialStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Smart Suggestions */}
                            <div>
                                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">مقترحات الذكاء الاصطناعي</h4>
                                <div className="space-y-2">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="group relative bg-purple-50 hover:bg-purple-100 border border-purple-200 p-3 rounded-lg transition-all cursor-pointer" onClick={() => addGoal(s)}>
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium text-purple-900 text-sm">{s.title}</span>
                                                <Plus className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="mt-1 text-xs text-purple-600 flex items-center gap-1">
                                                <Brain className="w-3 h-3" />
                                                {s.reason}
                                            </div>
                                        </div>
                                    ))}
                                    {suggestions.length === 0 && <p className="text-sm text-gray-400 italic">لا توجد مقترحات لهذا الملف.</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 mt-10">اختر مستفيداً لعرض التحليل</div>
                    )}
                </div>

                {/* MIDDLE PANEL: The Plan Builder (6 cols) */}
                <div className="col-span-6 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            أهداف الخطة (SMART Goals)
                        </h2>
                        <Button onClick={() => addGoal()} size="sm" variant="outline">
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة هدف يدوي
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {plan.goals?.map((goal, idx) => (
                            <Card key={goal.id} className="p-4 border-r-4 border-r-primary-500 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <Input
                                            className="font-bold text-gray-900 mb-2"
                                            value={goal.title}
                                            onChange={e => updateGoal(goal.id, { title: e.target.value })}
                                            placeholder="عنوان الهدف..."
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                className="text-xs border rounded p-1 bg-gray-50"
                                                value={goal.type}
                                                onChange={e => updateGoal(goal.id, { type: e.target.value as any })}
                                                title="نوع الهدف"
                                                aria-label="اختر نوع الهدف التأهيلي"
                                            >
                                                <option value="medical">طبي</option>
                                                <option value="physiotherapy">علاج طبيعي</option>
                                                <option value="social">اجتماعي</option>
                                                <option value="psychological">نفسي</option>
                                            </select>
                                            <Input
                                                className="text-xs flex-1"
                                                value={goal.measureOfSuccess}
                                                onChange={e => updateGoal(goal.id, { measureOfSuccess: e.target.value })}
                                                placeholder="معيار النجاح (Measurable)..."
                                            />
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => removeGoal(goal.id)}>حذف</Button>
                                </div>

                                {/* ISO 9001 Progress Slider */}
                                <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="font-semibold text-gray-600">مؤشر التقدم (KPI Tracker)</span>
                                        <span className={`font-bold ${goal.progress === 100 ? 'text-green-600' : 'text-primary-600'}`}>{goal.progress}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={goal.progress}
                                        onChange={e => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        title={`نسبة التقدم: ${goal.progress}%`}
                                        aria-label="مؤشر التقدم"
                                    />
                                </div>
                            </Card>
                        ))}
                        {plan.goals?.length === 0 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
                                <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">الخطة فارغة</p>
                                <p className="text-sm text-gray-400 mt-1">اسحب المقترحات من اليمين أو أضف هدفاً يدوياً</p>
                            </div>
                        )}
                    </div>

                    {/* ICF Goals Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Crosshair className="w-5 h-5 text-purple-600" />
                                أهداف ICF (التصنيف الدولي للأداء)
                            </h2>
                        </div>
                        <ICFGoalSelector
                            selectedGoals={icfGoals}
                            onChange={setIcfGoals}
                            maxGoals={8}
                        />
                    </div>
                </div>

                {/* RIGHT PANEL: Actions & Governance (3 cols) */}
                <div className="col-span-3 border-r bg-white p-4 overflow-y-auto">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        الاعتماد والحوكمة
                    </h3>

                    <div className="space-y-4">
                        {plan.approvals?.map(approval => (
                            <div key={approval.role} className={`p-4 rounded-lg border transition-colors ${approval.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-sm text-gray-700 capitalize">{approval.role.replace('_', ' ')}</span>
                                    {approval.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                </div>

                                {approval.status === 'approved' ? (
                                    <div className="text-xs text-green-700">
                                        <div>Approved by: {approval.approvedBy}</div>
                                        <div className="text-green-600 opacity-75">{new Date(approval.approvedAt!).toLocaleDateString()}</div>
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full text-xs"
                                        size="sm"
                                        variant={approval.role === 'director' ? 'primary' : 'outline'}
                                        onClick={() => handleApprove(approval.role)}
                                        disabled={approval.role === 'director' && plan.approvals?.some(a => a.role !== 'director' && a.status !== 'approved')}
                                    >
                                        {approval.role === 'director' ? 'الاعتماد النهائي' : 'موافقة'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t">
                        <Button className="w-full bg-primary hover:bg-primary-600 text-white mb-3" onClick={handleSave}>
                            <Save className="w-4 h-4 ml-2" />
                            حفظ المسودة
                        </Button>
                        <p className="text-xs text-center text-gray-400">
                            لا يمكن الاعتماد النهائي إلا بعد اكتمال موافقات الفريق الطبي والاجتماعي.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
