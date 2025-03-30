"use client";
import { usePathname } from "next/navigation";
import { CSSProperties, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MenuContext } from "./menu.context";
import StarBackground from "@/components/star-background";
import Navbar from "@/components/navbar";
import { Iplayer } from "@/interfaces/interface";
import { getUser } from "@/functions/user.function";
import { UserContext } from "./user.context";
import Icon from "@/assets/icons";

export function Providers({ children }: { children: React.ReactNode }) {
    const [isOpen, setOpen] = useState(true);
    const [user, setUser] = useState<Iplayer | null>(getUser());

    const path = usePathname();
    const queryClient = new QueryClient();

    function getStyle(): CSSProperties | undefined {
        if (path.includes('observatory') || path.includes('login') || path.includes('register')) {
            return {}
        }
        if (path.includes('end') || path.includes('replay')) {
            return { backgroundColor: '#3f3f46a0', paddingTop: "5.5rem" }
        }
        if (path === "/" || path.includes('rummy') || path.includes('uno') || path.includes('solitaire')) {
            return { backgroundColor: '#3f3f46a0' }
        }
        return { backgroundColor: '#3f3f46a0', paddingTop: "5.5rem" }
    }


    return (
        <MenuContext.Provider value={{ isOpen, setOpen }}>
            <UserContext.Provider value={{ user, setUser }}>

                <QueryClientProvider client={queryClient}>

                    <body className={`bg-zinc-800 duration-200 relative h-screen`}>
                        <StarBackground></StarBackground>
                        {(path.includes('end')) && <Navbar></Navbar>}
                        {(!path.includes('login') && !path.includes('register') && !path.includes('rummy') && !path.includes('uno') && !path.includes('solitaire')) && <Navbar></Navbar>}
                        {(path.includes('rummy') || path.includes('uno') || path.includes('solitaire')) && !path.includes('end') && <Navbar clear></Navbar>}
                        {
                            (path.includes('rummy') || path.includes('uno') || path.includes('solitaire')) && !path.includes('end') &&
                            <div className="fixed right-4 top-4 z-50">
                                <button className="bg-zinc-600 text-zinc-100 p-2 px-2 rounded-full hover:bg-zinc-500 w-12 h-12 duration-200 flex items-center justify-center relative group">
                                    <div className="flex items-center justify-center z-50">
                                        <Icon name="info" />
                                    </div>

                                    <div className="absolute h-full top-0 flex items-center">
                                        <div className="bg-zinc-500 text-sm text-zinc-100 p-1 px-2 rounded-lg duration-200 flex items-center justify-center text-sm group-hover:-translate-x-2/3 -translate-x-1/4 opacity-0 group-hover:opacity-100">
                                            Need&nbsp;some&nbsp;help?
                                        </div>
                                    </div>
                                </button>
                            </div>
                        }
                        <main style={getStyle()} className={`h-full`}>
                            {children}
                        </main>
                    </body>
                </QueryClientProvider>
            </UserContext.Provider>
        </MenuContext.Provider>
    );
}