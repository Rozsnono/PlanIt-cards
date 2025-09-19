"use client";
import { usePathname, useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MenuContext, MenuProvider } from "./menu.context";
import StarBackground from "@/components/star-background";
import Navbar from "@/components/navbar";
import { Iplayer } from "@/interfaces/interface";
import { getUser, PlayerWebSocket } from "@/functions/user.function";
import { UserContext, UserProvider } from "./user.context";
import Icon from "@/assets/icons";
import { IP } from "@/enums/ip.enum";
import Help from "@/components/help/help.component";

export function Providers({ children, className }: { children: React.ReactNode, className?: string }) {
    const [isOpen, setOpen] = useState(true);
    const path = usePathname();
    const route = useRouter();
    const [user, setUser] = useState<Iplayer | null>(getUser());

    const notAllowedURLs = ['rummy', 'uno', 'solitaire', 'observatory', 'login', 'register', 'verify', 'mobile'];

    const gameUrls = ['rummy', 'uno', 'solitaire', 'schnapps'];

    function setUserData(user: Iplayer | null) {
        setUser(user);
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !path.includes("/mobile")) {
        route.replace("/mobile");
    }

    const queryClient = new QueryClient();

    function getStyle(): CSSProperties | undefined {
        if (path.includes('observatory') || path.includes('login') || path.includes('register') || path.includes('verify') || path.includes('mobile')) {
            return {}
        }
        if (path.includes('end')) {
            return { paddingTop: "5.5rem" }
        }
        if (path === "/" || (gameUrls.find((url) => path.includes(url)) && !path.includes('end'))) {
            return {}
        }
        return { paddingTop: "5.5rem" }
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
        <MenuProvider>
            <UserProvider>
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
            </UserProvider>
        </MenuProvider>
    );
}


