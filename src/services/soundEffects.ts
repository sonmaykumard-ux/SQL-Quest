/**
 * Sound Effects Service using Web Audio API
 * Generates subtle, pleasant synthetic chimes with zero external asset dependencies.
 */

class SoundEffectsManager {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx && AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Subtle, clean 'ding' sound for lesson completion and sound testing.
   * Plays a gentle dual-harmonic bell chime (1046.5Hz & 2093Hz) with exponential decay.
   */
  playDing(enabled: boolean = true): void {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary chime oscillator (C6: 1046.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      // Gentle pitch bend upwards slightly to give a cheerful "ding"
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.08); // up to E6

      // Harmonic sparkle oscillator (E7: 2637 Hz) for crystalline resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2093.0, now); // C7

      // Gain envelopes: Subtle volume (0.12 max), gentle decay
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      // Connect nodes
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      // Start and stop
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      // Audio playback failure is always non-fatal
    }
  }

  /**
   * Sparkling celebratory chime when an achievement is unlocked.
   * 3-note ascending arpeggio (C6 -> E6 -> G6 -> C7).
   */
  playAchievementChime(enabled: boolean = true): void {
    if (!enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      const noteDelay = 0.09;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = now + idx * noteDelay;
        const duration = 0.45;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch {
      // non-fatal
    }
  }
}

export const soundEffects = new SoundEffectsManager();
