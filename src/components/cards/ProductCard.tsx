"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import type { Product } from "@/data/types";

const statusColor: Record<string, string> = {
  Live: "#30D158",
  Beta: "#64D2FF",
  "Coming Soon": "#FFD60A",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <GlassCard
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-5 py-4"
    >
      <div className="flex-1 flex items-center justify-between gap-3 w-full">
        <div className="min-w-0 flex-1">
          <span
            className="text-[17px] font-normal text-white leading-[22px]"
            style={{ letterSpacing: "-0.408px" }}
          >
            {product.name}
          </span>
          <p
            className="text-[13px] font-normal mt-0.5 leading-[18px]"
            style={{ letterSpacing: "-0.08px", color: "rgba(235, 235, 245, 0.3)" }}
          >
            {product.tagline}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2.5">
          {product.status && (
            <span
              className="text-[13px] font-medium"
              style={{ letterSpacing: "-0.08px", color: statusColor[product.status] ?? "rgba(235,235,245,0.3)" }}
            >
              {product.status}
            </span>
          )}
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M1.5 1.5L6.5 6.5L1.5 11.5" stroke="rgba(235,235,245,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </GlassCard>
  );
}
