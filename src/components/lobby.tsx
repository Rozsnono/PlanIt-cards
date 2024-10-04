import Icon from "@/assets/icons";
import Link from "next/link";

export default function Lobby({ robber, started, lobbyNumber, maxNumberOfPlayer = 4, players }: { robber?: boolean, started?: boolean, lobbyNumber?: number, maxNumberOfPlayer?: number, players?: { name: string, rank: number }[] }) {
    return (
        <main className="flex gap-2">
            <main className={`w-full rounded-md p-3 text-zinc-200 gap-3 flex flex-col ${robber ? "border border-zinc-500 bg-zinc-900" : "bg-zinc-800"}`}>
                <div className="flex justify-between">
                    <div className="font-bold">Lobby {lobbyNumber}</div>
                    <div className="font-thin">{players?.length ? players.length : 0}/{maxNumberOfPlayer}</div>
                </div>

                <hr />

                <div className="grid grid-cols-4 gap-4 w-full justify-center h-full">
                    {
                        players?.map(player => (
                            <div key={player.name} className="flex flex-col gap-1 items-center h-14 w-14 mx-auto">
                                <div className="text-xl">{player.name}</div>
                                <div className="text-md">{player.rank}</div>
                            </div>
                        ))
                    }

                    {
                        !players?.length || players?.length < maxNumberOfPlayer ?
                            new Array(maxNumberOfPlayer - (players?.length || 0)).fill(0).map((_, i) => (
                                <div key={i} className="flex flex-col gap-1 h-14 w-14 justify-center items-center bg-zinc-700 p-2 rounded-lg animate-pulse mx-auto">
                                </div>
                            )) : null
                    }

                </div>

                <div className="flex gap-1 justify-between items-end select-none">
                    {
                        started || (players?.length && players?.length >= maxNumberOfPlayer) ?
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

                    {
                        robber ?
                            <div className="font-bold italic">Robber</div>

                            : null
                    }
                </div>
            </main>
        </main>
    )
}