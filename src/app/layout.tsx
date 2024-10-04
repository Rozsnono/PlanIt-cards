
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "./tailwind.css";
import "./stars.scss";
import { MenuProvider } from "@/contexts/menu.context";
import { UserProvider } from "@/contexts/user.context";

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
      <MenuProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </MenuProvider>
    </html>
  );
}
