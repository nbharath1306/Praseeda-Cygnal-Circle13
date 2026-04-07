"use client";

import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";
import { playTap } from "@/lib/sound";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  tiltMax?: number;
}

export function GlassCard({
  children,
  className = "",
  href,
  target,
  rel,
  tiltMax = 8,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    VanillaTilt.init(el, {
      max: tiltMax,
      speed: 400,
      scale: 1.02,
      perspective: 800,
      glare: true,
      "max-glare": 0.25,
      gyroscope: true,
      gyroscopeMinAngleX: -15,
      gyroscopeMaxAngleX: 15,
      gyroscopeMinAngleY: -15,
      gyroscopeMaxAngleY: 15,
      reset: true,
      "reset-to-start": true,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    });

    return () => {
      const t = el as HTMLElement & { vanillaTilt?: { destroy: () => void } };
      t.vanillaTilt?.destroy();
    };
  }, [tiltMax]);

  const inner = (
    <div ref={ref} className={`liquid-glass ${className}`}>
      <div className="relative z-[1] flex items-center w-full">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="block" onClick={playTap}>
        {inner}
      </a>
    );
  }

  return inner;
}
