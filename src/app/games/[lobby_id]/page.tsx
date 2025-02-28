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
            console.log(data);
            if (data.game) {
                router.push(`/games/${lobby_id}/${data.lobby.game_id}/${data.lobby.settings.cardType.toLocaleLowerCase()}`);
            } else if (data.game_id) {
                router.push(`/games/${lobby_id}/${data.lobby.game_id}/${data.settings.cardType.toLocaleLowerCase()}`);
            } else if (data.error) {
                lobbyService.joinLobby(lobby_id as string).then((data: any) => {
                    if (data.error) {
                        router.replace("/games");
                    }
                    setLobby(data);
                    setForm(data.settings);
                });
            } else {
                setLobby(data);
                setForm(data.settings);
            }
        });

        return () => {
            socket.close();
        };
    }, [lobby_id, user, router]);


    function sendChat(e: any) {
        e.preventDefault();
        const chat = e.target.chat.value;
        e.target.chat.value = "";
        lobbyService.sendChatMessage(lobby_id as string, user!.username, chat);
    }

    function startLobbyGame() {
        gameService.startGame(lobby_id as string);
    }

    function setFormData(obj: any) {
        setForm((prev:any) => ({ ...prev, ...obj }));
    }

    function saveEdit(form: any) {
        console.log(form);
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


    function removePlayer(index: number) {
        lobby!.users.splice(index, 1);
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
                            <button onClick={startLobbyGame} className="bg-blue-600 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold hover:bg-blue-500 duration-200 focus:ring-2 ">Start</button>
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


            </main>
            <main className="lg:w-1/2 w-full min-h-screen bg-[#3f3f46c0] rounded-md flex flex-col p-3 text-zinc-300">

                <LobbySettings cancel={cancelEdit} getForm={form} save={saveEdit} canEdit title="Lobby settings"></LobbySettings>
            </main>
        </main>
    )
}