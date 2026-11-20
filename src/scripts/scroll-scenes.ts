import { clamp, openingSnapPoints, openingState } from './scene-math';
const hero = document.querySelector<HTMLElement>('.hero');
const media = window.matchMedia('(prefers-reduced-motion: no-preference)');
if (hero) {
  let frame = 0;
  let sceneLock = false;
  const stage = hero.querySelector<HTMLElement>('.hero-stage')!;
  const track = hero.querySelector<HTMLElement>('.reel-track')!;
  const cue = hero.querySelector<HTMLAnchorElement>('.arrival-cue')!;
  const reelLink = hero.querySelector<HTMLAnchorElement>('.reel-next')!;
  const update = () => {
    frame = 0;
    if (!media.matches) return;
    const bounds = hero.getBoundingClientRect();
    const p = clamp(
      -bounds.top / Math.max(1, hero.offsetHeight - stage.offsetHeight),
    );
    const state = openingState(p);
    cue.inert = state.mask > 0.8;
    reelLink.inert = state.reel < 0.9;
    for (const [key, value] of Object.entries(state))
      hero.style.setProperty(`--${key}`, String(value));
    hero.style.setProperty(
      '--travel-x',
      `${state.travel * Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08)}px`,
    );
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const moveToScene = (target: number, duration: number) => {
    const start = window.scrollY;
    const distance = target - start;
    const startedAt = performance.now();
    sceneLock = true;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      window.scrollTo(0, start + distance * eased);

      if (progress < 1) requestAnimationFrame(tick);
      else sceneLock = false;
    };

    requestAnimationFrame(tick);
  };
  const advanceScene = (event: WheelEvent) => {
    if (!media.matches || event.ctrlKey || !event.deltaY) return;

    const scrollDistance = hero.offsetHeight - stage.offsetHeight;
    const progress = -hero.getBoundingClientRect().top / scrollDistance;

    const lastHeldScene = openingSnapPoints.at(-1)!;
    if (progress < 0 || progress > lastHeldScene + 0.01) return;

    const direction = Math.sign(event.deltaY);
    const points =
      direction > 0 ? openingSnapPoints : [...openingSnapPoints].reverse();
    const targetProgress = points.find((point) =>
      direction > 0 ? point > progress + 0.01 : point < progress - 0.01,
    );

    if (targetProgress === undefined) return;

    event.preventDefault();
    if (sceneLock) return;

    moveToScene(
      hero.offsetTop + targetProgress * scrollDistance,
      targetProgress === 0.42 ? 900 : 650,
    );
  };
  const configure = () => {
    hero.classList.toggle('enhanced', media.matches);
    if (!media.matches) {
      hero.removeAttribute('style');
      cue.inert = false;
      reelLink.inert = false;
    }
    schedule();
  };
  window.addEventListener(
    'scroll',
    () => {
      schedule();
    },
    { passive: true },
  );
  window.addEventListener('wheel', advanceScene, { passive: false });
  window.addEventListener('resize', schedule, { passive: true });
  media.addEventListener('change', configure);
  configure();
}
