import Icon from "@/assets/icons";
import Link from "next/link";
import Image from "next/image";
import { Ilobby } from "@/interfaces/interface";
import { useContext } from "react";
import { UserContext } from "@/contexts/user.context";
import React from "react";
import { joinLobby } from "@/services/lobby.service";
import { useRouter } from "next/navigation";

export default function LobbyCard({ lobbyDatas, lobbyNumber }: { lobbyDatas: Ilobby, lobbyNumber: number }) {

    const { user } = useContext(UserContext);

    const router = useRouter();

    function getGameTypeImage() {
        switch (lobbyDatas.settings.cardType) {
            case "UNO":
                return "/assets/images/uno.png";
            case "RUMMY":
                return "/assets/images/rummy.png";
        }
    }

    function getCardStyleByType() {
        switch (lobbyDatas.settings.cardType) {
            case "UNO":
                return "border border-red-600 bg-zinc-800";
            case "RUMMY":
                if (lobbyDatas.settings.robberRummy) {
                    return "border border-zinc-500 bg-zinc-900";
                }
                return "bg-zinc-800";
        }
    }

    function joinLobbyByCode(e: any) {
        e.preventDefault();
        if (!e.target.lobbyCode.value) return;
        joinLobby(lobbyDatas._id, e.target.lobbyCode.value).then(data => {
            router.push("/games/" + lobbyDatas._id);
        });
    }

    function Button({ lobbyDatas }: { lobbyDatas: any }) {
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

                <Link href={"games/" + lobbyDatas._id} className="bg-green-700 text-white p-2 px-2 rounded-md hover:bg-green-600 flex items-center gap-1">
                    <Icon name="join"></Icon>
                    Join
                </Link>
            )
        }
        else if (lobbyDatas.game_id || (lobbyDatas.users?.length && lobbyDatas.users?.length + (lobbyDatas.bots?.length ? lobbyDatas.bots?.length : 0) >= lobbyDatas.settings.numberOfPlayers)) {
            return (
                <Link href={"games/" + lobbyDatas._id} className="bg-zinc-500 text-white p-2 px-2 rounded-md hover:bg-zinc-400 flex items-center gap-1">
                    <Icon name="watch"></Icon>
                    Watch
                </Link>
            )
        } else {
            return (

                <Link href={"games/" + lobbyDatas._id} className="bg-green-700 text-white p-2 px-2 rounded-md hover:bg-green-600 flex items-center gap-1">
                    <Icon name="join"></Icon>
                    Join
                </Link>
            )
        }
    }

    return (
        <main className="flex gap-2">
            <main className={`w-full rounded-md p-3 text-zinc-200 gap-3 flex flex-col ${getCardStyleByType()}`}>
                <div className="flex justify-between">
                    <div className="font-bold">Lobby {lobbyNumber}</div>
                    <div className="tracking-widest flex gap-3">
                        {lobbyDatas.settings.cardType}{lobbyDatas.settings.robberRummy && <div className="italic font-bold">Rubber</div>}
                    </div>
                    <div className="font-thin">{lobbyDatas.users?.length ? lobbyDatas.users.length : 0}/{lobbyDatas.settings.numberOfPlayers}</div>
                </div>

                <hr />

                <div className="grid grid-cols-4 gap-4 w-full justify-center h-full">
                    {
                        lobbyDatas.users?.map(player => (
                            <div key={player.username} className={`flex flex-col gap-1 items-center h-14 w-full mx-auto border ${player._id === user?._id ? "border-green-500 " : "border-zinc-500 "} rounded-md`}>
                                <div className="">{player.username}</div>
                                <div className="text-md">{player.rank}</div>
                            </div>
                        ))
                    }

                    {
                        lobbyDatas.bots?.map(bot => (
                            <div key={bot} className="flex flex-col gap-1 items-center h-14 w-full mx-auto border border-zinc-500 rounded-md">
                                <div className="">{bot}</div>
                                <div className="text-md">Bot</div>
                            </div>
                        ))
                    }

                    {
                        !lobbyDatas.game_id || !(lobbyDatas.users?.length && lobbyDatas.users?.length + (lobbyDatas.bots?.length || 0) >= lobbyDatas.settings.numberOfPlayers) ?
                            new Array(lobbyDatas.settings.numberOfPlayers - (lobbyDatas.users?.length + (lobbyDatas.bots?.length || 0) || 0)).fill(0).map((_, i) => (
                                <div key={i} className="flex flex-col gap-1 h-14 w-full justify-center items-center bg-zinc-700 p-2 rounded-lg animate-pulse mx-auto">
                                </div>
                            )) : null
                    }

                </div>

                <div className="flex gap-1 justify-between items-end select-none">
                    <Button lobbyDatas={lobbyDatas}></Button>


                    <Image src={getGameTypeImage()} width={100} height={100} alt={lobbyDatas.settings.cardType}></Image>
                </div>
            </main>
        </main>
    )
}