import { clamp, openingState } from './scene-math';
const hero = document.querySelector<HTMLElement>('.hero');
const media = window.matchMedia(
  '(min-width: 900px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)',
);
if (hero) {
  let frame = 0;
  const track = hero.querySelector<HTMLElement>('.reel-track')!;
  const cue = hero.querySelector<HTMLAnchorElement>('.arrival-cue')!;
  const reelLink = hero.querySelector<HTMLAnchorElement>('.reel-next')!;
  const update = () => {
    frame = 0;
    if (!media.matches) return;
    const bounds = hero.getBoundingClientRect();
    const p = clamp(-bounds.top / (hero.offsetHeight - window.innerHeight));
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
  const configure = () => {
    hero.classList.toggle('enhanced', media.matches);
    if (!media.matches) {
      hero.removeAttribute('style');
      cue.inert = false;
      reelLink.inert = false;
    }
    schedule();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  media.addEventListener('change', configure);
  configure();
}
