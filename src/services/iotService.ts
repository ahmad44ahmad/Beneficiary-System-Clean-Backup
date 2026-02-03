import { useState, useEffect } from 'react';

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
 * FEATURE 6: "Smart Sense" IoT Integration
 * Simulates a WebSocket connection to medical devices.
 */

// Simulated connection to a device
export const useIoTDevice = (beneficiaryId: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
    const [latestVitals, setLatestVitals] = useState<VitalSignData | null>(null);
    const [dataHistory, setDataHistory] = useState<VitalSignData[]>([]);

    useEffect(() => {
        // 1. Simulate Connection Handshake
        const connect = async () => {
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1500));
            setIsConnected(true);
            setDeviceStatus({
                id: 'DEV-9928-X',
                type: 'wearable_band',
                batteryLevel: 87,
                isConnected: true,
                lastSync: new Date().toISOString()
            });
        };

        connect();

        // 2. Simulate Real-time Data Stream (Mock WebSocket)
        const interval = setInterval(() => {
            if (!isConnected) return;

            const now = new Date();
            // Generate semi-random realistic values
            // Base HR around 75, with some volatility
            const randomHR = 70 + Math.floor(Math.random() * 20);
            // SpO2 usually stable 95-100
            const randomSpO2 = 94 + Math.floor(Math.random() * 6);

            const newData: VitalSignData = {
                timestamp: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heartRate: randomHR,
                oxygenSaturation: randomSpO2,
                bloodPressureSystolic: 110 + Math.floor(Math.random() * 20),
                bloodPressureDiastolic: 70 + Math.floor(Math.random() * 10),
                temperature: 36.5 + (Math.random() * 1)
            };

            setLatestVitals(newData);
            setDataHistory(prev => {
                const newHistory = [...prev, newData];
                // Keep last 30 data points
                if (newHistory.length > 30) return newHistory.slice(newHistory.length - 30);
                return newHistory;
            });

        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [isConnected, beneficiaryId]);

    return { isConnected, deviceStatus, latestVitals, dataHistory };
};
