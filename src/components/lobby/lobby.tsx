import Icon from "@/assets/icons";
import Link from "next/link";
import Image from "next/image";
import { Ilobby } from "@/interfaces/interface";
import { useContext } from "react";
import { UserContext } from "@/contexts/user.context";
import React from "react";
import { useRouter } from "next/navigation";
import LobbyService from "@/services/lobby.service";

export default function LobbyCard({ lobbyDatas, lobbyNumber, isAdmin }: { lobbyDatas: Ilobby, lobbyNumber: number, isAdmin?: boolean }) {

    const { user } = useContext(UserContext);
    const lobbyService = new LobbyService();
    const router = useRouter();

    function getGameTypeImage() {
        switch (lobbyDatas.settings.cardType) {
            case "UNO":
                return "/assets/images/uno.png";
            case "RUMMY":
                return "/assets/images/rummy.png";
            case "SOLITAIRE":
                return "/assets/images/rummy.png";
            case "SCHNAPPS":
                return "/assets/images/schnapps.png";
        }
    }

    function getCardStyleByType() {
        switch (lobbyDatas.settings.cardType) {
            case "UNO":
                return "bg-gradient-to-br from-purple-800 to-red-900";
            case "RUMMY":
                return "bg-gradient-to-br from-purple-800 to-gray-600";
            case "SOLITAIRE":
                return "bg-gradient-to-br from-purple-800 to-blue-600";
            case "SCHNAPPS":
                return "bg-gradient-to-br from-purple-800 to-orange-900";
        }
    }

    function joinLobbyByCode(e: any) {
        e.preventDefault();
        if (!e.target.lobbyCode.value) return;
        lobbyService.joinLobby(lobbyDatas._id, e.target.lobbyCode.value).then(data => {
            router.push("/games/" + lobbyDatas._id);
        });
    }

    function Button({ lobbyDatas }: { lobbyDatas: any }) {

        if (isAdmin) {
            return (
                <div className="bg-blue-500 text-white p-2 px-2 rounded-md hover:bg-blue-400 flex items-center gap-1">
                    <Icon name="pen"></Icon>
                    Edit
                </div>
            )
        }

        if (lobbyDatas.settings.privateLobby && !lobbyDatas.users.find((u: any) => u._id === user?._id)) {
            return (
                <form onSubmit={joinLobbyByCode} className="flex items-center gap-1">
                    <input id="lobbyCode" type="text" className="w-full max-w-64 p-2 rounded-l-md bg-zinc-700" />
                    <button type="submit" className="bg-blue-500 text-white p-2 px-2 rounded-r-md hover:bg-blue-400 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon name="key"></Icon>
                        Join
                    </button>
                </form>
            )
        }
        if (lobbyDatas.users.find((u: any) => u._id === user?._id)) {
            return (
                <Link href={"games/" + lobbyDatas._id} className="bg-green-700 text-white p-2 px-5 rounded-md hover:bg-green-600 flex items-center gap-1 hover:scale-105 transition-transform duration-200">
                    <Icon name="join"></Icon>
                    Join
                </Link>
            )
        } else if (lobbyDatas.game_id && lobbyDatas.settings.cardType !== "SOLITAIRE" && lobbyDatas.settings.cardType !== "SCHNAPPS") {
            return (
                <Link href={"games/" + lobbyDatas._id + "/" + lobbyDatas.game_id + "/" + lobbyDatas.settings.cardType.toLowerCase() + "/watch"} className="bg-zinc-500 text-white p-2 px-2 rounded-md hover:bg-zinc-400 flex items-center gap-1 hover:scale-105 transition-transform duration-200">
                    <Icon name="watch"></Icon>
                    Watch
                </Link>
            )
        } else if (lobbyDatas.game_id) {
            return <div></div>;
        } else {
            return (

                <Link href={"games/" + lobbyDatas._id} className="bg-green-700 text-white p-2 px-5 rounded-md hover:bg-green-600 flex items-center gap-1 hover:scale-105 transition-transform duration-200">
                    <Icon name="join"></Icon>
                    Join
                </Link>
            )
        }
    }


    return (
        <main className="flex flex-col rounded-xl bg-zinc-800/70 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 2xl:max-h-[35rem] max-h-fit">
            <div className={`w-full bg-gradient-to-l flex items-center justify-between p-4 ${getCardStyleByType()}`}>
                <div className="text-white font-bold text-lg flex flex-col ">
                    <span>Lobby {lobbyNumber}</span>
                    <span className="text-sm font-thin tracking-widest ms-2 orbitron">
                        {lobbyDatas.settings.cardType}
                    </span>
                </div>
                <div className="text-white text-sm font-thin tracking-widest flex items-center gap-2 rounded-full bg-sky-300/20 px-2 py-1">
                    {(lobbyDatas.users.length || 0) + (lobbyDatas.bots.length || 0)}/{lobbyDatas.settings.numberOfPlayers}
                </div>
            </div>
            <div className="p-4 2xl:hidden flex"></div>
            <div className="h-full w-full p-2 flex-col gap-2 2xl:flex hidden">
                {
                    lobbyDatas.users?.filter((p) => p._id == user?._id).map(player => (
                        <div key={player.username} className={`flex justify-between gap-1 p-2 text-zinc-200 items-center w-full mx-auto border border-purple-500 rounded-md`}>
                            <div className="">{player.username}</div>
                            <div className="text-md orbitron">{player.rank}</div>
                        </div>
                    ))
                }

                {
                    lobbyDatas.users?.filter((p) => p._id !== user?._id).map(player => (
                        <div key={player.username} className="flex justify-between gap-1 px-2 p-1 items-center w-full mx-auto border border-zinc-500 rounded-md text-[1rem]">
                            <div className="text-zinc-400">{player.username}</div>
                            <div className="text-sm text-zinc-400 orbitron">{player.rank}</div>
                        </div>
                    ))
                }


                {
                    lobbyDatas.bots?.map(bot => (
                        <div key={bot._id} className="flex justify-between gap-1 px-2 p-1 items-center w-full mx-auto border border-zinc-500 rounded-md text-[1rem]">
                            <div className="text-zinc-400">{bot.name}</div>
                            <div className="text-sm rounded-full bg-amber-900/30 border border-amber-900/70 text-zinc-400 px-2">Bot</div>
                        </div>
                    ))
                }

                {
                    lobbyDatas.settings.numberOfPlayers - (lobbyDatas.users?.length + (lobbyDatas.bots?.length || 0) || 0) > 0 &&
                        !lobbyDatas.game_id || !(lobbyDatas.users?.length && lobbyDatas.users?.length + (lobbyDatas.bots?.length || 0) >= lobbyDatas.settings.numberOfPlayers) ?
                        new Array(lobbyDatas.settings.numberOfPlayers - (lobbyDatas.users?.length + (lobbyDatas.bots?.length || 0) || 0) || 0).fill(0).map((_, i) => (
                            <div key={i} className="flex gap-1 w-full justify-center items-center bg-zinc-700 p-2 rounded-lg animate-pulse mx-auto">
                            </div>
                        )) : null
                }
            </div>
            <div className="w-full flex justify-between px-4 py-2">
                <Button lobbyDatas={lobbyDatas}></Button>
                <Image src={getGameTypeImage()} width={80} height={50} alt={lobbyDatas.settings.cardType}></Image>

            </div>
            <div className="w-full flex justify-between items-center p-4 border-t border-zinc-700">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    {
                        !lobbyDatas.settings.privateLobby && !lobbyDatas.game_id && (lobbyDatas.users.length || 0) + (lobbyDatas.bots.length || 0) < lobbyDatas.settings.numberOfPlayers &&
                        <span>
                            Waiting for players...
                        </span>
                    }
                    {
                        (lobbyDatas.users.length || 0) + (lobbyDatas.bots.length || 0) == lobbyDatas.settings.numberOfPlayers && lobbyDatas.users.find((u: any) => u._id === user?._id) &&
                        <span>
                            You are in the game!
                        </span>
                    }
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    {
                        !lobbyDatas.settings.privateLobby && !lobbyDatas.game_id && (lobbyDatas.users.length || 0) + (lobbyDatas.bots.length || 0) == lobbyDatas.settings.numberOfPlayers &&
                        <>
                            <div className="w-2 h-2 bg-yellow-400 animate-pulse rounded-full"></div>
                            Waiting
                        </>
                    }
                    {
                        lobbyDatas.settings.privateLobby &&
                        <>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Private
                        </>
                    }
                    {
                        !lobbyDatas.game_id && (lobbyDatas.users.length || 0) + (lobbyDatas.bots.length || 0) < lobbyDatas.settings.numberOfPlayers &&
                        <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Ready
                        </>
                    }
                    {
                        !lobbyDatas.settings.privateLobby && lobbyDatas.game_id &&
                        <>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Started
                        </>
                    }

                </div>
            </div>
        </main>
    )
}