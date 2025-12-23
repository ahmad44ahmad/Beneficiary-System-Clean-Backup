import React, { useState } from 'react';
import { MaintenanceRequest, MOCK_MAINTENANCE_REQUESTS } from '../../types/support';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
    Wrench,
    Droplets,
    Zap,
    Thermometer,
    Hammer,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Plus
} from 'lucide-react';

export const MaintenancePanel: React.FC = () => {
    const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE_REQUESTS);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress'>('all');

    const filteredRequests = requests.filter(r =>
        filter === 'all' || r.status === filter
    );

    const getIcon = (type: MaintenanceRequest['type']) => {
        switch (type) {
            case 'plumbing': return <Droplets className="w-5 h-5 text-blue-500" />;
            case 'electrical': return <Zap className="w-5 h-5 text-yellow-500" />;
            case 'ac': return <Thermometer className="w-5 h-5 text-cyan-500" />;
            case 'carpentry': return <Hammer className="w-5 h-5 text-orange-500" />;
            default: return <Wrench className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        قيد الانتظار
                    </button>
                    <button
                        onClick={() => setFilter('in_progress')}
                        className={`px-3 py-1 text-sm rounded-full ${filter === 'in_progress' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        جاري العمل
                    </button>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    طلب صيانة جديد
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredRequests.map(req => (
                    <Card key={req.id} className="p-4 border-r-4 border-r-teal-500 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    {getIcon(req.type)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                        {req.description}
                                        <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(req.priority)}`}>
                                            {req.priority === 'critical' ? 'حرج جداً' :
                                                req.priority === 'high' ? 'عالي' :
                                                    req.priority === 'medium' ? 'متوسط' : 'منخفض'}
                                        </span>
                                    </h4>
                                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                        <span className="font-medium text-gray-700">{req.location}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>بواسطة: {req.requestedBy}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{req.requestDate}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 min-w-[150px]">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${req.status === 'completed' ? 'bg-green-50 text-green-700' :
                                        req.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                                            req.status === 'pending' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {req.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                                        req.status === 'in_progress' ? <Clock className="w-4 h-4" /> :
                                            <AlertTriangle className="w-4 h-4" />}

                                    {req.status === 'completed' ? 'مكتمل' :
                                        req.status === 'in_progress' ? 'جاري الإصلاح' :
                                            'في الانتظار'}
                                </div>
                                {req.assignedTo && (
                                    <p className="text-xs text-gray-500">
                                        المسؤول: <span className="font-bold text-gray-700">{req.assignedTo}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {req.status !== 'completed' && (
                            <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                                <Button variant="outline" className="text-xs h-8">تعيين فني</Button>
                                <Button className="text-xs h-8 bg-teal-600 hover:bg-teal-700 text-white">تحديث الحالة</Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
