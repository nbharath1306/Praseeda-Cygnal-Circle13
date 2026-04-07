"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";
import type { TeamMember } from "@/data/types";
import { renderIcon } from "@/lib/icons";
import { playTap } from "@/lib/sound";

const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

const materialize = {
  hidden: { opacity: 0, scale: 0.96, y: 8, filter: "brightness(1.5) blur(4px)" },
  visible: { opacity: 1, scale: 1, y: 0, filter: "brightness(1) blur(0px)" },
};

function initTilt(el: HTMLElement, opts: Record<string, unknown>) {
  VanillaTilt.init(el, opts);
  return () => {
    const t = el as HTMLElement & { vanillaTilt?: { destroy: () => void } };
    t.vanillaTilt?.destroy();
  };
}

export function ProfileHero({ member }: { member: TeamMember }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const photoRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const ring = photoRingRef.current;
    const cleanups: (() => void)[] = [];

    if (panel) {
      cleanups.push(initTilt(panel, {
        max: 5, speed: 600, scale: 1.01, perspective: 1000,
        glare: true, "max-glare": 0.18,
        gyroscope: true, gyroscopeMinAngleX: -12, gyroscopeMaxAngleX: 12,
        gyroscopeMinAngleY: -12, gyroscopeMaxAngleY: 12,
        reset: true, "reset-to-start": true,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      }));
    }

    // Glass ring on photo tilts independently — subtle, faster
    if (ring) {
      cleanups.push(initTilt(ring, {
        max: 12, speed: 400, scale: 1.0, perspective: 600,
        glare: true, "max-glare": 0.35,
        gyroscope: true, gyroscopeMinAngleX: -15, gyroscopeMaxAngleX: 15,
        gyroscopeMinAngleY: -15, gyroscopeMaxAngleY: 15,
        reset: true, "reset-to-start": true,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      }));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        variants={materialize}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.8, ease }}
        className="w-full"
      >
        <div
          ref={panelRef}
          className="liquid-glass-panel w-full px-7 pt-10 pb-8 flex flex-col items-center text-center"
        >
          {/* Photo with liquid glass ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease }}
          >
            <div
              ref={photoRingRef}
              className="glass-photo-ring"
            >
              <div className="w-[84px] h-[84px] rounded-full overflow-hidden">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={84}
                  height={84}
                  priority
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease }}
            className="mt-5 text-[34px] font-bold text-white leading-[1.06]"
            style={{ letterSpacing: "0.374px" }}
          >
            {member.name}
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2, ease }}
            className="mt-1 text-[15px] font-normal"
            style={{ letterSpacing: "-0.24px", color: "rgba(235, 235, 245, 0.6)" }}
          >
            {member.title} · {member.company}
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3, ease }}
            className="mt-4 text-[15px] font-normal max-w-[300px] leading-[1.47]"
            style={{ letterSpacing: "-0.24px", color: "rgba(235, 235, 245, 0.3)" }}
          >
            {member.bio}
          </motion.p>

          {/* Social icons — single glass pill bar with separators */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4, ease }}
            className="mt-6 w-full"
          >
            <div
              className="flex items-center rounded-[16px] overflow-hidden"
              style={{
                background: "rgba(120, 120, 128, 0.12)",
                border: "0.5px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.10), inset 0 0 10px -4px rgba(255,255,255,0.15)",
              }}
            >
              {member.socials.map((social, i) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  onClick={playTap}
                  className="
                    flex-1 flex items-center justify-center
                    h-[44px] text-white/50
                    hover:text-white hover:bg-white/[0.06]
                    active:bg-white/[0.03] active:scale-95
                    transition-all duration-150
                  "
                  style={i < member.socials.length - 1 ? { borderRight: "0.5px solid rgba(255,255,255,0.08)" } : {}}
                >
                  {renderIcon(social.icon, { size: 17 })}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Status */}
      {member.status && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5, ease }}
          className="mt-5 flex items-center gap-2"
        >
          <span className="w-[6px] h-[6px] rounded-full bg-[#30D158] pulse-alive" />
          <span className="text-[13px] font-normal" style={{ letterSpacing: "-0.08px", color: "rgba(235, 235, 245, 0.3)" }}>
            {member.status}
          </span>
        </motion.div>
      )}
    </div>
  );
}
