import { test, expect } from '@playwright/test';

test.describe('Reports Dashboard', () => {

    test('reports center loads with two report cards', async ({ page }) => {
        await page.goto('/reports');

        // Main heading
        await expect(page.getByText('مركز التقارير الذكي')).toBeVisible({ timeout: 15_000 });

        // Two report cards
        await expect(page.getByText('تقرير الامتثال (ISO 9001)')).toBeVisible();
        await expect(page.getByText('تقرير الاستدامة والأثر')).toBeVisible();

        // Tags
        await expect(page.getByText('رسمي / ISO')).toBeVisible();
        await expect(page.getByText('استراتيجي / SROI')).toBeVisible();
    });

    test('clicking ISO report card opens the report', async ({ page }) => {
        await page.goto('/reports');
        await expect(page.getByText('مركز التقارير الذكي')).toBeVisible({ timeout: 15_000 });

        // Click ISO report card
        await page.getByText('تقرير الامتثال (ISO 9001)').click();

        // Back button and print mode label should appear
        await expect(page.getByText('العودة للتقارير')).toBeVisible();
        await expect(page.getByText('وضع المعاينة والطباعة')).toBeVisible();
    });

    test('back button returns to report selection', async ({ page }) => {
        await page.goto('/reports');
        await expect(page.getByText('مركز التقارير الذكي')).toBeVisible({ timeout: 15_000 });

        // Open a report
        await page.getByText('تقرير الاستدامة والأثر').click();
        await expect(page.getByText('العودة للتقارير')).toBeVisible();

        // Click back
        await page.getByText('العودة للتقارير').click();

        // Both cards visible again
        await expect(page.getByText('تقرير الامتثال (ISO 9001)')).toBeVisible();
        await expect(page.getByText('تقرير الاستدامة والأثر')).toBeVisible();
    });

});
