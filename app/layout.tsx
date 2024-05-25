import type { Metadata } from "next";
import { Inter, Love_Light } from "next/font/google";
import "./globals.css";
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
      <body
        className={inter.className}
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {children}
      </body>
    </html>
  );
}
