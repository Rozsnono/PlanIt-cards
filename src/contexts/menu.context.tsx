"use client";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import StarBackground from "@/components/star-background";
import { usePathname } from "next/navigation";
import { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from 'react-query';


export interface Menu {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

export const MenuContext = createContext<Menu>({
    isOpen: true,
    setOpen: (isOpen: boolean) => { },
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setOpen] = useState(true);

    const path = usePathname();
    const queryClient = new QueryClient();



    return (
        <MenuContext.Provider value={{ isOpen, setOpen }}>
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
        </MenuContext.Provider>
    );
}