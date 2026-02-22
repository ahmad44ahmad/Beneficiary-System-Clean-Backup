import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {

    // Target only the desktop sidebar (mobile sidebar has class 'sidebar-drawer')
    const desktopSidebar = 'aside.desktop-only';

    test('sidebar renders with section headers', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });

        // Desktop sidebar should be visible
        const sidebar = page.locator(desktopSidebar);
        await expect(sidebar).toBeVisible();

        // Section headers are collapsible buttons in the nav
        await expect(sidebar.locator('button', { hasText: 'الرئيسية' })).toBeVisible();
        await expect(sidebar.locator('button', { hasText: 'الحوكمة والجودة' })).toBeVisible();
        await expect(sidebar.locator('button', { hasText: 'العمليات' })).toBeVisible();
    });

    test('expanding section and clicking nav link navigates correctly', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });

        const sidebar = page.locator(desktopSidebar);

        // Expand "الحوكمة والجودة" section
        await sidebar.locator('button', { hasText: 'الحوكمة والجودة' }).click();

        // Click "درع السلامة (IPC)" nav link
        await sidebar.getByText('درع السلامة (IPC)').click();
        await expect(page).toHaveURL(/\/ipc/);

        // Verify IPC page content loaded
        await expect(page.getByText('درع السلامة')).toBeVisible({ timeout: 15_000 });
    });

    test('expanding operations section navigates to catering', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page.getByText('لوحة القياس التنفيذية')).toBeVisible({ timeout: 15_000 });

        const sidebar = page.locator(desktopSidebar);

        // Expand "العمليات" section
        await sidebar.locator('button', { hasText: 'العمليات' }).click();

        // Click "الإعاشة" (Catering) nav link
        await sidebar.getByText('الإعاشة').click();
        await expect(page).toHaveURL(/\/catering/);
    });

    test('active nav link has highlighted style', async ({ page }) => {
        // Navigate directly to IPC page
        await page.goto('/ipc');
        await expect(page.getByText('درع السلامة')).toBeVisible({ timeout: 15_000 });

        const sidebar = page.locator(desktopSidebar);

        // Expand the governance section to see the IPC link
        await sidebar.locator('button', { hasText: 'الحوكمة والجودة' }).click();

        // The IPC NavLink should have the active class
        const ipcLink = sidebar.locator('a[href="/ipc"]');
        await expect(ipcLink).toHaveClass(/bg-hrsd-teal/);
    });

});
