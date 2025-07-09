
import type { Metadata } from "next";
import { Genos, Inter, Orbitron } from "next/font/google";
import "./globals.scss";
import "./tailwind.css";
import "./stars.scss";

import { Providers } from "@/contexts/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'PlanIt - Play your cards right',
};

const orbitron = Orbitron({
  variable: "--font-orbitron-sans",
  subsets: ["latin"],
});

const genos = Genos({
  variable: "--font-genos-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <Providers className={`${orbitron.variable} ${genos.variable}`}>
        {children}
      </Providers>
    </html>
  );
}
