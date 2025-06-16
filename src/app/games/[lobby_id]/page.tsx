"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import { UserContext } from "@/contexts/user.context";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Ilobby } from "@/interfaces/interface";
import React from "react";
import Link from "next/link";
import Loader from "@/components/loader.component";
import { GameService } from "@/services/game.service";
import LobbyService from "@/services/lobby.service";
import LobbySettings from "@/components/lobby/lobby.settings.component";
import ProfileService from "@/services/profile.service";
const lobbyService = new LobbyService();
const gameService = new GameService("rummy");

export default function LobbyId() {
    const lobby_id = useParams().lobby_id;
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [form, setForm] = useState<any>({});

    const [lobby, setLobby] = useState<Ilobby | null>(null);


    useEffect(() => {
        const socket = lobbyService.connectWebSocket(lobby_id as string, user!._id, (data: any) => {
            if (data.status) {
                lobbyService.joinLobby(lobby_id as string).then((data2: any) => {
                    if (data2.error) {
                        router.replace("/games");
                    }
                    setLobby(data2);
                    setForm(data2.settings);
                });
            }
            if (!data.lobby) return;

            if (data.lobby.game_id) {
                router.push(`/games/${lobby_id}/${data.lobby.game_id}/${data.lobby.settings.cardType.toLocaleLowerCase()}`);
            } else {
                setLobby(data.lobby);
                setForm(data.lobby.settings);
            }
        });

        return () => {
            socket.close();
        };
    }, [lobby_id, user, router]);


    function sendChat(e: any) {
        e.preventDefault();
        const chat = e.target.chat.value;
        if (!chat || chat.trim() === "") return;
        e.target.chat.value = "";
        lobbyService.sendChatMessage(lobby_id as string, user!.username, chat);
    }

    async function startLobbyGame() {
        const type: 'rummy' | 'uno' = lobby!.settings.cardType.toLowerCase() as 'rummy' | 'uno';
        const res = await new GameService(type).startGame(lobby_id as string);
        if (res.error) {
            console.error(res.error);
        }
        router.push(`/games/${lobby_id}/${res.game_id}/${lobby!.settings.cardType.toLocaleLowerCase()}`);
    }

    function saveEdit(form: any) {
        lobbyService.editLobby(lobby_id as string, form);
    }

    function cancelEdit() {
        setForm(lobby!.settings);
    }

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

    if (!lobby || !lobby.settings) {
        return <Loader></Loader>
    }


    function removePlayer(id: string) {
    }

    return (
        <main className="flex gap-2 lg:flex-row md:flex-col flex-col p-2 h-full">
            <main className="w-full border-2 border-zinc-600 rounded-md flex p-3 gap-2 h-full">

                <div className="w-full h-full flex relative flex-col gap-2">
                    {
                        new Array(lobby.settings.numberOfPlayers).fill(0).map((_, i) => {
                            if (i % 2 == 1) return null
                            if (i < lobby.users.length) {
                                return (
                                    <PlayerCard key={i} playerData={lobby.users[i]} createdBy={lobby.createdBy} currentPlayer={user!._id} removePlayer={removePlayer} mutePlayer={() => { }}></PlayerCard>
                                )
                            } else if (i - lobby.users.length < lobby.bots.length) {
                                return (
                                    <PlayerCard bot key={i} playerData={{ username: lobby.bots[i - lobby.users.length].name, rank: '????' }} createdBy={lobby.createdBy} currentPlayer={user!._id} removePlayer={removePlayer} mutePlayer={() => { }}></PlayerCard>
                                );
                            }
                            return (
                                <PlayerCard key={i} loading></PlayerCard>
                            );
                        })

                    }

                </div>
                <div className="w-full h-full flex relative">
                    {/* {
                        lobby.createdBy === user!._id &&
                        <div className="flex flex-col w-1/2 justify-end">
                            <button disabled={lobby.users.length + lobby.bots.length < lobby.settings.numberOfPlayers} onClick={startLobbyGame} className="bg-blue-600 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold hover:bg-blue-500 duration-200 focus:ring-2 disabled:bg-blue-800 disabled:text-zinc-400 disabled:cursor-not-allowed">Start</button>
                        </div>
                    } */}

                    <div className="flex relative flex-col w-full bg-zinc-800 rounded-md h-full p-2">
                        <div className="h-full w-full border border-zinc-600 rounded-md flex flex-col gap-1 text-zinc-300 p-2 overflow-auto">

                            {
                                lobby.chat.map((message, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className={`${message.sender === user?.username ? 'text-sky-500' : 'text-zinc-500'} w-[6rem]`}>{message.sender}:</span>
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
                <div className="w-full h-full flex relative flex-col gap-2">
                    {
                        new Array(lobby.settings.numberOfPlayers).fill(0).map((_, i) => {
                            if (i % 2 == 0) return null
                            if (i < lobby.users.length) {
                                return (
                                    <PlayerCard key={i} playerData={lobby.users[i]} createdBy={lobby.createdBy} currentPlayer={user!._id} removePlayer={removePlayer} mutePlayer={() => { }}></PlayerCard>
                                )
                            } else if (i - lobby.users.length < lobby.bots.length) {
                                return (
                                    <PlayerCard bot key={i} playerData={{ username: lobby.bots[i - lobby.users.length].name, rank: '????' }} createdBy={lobby.createdBy} currentPlayer={user!._id} removePlayer={removePlayer} mutePlayer={() => { }}></PlayerCard>
                                );
                            }
                            return (
                                <PlayerCard key={i} loading></PlayerCard>
                            );
                        })

                    }

                </div>
            </main>
            {/* <main className="w-full min-h-screen bg-[#3f3f46c0] rounded-md flex flex-col p-3 gap-2">

                <div className="w-full h-full flex relative bg-zinc-700 h-1/2 rounded-lg overflow-hidden justify-center items-center text-zinc-400">

                    <div className="w-full h-1/2 select-none">
                        <div className="w-2/3 h-full mx-auto bg-green-900 rounded-[50%] relative border-4 border-amber-950 flex items-center justify-center">
                            <div className="m-auto h-1/2 w-2/3 bg-green-800 rounded-[50%]"></div>

                            {
                                new Array(lobby.settings.numberOfPlayers).fill(0).map((_, i) => {
                                    if (i < lobby.users.length) {
                                        return (
                                            <div key={i} className={`absolute group ${lobby.users[i]._id !== user!._id ? "bg-zinc-500 text-zinc-800" : "bg-zinc-300 text-zinc-600"}  flex items-center justify-center border-2 border-zinc-800 cursor-pointer rounded-full ${positionEnum[i]} w-24 h-24 duration-200`}>
                                                <Icon name="user" size={64} />
                                                <div className="absolute bottom-[-2rem] text-zinc-300">{lobby.users[i].username}</div>
                                                {lobby.users[i]._id !== user!._id && (
                                                    <React.Fragment>
                                                        {lobby.createdBy === user!._id && (
                                                            <div onClick={() => removePlayer(i)} className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:left-[-1.5rem] left-0 p-2 rounded-full bg-red-500 hover:bg-red-400">
                                                                <Icon name="close" />
                                                            </div>
                                                        )}
                                                        {lobby.createdBy === user!._id && (
                                                            <div className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:top-[-1.5rem] top-0 p-2 rounded-full bg-gray-500 hover:bg-gray-400">
                                                                <Icon name="unmute" />
                                                            </div>
                                                        )}
                                                        <div className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:right-[-1.5rem] right-0 p-2 rounded-full bg-blue-500 hover:bg-blue-400">
                                                            <Icon name="add-friend" />
                                                        </div>
                                                        <Link href={`/profile/${lobby.users[i].customId}`} className="absolute group-hover:opacity-100 opacity-0 duration-200 group-hover:right-[-3.8rem] right-0 p-2 rounded-full bg-sky-500 hover:bg-sky-400">
                                                            <Icon name="info" />
                                                        </Link>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        );
                                    } else if (i - lobby.users.length < lobby.bots.length) {
                                        return (
                                            <div key={i} className={`absolute bg-zinc-400 text-zinc-700 flex items-center justify-center border-2 border-zinc-700 rounded-full ${positionEnum[i]} w-24 h-24 duration-200`}>
                                                <StrokeIcon name="robot" size={56} />
                                                <div className="absolute bottom-[-2rem] text-zinc-300">{lobby.bots[i - lobby.users.length].name}</div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={i} className={`absolute bg-zinc-500 text-zinc-800 flex items-center justify-center border-2 border-zinc-800 cursor-pointer rounded-full ${positionEnum[i]} w-24 h-24 animate-spin duration-200`}>
                                            <Icon name="loader" size={32} />
                                        </div>
                                    );
                                })

                            }

                        </div>

                    </div>

                    {
                        lobby.settings &&
                        <div className="absolute top-3 right-3 text-lg">
                            {lobby.users.length + lobby.bots.length} / {lobby.settings.numberOfPlayers}
                        </div>
                    }
                </div>

                <div className="flex gap-2 h-1/2 w-full">
                    {
                        lobby.createdBy === user!._id &&
                        <div className="flex flex-col w-1/2 justify-end">
                            <button disabled={lobby.users.length + lobby.bots.length < lobby.settings.numberOfPlayers} onClick={startLobbyGame} className="bg-blue-600 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold hover:bg-blue-500 duration-200 focus:ring-2 disabled:bg-blue-800 disabled:text-zinc-400 disabled:cursor-not-allowed">Start</button>
                        </div>
                    }

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


            </main> */}
            <main className="lg:w-1/3 w-full h-full bg-zinc-800 rounded-md flex flex-col p-3 text-zinc-300">

                <LobbySettings cancel={cancelEdit} getForm={form} save={saveEdit} canEdit title="Lobby settings"></LobbySettings>

                {
                    lobby.createdBy === user!._id &&
                    <div className="flex flex-col w-1/2 justify-end mx-auto">
                        <button disabled={lobby.users.length + lobby.bots.length < lobby.settings.numberOfPlayers} onClick={startLobbyGame} className="bg-blue-600 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold hover:bg-blue-500 duration-200 focus:ring-2 disabled:bg-blue-800 disabled:text-zinc-400 disabled:cursor-not-allowed">Start</button>
                    </div>
                }
            </main>
        </main>
    )
}

function PlayerCard({ playerData, loading, bot, createdBy, removePlayer, mutePlayer, currentPlayer }: { playerData?: any, loading?: boolean, bot?: boolean, createdBy?: string, removePlayer?: (id: string) => void, mutePlayer?: (id: string) => void, currentPlayer?: string }) {
    if (loading) {
        return (
            <main className="w-full bg-zinc-800 rounded-lg p-3 flex gap-2 min-h-12 select-none">
                <div className={`relative bg-zinc-500 text-zinc-800 flex items-center justify-center border-2 border-zinc-800 rounded-full w-16 h-16 animate-pulse`}>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <div className="text-zinc-300 text-lg bg-zinc-600 animate-pulse rounded-lg w-32 h-3"></div>
                    <div className="text-zinc-300 text-lg bg-zinc-600 animate-pulse rounded-lg w-24 h-2"></div>
                </div>
            </main>
        )
    }

    if (bot) {
        return (
            <main className="w-full bg-zinc-800 rounded-lg p-3 flex gap-2 border-2 border-zinc-800 select-none">
                <div className={`relative bg-zinc-400 text-zinc-700 flex items-center justify-center border-2 border-zinc-700 rounded-full w-16 h-16 duration-200`}>
                    <StrokeIcon name="robot" size={40} />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-zinc-300 text-lg">{playerData.username}</div>
                    <div className="text-zinc-400 text-sm">{playerData.rank}</div>
                </div>
            </main>
        )
    }
    return (
        <main className={"w-full bg-zinc-800 rounded-lg p-3 flex gap-2 justify-between " + (currentPlayer === playerData._id ? 'border-2 border-zinc-500 ' : 'border-2 border-zinc-800')}>
            <div className="flex gap-2">
                <div className={`relative ${currentPlayer === playerData._id ? 'bg-zinc-300' : 'bg-zinc-400'} text-zinc-700 flex items-center justify-center border-2 border-zinc-700 rounded-full w-16 h-16 duration-200`}>
                    <Icon name="user" size={40} />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-zinc-300 text-lg">{playerData.username}</div>
                    <div className="text-zinc-400 text-sm">{playerData.rank}</div>
                </div>
            </div>
            {
                currentPlayer !== playerData._id &&
                <div className="flex gap-2">

                    {
                        playerData._id !== createdBy &&
                        <div onClick={() => { mutePlayer!(playerData._id) }} className="p-2 rounded-full bg-gray-500 hover:bg-gray-400 w-fit h-fit cursor-pointer">
                            <Icon name="unmute" />
                        </div>
                    }
                    <div onClick={() => { new ProfileService().createFriendRequest(playerData.customId) }} className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 w-fit h-fit cursor-pointer">
                        <Icon name="add-friend" />
                    </div>
                    <Link href={`/profile/${playerData.customId}`} className="p-2 rounded-full bg-sky-500 hover:bg-sky-400 w-fit h-fit">
                        <Icon name="info" />
                    </Link>
                    {
                        playerData._id !== createdBy &&
                        <div onClick={() => { removePlayer!(playerData._id) }} className="p-2 rounded-full bg-red-500 hover:bg-red-400 w-fit h-fit cursor-pointer">
                            <Icon name="close" />
                        </div>
                    }
                </div>
            }
        </main>
    )
}