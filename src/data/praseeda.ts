import { TeamMember } from "./types";

const praseeda: TeamMember = {
  slug: "praseeda",
  name: "Praseeda",
  title: "Title Here",
  company: "Circle13",
  bio: "Add your bio here.",
  photo: "/images/team/praseeda.jpeg",
  coverPhoto: "/images/team/praseeda-cover.jpeg",
  status: "Building something great",
  theme: "midnight",
  socials: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/praseeda", icon: "Linkedin" },
    { platform: "Instagram", url: "https://instagram.com/praseeda", icon: "Instagram" },
    { platform: "Email", url: "mailto:praseeda@circle13.space", icon: "Mail" },
  ],
  sections: [
    {
      id: "work",
      title: "Work",
      links: [
        {
          label: "Circle13",
          url: "https://circle13.space",
          icon: "Globe",
          description: "circle13.space",
        },
      ],
    },
    {
      id: "connect",
      title: "Connect",
      links: [
        {
          label: "Instagram",
          url: "https://instagram.com/praseeda",
          icon: "Instagram",
          description: "@praseeda",
        },
        {
          label: "Email",
          url: "mailto:praseeda@circle13.space",
          icon: "Mail",
          description: "praseeda@circle13.space",
        },
      ],
    },
  ],
  products: [],
};

export default praseeda;
