// ═══════════════════════════════════════════════════════════════════════════
// SlackIntegrationTest - Admin panel for testing Slack incident alert
// integration. Shows webhook config status and sends test alerts.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import {
    Bell,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Send,
    Loader2,
    Shield,
    Wifi,
    WifiOff,
    Info,
} from 'lucide-react';
import { getSupabaseClient } from '../../hooks/queries';
import { useToastStore } from '../../stores/useToastStore';

// ── Types ────────────────────────────────────────────────────────────────────

interface TestResult {
    success: boolean;
    message: string;
    details?: string;
    timestamp: string;
}

type ConnectionStatus = 'unknown' | 'checking' | 'connected' | 'disconnected';

// ── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_INCIDENT = {
    id: 'test-' + Date.now().toString(36),
    date: new Date().toISOString().split('T')[0],
    beneficiary_id: '00000000-0000-0000-0000-000000000000',
    type: 'fall',
    shift: 'morning',
    severity: 'CRITICAL',
    location: 'الجناح ب - غرفة 204',
    description: 'هذا تنبيه تجريبي من لوحة اختبار تكامل Slack. لا يوجد حادث فعلي.',
    action_taken: 'اختبار - لا يتطلب اجراء',
    witnesses: 'فريق تقنية المعلومات (اختبار)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

// ── Component ────────────────────────────────────────────────────────────────

export const SlackIntegrationTest: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isSending, setIsSending] = useState(false);
    const showToast = useToastStore((s) => s.showToast);

    /**
     * Check if Supabase connection is available (prerequisite for Edge Function).
     */
    const checkConnection = useCallback(async () => {
        setConnectionStatus('checking');
        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                setConnectionStatus('disconnected');
                showToast('لا يوجد اتصال بـ Supabase', 'error');
                return;
            }

            // Simple connectivity check
            const { error } = await supabase.from('audit_logs').select('id', { count: 'exact', head: true });
            if (error) {
                setConnectionStatus('disconnected');
                showToast('فشل الاتصال بقاعدة البيانات', 'error');
                return;
            }

            setConnectionStatus('connected');
            showToast('الاتصال بـ Supabase نشط', 'success');
        } catch {
            setConnectionStatus('disconnected');
            showToast('خطا في فحص الاتصال', 'error');
        }
    }, [showToast]);

    /**
     * Invoke the slack-incident-alert Edge Function with sample data.
     */
    const sendTestAlert = useCallback(async () => {
        setIsSending(true);
        const timestamp = new Date().toLocaleString('ar-SA');

        try {
            const supabase = getSupabaseClient();
            if (!supabase) {
                const result: TestResult = {
                    success: false,
                    message: 'لا يوجد اتصال بـ Supabase. تاكد من اعداد متغيرات البيئة.',
                    timestamp,
                };
                setTestResults((prev) => [result, ...prev]);
                showToast('لا يوجد اتصال بـ Supabase', 'error');
                setIsSending(false);
                return;
            }

            const { data, error } = await supabase.functions.invoke('slack-incident-alert', {
                body: {
                    type: 'INSERT',
                    record: {
                        ...SAMPLE_INCIDENT,
                        id: 'test-' + Date.now().toString(36),
                        created_at: new Date().toISOString(),
                    },
                },
            });

            if (error) {
                const result: TestResult = {
                    success: false,
                    message: 'فشل ارسال التنبيه التجريبي',
                    details: error.message || String(error),
                    timestamp,
                };
                setTestResults((prev) => [result, ...prev]);
                showToast('فشل ارسال التنبيه', 'error');
            } else {
                const result: TestResult = {
                    success: true,
                    message: 'تم ارسال التنبيه التجريبي بنجاح',
                    details: data?.incident_id ? `معرف الحادث: ${data.incident_id}` : undefined,
                    timestamp,
                };
                setTestResults((prev) => [result, ...prev]);
                showToast('تم ارسال التنبيه بنجاح', 'success');
            }
        } catch (err) {
            const result: TestResult = {
                success: false,
                message: 'خطا غير متوقع اثناء ارسال التنبيه',
                details: err instanceof Error ? err.message : String(err),
                timestamp,
            };
            setTestResults((prev) => [result, ...prev]);
            showToast('خطا غير متوقع', 'error');
        } finally {
            setIsSending(false);
        }
    }, [showToast]);

    // Connection status badge
    const getStatusBadge = () => {
        switch (connectionStatus) {
            case 'checking':
                return (
                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الفحص...
                    </span>
                );
            case 'connected':
                return (
                    <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm">
                        <Wifi className="w-4 h-4" />
                        متصل
                    </span>
                );
            case 'disconnected':
                return (
                    <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm">
                        <WifiOff className="w-4 h-4" />
                        غير متصل
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                        <Info className="w-4 h-4" />
                        غير محدد
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hrsd-primary flex items-center gap-3">
                        <Bell className="w-7 h-7" />
                        اختبار تكامل Slack
                    </h1>
                    <p className="text-gray-500 mt-1">
                        ارسال تنبيهات تجريبية للحوادث الحرجة الى قناة #medical-emergencies
                    </p>
                </div>
                {getStatusBadge()}
            </div>

            {/* Configuration Status Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-hrsd-primary" />
                    حالة الاعداد
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Supabase Connection */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {connectionStatus === 'connected' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : connectionStatus === 'disconnected' ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                                <Info className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                                <p className="font-medium text-gray-700">اتصال Supabase</p>
                                <p className="text-sm text-gray-500">VITE_SUPABASE_URL</p>
                            </div>
                        </div>
                        <button
                            onClick={checkConnection}
                            disabled={connectionStatus === 'checking'}
                            className="px-3 py-1.5 text-sm bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 disabled:opacity-50"
                        >
                            فحص
                        </button>
                    </div>

                    {/* Slack Webhook */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <div>
                                <p className="font-medium text-gray-700">Slack Webhook</p>
                                <p className="text-sm text-gray-500">SLACK_WEBHOOK_URL (Edge Function secret)</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            يتم التحقق عند الارسال
                        </span>
                    </div>

                    {/* Edge Function */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="font-medium text-gray-700">Edge Function</p>
                                <p className="text-sm text-gray-500">slack-incident-alert</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            يتم التحقق عند الارسال
                        </span>
                    </div>

                    {/* Database Trigger */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="font-medium text-gray-700">Database Trigger</p>
                                <p className="text-sm text-gray-500">on_critical_incident_insert</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            يعمل تلقائيا عند ادخال حادث حرج
                        </span>
                    </div>
                </div>
            </div>

            {/* Test Alert Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5 text-hrsd-primary" />
                    ارسال تنبيه تجريبي
                </h2>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>
                            سيتم ارسال رسالة تجريبية الى قناة Slack المحددة. تاكد من ان الوظيفة
                            الحدية (Edge Function) منشورة و SLACK_WEBHOOK_URL مُعدّ في اسرار Supabase.
                        </span>
                    </p>
                </div>

                {/* Sample data preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                    <p className="font-medium text-gray-700 mb-2">بيانات الحادث التجريبي:</p>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                        <div><span className="font-medium">النوع:</span> سقوط</div>
                        <div><span className="font-medium">الخطورة:</span> حرج (CRITICAL)</div>
                        <div><span className="font-medium">الوردية:</span> صباحي</div>
                        <div><span className="font-medium">الموقع:</span> {SAMPLE_INCIDENT.location}</div>
                        <div className="col-span-2">
                            <span className="font-medium">الوصف:</span> {SAMPLE_INCIDENT.description}
                        </div>
                    </div>
                </div>

                <button
                    onClick={sendTestAlert}
                    disabled={isSending}
                    className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                             transition-colors"
                >
                    {isSending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            جاري الارسال...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            ارسال تنبيه تجريبي
                        </>
                    )}
                </button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        نتائج الاختبار
                    </h2>
                    <div className="space-y-3">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-3 p-4 rounded-lg border ${
                                    result.success
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                }`}
                            >
                                {result.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                        {result.message}
                                    </p>
                                    {result.details && (
                                        <p className="text-sm mt-1 text-gray-600">{result.details}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">{result.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Setup Instructions */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    دليل الاعداد
                </h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm">
                    <li>
                        <span className="font-medium">انشاء Slack Incoming Webhook:</span>
                        <p className="mr-6 text-gray-500 mt-1">
                            من Slack API &gt; Your Apps &gt; Incoming Webhooks &gt; Add New Webhook to Workspace
                            واختر قناة #medical-emergencies
                        </p>
                    </li>
                    <li>
                        <span className="font-medium">اعداد السر في Supabase:</span>
                        <p className="mr-6 text-gray-500 mt-1 font-mono text-xs bg-gray-50 p-2 rounded">
                            supabase secrets set SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
                        </p>
                    </li>
                    <li>
                        <span className="font-medium">نشر الوظيفة الحدية:</span>
                        <p className="mr-6 text-gray-500 mt-1 font-mono text-xs bg-gray-50 p-2 rounded">
                            supabase functions deploy slack-incident-alert
                        </p>
                    </li>
                    <li>
                        <span className="font-medium">تطبيق ملف الترحيل SQL:</span>
                        <p className="mr-6 text-gray-500 mt-1 font-mono text-xs bg-gray-50 p-2 rounded">
                            012_slack_webhook_trigger.sql
                        </p>
                    </li>
                    <li>
                        <span className="font-medium">اعداد متغيرات التطبيق في قاعدة البيانات:</span>
                        <p className="mr-6 text-gray-500 mt-1 font-mono text-xs bg-gray-50 p-2 rounded leading-relaxed">
                            ALTER DATABASE postgres SET app.supabase_url = &apos;https://&lt;project&gt;.supabase.co&apos;;<br />
                            ALTER DATABASE postgres SET app.service_role_key = &apos;&lt;service-role-key&gt;&apos;;
                        </p>
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default SlackIntegrationTest;
