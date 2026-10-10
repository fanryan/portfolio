import { expect, test } from '@playwright/test';

type HeroFigureMetrics = {
  width: number;
  height: number;
  ratio: number;
};

async function readHeroFigureRatios(
  page: any,
  width: number,
  height: number,
): Promise<HeroFigureMetrics[]> {
  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('.opening-reel').scrollIntoViewIfNeeded();

  return page
    .locator('.reel-track figure')
    .evaluateAll((figures: HTMLElement[]) =>
      figures.map((figure: HTMLElement) => {
        const rect = figure.getBoundingClientRect();
        const ratio = rect.width / rect.height;
        return {
          width: rect.width,
          height: rect.height,
          ratio,
        } satisfies HeroFigureMetrics;
      }),
    );
}

test('hero card proportions stay visually consistent between mobile and desktop', async ({
  page,
}) => {
  const mobile = await readHeroFigureRatios(page, 390, 844);
  const desktop = await readHeroFigureRatios(page, 1440, 900);

  expect(mobile.length).toBeGreaterThan(0);
  expect(desktop.length).toBeGreaterThan(0);

  const mobileMinRatio = Math.min(...mobile.map((item) => item.ratio));
  const mobileMaxRatio = Math.max(...mobile.map((item) => item.ratio));
  const desktopMinRatio = Math.min(...desktop.map((item) => item.ratio));
  const desktopMaxRatio = Math.max(...desktop.map((item) => item.ratio));

  expect(mobileMinRatio).toBeGreaterThan(0.45);
  expect(mobileMaxRatio).toBeLessThan(1.2);
  expect(desktopMinRatio).toBeGreaterThan(0.65);
  expect(desktopMaxRatio).toBeLessThan(2.0);
});
