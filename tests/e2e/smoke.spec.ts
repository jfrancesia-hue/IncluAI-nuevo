import { test, expect } from '@playwright/test';

test.describe('Smoke — landing', () => {
  test('carga OK y muestra el CTA principal', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Planificá clases inclusivas'
    );
    await expect(page.getByRole('link', { name: /Crear mi primera guía/i })).toBeVisible();
  });

  test('el login está accesible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Iniciá sesión' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  });

  test('el registro muestra selector de tipo de usuario', async ({ page }) => {
    await page.goto('/registro');
    await expect(page.getByText('Soy docente')).toBeVisible();
    await expect(page.getByText('Soy familia')).toBeVisible();
    await expect(page.getByText('Soy profesional')).toBeVisible();
  });
});
