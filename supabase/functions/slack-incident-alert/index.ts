/**
 * slack-incident-alert - Supabase Deno Edge Function
 *
 * This function is triggered via database webhook when a critical incident is logged.
 * It:
 *   1. Receives the incident payload (via webhook POST or direct invoke)
 *   2. Fetches related beneficiary data (masking National IDs)
 *   3. Formats a rich Slack Block Kit message in Arabic
 *   4. Posts to the #medical-emergencies Slack channel via Incoming Webhook
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ── Types ────────────────────────────────────────────────────────────────────

interface IncidentRecord {
    id: string
    date: string
    beneficiary_id: string
    type: string
    shift: string
    description: string
    action_taken: string
    witnesses: string
    severity?: string
    location?: string
    created_at: string
    updated_at: string
}

interface WebhookPayload {
    type: 'INSERT' | 'UPDATE' | 'DELETE'
    record: IncidentRecord
    old_record?: IncidentRecord
}

interface BeneficiaryInfo {
    id: string
    name: string
    national_id?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Mask a National ID for PDPL compliance.
 * Example: 1055754009 -> 105***009
 * If the ID is shorter than 6 characters, fully mask it.
 */
function maskNationalId(nationalId: string | undefined | null): string {
    if (!nationalId) return 'غير متوفر'
    const cleaned = nationalId.replace(/\s/g, '')
    if (cleaned.length < 6) return '*'.repeat(cleaned.length)
    const first3 = cleaned.substring(0, 3)
    const last3 = cleaned.substring(cleaned.length - 3)
    return `${first3}***${last3}`
}

/**
 * Map incident type codes to Arabic labels.
 */
function getIncidentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        injury: 'اصابة',
        assault: 'اعتداء',
        neglect: 'اهمال',
        self_harm: 'ايذاء النفس',
        suicide_attempt: 'محاولة انتحار',
        death: 'وفاة',
        agitation: 'هياج',
        vandalism: 'تخريب',
        escape: 'هروب',
        fall: 'سقوط',
        medication_error: 'خطا دوائي',
        infection: 'عدوى',
        other: 'اخرى',
    }
    return labels[type] || type
}

/**
 * Map shift codes to Arabic labels.
 */
function getShiftLabel(shift: string): string {
    const labels: Record<string, string> = {
        morning: 'صباحي',
        evening: 'مسائي',
        night: 'ليلي',
    }
    return labels[shift] || shift
}

/**
 * Get severity emoji and Arabic label.
 */
function getSeverityInfo(severity: string | undefined): { emoji: string; label: string; color: string } {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return { emoji: '\uD83D\uDD34', label: 'حرج', color: '#dc2626' }
        case 'HIGH':
            return { emoji: '\uD83D\uDFE0', label: 'عالي', color: '#ea580c' }
        case 'MEDIUM':
            return { emoji: '\uD83D\uDFE1', label: 'متوسط', color: '#ca8a04' }
        case 'LOW':
            return { emoji: '\uD83D\uDFE2', label: 'منخفض', color: '#16a34a' }
        default:
            return { emoji: '\uD83D\uDD34', label: 'حرج', color: '#dc2626' }
    }
}

/**
 * Format a date string into a readable Arabic date/time.
 */
function formatDateTime(dateStr: string): string {
    try {
        const date = new Date(dateStr)
        const dateFormatted = date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        const timeFormatted = date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
        })
        return `${dateFormatted} - ${timeFormatted}`
    } catch {
        return dateStr
    }
}

/**
 * Build Slack Block Kit blocks for the incident alert message.
 */
function buildSlackBlocks(
    incident: IncidentRecord,
    beneficiary: BeneficiaryInfo | null
): Record<string, unknown>[] {
    const severityInfo = getSeverityInfo(incident.severity)
    const incidentTypeLabel = getIncidentTypeLabel(incident.type)
    const shiftLabel = getShiftLabel(incident.shift)
    const maskedId = beneficiary?.national_id
        ? maskNationalId(beneficiary.national_id)
        : 'غير متوفر'
    const beneficiaryName = beneficiary?.name || 'غير معروف'
    const location = incident.location || 'غير محدد'
    const dateTime = formatDateTime(incident.created_at || incident.date)

    const blocks: Record<string, unknown>[] = [
        // Header
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: `${severityInfo.emoji} تنبيه حادث حرج - نظام بصيرة`,
                emoji: true,
            },
        },
        // Severity + Type Section
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: `*نوع الحادث:*\n${incidentTypeLabel}`,
                },
                {
                    type: 'mrkdwn',
                    text: `*مستوى الخطورة:*\n${severityInfo.emoji} ${severityInfo.label}`,
                },
                {
                    type: 'mrkdwn',
                    text: `*التاريخ والوقت:*\n${dateTime}`,
                },
                {
                    type: 'mrkdwn',
                    text: `*الوردية:*\n${shiftLabel}`,
                },
            ],
        },
        { type: 'divider' },
        // Beneficiary Info
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: `*المستفيد:*\n${beneficiaryName}`,
                },
                {
                    type: 'mrkdwn',
                    text: `*الهوية الوطنية:*\n\`${maskedId}\``,
                },
                {
                    type: 'mrkdwn',
                    text: `*الموقع:*\n${location}`,
                },
                {
                    type: 'mrkdwn',
                    text: `*رقم الحادث:*\n\`${incident.id.substring(0, 8)}...\``,
                },
            ],
        },
        { type: 'divider' },
        // Description
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*وصف الحادث:*\n${incident.description || 'لا يوجد وصف'}`,
            },
        },
    ]

    // Action Taken (if available)
    if (incident.action_taken) {
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*الاجراء المتخذ:*\n${incident.action_taken}`,
            },
        })
    }

    // Witnesses (if available)
    if (incident.witnesses) {
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*الشهود:*\n${incident.witnesses}`,
            },
        })
    }

    // Footer context
    blocks.push(
        { type: 'divider' },
        {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `نظام بصيرة - مركز التاهيل الشامل بمنطقة الباحة | وزارة الموارد البشرية والتنمية الاجتماعية`,
                },
            ],
        }
    )

    return blocks
}

// ── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS })
    }

    try {
        const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL')
        if (!SLACK_WEBHOOK_URL) {
            console.error('SLACK_WEBHOOK_URL is not configured')
            return new Response(
                JSON.stringify({ error: 'SLACK_WEBHOOK_URL is not configured' }),
                { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client for fetching beneficiary data
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // Parse the incoming payload (from database webhook or direct invoke)
        const body = await req.json() as WebhookPayload
        const incident = body.record

        if (!incident) {
            return new Response(
                JSON.stringify({ error: 'No incident record in payload' }),
                { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        // Fetch beneficiary info (name and national_id for masking)
        let beneficiary: BeneficiaryInfo | null = null
        if (incident.beneficiary_id) {
            const { data } = await supabase
                .from('beneficiaries')
                .select('id, name, national_id')
                .eq('id', incident.beneficiary_id)
                .single()

            if (data) {
                beneficiary = data as BeneficiaryInfo
            }
        }

        // Build Slack Block Kit message
        const blocks = buildSlackBlocks(incident, beneficiary)
        const severityInfo = getSeverityInfo(incident.severity)

        const slackPayload = {
            text: `${severityInfo.emoji} تنبيه حادث حرج - نظام بصيرة: ${getIncidentTypeLabel(incident.type)}`,
            blocks,
        }

        // Post to Slack
        const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackPayload),
        })

        if (!slackResponse.ok) {
            const errorText = await slackResponse.text()
            console.error('Slack webhook error:', slackResponse.status, errorText)
            return new Response(
                JSON.stringify({
                    error: 'Failed to send Slack notification',
                    status: slackResponse.status,
                    details: errorText,
                }),
                { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        // Log the notification to audit_logs
        await supabase.from('audit_logs').insert({
            action: 'SLACK_NOTIFICATION_SENT',
            module: 'incidents',
            details: JSON.stringify({
                incident_id: incident.id,
                incident_type: incident.type,
                severity: incident.severity || 'CRITICAL',
                beneficiary_id: incident.beneficiary_id,
                channel: '#medical-emergencies',
            }),
        }).catch(() => { /* non-critical */ })

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Slack notification sent successfully',
                incident_id: incident.id,
            }),
            { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        console.error('slack-incident-alert error:', err)
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: String(err) }),
            { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        )
    }
})
