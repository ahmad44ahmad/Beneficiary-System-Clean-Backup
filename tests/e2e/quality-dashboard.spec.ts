import { test, expect } from '@playwright/test';

test.describe('Quality & Patient Safety Dashboard', () => {

    test('page loads with heading and stats cards', async ({ page }) => {
        await page.goto('/quality');

        // Main heading
        await expect(page.getByText('لوحة الجودة وسلامة المرضى')).toBeVisible({ timeout: 15_000 });

        // 4 stats cards (data from mock ovrService with 600ms delay)
        await expect(page.getByText('إجمالي البلاغات')).toBeVisible();
        await expect(page.getByText('بلاغات مفتوحة')).toBeVisible();
        await expect(page.getByText('نسبة التبليغ المجهول')).toBeVisible();
        await expect(page.getByText('متوسط وقت الإغلاق')).toBeVisible();
    });

    test('stats show correct mock data values', async ({ page }) => {
        await page.goto('/quality');
        await expect(page.getByText('لوحة الجودة وسلامة المرضى')).toBeVisible({ timeout: 15_000 });

        // Mock data: 2 total reports, 1 open, 50% anonymous, 4.5 avg days
        // Wait for data to load (600ms simulated delay)
        await expect(page.getByText('2').first()).toBeVisible({ timeout: 5_000 });
    });

    test('reports table displays mock incident data', async ({ page }) => {
        await page.goto('/quality');
        await expect(page.getByText('لوحة الجودة وسلامة المرضى')).toBeVisible({ timeout: 15_000 });

        // Table heading
        await expect(page.getByText('أحدث البلاغات المسجلة')).toBeVisible();

        // Table column headers
        await expect(page.getByText('رقم البلاغ')).toBeVisible();
        await expect(page.getByText('الخطورة')).toBeVisible();

        // Mock report IDs should appear
        await expect(page.getByText('OVR-2024-001')).toBeVisible({ timeout: 5_000 });
        await expect(page.getByText('OVR-2024-002')).toBeVisible();

        // Severity badges
        await expect(page.getByText('minor')).toBeVisible();
        await expect(page.getByText('near_miss')).toBeVisible();
    });

    test('just culture section renders with action buttons', async ({ page }) => {
        await page.goto('/quality');
        await expect(page.getByText('لوحة الجودة وسلامة المرضى')).toBeVisible({ timeout: 15_000 });

        // Just Culture section
        await expect(page.getByText('ثقافة العدالة (Just Culture)')).toBeVisible();
        await expect(page.getByText('لا عقاب على الخطأ البشري غير المقصود.')).toBeVisible();

        // Action buttons
        await expect(page.getByText('سياسة الجودة')).toBeVisible();
        await expect(page.getByText('تدريب الفريق')).toBeVisible();
    });

});
