"use client";

/**
 * Apple-style haptic tap sound.
 *
 * Apple's UI sounds are soft, dampened clicks — not beeps.
 * Think: the sound when you tap a toggle in iOS Settings,
 * or the keyboard haptic. A muffled "tok" with instant
 * attack and very fast decay.
 *
 * Implementation: short noise burst → bandpass filter at
 * ~3500Hz → fast exponential gain decay. Creates a
 * percussive, woody click that feels physical.
 */

let ctx: AudioContext | null = null;

export function playTap() {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const duration = 0.04; // 40ms — very short

    // White noise source
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter — shapes the noise into a "tok"
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3500;
    filter.Q.value = 1.2;

    // Gain envelope — instant attack, fast decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Connect
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + duration);
  } catch {
    /* audio not available — silent fail */
  }
}
