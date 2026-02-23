import { test, expect } from '@playwright/test';

test.describe('Navigation & App Loading', () => {

    test('welcome page loads with Basira branding', async ({ page }) => {
        await page.goto('/');
        // The welcome page displays "بصيرة" heading
        await expect(page.getByText('بصيرة', { exact: true })).toBeVisible({ timeout: 15_000 });
    });

    test('dashboard page is accessible', async ({ page }) => {
        await page.goto('/dashboard');
        // Wait for dashboard heading to render (replaces flaky networkidle)
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });
    });

    test('IPC dashboard is accessible', async ({ page }) => {
        await page.goto('/ipc');
        // IPC dashboard heading is "درع السلامة"
        await expect(page.getByText('درع السلامة')).toBeVisible({ timeout: 15_000 });
    });

    test('incident report form loads via lazy route', async ({ page }) => {
        await page.goto('/ipc/incident/new');
        // Wait for Suspense to resolve and form to render
        await expect(page.getByText('الإبلاغ عن حادثة عدوى')).toBeVisible({ timeout: 15_000 });
        // Verify category buttons are present (form fully loaded)
        await expect(page.getByText('عدوى مؤكدة')).toBeVisible();
    });

});
