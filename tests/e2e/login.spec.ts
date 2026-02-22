import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {

    test('login page renders with branding', async ({ page }) => {
        await page.goto('/login');
        // Assert login heading and branding
        await expect(page.getByText('تسجيل الدخول')).toBeVisible({ timeout: 15_000 });
        // Branding text appears in both mobile and desktop layouts; assert at least one is present
        await expect(page.getByText('نظام بصيرة').first()).toBeVisible();
    });

    test('credentials login navigates to dashboard', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByText('تسجيل الدخول')).toBeVisible({ timeout: 15_000 });

        // Fill credentials
        await page.getByPlaceholder('أدخل اسم المستخدم').fill('admin');
        await page.getByPlaceholder('أدخل كلمة المرور').fill('pass123');

        // Submit the form
        await page.getByRole('button', { name: 'دخول' }).click();

        // Wait for simulated login (1.5s delay) and navigation
        await page.waitForURL('**/dashboard', { timeout: 10_000 });
        expect(page.url()).toContain('/dashboard');
    });

    test('Nafath login method works', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByText('تسجيل الدخول')).toBeVisible({ timeout: 15_000 });

        // Switch to Nafath tab
        await page.getByText('نفاذ', { exact: true }).click();

        // Assert Nafath button is visible
        await expect(page.getByText('المتابعة بنفاذ')).toBeVisible();

        // Click Nafath login
        await page.getByText('المتابعة بنفاذ').click();

        // Wait for simulated login (2s delay) and navigation
        await page.waitForURL('**/dashboard', { timeout: 10_000 });
        expect(page.url()).toContain('/dashboard');
    });

    test('password visibility toggle works', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByText('تسجيل الدخول')).toBeVisible({ timeout: 15_000 });

        const passwordInput = page.getByPlaceholder('أدخل كلمة المرور');

        // Initially password is hidden
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click the eye toggle button (sibling of password input)
        const toggleButton = passwordInput.locator('..').locator('button');
        await toggleButton.click();

        // Password should now be visible
        await expect(passwordInput).toHaveAttribute('type', 'text');

        // Click again to hide
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

});
