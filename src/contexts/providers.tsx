"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MenuContext } from "./menu.context";
import StarBackground from "@/components/star-background";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Iplayer } from "@/interfaces/interface";
import { getUser } from "@/functions/user.function";
import { UserContext } from "./user.context";

export function Providers({ children }: { children: React.ReactNode }) {
    const [isOpen, setOpen] = useState(true);
    const [user, setUser] = useState<Iplayer | null>(getUser());

    const path = usePathname();
    const queryClient = new QueryClient();



    return (
        <MenuContext.Provider value={{ isOpen, setOpen }}>
            <UserContext.Provider value={{ user, setUser }}>

                <QueryClientProvider client={queryClient}>

                    <body className={`bg-zinc-800 pt-20 pr-4 ${!isOpen ? 'pl-4' : 'pl-52'} duration-200 relative`}>
                        <StarBackground></StarBackground>
                        {
                            !['register', 'login'].find(item => { return path.includes(item) }) &&
                            <>
                                <Navbar></Navbar>
                                <Sidebar></Sidebar>
                            </>
                        }
                        {children}
                    </body>
                </QueryClientProvider>
            </UserContext.Provider>
        </MenuContext.Provider>
    );
}