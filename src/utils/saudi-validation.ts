/**
 * Saudi National ID Validation
 * التحقق من رقم الهوية الوطنية السعودية
 */

export interface ValidationResult {
    valid: boolean;
    type: "citizen" | "resident" | null;
}

/**
 * Validates Saudi National ID using the correct Luhn algorithm variant
 * Saudi IDs: 10 digits, starts with 1 (citizen) or 2 (resident)
 */
export function validateSaudiNationalID(id: string): ValidationResult {
    // Format check
    if (!/^[12]\d{9}$/.test(id)) {
        return { valid: false, type: null };
    }

    // Luhn algorithm (Saudi variant)
    const digits = id.split("").map(Number);
    let sum = 0;

    for (let i = 0; i < 10; i++) {
        let digit = digits[i];

        // Double every second digit from the right (index 8, 6, 4, 2, 0)
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = Math.floor(digit / 10) + (digit % 10); // Sum of digits
            }
        }
        sum += digit;
    }

    const valid = sum % 10 === 0;
    const type = valid ? (id[0] === "1" ? "citizen" : "resident") : null;

    return { valid, type };
}

/**
 * Generates a valid Saudi National ID for testing
 * يولّد رقم هوية سعودي صالح للاختبار
 */
export function generateValidSaudiID(type: "citizen" | "resident" = "citizen"): string {
    const prefix = type === "citizen" ? "1" : "2";
    let baseDigits = prefix;

    // Generate 8 random digits
    for (let i = 0; i < 8; i++) {
        baseDigits += Math.floor(Math.random() * 10);
    }

    // Calculate check digit
    const digits = baseDigits.split("").map(Number);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        let digit = digits[i];
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
        }
        sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return baseDigits + checkDigit;
}

/**
 * Formats Saudi National ID with dashes for display
 * تنسيق رقم الهوية بالشرطات للعرض
 */
export function formatSaudiID(id: string): string {
    if (id.length !== 10) return id;
    return `${id.slice(0, 1)}-${id.slice(1, 5)}-${id.slice(5, 9)}-${id.slice(9)}`;
}

/**
 * Validates Saudi phone number
 * التحقق من رقم الهاتف السعودي
 */
export function validateSaudiPhone(phone: string): boolean {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, "");

    // Saudi mobile: starts with 05 and has 10 digits
    // Or international format: +966 5X XXX XXXX
    return /^(05\d{8}|966\d{9}|\+966\d{9})$/.test(cleaned);
}

/**
 * Formats Saudi phone number for display
 */
export function formatSaudiPhone(phone: string): string {
    const cleaned = phone.replace(/[\s-]/g, "").replace(/^\+?966/, "0");
    if (cleaned.length !== 10) return phone;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}
