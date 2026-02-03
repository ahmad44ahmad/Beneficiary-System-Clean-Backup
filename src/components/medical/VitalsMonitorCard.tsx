import React from 'react';
import {
    Activity,
    Wifi,
    WifiOff,
    Battery,
    Smartphone,
    Heart,
    Thermometer
} from 'lucide-react';
import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useIoTDevice } from '../../services/iotService';

export const VitalsMonitorCard: React.FC<{ beneficiaryId: string }> = ({ beneficiaryId }) => {
    const { isConnected, deviceStatus, latestVitals, dataHistory } = useIoTDevice(beneficiaryId);

    if (!isConnected) {
        return (
            <Card className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-dashed animate-pulse">
                <WifiOff className="w-10 h-10 mb-3" />
                <p>جاري البحث عن أجهزة طبية ذكية...</p>
                <span className="text-xs text-blue-500 mt-2">Connecting to IoMT Gateway...</span>
            </Card>
        );
    }

    const isAbnormalHR = latestVitals && (latestVitals.heartRate > 100 || latestVitals.heartRate < 60);

    return (
        <Card className="overflow-hidden border-teal-100 shadow-sm relative">
            {/* Live Indicator Pulse */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-mono text-green-700 font-bold">LIVE</span>
            </div>

            {/* Header / Device Info */}
            <div className="p-4 border-b bg-teal-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-teal-100 shadow-sm">
                        <Smartphone className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">VitalWatch Series 5</h3>
                        <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                            {deviceStatus?.id}
                            <span className="text-gray-300">|</span>
                            <Battery className="w-3 h-3 inline" /> {deviceStatus?.batteryLevel}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Vitals Display */}
            <div className="grid grid-cols-2 divide-x divide-x-reverse border-b">
                <div className={`p-6 text-center transition-colors ${isAbnormalHR ? 'bg-red-50' : 'bg-white'}`}>
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                        <Heart className={`w-5 h-5 ${isAbnormalHR ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                        <span className="text-xs font-semibold">نبض القلب</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-gray-900">
                        {latestVitals?.heartRate || '--'}
                    </div>
                    <span className="text-xs text-gray-400">BPM</span>
                </div>

                <div className="p-6 text-center bg-white">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-semibold">الأكسجين</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-gray-900">
                        {latestVitals?.oxygenSaturation || '--'}
                    </div>
                    <span className="text-xs text-gray-400">% SpO2</span>
                </div>
            </div>

            {/* Real-time Chart */}
            <div className="h-32 w-full mt-4 pr-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                            labelStyle={{ display: 'none' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="heartRate"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            animationDuration={300}
                        />
                        <Line
                            type="monotone"
                            dataKey="oxygenSaturation"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center pb-2">
                <span className="text-[10px] text-gray-400">Real-time IoMT Stream</span>
            </div>
        </Card>
    );
};
