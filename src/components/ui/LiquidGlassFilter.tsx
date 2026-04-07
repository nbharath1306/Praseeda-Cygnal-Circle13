"use client";

/**
 * SVG filter for Liquid Glass distortion.
 *
 * Based on liquid-glass.pro implementation:
 * - feTurbulence: fractal noise for organic distortion
 * - feGaussianBlur: smooth the turbulence
 * - feDisplacementMap: warp content through the noise
 *
 * This creates the visible edge warping/lensing that makes
 * it look like real curved glass, not just blur.
 */
export function LiquidGlassFilter() {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* Card-sized distortion */}
        <filter id="liquid-glass-card" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.04"
            numOctaves="3"
            seed="1"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="smooth-noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smooth-noise"
            scale="35"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Panel-sized distortion — gentler for larger surfaces */}
        <filter id="liquid-glass-panel" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.025"
            numOctaves="2"
            seed="2"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="4" result="smooth-noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smooth-noise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
