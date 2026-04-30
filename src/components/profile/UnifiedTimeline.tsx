import React from 'react';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import {
    Calendar,
    AlertTriangle,
    Stethoscope,
    ClipboardCheck,
    Clock
} from 'lucide-react';

interface UnifiedTimelineProps {
    profile: UnifiedBeneficiaryProfile;
}

interface TimelineEvent {
    id: string;
    date: string; // ISO string
    time?: string;
    type: 'visit' | 'incident' | 'medical' | 'rehab';
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
}

export const UnifiedTimeline: React.FC<UnifiedTimelineProps> = ({ profile }) => {
    // 1. Merge and Normalize Data
    const events: TimelineEvent[] = [];

    // Visits
    profile.visitLogs.forEach(visit => {
        events.push({
            id: `visit-${visit.id}`,
            date: visit.date,
            time: visit.time,
            type: 'visit',
            title: `Visit: ${visit.type}`,
            description: visit.notes,
            icon: <Calendar className="w-4 h-4" />,
            colorClass: 'bg-[#269798]/15 text-[#269798] border-[#269798]/30'
        });
    });

    // Incidents
    profile.incidents.forEach(incident => {
        events.push({
            id: `incident-${incident.id}`,
            date: incident.date,
            time: incident.time,
            type: 'incident',
            title: `Incident: ${incident.type}`,
            description: incident.description,
            icon: <AlertTriangle className="w-4 h-4" />,
            colorClass: 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/30'
        });
    });

    // Medical Exams
    profile.medicalHistory.forEach(exam => {
        events.push({
            id: `exam-${exam.id}`,
            date: exam.date,
            type: 'medical',
            title: `Medical Exam: ${exam.diagnosis}`,
            description: `Dr. ${exam.doctorName} - ${exam.recommendations}`,
            icon: <Stethoscope className="w-4 h-4" />,
            colorClass: 'bg-[#2BB574]/15 text-[#1E9658] border-[#2BB574]/20'
        });
    });

    // Rehab Plan Start (if active)
    if (profile.activeRehabPlan) {
        const plan = profile.activeRehabPlan as { id?: string; startDate?: string; goals?: unknown[] } & Record<string, unknown>;
        events.push({
            id: `plan-${plan.id as string}`,
            date: plan.startDate as string,
            type: 'rehab',
            title: 'Rehab Plan Started',
            description: `${(plan.goals as unknown[])?.length ?? 0} Goals Set`,
            icon: <ClipboardCheck className="w-4 h-4" />,
            colorClass: 'bg-[#FCB614]/15 text-[#D49A0A] border-[#FCB614]/20'
        });
    }

    // 2. Sort by Date (Newest First)
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Clock className="w-12 h-12 mb-3 opacity-20" />
                <p>لا توجد أحداث مسجلة في السجل</p>
            </div>
        );
    }

    return (
        <div className="relative border-s-2 border-gray-200 ms-3 space-y-8 py-4">
            {events.map((event, _index) => (
                <div key={event.id} className="relative ps-8">
                    {/* Dot on the line */}
                    <div
                        className={`
                            absolute -start-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                            ${event.type === 'incident' ? 'bg-[#DC2626]' :
                                event.type === 'medical' ? 'bg-[#2BB574]' :
                                    event.type === 'rehab' ? 'bg-[#FCB614]' : 'bg-[#269798]'}
                        `}
                    />

                    {/* Content Card */}
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <span className={`p-1.5 rounded-md ${event.colorClass}`}>
                                    {event.icon}
                                </span>
                                <h4 className="font-bold text-gray-900 text-sm">{event.title}</h4>
                            </div>
                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                {event.date} {event.time && `• ${event.time}`}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                            {event.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
