"use client";
import Icon from "@/assets/icons";
import LobbyCard from "@/components/lobby";
import RightSideBar, { RightSideBarHeader } from "./sidebar";
import { useState } from "react";

export default function Games() {

    const defaultPlayers = [{ name: "Norbi", rank: 1 }, { name: "Robi", rank: 2 }, { name: "Rezső", rank: 3 }, { name: "Ferenc", rank: 4 }, { name: "Jani", rank: 5 }, { name: "Józsi", rank: 6 }, { name: "Béla", rank: 7 }, { name: "Pista", rank: 8 }];

    const [open, setOpen] = useState(false);

    return (
        <main className="flex gap-2">
            <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="text-xl p-2">Tables</div>
                <hr />
                <main className="w-full grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 p-3">
                    <LobbyCard
                        lobbyDatas={
                            {
                                players: defaultPlayers as any,
                                settings: {
                                    numberOfPlayers: 8,
                                    robberRummy: true,
                                    privateLobby: false,
                                    lobbyCode: "",
                                    unranked: false,
                                    fillWithRobots: false,
                                    numberOfRobots: 0,
                                    type: "RUMMY"
                                },
                                chat: [],
                                game_id: "123456",
                                mutedPlayers: [],
                                _id: "123456"
                            }
                        }
                        lobbyNumber={1}>

                    </LobbyCard>

                    <LobbyCard
                        lobbyDatas={
                            {
                                players: defaultPlayers.slice(3) as any,
                                settings: {
                                    numberOfPlayers: 8,
                                    robberRummy: false,
                                    privateLobby: false,
                                    lobbyCode: "",
                                    unranked: false,
                                    fillWithRobots: false,
                                    numberOfRobots: 0,
                                    type: "UNO"
                                },
                                chat: [],
                                mutedPlayers: [],
                                _id: "123456"
                            }
                        }
                        lobbyNumber={2}>

                    </LobbyCard>

                    <LobbyCard
                        lobbyDatas={
                            {
                                players: defaultPlayers.slice(5) as any,
                                settings: {
                                    numberOfPlayers: 8,
                                    robberRummy: false,
                                    privateLobby: false,
                                    lobbyCode: "",
                                    unranked: false,
                                    fillWithRobots: false,
                                    numberOfRobots: 0,
                                    type: "RUMMY"
                                },
                                chat: [],
                                mutedPlayers: [],
                                _id: "123456"
                            }
                        }
                        lobbyNumber={3}>
                    </LobbyCard>
                </main>
            </main>

            <div className="fixed right-8 bottom-8">
                <button onClick={() => { setOpen(true) }} className="bg-sky-600 text-white p-2 px-2 rounded-full justify-center hover:bg-sky-500 flex items-center gap-1 w-16 h-16 duration-200">
                    <Icon name="add"></Icon>
                </button>
            </div>

            <RightSideBar open={open} onClose={() => { setOpen(!open) }}>
                <SideBarContent onClose={() => { setOpen(!open) }}></SideBarContent>
            </RightSideBar>
        </main>
    )
}

function SideBarContent({ onClose }: Readonly<{ onClose?: () => void }>) {

    const [nop, setNop] = useState(4); // Number of players
    const [rr, setRr] = useState(false); // Robber Rummy
    const [pl, setPl] = useState(false); // Private lobby
    const [lc, setLc] = useState(""); // Lobby code

    const [fr, setFr] = useState(false); // Fill with robots
    const [nor, setNor] = useState(1); // Number of robots

    const [ur, setUr] = useState(false); // Unranked

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
                        <div className="text-md w-1/3">Number of players</div>


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
                            <Icon name="info" size={100}></Icon> <span className="text-[.8rem]">Robber Rummy enhances traditional Rummy with several key changes. Players can draw any card from the discard pile but must take all cards above it, adding strategic depth. The game continues until a player reaches 500 points, making it more competitive over multiple rounds, unlike classic Rummy, which often ends when a player goes out. Additionally, players can add cards to opponents’ melds, promoting more interaction between players. These elements make Robber Rummy faster-paced and more engaging than its traditional counterpart.</span>
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

                                <input onChange={(e) => { setLc(e.target.value) }} value={lc} type="text" id="lobby_code" className="bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />

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


                </div>

            </div>


            <hr className="border-zinc-600" />


            <hr className="border-zinc-600 mb-6" />

            <div className="flex gap-2 px-4 mb-3 justify-center" >
                <button className="bg-green-700 text-white p-2 px-5 rounded-md hover:bg-green-600 flex items-center gap-1">
                    <Icon name="join"></Icon>
                    Create
                </button>
            </div>

        </main>
    )
}