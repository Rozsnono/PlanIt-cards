"use client";
import Icon from "@/assets/icons";
import LobbyCard from "@/components/lobby/lobby";
import RightSideBar, { RightSideBarHeader } from "./sidebar";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Ilobby } from "@/interfaces/interface";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/lobby.service";
import { ModalClass } from "@/components/filter.modal";
import LobbySettings from "@/components/lobby/lobby.settings.component";
import Pagination from "@/components/pagination";
const lobbyService = new LobbyService();

export default function Games() {
    const [open, setOpen] = useState(false);
    const [openPrivate, setOpenPrivate] = useState(false);

    const data = useQuery("lobbies", () => { return lobbyService.getLobbyData(getFilterFromURL()) }, { refetchOnWindowFocus: true });
    const modal = new ModalClass();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState<{
        cardType?: string,
        unranked?: boolean,
        noPrivateLobby?: boolean,
        noBots?: boolean,
        numberOfPlayers?: number,
        robotsDifficulty?: string,
        page: number
    }>({});

    function setFiltering() {
        setLoading(true);
        let url = `/games?cardType=${filter.cardType}`;
        if (filter.page) url += `&page=${filter.page}`;
        if (filter.unranked) url += '&unranked=true';
        if (filter.noPrivateLobby) url += '&noPrivateLobby=true';
        if (filter.noBots) url += '&noBots=true';
        if (filter.numberOfPlayers) url += `&numberOfPlayers=${filter.numberOfPlayers}`;
        if (filter.robotsDifficulty) url += `&robotsDifficulty=${filter.robotsDifficulty}`;
        router.push(url);
        setTimeout(() => {
            data.refetch();
            setLoading(false);
        }, 50);
    }

    function getFilterCSS(filterType: 'cardType' | 'unranked' | 'noPrivateLobby' | 'noBots' | 'numberOfPlayers' | 'robotsDifficulty', condition: any) {
        if (filter[filterType] === condition) {
            return "bg-green-700 hover:bg-green-600 text-zinc-400"
        } else {
            return "bg-zinc-700  hover:bg-zinc-600 text-zinc-400"
        }
    }

    function getFilterBoolean(filterType: 'cardType' | 'unranked' | 'noPrivateLobby' | 'noBots' | 'numberOfPlayers' | 'robotsDifficulty', condition: any) {
        return filter[filterType] === condition;
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
        console.log(f);
        return f;
    }

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
        setFilter({ ...filter, [key]: value });
    }

    function setPageNumber(page: number) {
        setFilter({ ...filter, page: page });
        setLoading(true);
        let url = `/games?page=${page}`;
        router.replace(url);
        setTimeout(() => {
            data.refetch();
            setLoading(false);
        }, 100);
    }

    return (
        <main className="flex gap-2">
            <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200 relative ">
                <div className="flex justify-between items-center">
                    <div className="text-xl p-2 flex gap-2 items-center">
                        <Icon name="table"></Icon>
                        Tables
                    </div>
                    <div className="flex gap-2 relative">
                        {
                            !data.isLoading && !data.isError && data.data.total > 1 &&
                            <Pagination total={data.data.total} page={filter.page} setPage={setPageNumber}></Pagination>
                        }
                    </div>
                    <div>
                        <div className="flex gap-2 relative">
                            <button className="more-modal-button text-zinc-200 p-2 px-4 rounded-md hover:bg-zinc-800 focus:bg-zinc-800 flex items-center gap-1">
                                <Icon name="filter"></Icon>
                                Filter
                            </button>

                            <modal.FilterModal className="top-10 right-4 border border-zinc-600 rounded-lg">
                                <div className="flex items-center flex-col gap-2 w-48">
                                    <button onClick={() => { setFilterByParam('cardType', 'RUMMY') }} className={getFilterCSS('cardType', 'RUMMY') + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="card" size={16} stroke></Icon> Rummy</button>
                                    <button onClick={() => { setFilterByParam('cardType', 'UNO') }} className={getFilterCSS('cardType', 'UNO') + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="card" size={16} stroke></Icon> Uno</button>
                                    <div className="p-1"></div>
                                    <div className="flex gap-1 w-full">
                                        {
                                            new Array(filter.cardType === 'RUMMY' ? 5 : 7).fill(0).map((_, index) => (
                                                <button onClick={() => { setFilterByParam('numberOfPlayers', index + 2) }} key={index} className={getFilterCSS('numberOfPlayers', index + 2) + " w-full h-8 rounded-lg flex items-center justify-center"}>{index + 2}</button>
                                            ))
                                        }
                                    </div>
                                    <div className="p-1"></div>
                                    <button onClick={() => { setFilter({ ...filter, unranked: !filter.unranked }) }} className={getFilterCSS('unranked', true) + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="unranked" size={16} stroke></Icon> Unranked</button>
                                    <button onClick={() => { setFilter({ ...filter, noPrivateLobby: !filter.noPrivateLobby }) }} className={getFilterCSS('noPrivateLobby', true) + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="key" size={16} stroke></Icon> No private lobbies</button>
                                    <button onClick={() => { setFilter({ ...filter, noBots: !filter.noBots }) }} className={getFilterCSS('noBots', true) + " w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"}> <Icon name="robot" size={16} stroke></Icon> No bots</button>
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
                                <button type="submit" onClick={setFiltering} className="text-zinc-300 bg-zinc-900 hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="filter" size={16}></Icon> Filter</button>

                            </modal.FilterModal>

                        </div>
                    </div>
                </div>
                <hr />
                <main className="relative w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 p-3 max-h-[95%] overflow-y-auto">
                    {loading && data.isLoading && <Loading />}
                    {!data.isLoading && !data.isError && data.data.data.map((lobby: Ilobby, index: number) => (
                        <LobbyCard key={index} lobbyDatas={lobby} lobbyNumber={index + 1} />
                    ))}
                    {!data.isLoading && data.isError && <div className="text-center text-zinc-300">Error fetching data</div>}
                    {!data.isLoading && !data.isError && data.data.length === 0 && <div className="text-center text-zinc-300 w-full col-span-12">No lobby found</div>}
                </main>
            </main>

            <div className="fixed right-8 bottom-8">
                <button onClick={() => setOpen(true)} className="bg-sky-600 text-white p-2 px-2 rounded-full hover:bg-sky-500 w-16 h-16 duration-200 flex items-center justify-center">
                    <Icon name="add" />
                </button>
            </div>

            <div className="fixed right-8 bottom-28">
                <button onClick={() => setOpenPrivate(true)} className="bg-green-600 text-white p-2 px-2 rounded-full hover:bg-green-500 w-16 h-16 duration-200 flex items-center justify-center">
                    <Icon name="join" />
                </button>
            </div>

            <RightSideBar open={open} onClose={() => setOpen(!open)}>
                <SideBarContent onClose={() => setOpen(!open)} />
            </RightSideBar>

            <RightSideBar open={openPrivate} onClose={() => setOpenPrivate(!openPrivate)}>
                <PrivateSideBarContent onClose={() => setOpenPrivate(!openPrivate)} />
            </RightSideBar>
        </main>
    );
}



function SideBarContent({ onClose }: Readonly<{ onClose?: () => void }>) {

    const router = useRouter();

    async function creatingLobby(form: any) {

        try {
            const result = await lobbyService.createLobby(form);
            // router.push(`/games/${result._id}`);
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