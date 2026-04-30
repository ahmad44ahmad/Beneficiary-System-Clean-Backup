import React from 'react';
import { Users, Crown, ClipboardCheck, UserCheck, Eye } from 'lucide-react';
import {
    CLOTHING_COMMITTEE_SPEC,
    ClothingCommitteeMember,
    ClothingCommitteeRole,
} from '../../types/clothing';

const ROLE_ICON: Record<ClothingCommitteeRole, React.ElementType> = {
    president: Crown,
    decision_recorder: ClipboardCheck,
    social_specialist: UserCheck,
    social_observer: Eye,
};

const ROLE_TONE: Record<ClothingCommitteeRole, { border: string; bg: string; accent: string }> = {
    president: {
        border: 'border-hrsd-gold/60',
        bg: 'bg-hrsd-gold/5',
        accent: 'text-hrsd-gold-dark',
    },
    decision_recorder: {
        border: 'border-hrsd-teal/60',
        bg: 'bg-hrsd-teal/5',
        accent: 'text-hrsd-teal',
    },
    social_specialist: {
        border: 'border-hrsd-green/60',
        bg: 'bg-hrsd-green/5',
        accent: 'text-hrsd-green-dark',
    },
    social_observer: {
        border: 'border-hrsd-navy/40',
        bg: 'bg-hrsd-navy/5',
        accent: 'text-hrsd-navy',
    },
};

interface Props {
    assignments?: Partial<Record<ClothingCommitteeRole, { id: string; name: string }>>;
}

const MemberCard: React.FC<{
    member: ClothingCommitteeMember;
    assignee?: { id: string; name: string };
}> = ({ member, assignee }) => {
    const Icon = ROLE_ICON[member.role];
    const tone = ROLE_TONE[member.role];

    return (
        <article
            className={`rounded-2xl border-2 ${tone.border} ${tone.bg} p-5 flex flex-col gap-4 transition-shadow hover:shadow-md`}
        >
            <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center ${tone.accent}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-hrsd-navy dark:text-white leading-tight">
                            {member.roleLabelAr}
                        </h3>
                        <span
                            className={`inline-block mt-1 text-[12px] font-semibold px-2 py-0.5 rounded-md bg-white ${tone.accent}`}
                        >
                            {member.membershipTypeAr}
                        </span>
                    </div>
                </div>
            </header>

            <div>
                <h4 className="text-[13px] font-semibold text-hrsd-cool-gray dark:text-hrsd-navy mb-2">
                    المهام الرئيسية
                </h4>
                <ul className="space-y-1.5">
                    {member.duties.map((duty, i) => (
                        <li
                            key={i}
                            className="text-[13px] text-hrsd-navy dark:text-hrsd-navy leading-relaxed flex gap-2"
                        >
                            <span className={`${tone.accent} mt-1`}>●</span>
                            <span>{duty}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <footer className="mt-auto pt-3 border-t border-gray-200/60 dark:border-gray-200">
                {assignee ? (
                    <div>
                        <span className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                            الموظف المُكلَّف
                        </span>
                        <p className="text-[14px] font-bold text-hrsd-navy dark:text-white mt-0.5">
                            {assignee.name}
                        </p>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={`w-full py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-300 text-[13px] font-medium text-hrsd-cool-gray dark:text-hrsd-cool-gray hover:bg-white hover:${tone.accent} transition-colors`}
                    >
                        تكليف موظف…
                    </button>
                )}
            </footer>
        </article>
    );
};

/**
 * Renders the four-member clothing committee per ضوابط الكسوة §المرحلة الثانية.2.
 * Fixed composition: chair, decision-recorder, specialist, observer.
 */
export const ClothingCommitteeCard: React.FC<Props> = ({ assignments = {} }) => (
    <section
        dir="rtl"
        className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 p-5 shadow-sm"
    >
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-hrsd-navy/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-hrsd-navy" />
                </div>
                <div>
                    <h2 className="text-[17px] font-bold text-hrsd-navy dark:text-white">
                        لجنة تأمين الكسوة
                    </h2>
                    <p className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mt-0.5">
                        تشكّل بقرار من مدير المركز — ضوابط الكسوة 2020 §المرحلة الثانية
                    </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLOTHING_COMMITTEE_SPEC.map((member) => (
                <MemberCard
                    key={member.role}
                    member={member}
                    assignee={assignments[member.role]}
                />
            ))}
        </div>
    </section>
);

export default ClothingCommitteeCard;
