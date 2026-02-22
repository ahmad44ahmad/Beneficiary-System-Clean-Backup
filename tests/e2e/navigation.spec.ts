import { test, expect } from '@playwright/test';

test.describe('Navigation & App Loading', () => {

    test('welcome page loads with Basira branding', async ({ page }) => {
        await page.goto('/');
        // The welcome page displays "بصيرة" heading
        await expect(page.getByText('بصيرة', { exact: true })).toBeVisible({ timeout: 15_000 });
    });

    test('dashboard page is accessible', async ({ page }) => {
        await page.goto('/dashboard');
        // Wait for lazy-loaded dashboard to render
        await page.waitForLoadState('networkidle');
        // Dashboard should have loaded (no longer showing loading spinner)
        await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 15_000 });
    });

    test('IPC dashboard is accessible', async ({ page }) => {
        await page.goto('/ipc');
        await page.waitForLoadState('networkidle');
        // IPC dashboard should render with its Arabic heading
        await expect(page.getByText('مكافحة العدوى', { exact: true })).toBeVisible({ timeout: 15_000 });
    });

    test('incident report form loads via lazy route', async ({ page }) => {
        await page.goto('/ipc/incident/new');
        // Wait for Suspense to resolve and form to render
        await expect(page.getByText('الإبلاغ عن حادثة عدوى')).toBeVisible({ timeout: 15_000 });
        // Verify category buttons are present (form fully loaded)
        await expect(page.getByText('عدوى مؤكدة')).toBeVisible();
    });

});
