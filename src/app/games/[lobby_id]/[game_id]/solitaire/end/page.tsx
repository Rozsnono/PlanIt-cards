"use client";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/assets/icons";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { GameService, SolitaireService } from "@/services/game.service";
import Loader from "@/components/loader.component";
import CardsUrls from "@/contexts/cards.context";
import { useContext } from "react";
import { UserContext } from "@/contexts/user.context";

export default function End() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;

    const { user } = useContext(UserContext);

    const router = useRouter();

    const gameSerivce = new GameService('');
    const data = useQuery('game', async () => { return gameSerivce.getGameHistory(user!.customId.toString(), game_id!.toString()) });

    function getPosition(allCards: any, id: string) {
        return "1:st";
        const positions = Object.values(allCards).map((cards: any) => { return cards.reduce((sum: any, obj: any) => { return sum + obj.value }, 0) });
        const sorted = positions.sort((a: any, b: any) => a - b);
        // if (sorted[0] !== 0) router.back();
        switch (sorted.indexOf(allCards[id].reduce((sum: any, obj: any) => { return sum + obj.value }, 0))) {
            case 0:
                return "1:st";
            case 1:
                return "2:nd";
            case 2:
                return "3:rd";
            default:
                return sorted.indexOf(allCards[id].reduce((sum: any, obj: any) => { return sum + obj.value }, 0)) + ":th";
        }
    }

    async function startNewGame() {
        const gameService = new SolitaireService();
        gameService.restartGame(lobby_id as string, game_id as string).then(data => {
            router.replace(`/games/${lobby_id}/${game_id}/solitaire`);
            router.refresh();
        });
    }

    return (
        <main className="w-full rounded-md p-5 min-h-screen text-zinc-200 relative gap-2">
            <div className="flex justify-between items-center pb-1">
                <div className="text-xl p-2 flex gap-2 items-center">
                    <Icon name="card" stroke></Icon>
                    Statistics
                </div>
                <div className="flex gap-2 relative">
                    <div onClick={startNewGame} className="text-zinc-200 p-2 px-4 rounded-md hover:bg-blue-700 focus:bg-zinc-800 flex items-center gap-1 cursor-pointer">
                        <Icon name="game" stroke></Icon>
                        Start new game
                    </div>
                </div>
                <div className="flex gap-2 relative">
                    <Link href={"/games"} className="text-zinc-200 p-2 px-4 rounded-md hover:bg-zinc-800 focus:bg-zinc-800 flex items-center gap-1 cursor-pointer">
                        <Icon name="join"></Icon>
                        Return to tables
                    </Link>
                </div>
            </div>
            <hr />
            <div className={`w-full flex justify-center items-center h-full pt-2`}>

                {data.isLoading && <Loader></Loader>}
                {data.isError && <div>Error</div>}
                {data.isSuccess && !data.isLoading && !data.isError && data.data &&
                    data.data.players.map((l: any, index: number) => (
                        <PlayerCard key={index} playerInfo={l} rank={l.rank} gain={data.data.rank.find((c: any) => c.player === l.customId).rank} pos={data.data.position.find((c: any) => c.player === l.customId).position} ></PlayerCard>
                    ))
                }
            </div>
        </main>
    )
}

function PlayerCard({ rank, gain, pos, playerInfo}: { rank: number, gain: number, pos: number, playerInfo: any }) {
    return (
        <div className="rounded-lg w-1/3 h-full bg-zinc-800 flex flex-col p-4 justify-between gap-3">
            <div className="flex w-full justify-between">
                <Link href={`/profile/${playerInfo.customId}`} className="flex gap-2 items-center">
                    <div style={{ backgroundColor: getColorByInitials(playerInfo).background, color: getColorByInitials(playerInfo).text }} className={"flex justify-center items-center w-16 h-16 rounded-full text-xl"}>
                        {getUserInitials(playerInfo.firstName, playerInfo.lastName)}
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1>{playerInfo.firstName} {playerInfo.lastName}</h1>
                        <h2 style={{ color: getRankName(playerInfo.rank).color }} className="text-[0.7rem] flex justify-start items-center w-full font-bold">
                            <div dangerouslySetInnerHTML={{ __html: getRankName(playerInfo.rank).icon }}></div>
                            {getRankName(playerInfo.rank).title}
                        </h2>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col w-full gap-2 h-full">
                <div className="flex items-center border border-zinc-500 rounded-lg p-2 px-4 w-full gap-3">
                    <div className="text-lg font-bold">Place</div>
                    <div className="w-[0.1rem] h-full bg-zinc-600 rounded-lg" />
                    <div className="w-full h-full flex justify-center items-center text-[2rem] font-bold">
                        <div className="flex ">
                            {pos}
                        </div>
                    </div>
                </div>
                <div className="flex items-center border border-zinc-500 rounded-lg p-2 px-4 w-full gap-3">
                    <div className="text-lg font-bold">Rank gain</div>
                    <div className="w-[0.1rem] h-full bg-zinc-600 rounded-lg" />
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <h2 style={{ color: getRankName(playerInfo.rank).color }} className="flex text-xl justify-center items-center w-full font-bold">
                            <div dangerouslySetInnerHTML={{ __html: getRankName(playerInfo.rank).icon }}></div>
                            {getRankName(playerInfo.rank).title}
                        </h2>
                        <div className="flex gap-1 items-center">
                            <div className="text-lg font-bold">+ {gain}</div>
                        </div>
                        <div className="flex gap-2 flex-wrap font-thin relative w-full">
                            <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>
                            <div style={{ width: `${getCurrentRank(playerInfo.rank)}%` }} className="rounded-full h-2 bg-green-400 z-50"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}