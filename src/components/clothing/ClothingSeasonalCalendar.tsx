import React from 'react';
import { CalendarDays, Sun, Snowflake, Moon, Star } from 'lucide-react';
import {
    CLOTHING_SEASONS,
    ClothingSeason,
    nextClothingSeason,
} from '../../types/clothing';

const SEASON_ICON: Record<ClothingSeason, React.ElementType> = {
    summer: Sun,
    winter: Snowflake,
    eid_fitr: Star,
    eid_adha: Moon,
};

const SEASON_TONE: Record<ClothingSeason, string> = {
    summer: 'border-hrsd-gold/60 bg-gradient-to-br from-hrsd-gold/10 to-hrsd-orange/5 text-hrsd-gold-dark',
    winter: 'border-hrsd-teal/60 bg-gradient-to-br from-hrsd-teal/10 to-hrsd-navy/5 text-hrsd-teal',
    eid_fitr: 'border-hrsd-green/60 bg-gradient-to-br from-hrsd-green/10 to-hrsd-teal/5 text-hrsd-green-dark',
    eid_adha: 'border-hrsd-navy/40 bg-gradient-to-br from-hrsd-navy/10 to-hrsd-teal/5 text-hrsd-navy',
};

/**
 * Four seasonal request windows per ضوابط الكسوة §المرحلة الأولى.1:
 *   Summer (1 Jan), Winter (1 Jul), Eid al-Fitr (1 Rajab), Eid al-Adha (1 Ramadan).
 * The next upcoming Gregorian window is highlighted.
 */
export const ClothingSeasonalCalendar: React.FC = () => {
    const next = nextClothingSeason();

    return (
        <section
            dir="rtl"
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-hrsd-gold/10 flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-hrsd-gold-dark" />
                    </div>
                    <div>
                        <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                            المواعيد الموسمية للكسوة
                        </h2>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                            أربعة مواسم رفع — ضوابط الكسوة 2020
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-hrsd-gold/10 text-hrsd-gold-dark">
                    <span className="text-[12px] font-semibold">أقرب موعد:</span>
                    <span className="text-[13px] font-bold">{next.season.labelAr}</span>
                    <span className="text-[12px]">· خلال {next.daysUntil} يوم</span>
                </div>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CLOTHING_SEASONS.map((season) => {
                    const isNext = season.id === next.season.id;
                    const Icon = SEASON_ICON[season.id];
                    const tone = SEASON_TONE[season.id];
                    return (
                        <li
                            key={season.id}
                            className={`rounded-xl border-2 p-4 flex flex-col gap-3 ${tone} ${
                                isNext ? 'ring-2 ring-hrsd-gold/50 shadow-md' : ''
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                {isNext && (
                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-hrsd-gold text-white">
                                        القادم
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
                                    {season.labelAr}
                                </h3>
                                <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                                    {season.noteAr}
                                </p>
                            </div>
                            <div className="mt-auto pt-3 border-t border-white/60">
                                <span className="text-[12px] text-slate-500 dark:text-slate-400">
                                    التقويم:
                                </span>
                                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 me-1">
                                    {season.requestDate.calendar === 'gregorian' ? 'ميلادي' : 'هجري'}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

export default ClothingSeasonalCalendar;
