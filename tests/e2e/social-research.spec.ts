import { test, expect } from '@playwright/test';

test.describe('Social Research Wizard', () => {

    test('wizard loads with step 1 and beneficiary dropdown', async ({ page }) => {
        await page.goto('/social-research');

        // Page heading
        await expect(page.getByText('بحث اجتماعي جديد')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('توثيق الحالة الاجتماعية للمستفيد لضمان تقديم الرعاية المناسبة')).toBeVisible();

        // Step 1 title in stepper
        await expect(page.getByText('بيانات المستفيد والولي')).toBeVisible();

        // Beneficiary dropdown is present in the form
        const dropdown = page.getByRole('main').locator('select').first();
        await expect(dropdown).toBeVisible();

        // Next button should be disabled (no beneficiary selected)
        const nextButton = page.getByRole('button', { name: 'التالي' });
        await expect(nextButton).toBeDisabled();
    });

    test('selecting beneficiary enables navigation between steps', async ({ page }) => {
        await page.goto('/social-research');
        await expect(page.getByText('بحث اجتماعي جديد')).toBeVisible({ timeout: 15_000 });

        // Select first beneficiary from the form dropdown (not the header select)
        const dropdown = page.getByRole('main').locator('select').first();
        await dropdown.selectOption({ index: 1 });

        // Next button should now be enabled
        const nextButton = page.getByRole('button', { name: 'التالي' });
        await expect(nextButton).toBeEnabled({ timeout: 5_000 });

        // Navigate to step 2
        await nextButton.click();
        await expect(page.getByText('حالة الأب')).toBeVisible();
        await expect(page.getByText('حالة الأم')).toBeVisible();

        // Navigate to step 3
        await nextButton.click();
        await expect(page.getByText('نوع السكن')).toBeVisible();
        await expect(page.getByText('الحالة الاقتصادية')).toBeVisible();

        // Go back to step 2
        const prevButton = page.getByRole('button', { name: 'السابق' });
        await prevButton.click();
        await expect(page.getByText('حالة الأب')).toBeVisible();
    });

    test('step 4 shows save button', async ({ page }) => {
        await page.goto('/social-research');
        await expect(page.getByText('بحث اجتماعي جديد')).toBeVisible({ timeout: 15_000 });

        // Select a beneficiary from the form dropdown
        const dropdown = page.getByRole('main').locator('select').first();
        await dropdown.selectOption({ index: 1 });

        // Navigate through all steps to step 4
        const nextButton = page.getByRole('button', { name: 'التالي' });
        await expect(nextButton).toBeEnabled({ timeout: 5_000 });
        await nextButton.click(); // → step 2
        await nextButton.click(); // → step 3
        await nextButton.click(); // → step 4

        // Step 4 content
        await expect(page.getByText('ملخص الباحث الاجتماعي')).toBeVisible();

        // Save button should be visible instead of Next
        await expect(page.getByRole('button', { name: 'حفظ واعتماد البحث' })).toBeVisible();
        // Next button should not be visible on last step
        await expect(nextButton).not.toBeVisible();
    });

});
