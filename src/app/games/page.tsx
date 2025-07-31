"use client";
import Icon from "@/assets/icons";
import LobbyCard from "@/components/lobby/lobby";
import RightSideBar, { RightSideBarHeader } from "./sidebar";
import { useContext, useEffect, useRef, useState } from "react";
import { Ilobby } from "@/interfaces/interface";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/lobby.service";
import LobbySettings from "@/components/lobby/lobby.settings.component";
import Image from "next/image";
import React from "react";
import { IP } from "@/enums/ip.enum";
import { UserContext } from "@/contexts/user.context";
const lobbyService = new LobbyService();

export default function Games() {
    const [open, setOpen] = useState(false);
    const [openPrivate, setOpenPrivate] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const { user } = useContext(UserContext);

    const socket = useRef<WebSocket | null>(null);

    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        data: { data: [], total: 0 },
    });

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);

    useEffect(() => {
        socket.current = new WebSocket(IP.LOBBYSOCKET);
        setState({ ...state, isLoading: true });


        socket!.current!.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket!.current!.send(JSON.stringify({ userId: user?._id || null, ...getFilterFromURL() }));
            setState({ ...state, isLoading: true });

        });

        socket!.current!.addEventListener('message', (event) => {
            try {
                if (event.data && JSON.parse(event.data).refresh) {
                    socket!.current!.send(JSON.stringify({ userId: user?._id || null, ...getFilterFromURL() }));
                    setState({ ...state, isLoading: true });
                } else {
                    try {
                        setState({ ...state, data: JSON.parse(event.data), isLoading: false });
                    } catch {
                        setState({ ...state, isLoading: false });
                    }
                }
            } catch { }
        });

        return () => {
            socket!.current!.close();
        };
    }, [])

    function refreshLobbyList() {
        socket!.current!.send(JSON.stringify({ userId: user?._id, ...getFilterFromURL() }));
        setState({ ...state, isLoading: true });
    }


    function getFilterFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const f: any = {};
        if (urlParams.get('page')) f.page = parseInt(urlParams.get('page') as string);
        if (urlParams.get('cardType')) f.cardType = urlParams.get('cardType');
        if (urlParams.get('unranked')) f.unranked = urlParams.get('unranked') === 'true';
        if (urlParams.get('noPrivateLobby')) f.noPrivateLobby = urlParams.get('noPrivateLobby') === 'true';
        if (urlParams.get('noBots')) f.noBots = urlParams.get('noBots') === 'true';
        if (urlParams.get('numberOfPlayers')) f.numberOfPlayers = parseInt(urlParams.get('numberOfPlayers') as string);
        if (urlParams.get('robotsDifficulty')) f.robotsDifficulty = urlParams.get('robotsDifficulty');
        setPage(f.page || 1);
        return f;
    }

    function setPageNumber(page: number) {
        // setFilter({ ...filter, page: page });
        setLoading(true);
        const url = `/games?page=${page}`;
        router.replace(url);
        setTimeout(() => {
            setLoading(false);
        }, 100);
    }

    async function creatingLobby(form: any) {
        setLoading(true);
        try {
            const result = await lobbyService.createLobby(form);
            router.push(`/games/${result._id}`);
        } catch (error) {
            setLoading(false);
            console.error("Error creating lobby:", error);
        }
    }

    if (loading || state.isLoading) return <Loading />


    return (
        <main className="flex gap-2 flex-col h-full p-2">
            <main className="relative w-full h-full grid 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 p-3 overflow-y-auto">
                {!state.isLoading && !state.isError && state.data.data.map((lobby: Ilobby, index: number) => (
                    <React.Fragment key={index}>
                        <LobbyCard lobbyDatas={lobby} lobbyNumber={index + 1} />
                        {((index + 1) % 5 == 0 || (index + 1) % 7 == 0) &&
                            <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-zinc-500">
                                <Image src="/assets/logo.png" width={100} height={100} alt="Logo"></Image>
                            </div>
                        }
                    </React.Fragment>
                ))}
                {!state.isLoading && state.isError && <div className="text-center text-zinc-300">Error fetching data</div>}
                {!state.isLoading && !state.isError && state.data.data.length === 0 && <div className="text-center text-zinc-300 w-full col-span-12">
                    <div className="text-2xl">No lobbies found</div>
                    <div className="text-md mt-2">Create a new lobby or try again later.</div>    
                </div>}
            </main> 

            {
                !state.isLoading && state.data &&
                page < state.data.total &&
                <main className="w-full flex items-center justify-center">
                    <button onClick={() => { setPageNumber(page + 1) }} className="px-4 p-2 flex items-center justify-center bg-green-700 hover:bg-green-600 rounded-lg text-zinc-100 gap-2">
                        Load more
                        <Icon name="refresh" stroke></Icon>
                    </button>
                </main>
            }

            <div className="fixed right-8 bottom-8">
                <button onClick={() => creatingLobby({ numberOfPlayers: 4, cardType: 'RUMMY', fillWithRobots: true, numberOfRobots: 3, robotsDifficulty: 'EASY' })} className="bg-sky-600 text-white p-2 px-2 rounded-full hover:bg-sky-500 w-16 h-16 duration-200 flex items-center justify-center relative group">
                    <div className="flex items-center justify-center z-50">
                        <Icon name="add" />
                    </div>

                    <div className="absolute h-full top-0 flex items-center group-hover:flex">
                        <div className="bg-sky-500 text-white p-2 px-4 rounded-lg duration-200 flex items-center justify-center text-sm group-hover:-translate-x-3/4 translate-x-0 opacity-0 group-hover:opacity-100">
                            Create
                        </div>
                    </div>
                </button>
            </div>

            <div className="fixed right-8 bottom-28">
                <button onClick={() => setOpenPrivate(true)} className="bg-green-600 text-white p-2 px-2 rounded-full hover:bg-green-500 w-16 h-16 duration-200 flex items-center justify-center relative group">
                    <div className="flex items-center justify-center z-50">
                        <Icon name="join" />
                    </div>

                    <div className="absolute h-full top-0 flex items-center">
                        <div className="bg-green-500 text-white p-2 px-4 rounded-lg duration-200 flex items-center justify-center text-sm group-hover:-translate-x-3/4 translate-x-0 opacity-0 group-hover:opacity-100">
                            Join
                        </div>
                    </div>
                </button>
            </div>

            <div className="fixed right-8 bottom-48">
                <button onClick={() => setOpenFilter(true)} className="bg-zinc-300 text-zinc-700 p-2 px-2 rounded-full hover:bg-zinc-200 w-16 h-16 duration-200 flex items-center justify-center relative group">
                    <div className="flex items-center justify-center z-50">
                        <Icon name="filter" />
                    </div>

                    <div className="absolute h-full top-0 flex items-center">
                        <div className="bg-zinc-200 text-zinc-700 p-2 px-4 rounded-lg duration-200 flex items-center justify-center text-sm group-hover:-translate-x-3/4 translate-x-0 opacity-0 group-hover:opacity-100">
                            Filter
                        </div>
                    </div>
                </button>
            </div>



            <RightSideBar className="border-sky-600" open={open} onClose={() => setOpen(!open)}>
                <SideBarContent onClose={() => setOpen(!open)} onLoading={setLoading} />
            </RightSideBar>

            <RightSideBar className="border-green-600" open={openPrivate} onClose={() => setOpenPrivate(!openPrivate)}>
                <PrivateSideBarContent onClose={() => setOpenPrivate(!openPrivate)} />
            </RightSideBar>

            <RightSideBar className="border-zinc-300" open={openFilter} onClose={() => setOpenFilter(!openFilter)}>
                <FilterSideBarContent onClose={() => { setOpenFilter(!openFilter); refreshLobbyList(); }} />
            </RightSideBar>
        </main>
    );
}



function SideBarContent({ onClose, onLoading }: Readonly<{ onClose?: () => void, onLoading: (loading: boolean) => void }>) {

    const router = useRouter();

    async function creatingLobby(form: any) {
        onLoading(true);
        try {
            const result = await lobbyService.createLobby(form);
            router.push(`/games/${result._id}`);
        } catch (error) {
            console.error("Error creating lobby:", error);
        }

    }

    return (
        <main className="flex flex-col w-full h-full text-zinc-200 select-none">

            <LobbySettings getForm={{ robotsDifficulty: 'EASY', numberOfPlayers: 4, cardType: 'RUMMY', numberOfRobots: 1 }} save={creatingLobby} onlyNew title="Create a lobby">

                <RightSideBarHeader onClose={() => { onClose!() }}></RightSideBarHeader>
            </LobbySettings>

        </main>
    )
}

function PrivateSideBarContent({ onClose }: Readonly<{ onClose?: () => void }>) {
    const [lc, setLc] = useState<string | null>(""); // Lobby code

    return (
        <main className="flex flex-col w-full h-full text-zinc-200 select-none">
            <div className="flex items-center justify-between relative">
                <div className="pt-2">
                    <div className="text-2xl">Join a private lobby</div>
                </div>

                <div className="flex items-center gap-2">

                    <RightSideBarHeader onClose={() => { onClose!() }}></RightSideBarHeader>
                </div>


            </div>

            <hr className="border-zinc-600 my-5" />

            <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-14 h-full">


                <div className="flex flex-col gap-6 ">

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Lobby code</div>

                        <div className="w-full flex items-center">

                            <input onChange={(e) => { setLc(e.target.value) }} value={lc as string} type="text" id="lobby_code" className="bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />

                        </div>
                    </div>

                </div>

            </div>


            <hr className="border-zinc-600" />


            <hr className="border-zinc-600 mb-6" />

            <div className="flex gap-2 px-4 mb-3 justify-center" >
                <button className="bg-green-700 text-white p-2 px-5 rounded-md hover:bg-green-600 flex items-center gap-1">
                    <Icon name="join"></Icon>
                    Join
                </button>
            </div>

        </main>
    )
}

function FilterSideBarContent({ onClose }: Readonly<{ onClose?: () => void }>) {
    const [filter, setFilter] = useState<{
        cardType?: string,
        unranked?: boolean,
        noPrivateLobby?: boolean,
        noBots?: boolean,
        numberOfPlayers?: number,
        robotsDifficulty?: string,
        page: number
    }>({ page: 1 });

    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setFilter({
            cardType: urlParams.get('cardType') || "",
            unranked: urlParams.get('unranked') === 'true' || false,
            noPrivateLobby: urlParams.get('noPrivateLobby') === 'true' || false,
            noBots: urlParams.get('noBots') === 'true' || false,
            numberOfPlayers: urlParams.get('numberOfPlayers') ? parseInt(urlParams.get('numberOfPlayers') as string) : 0,
            robotsDifficulty: urlParams.get('robotsDifficulty') || "",
            page: urlParams.get('page') ? parseInt(urlParams.get('page') as string) : 1,
        })

    }, []);


    function getDifficulty(difficulty: number) {
        switch (difficulty) {
            case 0:
                return "EASY";
            case 1:
                return "MEDIUM";
            case 2:
                return "HARD";
            default:
                return "";
        }
    }

    function setFilterByParam(key: string, value: any) {
        if ((filter as any)[key] === value) {
            delete (filter as any)[key];
            setFilter({ ...filter });
        } else {
            setFilter({ ...filter, [key]: value });
        }
    }

    function getFilterCSS(filterType: 'cardType' | 'unranked' | 'noPrivateLobby' | 'noBots' | 'numberOfPlayers' | 'robotsDifficulty', condition: any, numberOf?: boolean) {
        if (numberOf && filter[filterType]! > condition) {
            return "bg-green-700 hover:bg-green-600 text-zinc-400"
        }
        if (filter[filterType] === condition) {
            return "bg-green-700 hover:bg-green-600 text-zinc-400"
        } else {
            return "bg-zinc-700  hover:bg-zinc-600 text-zinc-400"
        }
    }

    function getFilterBoolean(filterType: 'cardType' | 'unranked' | 'noPrivateLobby' | 'noBots' | 'numberOfPlayers' | 'robotsDifficulty', condition: any) {
        return filter[filterType] === condition;
    }

    function setFiltering() {
        let url = `/games?cardType=${filter.cardType}`;
        if (filter.page) url += `&page=${filter.page}`;
        if (filter.unranked) url += '&unranked=true';
        if (filter.noPrivateLobby) url += '&noPrivateLobby=true';
        if (filter.noBots) url += '&noBots=true';
        if (filter.numberOfPlayers) url += `&numberOfPlayers=${filter.numberOfPlayers}`;
        if (filter.robotsDifficulty) url += `&robotsDifficulty=${filter.robotsDifficulty}`;
        router.push(url);
        setTimeout(() => {
            onClose!();
        }, 50);
    }

    return (
        <main className="flex flex-col w-full h-full text-zinc-200 select-none">
            <div className="flex items-center justify-between relative">
                <div className="pt-2">
                    <div className="text-2xl">Set filter</div>
                </div>

                <div className="flex items-center gap-2">

                    <RightSideBarHeader onClose={() => { onClose!() }}></RightSideBarHeader>
                </div>


            </div>

            <hr className="border-zinc-600 my-5" />

            <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between gap-2">
                    <button onClick={() => { setFilterByParam('cardType', 'RUMMY') }} className={getFilterCSS('cardType', 'RUMMY') + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="card" size={16} stroke></Icon> Rummy</button>
                    <button onClick={() => { setFilterByParam('cardType', 'UNO') }} className={getFilterCSS('cardType', 'UNO') + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="card" size={16} stroke></Icon> Uno</button>
                    <button onClick={() => { setFilterByParam('cardType', 'SOLITAIRE') }} className={getFilterCSS('cardType', 'SOLITAIRE') + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="card" size={16} stroke></Icon> Solitaire</button>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 w-full">
                        {
                            filter.cardType !== 'SOLITAIRE' &&
                            new Array(filter.cardType === 'RUMMY' ? 5 : 7).fill(0).map((_, index) => (
                                <button onClick={() => { setFilterByParam('numberOfPlayers', index + 2) }} key={index} className={getFilterCSS('numberOfPlayers', index + 2, true) + " w-full h-8 rounded-lg flex items-center justify-center"}>{index + 2}</button>
                            ))
                        }
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <button onClick={() => { setFilter({ ...filter, unranked: !filter.unranked }) }} className={getFilterCSS('unranked', true) + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="unranked" size={16} stroke></Icon> Unranked</button>
                    <button onClick={() => { setFilter({ ...filter, noPrivateLobby: !filter.noPrivateLobby }) }} className={getFilterCSS('noPrivateLobby', true) + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="key" size={16} stroke></Icon> No private lobbies</button>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <button onClick={() => { setFilter({ ...filter, noBots: !filter.noBots }) }} className={getFilterCSS('noBots', true) + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="robot" size={16} stroke></Icon> No bots</button>
                </div>
                <div className="flex items-center justify-between gap-2">
                    {
                        getFilterBoolean('noBots', false) &&
                        <div className="flex gap-1 w-full">
                            {
                                new Array(filter.noBots ? 0 : 3).fill(0).map((_, index) => (
                                    <button onClick={() => { setFilter({ ...filter, robotsDifficulty: getDifficulty(index) }) }} key={index} className={getFilterCSS('robotsDifficulty', getDifficulty(index)) + " w-full h-8 rounded-lg flex items-center justify-center"}>
                                        {getDifficulty(index)}
                                    </button>
                                ))
                            }
                        </div>
                    }
                </div>

            </div>


            <hr className="border-zinc-600" />


            <hr className="border-zinc-600 mb-6" />

            <div className="flex gap-2 px-4 mb-3 justify-center" >
                <button onClick={setFiltering} className="bg-zinc-300 text-zinc-900 p-2 px-5 rounded-md hover:bg-zinc-200 flex items-center gap-1">
                    <Icon name="filter"></Icon>
                    Set
                </button>
            </div>

        </main>
    )
}