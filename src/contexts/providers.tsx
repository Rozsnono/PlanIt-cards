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

export function Providers({ children, className }: { children: React.ReactNode, className?: string }) {
    const [isOpen, setOpen] = useState(true);
    const [user, setUser] = useState<Iplayer | null>(getUser());
    const [helperOpen, setHelperOpen] = useState(false);

    const notAllowedURLs = ['rummy', 'uno', 'solitaire', 'observatory', 'login', 'register'];


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
            return { backgroundImage: 'linear-gradient(50deg,rgba(255, 255, 255, 0) 0%, rgba(226, 99, 255, 0.18) 20%, rgba(255, 255, 255, 0) 50%, rgba(206, 53, 255, 0.12) 85%, rgba(255, 255, 255, 0) 100%)', paddingTop: "5.5rem"}
        }
        if (path === "/" || (path.includes('rummy') || path.includes('uno') || path.includes('solitaire') && !path.includes('end'))) {
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
                        {(path.includes('end')) && <Navbar></Navbar>}
                        {(!path.includes('login') && !path.includes('register') && !path.includes('rummy') && !path.includes('uno') && !path.includes('solitaire')) && <Navbar></Navbar>}
                        {(path.includes('rummy') || path.includes('uno') || path.includes('solitaire')) && !path.includes('end') && <Navbar clear></Navbar>}
                        {
                            (path.includes('rummy') || path.includes('uno') || path.includes('solitaire')) && !path.includes('end') &&
                            <div className="fixed right-4 top-4 z-50">
                                <button onClick={() => { setHelperOpen(!helperOpen) }} className="bg-zinc-600 text-zinc-100 p-2 px-2 rounded-full hover:bg-zinc-500 w-12 h-12 duration-200 flex items-center justify-center relative group">
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
                        {
                            helperOpen &&
                            <div className="fixed h-full top-0 right-0 bg-zinc-700/90 w-[40rem] z-[999] rounded-l-lg ring-2 ring-zinc-500">
                                <RummyHelper opened={helperOpen} setOpened={setHelperOpen}></RummyHelper>
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


export function RummyHelper({ opened, setOpened }: { opened: boolean, setOpened: (opened: boolean) => void }) {

    if (!opened) return null;

    return (
        <div className={"relative h-full w-full flex flex-col p-4 gap-3"}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-zinc-100 font-semibold">How to play rummy?</h1>
                <button onClick={() => setOpened(!opened)} className="text-zinc-100 hover:text-zinc-300 duration-200">
                    {opened ? <Icon name="close" /> : <Icon name="menu" />}
                </button>
            </div>
            <hr />
            <div className={`flex-1 overflow-y-auto duration-200`}>
                <p className="text-zinc-300 mt-4">
                    Rummy is a card game where the objective is to form sets or sequences of cards. Players draw and discard cards to create valid combinations.
                </p>
                <ul className="list-disc pl-5 mt-2 text-zinc-300">
                    <li>Each player is dealt a hand of cards.</li>
                    <li>Players take turns drawing and discarding cards.</li>
                    <li>Valid combinations include sets (three or four cards of the same rank) and sequences (three or more consecutive cards of the same suit).</li>
                    <li>The game ends when a player forms valid combinations with all their cards.</li>
                </ul>
                <p className="text-zinc-300 mt-4">
                    For more detailed rules, you can refer to the official <a href="https://en.wikipedia.org/wiki/Rummy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Wikipedia page</a>.
                </p>
            </div>
        </div>
    );
}