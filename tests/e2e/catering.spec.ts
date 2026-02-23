import { test, expect } from '@playwright/test';

test.describe('Catering Dashboard', () => {

    test('page loads with heading and stats cards', async ({ page }) => {
        await page.goto('/catering');

        // Main heading
        await expect(page.getByText('الإعاشة والتغذية')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('مراقبة جودة الغذاء وجداول الوجبات')).toBeVisible();

        // Stats cards (overview is default tab)
        await expect(page.getByText('نسبة الرضا')).toBeVisible();
        await expect(page.getByText('94%')).toBeVisible();
        await expect(page.getByText('التكلفة اليومية')).toBeVisible();
        await expect(page.getByText('5,220')).toBeVisible();
    });

    test('tab navigation switches content', async ({ page }) => {
        await page.goto('/catering');
        await expect(page.getByText('الإعاشة والتغذية')).toBeVisible({ timeout: 15_000 });

        // Default tab is overview — meal schedule preview and quality checklist preview visible
        await expect(page.getByText('جدول الوجبات الأسبوعي')).toBeVisible();
        await expect(page.getByText('قائمة فحص الجودة اليومي')).toBeVisible();

        // Click "جدول الوجبات" tab — full schedule
        await page.getByRole('button', { name: 'جدول الوجبات' }).click();
        await expect(page.getByText('الأحد')).toBeVisible();
        await expect(page.getByText('السبت')).toBeVisible();
        // Table headers
        await expect(page.getByText('الإفطار')).toBeVisible();
        await expect(page.getByText('الغداء')).toBeVisible();

        // Click "فحص الجودة" tab — full checklist
        await page.getByRole('button', { name: 'فحص الجودة' }).click();
        await expect(page.getByText('نظافة منطقة التحضير')).toBeVisible();
        await expect(page.getByText('نظافة الأواني والأدوات')).toBeVisible();
    });

    test('quality checklist items can be toggled', async ({ page }) => {
        await page.goto('/catering');
        await expect(page.getByText('الإعاشة والتغذية')).toBeVisible({ timeout: 15_000 });

        // Switch to quality tab for full checklist
        await page.getByRole('button', { name: 'فحص الجودة' }).click();

        // "نظافة ثلاجات التخزين" starts unchecked (Circle icon)
        const fridgeItem = page.getByText('نظافة ثلاجات التخزين');
        await expect(fridgeItem).toBeVisible();

        // Click to toggle — the row is the clickable div
        await fridgeItem.click();

        // After toggle, the item's row should now have a green checkmark
        // (CheckCircle2 replaces Circle after click)
        const row = fridgeItem.locator('..');
        await expect(row.locator('.text-green-500')).toBeVisible();
    });

    test('meal schedule shows 7-day menu', async ({ page }) => {
        await page.goto('/catering');
        await expect(page.getByText('الإعاشة والتغذية')).toBeVisible({ timeout: 15_000 });

        // Switch to schedule tab
        await page.getByRole('button', { name: 'جدول الوجبات' }).click();

        // All 7 days present
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        for (const day of days) {
            await expect(page.getByText(day, { exact: true })).toBeVisible();
        }

        // Sample meal content
        await expect(page.getByText('كبسة دجاج + سلطة + لبن')).toBeVisible();
    });

});
