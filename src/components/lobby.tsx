import Icon from "@/assets/icons";
import Link from "next/link";
import Image from "next/image";
import { Ilobby } from "@/interfaces/interface";

export default function LobbyCard({ lobbyDatas, lobbyNumber }: { lobbyDatas: Ilobby, lobbyNumber: number }) {


    function getGameTypeImage() {
        switch (lobbyDatas.settings.type) {
            case "UNO":
                return "/assets/images/uno.png";
            case "RUMMY":
                return "/assets/images/rummy.png";
            case "SCHNAPSEN":
                return "/assets/images/schnapsen.png";
        }
    }

    function getCardStyleByType() {
        switch (lobbyDatas.settings.type) {
            case "UNO":
                return "border border-red-600 bg-zinc-800";
            case "RUMMY":
                if (lobbyDatas.settings.robberRummy) {
                    return "border border-zinc-500 bg-zinc-900";
                }
                return "bg-zinc-800";
            case "SCHNAPSEN":
                return "border border-green-800 bg-zinc-700";
        }
    }

    return (
        <main className="flex gap-2">
            <main className={`w-full rounded-md p-3 text-zinc-200 gap-3 flex flex-col ${getCardStyleByType()}`}>
                <div className="flex justify-between">
                    <div className="font-bold">Lobby {lobbyNumber}</div>
                    <div className="tracking-widest flex gap-3">
                        {lobbyDatas.settings.type}{lobbyDatas.settings.robberRummy && <div className="italic font-bold">Rubber</div>}
                    </div>
                    <div className="font-thin">{lobbyDatas.players?.length ? lobbyDatas.players.length : 0}/{lobbyDatas.settings.numberOfPlayers}</div>
                </div>

                <hr />

                <div className="grid grid-cols-4 gap-4 w-full justify-center h-full">
                    {
                        lobbyDatas.players?.map(player => (
                            <div key={player.name} className="flex flex-col gap-1 items-center h-14 w-14 mx-auto">
                                <div className="text-xl">{player.name}</div>
                                <div className="text-md">{player.rank}</div>
                            </div>
                        ))
                    }

                    {
                        !lobbyDatas.players?.length || lobbyDatas.players?.length < lobbyDatas.settings.numberOfPlayers ?
                            new Array(lobbyDatas.settings.numberOfPlayers - (lobbyDatas.players?.length || 0)).fill(0).map((_, i) => (
                                <div key={i} className="flex flex-col gap-1 h-14 w-14 justify-center items-center bg-zinc-700 p-2 rounded-lg animate-pulse mx-auto">
                                </div>
                            )) : null
                    }

                </div>

                <div className="flex gap-1 justify-between items-end select-none">
                    {
                        lobbyDatas.game_id || (lobbyDatas.players?.length && lobbyDatas.players?.length >= lobbyDatas.settings.numberOfPlayers) ?
                            <Link href={"games/123456"} className="bg-zinc-500 text-white p-2 px-2 rounded-md hover:bg-zinc-400 flex items-center gap-1">
                                <Icon name="watch"></Icon>
                                Watch
                            </Link>
                            :
                            <Link href={"games/123456"} className="bg-green-700 text-white p-2 px-2 rounded-md hover:bg-green-600 flex items-center gap-1">
                                <Icon name="join"></Icon>
                                Join
                            </Link>
                    }


                    <Image src={getGameTypeImage()} width={100} height={100} alt={lobbyDatas.settings.type}></Image>
                </div>
            </main>
        </main>
    )
}