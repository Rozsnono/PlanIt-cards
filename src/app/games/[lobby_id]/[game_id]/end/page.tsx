"use client";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import getCardUrl from "@/contexts/cards.context";

export default function End() {

    const router = useRouter();
    const numberOfPlayers = 2;

    const playerInfo = { firstName: "Náspár", lastName: "Gorbert", rank: 700, customId: "526f7a734e6f7262657274db9a881e3d8590d4dd" }


    return (
        <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200 relative flex">
            <div className={`w-full grid gap-2 grid-cols-${numberOfPlayers} justify-center items-center`}>
                <Players playerInfo={playerInfo}></Players>
                <Players playerInfo={playerInfo}></Players>
                <Players playerInfo={playerInfo}></Players>
            </div>
        </main>
    )
}

function Players({ playerInfo }: { playerInfo: any }) {

    const cards = [
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
        { name: "2S", rank: 2, suit: "S", isJoker: false },
    ]

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
            <div className="flex w-full gap-2 h-full">
                <div className="flex flex-col items-center border border-zinc-500 rounded-lg p-4 w-full">
                    <div className="text-lg font-bold">Place</div>
                    <div className="w-full h-[0.1rem] bg-zinc-600 rounded-lg" />
                    <div className="w-full h-full flex justify-center items-center text-[7rem] font-bold">
                        <div className="flex ">
                            1
                            <span className="font-thin text-4xl">th</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center border border-zinc-500 rounded-lg p-4 w-full">
                    <div className="text-lg font-bold">Rank gain</div>
                    <div className="w-full h-[0.1rem] bg-zinc-600 rounded-lg" />
                    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                        <div className="flex h-20 relative">
                            <div className="scale-[5] absolute top-2 -left-3" dangerouslySetInnerHTML={{ __html: getRankName(playerInfo.rank).icon }}></div>
                        </div>
                        <div>{getRankName(playerInfo.rank).title}</div>
                        <div className="flex gap-1 items-center">
                            <div className="text-2xl font-thin">{playerInfo.rank}</div>
                            <div className="text-2xl font-bold">+ 50</div>
                        </div>
                        <div className="flex gap-2 flex-wrap font-thin relative w-full">
                            <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>
                            <div style={{ width: `${getCurrentRank(playerInfo.rank + 50)}%` }} className="rounded-full h-2 bg-green-400 z-50"></div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col items-center border border-zinc-500 rounded-lg p-4 w-full">
                    <div className="text-lg font-bold">Achievements</div>
                    <div className="w-full h-[0.1rem] bg-zinc-600 rounded-lg" />

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
                <div className="absolute bottom-2 right-3 flex flex-col gap-1 text-zinc-200 text-[0.9rem] items-center">
                    <div className="font-bold">Value</div>
                    <div>100</div>
                </div>
            </div>
        </div>
    )
}