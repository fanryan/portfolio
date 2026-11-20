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
  expect(mobile[0].width).toBeLessThanOrEqual(390 * 0.82 + 1);
  expect(mobile[1].width).toBeLessThanOrEqual(390 * 0.47 + 1);
  expect(mobile[2].width).toBeLessThanOrEqual(390 * 0.82 + 1);

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

test('desktop wheel gestures hold at the name reveal and introduction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const sceneScrollDistance = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>('.hero')!;
    const stage = hero.querySelector<HTMLElement>('.hero-stage')!;
    return hero.offsetHeight - stage.offsetHeight;
  });

  await page.mouse.wheel(0, 2400);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(sceneScrollDistance * 0.23 - 10);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThan(sceneScrollDistance * 0.23 + 10);

  await page.waitForTimeout(100);
  await page.mouse.wheel(0, 2400);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(sceneScrollDistance * 0.42 - 10);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThan(sceneScrollDistance * 0.42 + 10);
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

test('company logos share one consistent size on desktop and mobile', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/#experience');
    const logoBoxes = await page
      .locator('.company-logo')
      .evaluateAll((logos: HTMLImageElement[]) =>
        logos.map((logo) => {
          const rect = logo.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }),
      );

    expect(logoBoxes).toHaveLength(4);
    logoBoxes.forEach((box) => {
      expect(box.width).toBeCloseTo(logoBoxes[0].width, 1);
      expect(box.height).toBeCloseTo(logoBoxes[0].height, 1);
    });
  }
});

test('project carousel snaps, cycles, and stays within the viewport', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`/?project-carousel=${viewport.width}#projects`);

    const carousel = page.locator('[data-project-carousel]');
    const next = carousel.getByRole('button', { name: 'Next project' });
    const activeProject = carousel.locator('.project.is-active h3');

    await expect(activeProject).toHaveText('PayCore');
    const framing = await carousel.evaluate((element) => {
      const viewport = element.querySelector('.project-viewport')!;
      const active = element.querySelector<HTMLElement>('.project.is-active')!;
      const before = element.querySelector<HTMLElement>('.project.is-before')!;
      const after = element.querySelector<HTMLElement>('.project.is-after')!;
      const viewportRect = viewport.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const beforeRect = before.getBoundingClientRect();
      const afterRect = after.getBoundingClientRect();
      return {
        activeCenter: activeRect.left + activeRect.width / 2,
        viewportCenter: viewportRect.left + viewportRect.width / 2,
        beforeRight: beforeRect.right,
        afterLeft: afterRect.left,
        viewportLeft: viewportRect.left,
        viewportRight: viewportRect.right,
      };
    });
    expect(framing.activeCenter).toBeCloseTo(framing.viewportCenter, 0);
    expect(framing.beforeRight).toBeGreaterThan(framing.viewportLeft);
    expect(framing.afterLeft).toBeLessThan(framing.viewportRight);
    await next.click();
    await expect(activeProject).toHaveText('LedgerFlow');
    await page.waitForTimeout(550);
    await next.click();
    await expect(activeProject).toHaveText('NUSpot');
    await page.waitForTimeout(550);
    await next.click();
    await expect(activeProject).toHaveText('PayCore');
    await page.waitForTimeout(550);
    await expect(carousel.locator('.project.is-active')).not.toHaveAttribute(
      'aria-hidden',
      'true',
    );

    if (viewport.width === 390) {
      await carousel.locator('.project-viewport').scrollIntoViewIfNeeded();
      const box = await carousel.locator('.project-viewport').boundingBox();
      if (!box) throw new Error('Project carousel viewport is not visible');
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.4);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.4);
      await page.mouse.up();
      await expect(activeProject).toHaveText('LedgerFlow');
    }

    const bounds = await carousel
      .locator('.project-viewport')
      .evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          viewportWidth: innerWidth,
        };
      });
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth);
  }
});

test('project visuals share a fixed uncropped frame', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`/?project-format=${viewport.width}#projects`);

    const ratios = await page
      .locator('.project-track > .project:not([aria-hidden])')
      .evaluateAll((projects: HTMLElement[]) =>
        projects.map((project) => {
          const media = project.querySelector<HTMLElement>(
            '.project-visual, .project-screenshot img',
          )!;
          const rect = media.getBoundingClientRect();
          return rect.width / rect.height;
        }),
      );

    expect(ratios).toHaveLength(3);
    ratios.forEach((ratio) => expect(ratio).toBeCloseTo(4 / 3, 1));
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
