import { test, expect } from '@playwright/test';

test.describe('Incident Report Form — Full Journey', () => {

    test('nurse can fill and submit an infection incident report', async ({ page }) => {
        // Navigate to the incident report form
        await page.goto('/ipc/incident/new');

        // Wait for the form to fully load (locations fetched, spinner gone)
        await expect(page.getByText('الإبلاغ عن حادثة عدوى')).toBeVisible({ timeout: 15_000 });

        // ── Step 1: Select incident category ──
        // Click "عدوى مؤكدة" (Confirmed Infection) category button
        await page.getByText('عدوى مؤكدة').click();

        // ── Step 2: Select affected person type ──
        // Click "مستفيد" (Beneficiary) button
        await page.getByText('مستفيد', { exact: true }).click();

        // ── Step 3: Fill affected person name ──
        // The name input appears conditionally after selecting the type
        // Placeholder is dynamic: "اسم مستفيد" (derived from AFFECTED_TYPES label)
        const affectedNameInput = page.getByPlaceholder('اسم مستفيد');
        await expect(affectedNameInput).toBeVisible({ timeout: 5_000 });
        await affectedNameInput.fill('محمد أحمد العلي');

        // ── Step 4: Fill reporter name ──
        const reporterInput = page.getByPlaceholder('اسمك');
        await reporterInput.fill('ممرضة سارة');

        // ── Step 5: Select location (first option from demo data) ──
        // Scope to main content area (header also has a select)
        const locationSelect = page.getByRole('main').locator('select');
        // Wait for options to be populated (demo locations loaded)
        await expect(locationSelect.locator('option')).not.toHaveCount(1, { timeout: 5000 });
        await locationSelect.selectOption({ index: 1 });

        // ── Step 6: Select infection site ──
        // Sites are short labels: 'تنفسي', 'بولي', 'جلدي', etc.
        await page.getByText('تنفسي', { exact: true }).click();

        // ── Step 7: Select symptoms (multi-select) ──
        await page.getByText('حمى', { exact: true }).click();
        await page.getByText('سعال', { exact: true }).click();

        // ── Step 8: Select severity level ──
        await page.getByText('متوسط', { exact: true }).click();

        // ── Step 9: Select immediate actions ──
        await page.getByText('عزل المصاب').click();
        await page.getByText('إبلاغ الطبيب').click();

        // ── Step 10: Set up alert dialog handler BEFORE submit ──
        // The form uses native alert() for feedback, not toasts
        let alertMessage = '';
        page.on('dialog', async (dialog) => {
            alertMessage = dialog.message();
            await dialog.accept();
        });

        // ── Step 11: Submit the form ──
        await page.getByText('تسجيل الحادثة').click();

        // ── Step 12: Assert success ──
        // Wait for the alert to fire and navigation to complete
        await page.waitForURL('**/ipc', { timeout: 10_000 });

        // Verify the success alert message was shown
        expect(alertMessage).toContain('تم تسجيل الحادثة بنجاح');
    });

    test('form validates required fields before submission', async ({ page }) => {
        await page.goto('/ipc/incident/new');
        await expect(page.getByText('الإبلاغ عن حادثة عدوى')).toBeVisible({ timeout: 15_000 });

        // Set up alert dialog handler for validation messages
        let alertMessage = '';
        page.on('dialog', async (dialog) => {
            alertMessage = dialog.message();
            await dialog.accept();
        });

        // Try to submit without filling required fields
        await page.getByText('تسجيل الحادثة').click();

        // Expect validation alert (category is required)
        expect(alertMessage).toContain('الرجاء اختيار نوع الحادثة');

        // URL should NOT have changed (still on form page)
        expect(page.url()).toContain('/ipc/incident/new');
    });

});
