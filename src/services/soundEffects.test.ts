import test from 'node:test';
import assert from 'node:assert/strict';
import { soundEffects } from './soundEffects';

test('soundEffects: playDing does not throw in any environment', () => {
  assert.doesNotThrow(() => {
    soundEffects.playDing(false);
  });
  assert.doesNotThrow(() => {
    soundEffects.playDing(true);
  });
});

test('soundEffects: playAchievementChime does not throw in any environment', () => {
  assert.doesNotThrow(() => {
    soundEffects.playAchievementChime(false);
  });
  assert.doesNotThrow(() => {
    soundEffects.playAchievementChime(true);
  });
});
