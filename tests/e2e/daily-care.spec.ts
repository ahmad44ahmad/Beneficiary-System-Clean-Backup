import { test, expect } from '@playwright/test';

test.describe('Daily Care Form', () => {

    test('daily care form loads and renders', async ({ page }) => {
        await page.goto('/basira/care');
        // Wait for lazy-loaded form to render
        await expect(page.getByText('سجل العناية اليومي')).toBeVisible({ timeout: 15_000 });
        // Shift radio buttons visible
        await expect(page.getByText('صباحي')).toBeVisible();
        await expect(page.getByText('مسائي')).toBeVisible();
        await expect(page.getByText('ليلي')).toBeVisible();
        // Vital signs section heading visible
        await expect(page.getByRole('heading', { name: 'العلامات الحيوية' })).toBeVisible();
    });

    test('nurse can fill and submit a daily care log', async ({ page }) => {
        await page.goto('/basira/care');
        await expect(page.getByText('سجل العناية اليومي')).toBeVisible({ timeout: 15_000 });

        // ── Select shift: مسائي ──
        await page.locator('input[name="shift"][value="مسائي"]').check();

        // ── Fill vital signs ──
        await page.locator('input[name="temperature"]').fill('37.2');
        await page.locator('input[name="pulse"]').fill('78');
        await page.locator('input[name="blood_pressure_systolic"]').fill('120');
        await page.locator('input[name="blood_pressure_diastolic"]').fill('80');
        await page.locator('input[name="oxygen_saturation"]').fill('97');
        await page.locator('input[name="blood_sugar"]').fill('95');

        // ── Select mobility and mood ──
        await page.locator('select[name="mobility_today"]').selectOption('limited');
        await page.locator('select[name="mood"]').selectOption('happy');

        // ── Fill nursing notes ──
        await page.locator('textarea[name="notes"]').fill('المستفيد بحالة جيدة اليوم');

        // ── Submit ──
        await page.getByText('حفظ السجل').click();

        // ── Assert success message appears ──
        await expect(page.getByText('تم حفظ سجل العناية اليومية بنجاح')).toBeVisible({ timeout: 10_000 });
    });

    test('follow-up checkbox can be toggled', async ({ page }) => {
        await page.goto('/basira/care');
        await expect(page.getByText('سجل العناية اليومي')).toBeVisible({ timeout: 15_000 });

        const checkbox = page.locator('input[name="requires_followup"]');

        // Initially unchecked
        await expect(checkbox).not.toBeChecked();

        // Toggle on
        await checkbox.check();
        await expect(checkbox).toBeChecked();

        // Verify label text is visible
        await expect(page.getByText('يحتاج إلى متابعة طبية')).toBeVisible();
    });

});
