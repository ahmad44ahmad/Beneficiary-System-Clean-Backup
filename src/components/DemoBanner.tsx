import React from 'react';

export function DemoBanner() {
    const isDemo = import.meta.env.VITE_APP_MODE === 'demo';

    if (!isDemo) return null;

    return (
        <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium animate-in slide-in-from-top duration-500" dir="rtl">
            🎭 نسخة تجريبية للعرض - البيانات وهمية ويتم إعادة تعيينها يومياً
            <span className="mr-2 text-white/80 text-xs">(Demo Mode)</span>
        </div>
    );
}
