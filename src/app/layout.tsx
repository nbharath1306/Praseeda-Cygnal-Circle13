import type { Metadata } from "next";
import { satoshi } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Praseeda P Rao — Circle13",
  description: "Connect with Praseeda P Rao. Co-Founder at Circle13.",
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
