import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

/**
 * voice-to-care-form — Edge Function
 * تحويل التسجيل الصوتي إلى بيانات نموذج الرعاية اليومية
 *
 * Receives base64-encoded audio from the client, sends it to the
 * Anthropic Messages API with native audio support and tool calling,
 * and returns structured DailyCareForm JSON.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

/** DailyCareForm tool schema for Anthropic tool calling (structured outputs) */
const FILL_DAILY_CARE_FORM_TOOL = {
    name: 'fill_daily_care_form',
    description:
        'يملأ نموذج الرعاية اليومية بالبيانات المستخرجة من التسجيل الصوتي للممرض أو الطبيب. ' +
        'استخرج جميع العلامات الحيوية والحالة العامة والملاحظات المذكورة في التسجيل.',
    input_schema: {
        type: 'object' as const,
        properties: {
            shift: {
                type: 'string' as const,
                enum: ['صباحي', 'مسائي', 'ليلي'],
                description: 'الوردية: صباحي أو مسائي أو ليلي',
            },
            temperature: {
                type: 'number' as const,
                description: 'درجة حرارة الجسم بالدرجة المئوية (مثال: 37.2)',
            },
            pulse: {
                type: 'number' as const,
                description: 'معدل النبض بالنبضة في الدقيقة (BPM)',
            },
            blood_pressure_systolic: {
                type: 'number' as const,
                description: 'ضغط الدم الانقباضي (العلوي) بالملم زئبق',
            },
            blood_pressure_diastolic: {
                type: 'number' as const,
                description: 'ضغط الدم الانبساطي (السفلي) بالملم زئبق',
            },
            oxygen_saturation: {
                type: 'number' as const,
                description: 'نسبة تشبع الأكسجين في الدم (%)',
            },
            blood_sugar: {
                type: 'number' as const,
                description: 'مستوى السكر في الدم (mg/dL)',
            },
            weight: {
                type: 'number' as const,
                description: 'الوزن بالكيلوجرام',
            },
            mobility_today: {
                type: 'string' as const,
                enum: ['active', 'limited', 'bedridden'],
                description: 'الحالة الحركية اليوم: active=نشيط، limited=محدود الحركة، bedridden=ملازم للفراش',
            },
            mood: {
                type: 'string' as const,
                enum: ['stable', 'happy', 'anxious', 'aggressive', 'depressed', 'confused'],
                description:
                    'المزاج والحالة النفسية: stable=مستقر، happy=سعيد، anxious=قلق، aggressive=عدواني، depressed=مكتئب، confused=مشوش',
            },
            notes: {
                type: 'string' as const,
                description: 'ملاحظات التمريض الإضافية',
            },
            incidents: {
                type: 'string' as const,
                description: 'أي حوادث أو أعراض صحية طارئة وقعت',
            },
            requires_followup: {
                type: 'boolean' as const,
                description: 'هل يحتاج المستفيد إلى متابعة طبية أو إشراف خاص في الوردية القادمة',
            },
        },
        required: ['shift', 'mood', 'mobility_today', 'requires_followup'],
    },
}

const SYSTEM_PROMPT = `أنت مساعد طبي ذكي متخصص في استخراج بيانات الرعاية اليومية من التسجيلات الصوتية.

مهمتك:
١. استمع للتسجيل الصوتي بعناية — قد يكون بالعربية أو الإنجليزية أو مزيج منهما.
٢. استخرج جميع العلامات الحيوية المذكورة (الحرارة، النبض، ضغط الدم، الأكسجين، السكر، الوزن).
٣. حدد الوردية (صباحي / مسائي / ليلي) من السياق أو الوقت المذكور.
٤. قيّم الحالة الحركية والمزاج من الوصف.
٥. سجّل أي ملاحظات أو حوادث مذكورة.
٦. حدد ما إذا كانت هناك حاجة لمتابعة طبية.

قواعد مهمة:
- إذا لم يُذكر رقم معين (مثل الوزن أو السكر)، لا تملأ ذلك الحقل — اتركه فارغاً.
- استخدم دائماً أداة fill_daily_care_form لإرجاع البيانات.
- لا تخمن أرقاماً لم تُذكر صراحة في التسجيل.
- إذا ذُكر ضغط الدم كقيمة واحدة (مثل "١٢٠ على ٨٠")، افصله إلى systolic و diastolic.
- الأرقام قد تُذكر بالعربية (واحد وعشرين) أو بالإنجليزية (twenty-one) — تعامل مع كليهما.`

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS })
    }

    try {
        const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
        if (!anthropicApiKey) {
            return new Response(
                JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }),
                { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        const body = await req.json()
        const { audio_base64, media_type } = body as {
            audio_base64: string
            media_type?: string
        }

        if (!audio_base64) {
            return new Response(
                JSON.stringify({ error: 'audio_base64 is required' }),
                { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        // Resolve media type — default to audio/webm if not provided
        const resolvedMediaType = media_type || 'audio/webm'

        // Build the Anthropic Messages API request with native audio input + tool calling
        const anthropicPayload = {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            tools: [FILL_DAILY_CARE_FORM_TOOL],
            tool_choice: { type: 'tool', name: 'fill_daily_care_form' },
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_audio',
                            source: {
                                type: 'base64',
                                media_type: resolvedMediaType,
                                data: audio_base64,
                            },
                        },
                        {
                            type: 'text',
                            text: 'استمع للتسجيل الصوتي واستخرج بيانات نموذج الرعاية اليومية باستخدام أداة fill_daily_care_form.',
                        },
                    ],
                },
            ],
        }

        const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': anthropicApiKey,
                'anthropic-version': '2024-10-22',
            },
            body: JSON.stringify(anthropicPayload),
        })

        if (!anthropicResponse.ok) {
            const errorText = await anthropicResponse.text()
            console.error('Anthropic API error:', anthropicResponse.status, errorText)
            return new Response(
                JSON.stringify({
                    error: 'Anthropic API request failed',
                    status: anthropicResponse.status,
                    details: errorText,
                }),
                { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        const anthropicResult = await anthropicResponse.json()

        // Extract the tool_use block from the response
        const toolUseBlock = anthropicResult.content?.find(
            (block: { type: string }) => block.type === 'tool_use'
        )

        if (!toolUseBlock || toolUseBlock.name !== 'fill_daily_care_form') {
            console.error('No tool_use block found in response:', JSON.stringify(anthropicResult))
            return new Response(
                JSON.stringify({
                    error: 'لم يتم استخراج بيانات النموذج من التسجيل الصوتي',
                    raw_response: anthropicResult,
                }),
                { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
            )
        }

        // Return the structured form data
        return new Response(
            JSON.stringify({
                success: true,
                form_data: toolUseBlock.input,
            }),
            { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        console.error('voice-to-care-form error:', err)
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: String(err) }),
            { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        )
    }
})
