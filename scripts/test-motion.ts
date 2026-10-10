import assert from 'node:assert/strict';
import { openingState, clamp } from '../src/scripts/scene-math.ts';
assert.equal(clamp(-1), 0);
assert.equal(clamp(2), 1);
assert.deepEqual(openingState(0), {
  mask: 0,
  nameExit: 0,
  intro: 0,
  reel: 0,
  travel: 0,
});
assert.equal(
  openingState(0.24).mask,
  1,
  'Portrait must finish revealing before intro',
);
assert.equal(
  openingState(0.42).intro,
  1,
  'Introduction needs a fully visible reading interval',
);
assert.equal(
  openingState(0.62).reel,
  1,
  'Reel must be visible before horizontal travel',
);
assert.equal(openingState(0.62).travel, 0);
assert.equal(openingState(1).travel, 1, 'Final photo must be reached');
for (let i = 0; i <= 1000; i++) {
  const state = openingState(i / 1000);
  for (const value of Object.values(state)) assert(value >= 0 && value <= 1);
  if (i > 0)
    assert(
      state.travel >= openingState((i - 1) / 1000).travel,
      'Forward scroll cannot reverse reel',
    );
}
console.log(
  'Motion checks passed: scene boundaries, readable intervals, bounded values, monotonic travel.',
);
