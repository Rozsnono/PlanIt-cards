"use client";
import Icon from "@/assets/icons";
import LobbyCard from "@/components/lobby/lobby";
import RightSideBar, { RightSideBarHeader } from "./sidebar";
import { useState } from "react";
import { useQuery } from "react-query";
import { Ilobby } from "@/interfaces/interface";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/lobby.service";
const lobbyService = new LobbyService();

export default function Games() {
    const [open, setOpen] = useState(false);
    const [openPrivate, setOpenPrivate] = useState(false);

    const data = useQuery("lobbies", lobbyService.getLobbyData, { refetchOnWindowFocus: false });

    return (
        <main className="flex gap-2">
            <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="text-xl p-2">Tables</div>
                <hr />
                <main className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 p-3">
                    {data.isLoading && <Loading />}
                    {!data.isLoading && !data.isError && !data.data.error && data.data.map((lobby: Ilobby, index: number) => (
                        <LobbyCard key={index} lobbyDatas={lobby} lobbyNumber={index + 1} />
                    ))}
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

    const [nop, setNop] = useState(4); // Number of users
    const [ct, setCt] = useState("RUMMY"); // Number of users
    const [rr, setRr] = useState(false); // Robber Rummy
    const [pl, setPl] = useState(false); // Private lobby
    const [lc, setLc] = useState<string | null>(null); // Lobby code

    const [fr, setFr] = useState(false); // Fill with robots
    const [nor, setNor] = useState(1); // Number of robots
    const [rd, setRd] = useState(0); // Number of robots

    const [ur, setUr] = useState(false); // Unranked

    const router = useRouter();

    async function creatingLobby() {

        const lobbySettings = {
            numberOfPlayers: nop,
            cardType: ct,
            robberRummy: rr,
            privateLobby: pl,
            lobbyCode: lc,
            fillWithRobots: fr,
            numberOfRobots: nor,
            robotsDifficulty: 0,
            unranked: ur
        };

        try {
            const result = await lobbyService.createLobby(lobbySettings);
            router.push(`/games/${result._id}`);
        } catch (error) {
            console.error("Error creating lobby:", error);
        }

    }

    return (
        <main className="flex flex-col w-full h-full text-zinc-200 select-none">
            <div className="flex items-center justify-between relative">
                <div className="pt-2">
                    <div className="text-2xl">Create a lobby</div>
                </div>

                <div className="flex items-center gap-2">

                    <RightSideBarHeader onClose={() => { onClose!() }}></RightSideBarHeader>
                </div>


            </div>

            <hr className="border-zinc-600 my-5" />

            <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-14 h-full">


                <div className="flex flex-col gap-6 ">


                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Number of users</div>


                        <div className="relative w-full">
                            <label htmlFor="number_of_player" className="sr-only">Labels range</label>
                            <input id="number_of_player" type="range" onChange={(e) => setNop(parseInt(e.target.value))} value={nop} min="2" max="8" className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Min 2</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{nop}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Max 8</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Type</div>

                        <div className="w-full flex items-center">
                            <button onClick={() => { setCt('RUMMY') }} type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-s-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-gray-100 ${ct === 'RUMMY' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                RUMMY
                            </button>
                            <button disabled onClick={() => { setCt('UNO') }} type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-e-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-gray-100 ${ct === 'UNO' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                UNO
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Robber Rummy</div>

                        <div className="w-full flex items-center">

                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" id="robber_rummy" onChange={(e) => { setRr(e.target.checked) }} checked={rr} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        rr &&
                        <div className="flex gap-2 text-zinc-200 items-center italic">
                            <Icon name="info" size={100}></Icon> <span className="text-[.8rem]">Robber Rummy enhances traditional Rummy with several key changes. users can draw any card from the discard pile but must take all cards above it, adding strategic depth. The game continues until a player reaches 500 points, making it more competitive over multiple rounds, unlike classic Rummy, which often ends when a player goes out. Additionally, users can add cards to opponents’ melds, promoting more interaction between users. These elements make Robber Rummy faster-paced and more engaging than its traditional counterpart.</span>
                        </div>
                    }

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Private lobby</div>

                        <div className="w-full flex items-center">

                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" id="private_lobby" className="sr-only peer" onChange={(e) => { setPl(e.target.checked) }} checked={pl} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        pl &&
                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Lobby code</div>

                            <div className="w-full flex items-center">

                                <input onChange={(e) => { setLc(e.target.value) }} value={lc as string} type="text" id="lobby_code" className="bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />

                            </div>
                        </div>
                    }

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Unranked</div>

                        <div className="w-full flex items-center">

                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" id="unranked" onChange={(e) => { setUr(e.target.checked) }} checked={ur} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Fill with Robots</div>

                        <div className="w-full flex items-center">

                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" id="fill_with_robots" onChange={(e) => { setFr(e.target.checked) }} checked={fr} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        fr &&
                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Number of Robots</div>

                            <div className="relative w-full">
                                <label htmlFor="number_of_robots" className="sr-only">Labels range</label>
                                <input id="number_of_robots" type="range" onChange={(e) => setNor(parseInt(e.target.value))} value={nor} min="1" max={nop - 1} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Min 1</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{nor}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Max {nop - 1}</span>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        fr &&
                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Difficulty</div>

                            <div className="relative w-full">
                                <label htmlFor="robotsDifficulty" className="sr-only">Labels range</label>
                                <input id="robotsDifficulty" type="range" onChange={(e) => setRd(parseInt(e.target.value))} value={rd} min={0} max={2} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between">
                                    <span onClick={() => setRd(0)} className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">Easy</span>
                                    <span onClick={() => setRd(1)} className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">Medium</span>
                                    <span onClick={() => setRd(2)} className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">Hard</span>
                                </div>
                            </div>
                        </div>
                    }


                </div>

            </div>


            <hr className="border-zinc-600" />


            <hr className="border-zinc-600 mb-6" />

            <div className="flex gap-2 px-4 mb-3 justify-center" >
                <button onClick={creatingLobby} className="bg-green-700 text-white p-2 px-5 rounded-md hover:bg-green-600 flex items-center gap-1">
                    <Icon name="join"></Icon>
                    Create
                </button>
            </div>

        </main>
    )
}

function PrivateSideBarContent({ onClose }: Readonly<{ onClose?: () => void }>) {
    const [lc, setLc] = useState<string | null>(null); // Lobby code

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