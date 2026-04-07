import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-body",
});

// Aliases for backward compat
export const instrumentSerif = satoshi;
export const inter = satoshi;
