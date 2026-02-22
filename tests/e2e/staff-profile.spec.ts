import { test, expect } from '@playwright/test';

test.describe('Staff Profile', () => {

    test('profile renders with mock employee data', async ({ page }) => {
        await page.goto('/staff');

        // Staff name and role
        await expect(page.getByText('نايف بن عبدالله الغامدي')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('ممرض - جناح الذكور')).toBeVisible();

        // Contact info
        await expect(page.getByText('naif@example.com')).toBeVisible();
        await expect(page.getByText('0501234567')).toBeVisible();
    });

    test('gamification section shows badges and stats', async ({ page }) => {
        await page.goto('/staff');
        await expect(page.getByText('نايف بن عبدالله الغامدي')).toBeVisible({ timeout: 15_000 });

        // Badges section
        await expect(page.getByText('الشارات')).toBeVisible();
        await expect(page.getByText('نجم الالتزام')).toBeVisible();
        await expect(page.getByText('خبير الأدوية')).toBeVisible();
        await expect(page.getByText('حارس السلامة')).toBeVisible();

        // Statistics section
        await expect(page.getByText('إحصائيات')).toBeVisible();
        await expect(page.getByText('ورديات')).toBeVisible();
        await expect(page.getByText('أدوية', { exact: true })).toBeVisible();
        await expect(page.getByText('تقييمات')).toBeVisible();
        await expect(page.getByText('حوادث')).toBeVisible();
    });

    test('certifications section shows status indicators', async ({ page }) => {
        await page.goto('/staff');
        await expect(page.getByText('نايف بن عبدالله الغامدي')).toBeVisible({ timeout: 15_000 });

        // Certifications header
        await expect(page.getByText('الشهادات')).toBeVisible();

        // Certification names
        await expect(page.getByText('رخصة الهيئة السعودية')).toBeVisible();
        await expect(page.getByText('BLS - الإنعاش القلبي')).toBeVisible();
        await expect(page.getByText('إدارة الأدوية')).toBeVisible();

        // Status labels
        await expect(page.getByText('سارية')).toBeVisible();
        await expect(page.getByText('قاربت')).toBeVisible();
        await expect(page.getByText('منتهية')).toBeVisible();
    });

});
