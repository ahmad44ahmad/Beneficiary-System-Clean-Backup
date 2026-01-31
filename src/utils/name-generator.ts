/**
 * Saudi Name Generator
 * مولد الأسماء السعودية - منطقة الباحة
 */

import { AL_BAHA_FAMILIES, MALE_FIRST_NAMES, FEMALE_FIRST_NAMES } from '../data/domain-assets';

export type Gender = "male" | "female";

/**
 * Generates a full Saudi name in Al-Baha region style
 * يولّد اسم سعودي كامل بأسلوب منطقة الباحة
 * 
 * @example
 * generateSaudiName("male") // "محمد بن سعد بن عبدالله الغامدي"
 * generateSaudiName("female") // "نورة بنت أحمد بن فهد الزهراني"
 */
export function generateSaudiName(gender: Gender): string {
    const firstNames = gender === "male" ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
    const connector = gender === "male" ? "بن" : "بنت";

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const fatherName = MALE_FIRST_NAMES[Math.floor(Math.random() * MALE_FIRST_NAMES.length)];
    const grandfatherName = MALE_FIRST_NAMES[Math.floor(Math.random() * MALE_FIRST_NAMES.length)];
    const familyName = AL_BAHA_FAMILIES[Math.floor(Math.random() * AL_BAHA_FAMILIES.length)];

    return `${firstName} ${connector} ${fatherName} ${connector} ${grandfatherName} ${familyName}`;
}

/**
 * Generates a short Saudi name (first + family only)
 */
export function generateShortName(gender: Gender): string {
    const firstNames = gender === "male" ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const familyName = AL_BAHA_FAMILIES[Math.floor(Math.random() * AL_BAHA_FAMILIES.length)];

    return `${firstName} ${familyName}`;
}

/**
 * Generates a guardian name for a beneficiary
 * يولّد اسم ولي أمر للمستفيد
 */
export function generateGuardianName(): string {
    return generateSaudiName("male");
}

/**
 * Generates a Saudi phone number
 * يولّد رقم هاتف سعودي
 */
export function generateSaudiPhone(): string {
    const prefixes = ["050", "053", "054", "055", "056", "057", "058", "059"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
    return `${prefix}${suffix}`;
}

/**
 * Generates a file ID for beneficiary
 * يولّد رقم ملف للمستفيد
 */
export function generateFileId(year: number = new Date().getFullYear()): string {
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `RHB-${year}-${sequence.toString().padStart(3, "0")}`;
}

/**
 * Generates a room assignment
 */
export function generateRoomAssignment(): { room: string; bed: string } {
    const wings = ["أ", "ب", "ج", "د"];
    const wing = wings[Math.floor(Math.random() * wings.length)];
    const floor = Math.floor(Math.random() * 4) + 1;
    const roomNumber = Math.floor(Math.random() * 10) + 1;
    const bed = (Math.floor(Math.random() * 2) + 1).toString();

    return {
        room: `${wing}-${floor}${roomNumber.toString().padStart(2, "0")}`,
        bed
    };
}

/**
 * Gets a random guardian relation
 */
export function getRandomGuardianRelation(): string {
    const relations = ["father", "mother", "brother", "sister", "uncle", "legalGuardian"];
    return relations[Math.floor(Math.random() * relations.length)];
}

export const GUARDIAN_RELATION_LABELS: Record<string, string> = {
    father: "أب",
    mother: "أم",
    brother: "أخ",
    sister: "أخت",
    uncle: "عم",
    legalGuardian: "وكيل شرعي"
};
