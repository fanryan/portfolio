import { expect, test } from '@playwright/test';

type HeroFigureMetrics = {
  width: number;
  height: number;
  ratio: number;
};

async function readHeroImageRatios(
  page: any,
  width: number,
  height: number,
): Promise<HeroFigureMetrics[]> {
  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('.opening-reel').scrollIntoViewIfNeeded();

  return page
    .locator('.reel-track img')
    .evaluateAll((images: HTMLImageElement[]) =>
      images.map((image: HTMLImageElement) => {
        const rect = image.getBoundingClientRect();
        const ratio = rect.width / rect.height;
        return {
          width: rect.width,
          height: rect.height,
          ratio,
        } satisfies HeroFigureMetrics;
      }),
    );
}

test('hero reel keeps wide portrait wide framing on mobile and desktop', async ({
  page,
}) => {
  const mobile = await readHeroImageRatios(page, 390, 844);
  const desktop = await readHeroImageRatios(page, 1440, 900);

  expect(mobile).toHaveLength(3);
  expect(desktop).toHaveLength(3);

  for (const ratios of [mobile, desktop]) {
    expect(ratios[0].ratio).toBeCloseTo(4 / 3, 1);
    expect(ratios[1].ratio).toBeCloseTo(3 / 4, 1);
    expect(ratios[2].ratio).toBeCloseTo(4 / 3, 1);
  }

  await page.goto('/');
  await expect(page.locator('.reel-track figure').nth(0)).toContainText(
    'WITH THE TEAM',
  );
  await expect(page.locator('.reel-track figure').nth(1)).toContainText(
    'MONZA, ITALY',
  );
  await expect(page.locator('.reel-track figure').nth(2)).toContainText(
    'SECEDA, ITALY',
  );
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

    await expect(page.locator('.journal-photo a')).toHaveCount(0);
    await expect(page.locator('.photo-dialog')).toHaveCount(0);
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

test('plain text page shares the mobile header and content inset', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');
  const portfolioWordmarkX = await page
    .locator('.wordmark')
    .evaluate((element) => element.getBoundingClientRect().x);

  await page.goto('/plain');
  const plainWordmarkX = await page
    .locator('.recruiter-wordmark')
    .evaluate((element) => element.getBoundingClientRect().x);
  const plainContentX = await page
    .locator('.recruiter-intro > .eyebrow')
    .evaluate((element) => element.getBoundingClientRect().x);

  expect(plainWordmarkX).toBeCloseTo(portfolioWordmarkX, 1);
  expect(plainContentX).toBeCloseTo(plainWordmarkX, 1);
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
