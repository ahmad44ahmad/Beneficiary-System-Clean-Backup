import { test, expect } from '@playwright/test';

test.describe('Empowerment Dashboard', () => {

    test('page loads with heading and stats cards', async ({ page }) => {
        await page.goto('/empowerment');

        // Main heading
        await expect(page.getByText('محرك التمكين')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('إدارة الأهداف التأهيلية الذكية (SMART)')).toBeVisible();

        // 4 stats cards
        await expect(page.getByText('إجمالي الأهداف')).toBeVisible();
        await expect(page.getByText('أهداف مُحققة')).toBeVisible();
        await expect(page.getByText('قيد التنفيذ').first()).toBeVisible();
        await expect(page.getByText('متوسط التقدم')).toBeVisible();
    });

    test('goal cards render from demo data', async ({ page }) => {
        await page.goto('/empowerment');
        await expect(page.getByText('محرك التمكين')).toBeVisible({ timeout: 15_000 });

        // DEMO_GOALS contain 3 goals — verify they render
        await expect(page.getByText('المشي باستقلالية لمسافة 50 متر')).toBeVisible();
        await expect(page.getByText('ارتداء الملابس العلوية باستقلالية')).toBeVisible();
        await expect(page.getByText('نطق 20 كلمة جديدة بوضوح')).toBeVisible();
    });

    test('status filter dropdown filters goals', async ({ page }) => {
        await page.goto('/empowerment');
        await expect(page.getByText('محرك التمكين')).toBeVisible({ timeout: 15_000 });

        // All 3 goals visible initially
        await expect(page.getByText('المشي باستقلالية لمسافة 50 متر')).toBeVisible();

        // Filter by "مخطط" (planned) — no demo goals have this status
        // Scope to the status filter select (not the header view-switcher)
        const statusFilter = page.locator('select', { hasText: 'جميع الحالات' });
        await statusFilter.selectOption('planned');
        await expect(page.getByText('لا توجد أهداف مطابقة')).toBeVisible();

        // Reset to all
        await statusFilter.selectOption('all');
        await expect(page.getByText('المشي باستقلالية لمسافة 50 متر')).toBeVisible();
    });

});
