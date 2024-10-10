"use client";
import Icon from "@/assets/icons"
import { UserContext } from "@/contexts/user.context";
import { getCookie } from "@/functions/user.function";
import { Ilobby } from "@/interfaces/interface";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { useContext, useEffect, useState } from "react";

export default function LobbyId() {

    const lobby_id = useParams().lobby_id;
    const path = usePathname();
    const { user } = useContext(UserContext);


    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
                if (typeof data.message === "string") {
                    fetch(`/api/join/${lobby_id}`, { method: "PUT", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } }).then(res => res.json()).then(data => {
                        setLobby(data.lobby as Ilobby);
                    }
                    );
                } else {
                    setLobby(data.message.fullDocument as Ilobby);
                }
            } // handle message
            else {
                setLobby(data as Ilobby);
            }
        });

        return () => {
            socket.close();
        };
    }, [])


    const [lobby, setLobby] = useState<Ilobby | null>(null);

    const positionEnum = [
        "left-[-12%]",
        "right-[-12%]",
        "top-[-40%]",
        "bottom-[-40%]",
        "left-[10%] top-[-30%]",
        "right-[10%] top-[-30%]",
        "bottom-[-30%] left-[10%]",
        "bottom-[-30%] right-[10%]",
    ]

    if (!lobby) {
        return <div>Loading...</div>
    }


    function removePlayer(index: number) {
        lobby!.users.splice(index, 1);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function sendChat(e: any) {
        e.preventDefault();
        const chat = e.target.chat.value;
        e.target.chat.value = "";
        fetch(`/api/chat/${lobby_id}`, { method: "PUT", body: JSON.stringify({ sender: user!.username, message: chat, time: new Date().toISOString(), type: "text" }), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } })
    }

    return (
        <main className="flex gap-2 lg:flex-row md:flex-col flex-col">
            <main className="w-full min-h-screen bg-[#3f3f46c0] rounded-md flex flex-col p-3 gap-2">

                <div className="w-full h-full flex relative bg-zinc-700 h-1/2 rounded-lg overflow-hidden justify-center items-center text-zinc-400">

                    <div className="w-full h-1/2 select-none">
                        <div className="w-2/3 h-full mx-auto bg-green-900 rounded-[50%] relative border-4 border-amber-950 flex items-center justify-center">
                            <div className="m-auto h-1/2 w-2/3 bg-green-800 rounded-[50%]"></div>

                            {
                                new Array(lobby.settings.numberOfPlayers).fill(0).map((_, i) => {

                                    if (i < lobby.users.length) {
                                        return (
                                            <div key={i} className={`absolute group ${lobby.users[i]._id !== user!._id ? "bg-zinc-500 text-zinc-800" : "bg-zinc-300 text-zinc-600"}  flex items-center justify-center border-2 border-zinc-800 cursor-pointer rounded-full ${positionEnum[i]} w-24 h-24 duration-200`}>
                                                <Icon name="user" size={64}></Icon>
                                                <div className="absolute bottom-[-2rem] text-zinc-300">{lobby.users[i].username}</div>

                                                {

                                                    lobby.users[i]._id !== user!._id &&

                                                    <React.Fragment>
                                                        {
                                                            lobby.createdBy === user!._id &&
                                                            <div onClick={() => { removePlayer(i) }} className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:left-[-1.5rem] left-0 p-2 rounded-full bg-red-500 hover:bg-red-400">
                                                                <Icon name="close"></Icon>
                                                            </div>
                                                        }

                                                        {
                                                            lobby.createdBy === user!._id &&
                                                            <div className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:top-[-1.5rem] top-0 p-2 rounded-full bg-gray-500 hover:bg-gray-400">
                                                                <Icon name="unmute"></Icon>
                                                            </div>
                                                        }

                                                        <div className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:right-[-1.5rem] right-0 p-2 rounded-full bg-blue-500 hover:bg-blue-400">
                                                            <Icon name="add-friend"></Icon>
                                                        </div>
                                                        <div className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:right-[-3.8rem] right-0 p-2 rounded-full bg-sky-500 hover:bg-sky-400">
                                                            <Icon name="info"></Icon>
                                                        </div>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={i} className={`absolute bg-zinc-500 text-zinc-800 flex items-center justify-center border-2 border-zinc-800 cursor-pointer rounded-full ${positionEnum[i]} w-24 h-24 animate-spin duration-200`}>
                                            <Icon name="loader" size={32}></Icon>
                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>

                    <div className="absolute top-3 right-3 text-lg">
                        {lobby.users.length} / {lobby.settings.numberOfPlayers}
                    </div>
                </div>

                <div className="flex gap-2 h-1/2 w-full">

                    <div className="flex flex-col w-1/2 justify-end">
                        <Link href={path + "/2345"} className="w-full">
                            <button className="bg-blue-600 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold hover:bg-blue-500 duration-200 focus:ring-2 ">Start</button>
                        </Link>
                    </div>

                    <div className="flex relative flex-col w-full bg-zinc-800 rounded-md h-full p-2">
                        <div className="h-full w-full border border-zinc-600 rounded-md flex flex-col gap-1 text-zinc-300 p-2 overflow-auto">

                            {
                                lobby.chat.map((message, i) => (
                                    <div key={i} className="flex gap-1">
                                        <span className="text-zinc-500 w-[4rem]">{message.sender}:</span>
                                        <span className="w-full">{message.message}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <form onSubmit={sendChat} className="w-full pt-3 flex gap-2">
                            <input type="text" id="chat" className="bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Aa" />
                            <button type="submit" className="bg-zinc-500 text-white p-1 px-2 rounded-md hover:bg-zinc-400 flex items-center ">
                                <Icon name="send"></Icon>
                            </button>
                        </form>
                    </div>
                </div>


            </main>
            <main className="lg:w-1/2 w-full min-h-screen bg-[#3f3f46c0] rounded-md flex flex-col p-3 text-zinc-300">

                <div className="flex w-full justify-between items-center pb-4">
                    <div></div>
                    <div className="text-2xl">Lobby settings</div>
                    <div className="cursor-pointer">
                        <Icon name="pen" size={24}></Icon>
                    </div>
                </div>

                <hr />

                <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-14 h-full select-none">


                    <div className="flex flex-col gap-6 ">


                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Number of users</div>


                            <div className="relative w-full">
                                <label htmlFor="labels-range-input" className="sr-only">Labels range</label>
                                <input readOnly id="labels-range-input" type="range" min="2" max="8" value={lobby.settings.numberOfPlayers} className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Min 2</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">4</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Max 8</span>
                                </div>
                            </div>

                        </div>

                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Type</div>

                            <div className="w-full flex items-center">
                                <button disabled type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-s-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-gray-100 ${lobby.settings.cardType === 'RUMMY' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                    RUMMY
                                </button>
                                <button disabled type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-e-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-gray-100 ${lobby.settings.cardType === 'UNO' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                    UNO
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Robber Rummy</div>

                            <div className="w-full flex items-center">

                                <label className="inline-flex items-center cursor-pointer">
                                    <input readOnly type="checkbox" value="" className="sr-only peer" checked={lobby.settings.robberRummy} />
                                    <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                                </label>

                            </div>
                        </div>

                        {
                            lobby.settings.robberRummy &&
                            <div className="flex gap-2 text-zinc-200 items-center italic">
                                <Icon name="info" size={100}></Icon> <span className="text-[.8rem]">Robber Rummy enhances traditional Rummy with several key changes. users can draw any card from the discard pile but must take all cards above it, adding strategic depth. The game continues until a player reaches 500 points, making it more competitive over multiple rounds, unlike classic Rummy, which often ends when a player goes out. Additionally, users can add cards to opponents’ melds, promoting more interaction between users. These elements make Robber Rummy faster-paced and more engaging than its traditional counterpart.</span>
                            </div>
                        }

                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Private lobby</div>

                            <div className="w-full flex items-center">

                                <label className="inline-flex items-center cursor-pointer">
                                    <input readOnly type="checkbox" value="" className="sr-only peer" checked={lobby.settings.privateLobby} />
                                    <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                                </label>

                            </div>
                        </div>

                        {
                            lobby.settings.privateLobby && lobby.settings.lobbyCode &&
                            <div className="flex gap-2 text-zinc-200 items-center">
                                <div className="text-md w-1/3">Lobby code</div>

                                <div className="w-full flex items-center">

                                    <input readOnly type="text" id="first_name" value={lobby.settings.lobbyCode} className="bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />

                                </div>
                            </div>
                        }

                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Unranked</div>

                            <div className="w-full flex items-center">

                                <label className="inline-flex items-center cursor-pointer">
                                    <input readOnly type="checkbox" value="" className="sr-only peer" checked={lobby.settings.unranked} />
                                    <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                                </label>

                            </div>
                        </div>

                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Fill with Robots</div>

                            <div className="w-full flex items-center">

                                <label className="inline-flex items-center cursor-pointer">
                                    <input readOnly type="checkbox" value="" className="sr-only peer" checked={lobby.settings.fillWithRobots} />
                                    <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                                </label>

                            </div>
                        </div>

                        {
                            lobby.settings.fillWithRobots && lobby.settings.numberOfRobots &&
                            <div className="flex gap-2 text-zinc-200 items-center">
                                <div className="text-md w-1/3">Number of Robots</div>

                                <div className="relative w-full">
                                    <label htmlFor="labels-range-input" className="sr-only">Labels range</label>
                                    <input readOnly id="labels-range-input" type="range" min={1} max={lobby.settings.numberOfPlayers} className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer" value={lobby.settings.numberOfRobots} />
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Min 1</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{lobby.settings.numberOfRobots}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Max {lobby.settings.numberOfPlayers}</span>
                                    </div>
                                </div>
                            </div>
                        }


                    </div>

                </div>
            </main>
        </main>
    )
}