import { TeamMember } from "./types";

const praseeda: TeamMember = {
  slug: "praseeda",
  name: "Praseeda P Rao",
  title: "CMO",
  company: "Circle13",
  bio: "Designing experiences, building brands, and turning ideas into reality.",
  photo: "/images/team/praseeda.jpeg",
  coverPhoto: "/images/team/praseeda-cover.jpeg",
  status: "Creating something beautiful",
  theme: "royal",
  socials: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/praseeda-rao-18b938313/", icon: "Linkedin" },
    { platform: "WhatsApp", url: "https://wa.me/917338089226", icon: "WhatsApp" },
    { platform: "Instagram", url: "https://www.instagram.com/praseedarao?igsh=MWlsNncydnJpZXhtZA==", icon: "Instagram" },
    { platform: "Email", url: "mailto:praseedarao4@gmail.com", icon: "Mail" },
  ],
  sections: [
    {
      id: "ventures",
      title: "Ventures",
      links: [
        {
          label: "Circle13",
          url: "https://circle13.space",
          icon: "Globe",
          description: "Where ideas become reality",
        },
        {
          label: "Build Labs",
          url: "https://buildlabs.circle13.space",
          icon: "Rocket",
          description: "Where ideas become products",
        },
      ],
    },
    {
      id: "connect",
      title: "Connect",
      links: [
        {
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/praseeda-rao-18b938313/",
          icon: "Linkedin",
          description: "Praseeda P Rao",
        },
        {
          label: "Instagram",
          url: "https://www.instagram.com/praseedarao?igsh=MWlsNncydnJpZXhtZA==",
          icon: "Instagram",
          description: "@praseedarao",
        },
        {
          label: "Email",
          url: "mailto:praseedarao4@gmail.com",
          icon: "Mail",
          description: "praseedarao4@gmail.com",
        },
      ],
    },
  ],
  products: [],
};

export default praseeda;
