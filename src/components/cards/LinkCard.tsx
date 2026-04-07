"use client";

import { renderIcon } from "@/lib/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Link } from "@/data/types";

export function LinkCard({ link }: { link: Link }) {
  return (
    <GlassCard
      href={link.url}
      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="gap-3.5 px-5 py-4"
    >
      {/* Icon — iOS systemFill background */}
      <div
        className="shrink-0 w-[38px] h-[38px] rounded-[12px] flex items-center justify-center"
        style={{ background: "rgba(120, 120, 128, 0.18)" }}
      >
        {renderIcon(link.icon, {
          size: 18,
          className: "text-[#0A84FF]",
        })}
      </div>

      {/* Text — iOS Body + Subheadline */}
      <div className="flex-1 min-w-0">
        <span
          className="text-[17px] font-normal block leading-[22px] text-white"
          style={{ letterSpacing: "-0.408px" }}
        >
          {link.label}
        </span>
        {link.description && (
          <span
            className="text-[13px] font-normal block mt-0.5 leading-[18px]"
            style={{ letterSpacing: "-0.08px", color: "rgba(235, 235, 245, 0.3)" }}
          >
            {link.description}
          </span>
        )}
      </div>

      {/* iOS disclosure indicator */}
      <svg width="8" height="13" viewBox="0 0 8 13" fill="none" className="shrink-0">
        <path d="M1.5 1.5L6.5 6.5L1.5 11.5" stroke="rgba(235,235,245,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </GlassCard>
  );
}
