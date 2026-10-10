export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const phase = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));
export const ease = (value: number) => value * value * (3 - 2 * value);
export function openingState(progress: number) {
  return {
    mask: ease(phase(progress, 0.04, 0.23)),
    nameExit: ease(phase(progress, 0.26, 0.37)),
    intro:
      ease(phase(progress, 0.28, 0.39)) *
      (1 - ease(phase(progress, 0.46, 0.56))),
    reel: ease(phase(progress, 0.49, 0.61)),
    travel: ease(phase(progress, 0.63, 0.98)),
  };
}
