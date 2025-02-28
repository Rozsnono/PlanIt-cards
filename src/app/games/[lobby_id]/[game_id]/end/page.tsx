"use client";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Link from "next/link";
import Image from "next/image";
import getCardUrl from "@/contexts/cards.context";
import Icon from "@/assets/icons";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { GameService } from "@/services/game.service";
import Loader from "@/components/loader.component";

export default function End() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;

    const gameSerivce = new GameService('');
    const data = useQuery('game', async () => { return gameSerivce.getGame(lobby_id, game_id?.toString()) });

    function getPosition(allCards: any, id: string) {
        const positions = Object.values(allCards).map((cards: any) => { return cards.reduce((sum: any, obj: any) => { return sum + obj.value }, 0) });
        const sorted = positions.sort((a: any, b: any) => b + a);
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

    return (
        <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200 relative gap-2">
            <div className="flex justify-between items-center">
                <div className="text-xl p-2 flex gap-2 items-center">
                    <Icon name="card" stroke></Icon>
                    Statistics
                </div>
                <div>
                    <div className="flex gap-2 relative">
                        <Link href={'/games/' + lobby_id} className="text-zinc-200 p-2 px-4 rounded-md hover:bg-zinc-800 focus:bg-zinc-800 flex items-center gap-1">
                            <Icon name="join"></Icon>
                            Return to lobby
                        </Link>
                    </div>
                </div>
            </div>
            <hr />
            <div className={`w-full grid gap-2 grid-cols-4 justify-center items-center h-full pt-2`}>

                {data.isLoading && <Loader></Loader>}
                {data.isError && <div>Error</div>}
                {data.isSuccess && !data.isLoading && !data.isError && data.data && data.data.lobby &&
                    data.data.lobby.users.map((l: any, index: number) => (
                        <Players place={getPosition(data.data.game.playerCards, l._id)} key={index} playerInfo={{ firstName: l.firstName, lastName: l.lastName, customId: l.customId, rank: l.rank }} cards={data.data.game.playerCards[l._id]}></Players>
                    ))
                }
                {data.isSuccess && !data.isLoading && !data.isError && data.data && data.data.lobby &&
                    data.data.lobby.bots.map((l: any, index: number) => (
                        <Players place={getPosition(data.data.game.playerCards, l._id)} key={index} playerInfo={{ firstName: l.name, lastName: 'Bot', customId: l._id, rank: 'BOT' }} cards={data.data.game.playerCards[l._id]}></Players>
                    ))
                }
            </div>
        </main>
    )
}

function Players({ playerInfo, cards, place }: { playerInfo: any, cards: any, place: string }) {

    return (
        <div className="rounded-lg w-full h-full bg-zinc-800 flex flex-col p-4 justify-between gap-3">
            <div className="flex w-full justify-between">
                <Link href={`/profile/${playerInfo.customId}`} className="flex gap-2 items-center">
                    <div style={{ backgroundColor: getColorByInitials(getUserInitials(playerInfo.firstName, playerInfo.lastName)!).background, color: getColorByInitials(getUserInitials(playerInfo.firstName, playerInfo.lastName)!).text }} className={"flex justify-center items-center w-16 h-16 rounded-full text-xl"}>
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
                            {place.split(":")[0]}
                            <span className="font-thin text-md">{place.split(":")[1]}</span>
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
                            <div className="text-lg font-thin">{playerInfo.rank}</div>
                            <div className="text-lg font-bold">+ 50</div>
                        </div>
                        <div className="flex gap-2 flex-wrap font-thin relative w-full">
                            <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>
                            <div style={{ width: `${getCurrentRank(playerInfo.rank + 50)}%` }} className="rounded-full h-2 bg-green-400 z-50"></div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex w-full relative">
                {
                    cards.map((card, index) => (
                        <div key={index} className="w-10 bg-zinc-700 rounded-md flex justify-center items-center">
                            <Image src={"/assets/cards/" + getCardUrl(card.name)} width={100} height={100} alt={card.name}></Image>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}