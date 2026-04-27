import { useState, useEffect } from 'react';
import { useVitalsAlertsStore } from '../stores/useVitalsAlertsStore';

export interface VitalSignData {
    timestamp: string;
    heartRate: number; // bpm
    oxygenSaturation: number; // %
    bloodPressureSystolic: number; // mmHg
    bloodPressureDiastolic: number; // mmHg
    temperature: number; // Celsius
}

export interface DeviceStatus {
    id: string;
    type: 'wearable_band' | 'bed_monitor' | 'pulse_oximeter';
    batteryLevel: number;
    isConnected: boolean;
    lastSync: string;
}

/**
 * IoMT integration: simulates a wearable feeding vital signs every 3s.
 * Threshold breaches push alerts to the vitalsAlertsStore — consumed by
 * SmartAlertsPanel and any subscribing surface.
 */

interface BeneficiaryHint {
    name: string;
    location: string;
}

function detectAndPushAlert(vitals: VitalSignData, hint: BeneficiaryHint, beneficiaryId: string) {
    const { push } = useVitalsAlertsStore.getState();
    const now = new Date();
    const hhmm = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    if (vitals.temperature >= 38.5) {
        push({
            severity: vitals.temperature >= 39.5 ? 'critical' : 'high',
            title: 'ارتفاع في درجة الحرارة',
            message: `درجة الحرارة ${vitals.temperature.toFixed(1)}°C — تجاوز الحدّ الطبيعي`,
            beneficiaryName: hint.name,
            beneficiaryId,
            location: hint.location,
            timestamp: hhmm,
            suggestedAction: 'قياس العلامات الحيوية وإبلاغ الطبيب فوراً',
        });
    }

    if (vitals.oxygenSaturation < 92) {
        push({
            severity: vitals.oxygenSaturation < 88 ? 'critical' : 'high',
            title: 'انخفاض في تشبّع الأكسجين',
            message: `SpO₂ = ${vitals.oxygenSaturation}٪ — تحت الحدّ الطبيعي`,
            beneficiaryName: hint.name,
            beneficiaryId,
            location: hint.location,
            timestamp: hhmm,
            suggestedAction: 'تأكيد القراءة، تطبيق الأكسجين عند الحاجة، إبلاغ الطبيب',
        });
    }

    if (vitals.heartRate > 120 || vitals.heartRate < 50) {
        push({
            severity: 'high',
            title: 'اضطراب في معدّل النبض',
            message: `معدّل النبض ${vitals.heartRate} نبضة/دقيقة — خارج النطاق الطبيعي`,
            beneficiaryName: hint.name,
            beneficiaryId,
            location: hint.location,
            timestamp: hhmm,
            suggestedAction: 'إعادة القياس بعد ٥ دقائق وإبلاغ الطبيب لو استمرّ',
        });
    }
}

export const useIoTDevice = (beneficiaryId: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
    const [latestVitals, setLatestVitals] = useState<VitalSignData | null>(null);
    const [dataHistory, setDataHistory] = useState<VitalSignData[]>([]);

    useEffect(() => {
        const connect = async () => {
            await new Promise(r => setTimeout(r, 1500));
            setIsConnected(true);
            setDeviceStatus({
                id: 'DEV-9928-X',
                type: 'wearable_band',
                batteryLevel: 87,
                isConnected: true,
                lastSync: new Date().toISOString(),
            });
        };
        connect();

        let tickCount = 0;
        const interval = setInterval(() => {
            if (!isConnected) return;
            tickCount += 1;

            const now = new Date();
            const randomHR = 70 + Math.floor(Math.random() * 20);
            const randomSpO2 = 94 + Math.floor(Math.random() * 6);
            let temperature = 36.5 + (Math.random() * 1);

            // كل ١٠ نبضات (≈٣٠ ثانية) يحاكي النظام ارتفاعاً حرارياً ليلياً
            // كي يستجيب محرّك الإنذار المبكر بشكل ظاهر للديمو.
            if (tickCount % 10 === 0) {
                temperature = 38.7 + Math.random() * 0.6;
            }

            const newData: VitalSignData = {
                timestamp: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heartRate: randomHR,
                oxygenSaturation: randomSpO2,
                bloodPressureSystolic: 110 + Math.floor(Math.random() * 20),
                bloodPressureDiastolic: 70 + Math.floor(Math.random() * 10),
                temperature,
            };

            setLatestVitals(newData);
            setDataHistory(prev => {
                const newHistory = [...prev, newData];
                if (newHistory.length > 30) return newHistory.slice(newHistory.length - 30);
                return newHistory;
            });

            detectAndPushAlert(newData, {
                name: 'محمد — أبو سعد',
                location: 'الجناح الشمالي — غرفة ١٠٧',
            }, beneficiaryId);

        }, 3000);

        return () => clearInterval(interval);
    }, [isConnected, beneficiaryId]);

    return { isConnected, deviceStatus, latestVitals, dataHistory };
};

/**
 * Helper to seed demo vitals alerts on demand (e.g., when SmartAlertsPanel
 * is opened and the store is empty). Mirrors the script's "ارتفاع حرارة
 * مستفيد ليلاً" scenario.
 */
export function seedDemoVitalsAlerts() {
    const { alerts, push } = useVitalsAlertsStore.getState();
    if (alerts.length > 0) return;

    push({
        severity: 'high',
        title: 'ارتفاع في درجة الحرارة',
        message: 'درجة الحرارة 38.9°C — تجاوز الحدّ الطبيعي',
        beneficiaryName: 'محمد — أبو سعد',
        beneficiaryId: '172',
        location: 'الجناح الشمالي — غرفة ١٠٧',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: 'قياس العلامات الحيوية وإبلاغ الطبيب المناوب',
    });

    push({
        severity: 'medium',
        title: 'انخفاض في تشبّع الأكسجين',
        message: 'SpO₂ = 91٪ — قراءة دون الحدّ الطبيعي',
        beneficiaryName: 'فاطمة سعيد',
        beneficiaryId: 'B002',
        location: 'القسم النسائي — غرفة ٢٠٢',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: 'إعادة القياس وتطبيق الأكسجين عند الحاجة',
    });
}
