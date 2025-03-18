
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "./tailwind.css";
import "./stars.scss";

import { Providers } from "@/contexts/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'PlanIt - Play your cards right',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <Providers>
        {children}
      </Providers>
    </html>
  );
}
