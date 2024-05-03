import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuroraHero } from "@/components/stars";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Defeat the Primeagen",
  description: "a game by Keegan Anglim & Daniel Johnson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
