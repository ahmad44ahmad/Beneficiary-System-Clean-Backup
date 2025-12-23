
// Removed invalid import

interface DailyCareLog {
    shift: string;
    temperature?: number;
    pulse?: number;
    blood_pressure_systolic?: number;
    blood_pressure_diastolic?: number;
    oxygen_saturation?: number;
    blood_sugar?: number;
    mobility_today: string;
    mood: string;
    notes?: string;
    incidents?: string;
    requires_followup: boolean;
}

export const generateShiftSummary = (logs: DailyCareLog[], beneficiaryName: string): string => {
    if (!logs || logs.length === 0) return `لا تجد سجلات لليوم للمستفيد ${beneficiaryName}.`;

    const sections: string[] = [];

    // Header
    sections.push(`📋 *تقرير استلام وتسليم (Handover)*`);
    sections.push(`👤 المستفيد: ${beneficiaryName}`);
    sections.push(`📅 التاريخ: ${new Date().toLocaleDateString('en-GB')}`);
    sections.push('-------------------');

    logs.forEach(log => {
        sections.push(`🔸 *وردية: ${log.shift}*`);

        // Vitals Summary
        const vitals = [];
        if (log.temperature) vitals.push(`Temp: ${log.temperature}`);
        if (log.pulse) vitals.push(`HR: ${log.pulse}`);
        if (log.blood_pressure_systolic) vitals.push(`BP: ${log.blood_pressure_systolic}/${log.blood_pressure_diastolic}`);
        if (log.blood_sugar) vitals.push(`Gluc: ${log.blood_sugar}`);

        if (vitals.length > 0) sections.push(`   - العلامات: ${vitals.join(' | ')}`);

        // Status
        sections.push(`   - المزاج: ${log.mood}`);
        sections.push(`   - الحركة: ${log.mobility_today}`);

        // Notes & Incidents
        if (log.notes) sections.push(`   - 📝 ملاحظات: ${log.notes}`);
        if (log.incidents) sections.push(`   - ⚠️ حوادث: ${log.incidents}`);
        if (log.requires_followup) sections.push(`   - 🔴 يتطلب متابعة!`);

        sections.push('');
    });

    return sections.join('\n');
};
