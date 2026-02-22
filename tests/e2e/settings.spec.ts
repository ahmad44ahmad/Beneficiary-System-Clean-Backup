import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {

    // Use unique subtitle as page-loaded indicator (avoids ambiguous "الإعدادات" matches)
    const pageReady = 'تخصيص تجربة استخدام النظام';

    test('settings page loads with all sections', async ({ page }) => {
        await page.goto('/settings');

        // Page subtitle is unique to this page
        await expect(page.getByText(pageReady)).toBeVisible({ timeout: 15_000 });

        // All setting sections visible
        await expect(page.getByText('المظهر')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'الإشعارات' })).toBeVisible();
        await expect(page.getByText('اللغة')).toBeVisible();
    });

    test('theme selection toggles between options', async ({ page }) => {
        await page.goto('/settings');
        await expect(page.getByText(pageReady)).toBeVisible({ timeout: 15_000 });

        // Default is "فاتح" (light) — should have active styling
        const lightBtn = page.getByText('فاتح');
        await expect(lightBtn).toBeVisible();

        // Click "داكن" (dark) button
        const darkBtn = page.getByText('داكن');
        await darkBtn.click();

        // The dark button's parent should now have the active border color
        const darkContainer = darkBtn.locator('..');
        await expect(darkContainer).toHaveClass(/border-\[#148287\]/);
    });

    test('notification toggle can be switched', async ({ page }) => {
        await page.goto('/settings');
        await expect(page.getByText(pageReady)).toBeVisible({ timeout: 15_000 });

        // Notifications section
        await expect(page.getByText('تفعيل الإشعارات')).toBeVisible();

        // Toggle button — starts enabled (green bg-[#2DB473])
        const toggle = page.getByTitle('تعطيل الإشعارات');
        await expect(toggle).toBeVisible();

        // Click to disable
        await toggle.click();

        // After toggle, the title changes to the opposite action
        await expect(page.getByTitle('تفعيل الإشعارات')).toBeVisible();
    });

    test('save button shows confirmation', async ({ page }) => {
        await page.goto('/settings');
        await expect(page.getByText(pageReady)).toBeVisible({ timeout: 15_000 });

        // Click save button
        await page.getByText('حفظ التغييرات').click();

        // Should show "تم الحفظ!" confirmation
        await expect(page.getByText('تم الحفظ!')).toBeVisible();

        // After 2s timeout it reverts — wait and check
        await expect(page.getByText('حفظ التغييرات')).toBeVisible({ timeout: 5_000 });
    });

});
