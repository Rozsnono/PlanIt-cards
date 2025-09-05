"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import { UserContext } from "@/contexts/user.context";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Ilobby } from "@/interfaces/interface";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { GameService } from "@/services/game.service";
import LobbyService from "@/services/lobby.service";
import LobbySettings from "@/components/lobby/lobby.settings.component";
import ProfileService from "@/services/profile.service";
import Loading from "@/app/loading";
import { useQuery } from "react-query";
const lobbyService = new LobbyService();

export default function LobbyId() {
    const lobby_id = useParams().lobby_id;
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [form, setForm] = useState<any>({});

    const [lobby, setLobby] = useState<Ilobby | null>(null);
    const [isChanged, setIsChanged] = useState(false);
    const [tmpForm, setTmpForm] = useState<any>({});
    const [friendInvite, setFriendInvite] = useState(false);
    const [friendSearch, setFriendSearch] = useState("");

    useEffect(()=>{
        setFriendInviteSent(false);
    }, [friendInvite])

    const [friendInviteSent, setFriendInviteSent] = useState(false);

    const friends = useQuery('friends', async () => {
        const res = await new ProfileService().getFriends(friendSearch);
        return res;
    });

    useEffect(() => {
        const socket = lobbyService.connectWebSocket(lobby_id as string, user!._id, (data: any) => {
            if (data.status) {
                lobbyService.joinLobby(lobby_id as string).then((lobbyData: any) => {
                    if (lobbyData.error) {
                        router.replace("/games");
                    }
                    setLobby(lobbyData);
                    setForm(lobbyData.settings);
                }).catch((err) => {
                    console.error("Error joining lobby:", err);
                    router.replace("/games");
                });
            }
            if (data.game_over) {
                router.push(`/games`);
            }
            if (!data.lobby) return;

            if (data.lobby.game_id) {
                router.push(`/games/${lobby_id}/${data.lobby.game_id}/${data.lobby.settings.cardType.toLocaleLowerCase()}`);
            } else {
                setLobby(data.lobby);
                setForm(data.lobby.settings);
            }

            if (data.lobby.users && !data.lobby.users.find((u: any) => u._id === user!._id)) {
                router.replace("/games");
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
        const res = await new GameService(type).startGame(lobby_id as string, form.timeLimit);
        if (res.error) {
            console.error(res.error);
        }
        router.push(`/games/${lobby_id}/${res.game_id}/${lobby!.settings.cardType.toLocaleLowerCase()}`);
    }

    function saveEdit() {
        lobbyService.editLobby(lobby_id as string, tmpForm).then((data) => {
            if (data.error) {
                console.error(data.error);
            }
            setIsChanged(false);
        });
    }

    function cancelEdit() {
        setForm(lobby!.settings);
    }

    if (!lobby || !lobby.settings) {
        return <Loading></Loading>
    }

    function checkIfChanged(form: any) {
        if (!lobby) return false;
        if (!form) return false;
        const keys = Object.keys(form);
        setTmpForm(form);
        for (const key of keys) {
            if (form[key] !== (lobby.settings as any)[key]) {
                setIsChanged(true);
                return;
            }
        }
        setIsChanged(false);
    }


    function removePlayer(id: string) {
        lobbyService.kickFromLobby(lobby_id as string, id);
    }


    return (
        <main className="flex flex-col md:flex-row gap-2 justify-center w-full md:w-3/4 mx-auto h-full">
            <main className="w-1/2 border border-purple-800/50 bg-black/40 h-full rounded-2xl flex flex-col p-6 gap-2">
                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="users" size={32}></Icon>
                        Players
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2">
                        {
                            lobby.users.length === 0 && <span className="text-zinc-400">No players in the lobby yet.</span>
                        }
                        {
                            new Array(lobby.settings.numberOfPlayers).fill(0).map((_, i) => {
                                if (i < lobby.users.length) {
                                    return (
                                        <PlayerCard key={i} playerData={lobby.users[i]} createdBy={lobby.createdBy} currentPlayer={user!._id} removePlayer={removePlayer} mutePlayer={() => { }}></PlayerCard>
                                    )
                                } else if (i - lobby.users.length < lobby.bots.length) {
                                    return (
                                        null
                                    );
                                }
                                return (
                                    <PlayerCard key={i} loading></PlayerCard>
                                );
                            })

                        }
                    </div>
                </div>

                {
                    !friends.isLoading && friends.data && friends.data.length > 0 &&
                    <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                        <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                            <Icon name="users" size={32}></Icon>
                            Friends
                        </div>

                        <div className="border-b-[0.1rem] border-purple-800/50"></div>

                        <div className="flex flex-col w-full justify-end mx-auto ">
                            <button onClick={() => setFriendInvite(true)} className="bg-gradient-to-l from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-400 disabled:from-purple-500/50 disabled:to-purple-700/50 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold duration-200 focus:ring-2 disabled:text-zinc-400 disabled:cursor-not-allowed">Invite Friends</button>
                        </div>

                        {
                            friendInvite &&
                            <main className="fixed top-0 left-0 w-full h-full bg-black/50 z-[4000] flex items-center justify-center">
                                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/90 shadow-lg p-6 flex flex-col gap-4 max-w-md relative">
                                    <div className="absolute top-4 right-4">
                                        <button onClick={() => setFriendInvite(false)} className="text-purple-400 hover:text-purple-300">
                                            <Icon name="close" size={24}></Icon>
                                        </button>
                                    </div>
                                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                                        <Icon name="users" size={32}></Icon>
                                        Invite Friends
                                    </div>
                                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                                    <input type="text" value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            friends.refetch();
                                        }
                                    }} placeholder="Enter username" className="w-full p-2 rounded-md bg-purple-700/40 border border-purple-500/30 text-white" />
                                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                                    {
                                        friendInviteSent &&
                                        <div className="flex items-center justify-center text-sm">
                                            <div className="text-green-500">Friend invite sent!</div>
                                        </div>

                                    }

                                    <div className="flex flex-col gap-4 h-full overflow-auto">
                                        {
                                            friends.isLoading ? (
                                                <div className="text-zinc-400">Loading friends...</div>
                                            ) : (
                                                friends.data.map((friend: any) => (
                                                    <PlayerCard key={friend._id} playerData={friend} onlyInvite invitePlayer={() => {
                                                        setFriendInviteSent(false);
                                                        new ProfileService().createGameInvite(lobby._id, friend.customId).then(() => {
                                                            setFriendInviteSent(true);
                                                        });
                                                    }}></PlayerCard>
                                                ))
                                            )
                                        }
                                    </div>
                                </div>
                            </main>
                        }

                    </div>
                }



                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col h-full">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="chat" size={32}></Icon>
                        Chat
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 h-full">
                        <div className="h-full w-full rounded-md flex flex-col gap-1 text-zinc-300 overflow-auto">
                            {
                                lobby.chat.map((message, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className={`${message.sender === user?.username ? 'text-purple-500/80 font-bold' : 'text-zinc-500'}`}>{message.sender}:</span>
                                        <span className="">{message.message}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <form onSubmit={sendChat} className="w-full pt-3 flex gap-2">
                            <input type="text" id="chat" className="bg-purple-700/40 border border-purple-400/50 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Aa" />
                            <button type="submit" className="bg-purple-500/60 hover:bg-purple-400/80 text-white p-1 px-2 rounded-md flex items-center duration-200 hover:scale-105">
                                <Icon name="send"></Icon>
                            </button>
                        </form>
                    </div>
                </div>

            </main>
            <main className="w-full border border-purple-800/50 bg-gradient-to-br from-indigo-800/10 via-black/40 to-purple-900/10 h-full rounded-2xl flex flex-col p-6 gap-2 items-center justify-center">

                <div className="flex flex-col gap-5">
                    <div className="rounded-full flex items-center justify-center border-4 border-purple-600/50 w-96 h-96 animate-scale">
                        <div className="h-32 w-32 flex items-center justify-center bg-gradient-to-r from-purple-800/80 to-purple-400/80 shadow-2xl shadow-purple-500/50 rounded-full">
                            <Image src={"/assets/icon.png"} alt="Logo" height={100} width={100}></Image>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <h1 className="text-5xl text-purple-600 font-bold mt-4">{lobby.settings.cardType}</h1>
                        <div className="flex gap-4">
                            <span className="text-purple-400 text-lg flex items-center gap-2">
                                <Icon name="trophy" stroke></Icon>
                                <span className="text-zinc-300">
                                    {!lobby.settings.unranked ? 'Ranked' : 'Casual'} Match
                                </span>
                            </span>
                            <span className="text-purple-400 text-lg flex items-center gap-2">
                                <Icon name="mode" stroke></Icon>
                                <span className="text-zinc-300">

                                    {
                                        lobby.settings.fillWithRobots ?
                                            lobby.settings.robotsDifficulty :
                                            'Custom'
                                    } Mode
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
            <main className="w-1/2 border border-purple-800/50 bg-black/40 h-full rounded-2xl flex flex-col p-6 gap-2">
                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="users" size={32}></Icon>
                        Robots
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2">
                        {
                            lobby.bots.length === 0 && <span className="text-zinc-400">No robots allowed here!</span>
                        }
                        {
                            new Array(lobby.settings.numberOfPlayers).fill(0).map((_, i) => {
                                if (i < lobby.users.length) {
                                    return null
                                } else if (i - lobby.users.length < lobby.bots.length) {
                                    return (
                                        <PlayerCard bot key={i} playerData={{ username: lobby.bots[i - lobby.users.length].name, rank: '????' }} createdBy={lobby.createdBy} currentPlayer={user!._id} removePlayer={removePlayer} mutePlayer={() => { }}></PlayerCard>
                                    );
                                }
                                return (null);
                            })

                        }
                    </div>
                </div>

                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col h-full overflow-auto">
                    <div className="text-purple-600 text-lg font-bold flex items-center justify-between gap-2 p-2">
                        <span className="flex items-center gap-1">
                            <Icon name="settings" size={32}></Icon>
                            Lobby Settings
                        </span>

                        {
                            isChanged
                            &&
                            <button onClick={saveEdit} className="bg-gradient-to-br from-green-500/70 to-emerald-700/50 px-4 p-1 rounded-lg text-zinc-200 font-thin text-xs hover:from-emerald-600/70 hover:to-emerald-800/50">Save</button>
                        }

                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 h-full">
                        <LobbySettings changing={(form) => { checkIfChanged(form) }} justForm cancel={cancelEdit} getForm={form} save={saveEdit} canEdit={lobby.createdBy === user!._id} title="Lobby settings"></LobbySettings>
                    </div>

                    {
                        lobby.createdBy === user!._id &&
                        <div className="flex flex-col w-full justify-end mx-auto mt-8 3xl:mt-0">
                            <button disabled={lobby.users.length + lobby.bots.length < lobby.settings.numberOfPlayers || isChanged} onClick={startLobbyGame} className="bg-gradient-to-l from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-400 disabled:from-purple-500/50 disabled:to-purple-700/50 w-full rounded-lg p-2 px-5 text-zinc-200 font-bold duration-200 focus:ring-2 disabled:text-zinc-400 disabled:cursor-not-allowed">Start</button>
                        </div>
                    }
                </div>
            </main>
        </main>
    )
}

function PlayerCard({ playerData, loading, bot, createdBy, onlyInvite, removePlayer, mutePlayer, invitePlayer, currentPlayer }: { playerData?: any, loading?: boolean, bot?: boolean, createdBy?: string, onlyInvite?: boolean, removePlayer?: (id: string) => void, mutePlayer?: (id: string) => void, invitePlayer?: (id: string) => void, currentPlayer?: string }) {
    if (loading) {
        return (
            <main className="w-full bg-black/40 rounded-lg px-3 py-2 flex gap-2 border-2 border-purple-800/50 select-none items-center">
                <div className={`relative bg-zinc-800/70 text-zinc-200 flex items-center justify-center rounded-full w-12 h-12 duration-200 animate-pulse`}>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <div className="text-zinc-300 text-lg bg-zinc-600 animate-pulse rounded-lg w-32 h-3"></div>
                    <div className="text-zinc-300 text-lg bg-zinc-600 animate-pulse rounded-lg w-12 h-2"></div>
                </div>
            </main>
        )
    }

    if (bot) {
        return (
            <main className="w-full bg-black/40 rounded-lg px-3 py-2 flex gap-2 border-2 border-purple-800/50 select-none items-center">
                <div className={`relative bg-zinc-800/70 text-zinc-200 flex items-center justify-center rounded-full w-12 h-12 duration-200`}>
                    <StrokeIcon name="robot" size={24} />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-zinc-300 text-lg">{playerData.username}</div>
                    <div className="text-zinc-400 text-sm orbitron">{playerData.rank}</div>
                </div>
                <div className="flex h-full items-center justify-end gap-2 ml-auto">
                    <div className="rounded-full bg-purple-400/40 px-2 py-1 text-xs text-zinc-300">Bot</div>
                </div>
            </main>
        )
    }
    return (
        <main className={"w-full bg-black/40 rounded-lg px-3 py-2 flex gap-2 justify-between " + (currentPlayer === playerData._id ? 'border-2 border-purple-500 ' : 'border-2 border-purple-800/50')}>
            <div className="flex gap-2 items-center">
                <div className={`relative bg-zinc-800/70 text-zinc-200 flex items-center justify-center rounded-full w-12 h-12 duration-200`}>
                    <Icon name="user" size={24} />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-zinc-300 text-lg">{playerData.username}</div>
                    <div className="text-zinc-400 text-sm orbitron">{playerData.rank}</div>
                </div>
            </div>
            {
                currentPlayer !== playerData._id && !onlyInvite &&
                <div className="flex gap-2 flex-wrap justify-end">
                    <div onClick={() => { new ProfileService().createFriendRequest(playerData.customId) }} className="p-1 rounded-full bg-gradient-to-br from-blue-400 to-indigo-700 w-fit h-fit cursor-pointer hover:scale-110 transition-transform duration-200">
                        <Icon name="add-friend" size={16} />
                    </div>
                    <Link href={`/profile/${playerData.customId}`} className="p-1 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 w-fit h-fit cursor-pointer hover:scale-110 transition-transform duration-200">
                        <Icon name="info" size={16} />
                    </Link>
                    {
                        playerData._id !== createdBy &&
                        <div onClick={() => { removePlayer!(playerData._id) }} className="p-1 rounded-full bg-gradient-to-bl from-indigo-500 to-red-700 w-fit h-fit cursor-pointer hover:scale-110 transition-transform duration-200">
                            <Icon name="close" size={16} />
                        </div>
                    }
                </div>
            }

            {
                onlyInvite &&
                <div className="flex gap-2 flex-wrap justify-end">
                    <div onClick={() => { invitePlayer!(playerData._id) }} className="p-1 rounded-full bg-gradient-to-bl from-indigo-500 to-sky-700 w-fit h-fit cursor-pointer hover:scale-110 transition-transform duration-200">
                        <Icon name="invite" size={16} />
                    </div>
                </div>
            }
        </main>
    )
}