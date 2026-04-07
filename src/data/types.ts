export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export type ThemeId =
  | "noir"       // Dark + gold (default)
  | "midnight"   // Dark + icy blue
  | "ember"      // Dark + warm orange/red
  | "forest"     // Dark + emerald green
  | "royal"      // Dark + violet/purple
  | "ivory"      // Light + dark text
  | "monochrome"; // Pure black & white

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  photo: string;
  coverPhoto?: string;
  status?: string;
  theme?: ThemeId;
  socials: SocialLink[];
  sections: LinkSection[];
  products?: Product[];
}

export interface LinkSection {
  id: string;
  title: string;
  links: Link[];
}

export interface Link {
  label: string;
  url: string;
  icon: string;
  description?: string;
  isPrimary?: boolean;
}

export interface Product {
  name: string;
  tagline: string;
  url: string;
  logo?: string;
  status?: "Coming Soon" | "Live" | "Beta";
}
