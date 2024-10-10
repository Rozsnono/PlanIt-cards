
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "./tailwind.css";
import "./stars.scss";

import { Providers } from "@/contexts/providers";
import Transition from "@/transitions/Transition";

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
        <Transition>
          <div className="fixed top-0 left-0 w-screen h-screen bg-zinc-800 z-[1000]"></div>
        </Transition>
        {children}
      </Providers>
    </html>
  );
}
