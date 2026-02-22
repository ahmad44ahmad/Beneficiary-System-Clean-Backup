import { test, expect } from '@playwright/test';

test.describe('Executive Dashboard', () => {

    test('dashboard loads with KPI cards', async ({ page }) => {
        await page.goto('/dashboard');

        // Main heading
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });

        // 4 KPI cards are visible with their labels
        await expect(page.getByText('المستفيدين النشطين')).toBeVisible();
        await expect(page.getByText('نسبة تغطية الخطط')).toBeVisible();
        await expect(page.getByText('متوسط إنجاز الأهداف')).toBeVisible();
        await expect(page.getByText('حالات حرجة (High Risk)')).toBeVisible();
    });

    test('department performance section renders', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });

        // Department performance heading
        await expect(page.getByText('أداء الأقسام (معدل إنجاز الأهداف)')).toBeVisible();
    });

    test('critical alerts section shows warning', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });

        // Critical alert text is visible
        await expect(page.getByText('يتطلب تدخل فوري')).toBeVisible();
    });

});
