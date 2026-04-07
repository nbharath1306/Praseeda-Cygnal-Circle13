import type { Metadata } from "next";
import { satoshi } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Circle13 — Connect",
  description: "Circle13 team link hub. Connect, explore, and collaborate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className="min-h-dvh font-[family-name:var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
