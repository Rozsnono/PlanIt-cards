"use client";
import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MenuContext } from "./menu.context";
import StarBackground from "@/components/star-background";
import Navbar from "@/components/navbar";
import { Iplayer } from "@/interfaces/interface";
import { getUser, PlayerWebSocket } from "@/functions/user.function";
import { UserContext } from "./user.context";
import Icon from "@/assets/icons";
import { IP } from "@/enums/ip.enum";
import Help from "@/components/help/help.component";

export function Providers({ children, className }: { children: React.ReactNode, className?: string }) {
    const [isOpen, setOpen] = useState(true);
    const [user, setUser] = useState<Iplayer | null>(getUser());

    const notAllowedURLs = ['rummy', 'uno', 'solitaire', 'observatory', 'login', 'register'];

    const gameUrls = ['rummy', 'uno', 'solitaire', 'schnapps'];


    function setUserData(user: Iplayer | null) {
        setUser(user);
    }

    const path = usePathname();
    const queryClient = new QueryClient();

    function getStyle(): CSSProperties | undefined {
        if (path.includes('observatory') || path.includes('login') || path.includes('register')) {
            return { backgroundImage: 'linear-gradient(50deg,rgba(255, 255, 255, 0) 0%, rgba(226, 99, 255, 0.18) 20%, rgba(255, 255, 255, 0) 50%, rgba(206, 53, 255, 0.12) 85%, rgba(255, 255, 255, 0) 100%)' }
        }
        if (path.includes('end')) {
            return { backgroundImage: 'linear-gradient(50deg,rgba(255, 255, 255, 0) 0%, rgba(226, 99, 255, 0.18) 20%, rgba(255, 255, 255, 0) 50%, rgba(206, 53, 255, 0.12) 85%, rgba(255, 255, 255, 0) 100%)', paddingTop: "5.5rem" }
        }
        if (path === "/" || (gameUrls.find((url) => path.includes(url)) && !path.includes('end'))) {
            return { backgroundImage: 'linear-gradient(50deg,rgba(255, 255, 255, 0) 0%, rgba(226, 99, 255, 0.18) 20%, rgba(255, 255, 255, 0) 50%, rgba(206, 53, 255, 0.12) 85%, rgba(255, 255, 255, 0) 100%)' }
        }
        return { backgroundImage: 'linear-gradient(50deg,rgba(255, 255, 255, 0) 0%, rgba(226, 99, 255, 0.18) 20%, rgba(255, 255, 255, 0) 50%, rgba(206, 53, 255, 0.12) 85%, rgba(255, 255, 255, 0) 100%)', paddingTop: "5.5rem" }
    }

    useEffect(() => {
        const playerSocket = new PlayerWebSocket(IP.PLAYERSOCKET, user, (e) => { setUserData(e) });

        if (notAllowedURLs.some(url => !path.includes(url))) {
            playerSocket.connect();
        } else {
            playerSocket.close();
        }
    }, [])


    return (
        <MenuContext.Provider value={{ isOpen, setOpen }}>
            <UserContext.Provider value={{ user, setUser }}>

                <QueryClientProvider client={queryClient}>

                    <body className={`bg-zinc-900 duration-200 relative h-screen ${className}`}>
                        <StarBackground></StarBackground>
                        <Navbar></Navbar>
                        <Help></Help>
                        <main style={getStyle()} className={`h-full`}>
                            {children}
                        </main>
                    </body>
                </QueryClientProvider>
            </UserContext.Provider>
        </MenuContext.Provider>
    );
}


