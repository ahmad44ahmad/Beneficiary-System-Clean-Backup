import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { UserCheck, FileSignature, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface Signature {
    name: string;
    role_title: string;
    signed_at: string;
    user_id?: string;
}

interface DailyReport {
    id: string;
    report_date: string;
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
    signatures: Record<string, Signature>;
}

// Mock roles for testing the "Zero Paper" flow
const ROLES = [
    { id: 'nutritionist', title: 'أخصائي التغذية', label: 'Nutritionist' },
    { id: 'supervisor', title: 'مشرف الفترة', label: 'Shift Supervisor' },
    { id: 'director', title: 'مدير المركز', label: 'Center Director' }
];

export const ReceivingCommittee: React.FC<{ date: Date }> = ({ date }) => {
    const [report, setReport] = useState<DailyReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeRole, setActiveRole] = useState('nutritionist'); // For demo purposes
    const [isSigning, setIsSigning] = useState(false);

    const formattedDate = date.toISOString().split('T')[0];

    useEffect(() => {
        fetchReport();
    }, [formattedDate]);

    const fetchReport = async () => {
        setLoading(true);
        // Try to find the report for this day
        const { data, error } = await supabase
            .from('catering_daily_reports')
            .select('*')
            .eq('report_date', formattedDate)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching report:', error);
        }

        if (data) {
            setReport(data);
        } else {
            // No report exists? That's fine, we'll create one when they sign.
            setReport(null);
        }
        setLoading(false);
    };

    const handleSign = async () => {
        setIsSigning(true);
        try {
            const currentSignature: Signature = {
                name: activeRole === 'nutritionist' ? 'د. أحمد (تشبيه)' : activeRole === 'supervisor' ? 'مشرف 1' : 'المدير العام',
                role_title: ROLES.find(r => r.id === activeRole)?.title || '',
                signed_at: new Date().toISOString(),
                user_id: 'demo-user-id'
            };

            let newSignatures = { ...report?.signatures };
            newSignatures[activeRole] = currentSignature;

            // Determine if fully signed
            const allSigned = ROLES.every(r => newSignatures[r.id]);
            const newStatus = allSigned ? 'approved' : 'pending_approval';

            if (report) {
                // Update
                const { error } = await supabase
                    .from('catering_daily_reports')
                    .update({
                        signatures: newSignatures,
                        status: newStatus
                    })
                    .eq('id', report.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('catering_daily_reports')
                    .insert({
                        report_date: formattedDate,
                        signatures: newSignatures,
                        status: newStatus
                    });
                if (error) throw error;
            }

            await fetchReport();

        } catch (err) {
            console.error('Failed to sign:', err);
            alert('حدث خطأ أثناء التوقيع');
        } finally {
            setIsSigning(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-700">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#14415A]">لجنة الاستلام الرقمية</h3>
                        <p className="text-gray-500 text-sm">التوقيع والمصادقة الإلكترونية على الاستلام</p>
                    </div>
                </div>

                {/* Role Switcher for Demo */}
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-500 px-2">تجربة بصمة:</span>
                    {ROLES.map(role => (
                        <button
                            key={role.id}
                            onClick={() => setActiveRole(role.id)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${activeRole === role.id
                                ? 'bg-white shadow-sm text-blue-700 font-bold border border-blue-100'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {role.title}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-8 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ROLES.map(role => {
                        const signature = report?.signatures?.[role.id];
                        const isMe = activeRole === role.id;

                        return (
                            <div
                                key={role.id}
                                className={`relative p-5 rounded-xl border-2 transition-all ${signature
                                    ? 'border-green-100 bg-green-50/50'
                                    : isMe
                                        ? 'border-blue-200 bg-blue-50/30 shadow-md ring-2 ring-blue-100/50'
                                        : 'border-dashed border-gray-200 bg-gray-50/50 opacity-70'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-sm font-bold ${signature ? 'text-green-700' : 'text-gray-600'}`}>
                                        {role.title}
                                    </span>
                                    {signature ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <UserCheck className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                {signature ? (
                                    <div className="text-sm">
                                        <p className="font-bold text-gray-900">{signature.name}</p>
                                        <p className="text-xs text-gray-500 mt-1" dir="ltr">
                                            {new Date(signature.signed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <div className="mt-3 flex items-center gap-1 text-[10px] text-green-700 font-medium bg-green-100 w-fit px-2 py-0.5 rounded-full">
                                            <FileSignature className="w-3 h-3" />
                                            تم التوقيع رقمياً
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        {isMe ? (
                                            <button
                                                onClick={handleSign}
                                                disabled={isSigning}
                                                className="w-full py-2 bg-[#14415A] text-white rounded-lg text-sm font-medium hover:bg-[#0f3246] transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                                            >
                                                {isSigning ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <FileSignature className="w-4 h-4" />
                                                        اعتماد (توقيع)
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">بانتظار التوقيع...</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Status Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">حالة التقرير اليومي:</span>
                    <span className={`px-2 py-1 rounded-md font-bold ${report?.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : report?.status === 'pending_approval'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {report?.status === 'approved' ? 'مكتمل ومعتمد' :
                            report?.status === 'pending_approval' ? 'بانتظار الاكتمال' : 'مسودة'}
                    </span>
                </div>
                {report?.status === 'approved' && (
                    <div className="text-xs text-gray-400">
                        الرقم المرجعي: {report.id.slice(0, 8)}
                    </div>
                )}
            </div>
        </div>
    );
};
