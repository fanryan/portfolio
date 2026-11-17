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

  expect(mobileMinRatio).toBeGreaterThan(0.35);
  expect(mobileMaxRatio).toBeLessThan(1.7);
  expect(desktopMinRatio).toBeGreaterThan(0.65);
  expect(desktopMaxRatio).toBeLessThan(2.4);
});

test('reel heading clears the fixed header on desktop and mobile', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('.hero')!;
      const stage = hero.querySelector<HTMLElement>('.hero-stage')!;
      window.scrollTo(0, (hero.offsetHeight - stage.offsetHeight) * 0.72);
    });

    await expect
      .poll(() =>
        page
          .locator('.opening-reel')
          .evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).opacity),
          ),
      )
      .toBeGreaterThan(0.99);

    const positions = await page.evaluate(() => {
      const header = document.querySelector('.header')!.getBoundingClientRect();
      const heading = document
        .querySelector('.reel-heading')!
        .getBoundingClientRect();
      return { headerBottom: header.bottom, headingTop: heading.top };
    });
    expect(positions.headingTop).toBeGreaterThan(positions.headerBottom);
  }
});

test('personal photo thumbnails use a consistent 16:9 crop', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/#about');
    await page.locator('.journal-strip').scrollIntoViewIfNeeded();

    const ratios = await page
      .locator('.journal-photo img')
      .evaluateAll((images: HTMLImageElement[]) =>
        images.map((image) => {
          const rect = image.getBoundingClientRect();
          return rect.width / rect.height;
        }),
      );

    expect(ratios).toHaveLength(6);
    ratios.forEach((ratio) => expect(ratio).toBeCloseTo(16 / 9, 1));
  }
});

test('plain text view presents the portfolio content without the animated hero', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/plain');

  await expect(page.getByRole('heading', { name: 'Ryan Fan' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Selected projects' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Back to full site/ }),
  ).toBeVisible();
  await expect(page.locator('.hero')).toHaveCount(0);
});

test('exchange countries disclosure stays clear and in-bounds on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#about');

  const disclosure = page.locator('.exchange-countries');
  const summary = disclosure.locator('summary');
  const popover = disclosure.locator('.country-popover');

  await summary.scrollIntoViewIfNeeded();
  await expect(disclosure).not.toHaveAttribute('open', '');
  await expect
    .poll(() =>
      summary.evaluate((element) =>
        getComputedStyle(element, '::after').content.replaceAll('"', ''),
      ),
    )
    .toBe('↓');

  await summary.click();
  await expect(disclosure).toHaveAttribute('open', '');
  await expect
    .poll(() =>
      summary.evaluate((element) =>
        getComputedStyle(element, '::after').content.replaceAll('"', ''),
      ),
    )
    .toBe('↑');

  const bounds = await popover.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, viewportWidth: innerWidth };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth);
});
