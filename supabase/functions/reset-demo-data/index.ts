import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // حذف البيانات المُضافة (ليست الأساسية) - Example strategy: keep IDs fixed for demo, delete others
    // Or just wipe activity_log and reset alerts

    await supabase.from('activity_log').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // إعادة حالة التنبيهات
    await supabase.from('alerts').update({ status: 'open' }).in('status', ['resolved', 'acknowledged'])

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    })
})
