import { icons } from "lucide-react";
import { createElement } from "react";

/**
 * Custom brand SVG icons that Lucide doesn't include.
 * All are 24x24 viewBox, stroke-based to match Lucide style.
 */
const brandIcons: Record<string, (props: { size?: number; className?: string }) => React.ReactElement> = {
  Linkedin: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Instagram: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Twitter: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Threads: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.711-.073 1.026-.32 1.927-.736 2.697-.56 1.035-1.373 1.828-2.416 2.356-1.025.52-2.21.762-3.52.72-1.627-.053-2.953-.591-3.942-1.6-.862-.879-1.34-2.05-1.344-3.3.01-1.63.74-3.064 2.058-4.034 1.19-.877 2.783-1.36 4.486-1.36.795 0 1.563.083 2.295.246.003-.87-.07-1.638-.261-2.313l2.07-.458c.263 1.04.357 2.2.283 3.466a9.5 9.5 0 0 1 2.728 1.818c1.074 1.078 1.727 2.423 1.94 3.998.223 1.657-.183 3.263-1.14 4.522-1.2 1.58-3.157 2.46-5.67 2.546h-.013z" />
    </svg>
  ),
  WhatsApp: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  ),
};

/**
 * Resolve an icon by name.
 * Checks custom brand icons first, then falls back to Lucide icons map.
 */
export function renderIcon(
  name: string,
  { size = 20, strokeWidth = 1.8, className = "" }: { size?: number; strokeWidth?: number; className?: string } = {}
): React.ReactElement | null {
  // Check brand icons first
  const BrandIcon = brandIcons[name];
  if (BrandIcon) {
    return <BrandIcon size={size} className={className} />;
  }

  // Fall back to Lucide icons
  const lucideIcon = icons[name as keyof typeof icons];
  if (lucideIcon) {
    return createElement(lucideIcon, {
      size,
      strokeWidth,
      className,
    } as React.SVGAttributes<SVGElement>);
  }

  return null;
}
