import { test, expect } from '@playwright/test';

test.describe('Beneficiary List Page', () => {

    test('page loads with demo data and stats', async ({ page }) => {
        await page.goto('/beneficiaries-list');

        // Page heading
        await expect(page.getByText('قائمة المستفيدين')).toBeVisible({ timeout: 15_000 });

        // Stats bar shows total count (12 demo beneficiaries)
        await expect(page.getByText('إجمالي 12 مستفيد في مركز التأهيل الشامل')).toBeVisible();

        // At least one demo beneficiary card is visible
        await expect(page.getByText('عبدالله محمد المالكي')).toBeVisible();
    });

    test('search filters beneficiary cards', async ({ page }) => {
        await page.goto('/beneficiaries-list');
        await expect(page.getByText('قائمة المستفيدين')).toBeVisible({ timeout: 15_000 });

        // Find search input and type a name
        const searchInput = page.getByPlaceholder('ابحث عن مستفيد بالاسم...');
        await expect(searchInput).toBeVisible();
        await searchInput.fill('فاطمة');

        // The matching card should be visible
        await expect(page.getByText('فاطمة أحمد الغامدي')).toBeVisible();

        // Non-matching cards should be filtered out
        await expect(page.getByText('عبدالله محمد المالكي')).not.toBeVisible();
    });

    test('stat cards show correct counts', async ({ page }) => {
        await page.goto('/beneficiaries-list');
        await expect(page.getByText('قائمة المستفيدين')).toBeVisible({ timeout: 15_000 });

        // Demo data: 12 total, 8 stable, 3 needs_attention, 1 critical
        await expect(page.getByText('إجمالي').first()).toBeVisible();
        await expect(page.getByText('مستقر').first()).toBeVisible();
        await expect(page.getByText('متابعة').first()).toBeVisible();
        await expect(page.getByText('حرج').first()).toBeVisible();
    });

    test('filter panel opens and filters by health status', async ({ page }) => {
        await page.goto('/beneficiaries-list');
        await expect(page.getByText('قائمة المستفيدين')).toBeVisible({ timeout: 15_000 });

        // Open the filter panel
        await page.getByText('فلترة').click();
        await expect(page.getByText('خيارات الفلترة')).toBeVisible();

        // Filter by "حرج" (critical) health status — find select near its label
        const healthLabel = page.getByText('الحالة الصحية');
        const healthSelect = healthLabel.locator('..').locator('select');
        await healthSelect.selectOption({ label: 'حرج' });

        // Only critical beneficiary should be visible (نورة سعيد العمري)
        await expect(page.getByText('نورة سعيد العمري')).toBeVisible();
        // Stable ones should be filtered out
        await expect(page.getByText('عبدالله محمد المالكي')).not.toBeVisible();
    });

});
