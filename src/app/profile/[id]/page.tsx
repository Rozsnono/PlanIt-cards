"use client";
import Icon from "@/assets/icons";
import Chart from "@/components/chart";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import Image from "next/image";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Pagination from "@/components/pagination";
import React, { useContext } from "react";
import { achievements } from "@/interfaces/achievement.enum";
import ProfileService from "@/services/profile.service";
import { UserContext } from "@/contexts/user.context";
import { GameHistoryService } from "@/services/game.history.service";
import Link from "next/link";
import Loader from "@/components/loader.component";

export default function ProfilePage() {

    const player_id = useParams().id;

    const [page, setPage] = React.useState(1);

    const { user } = useContext(UserContext);
    const profileService = new ProfileService();
    const gameHistoryService = new GameHistoryService();

    function getPlayer() {
        return profileService.getProfileData(player_id as string).then(res => res.json());
    }

    const player = useQuery("player", getPlayer, { enabled: !!player_id, refetchOnWindowFocus: false });

    const GameHistory = useQuery("gameHistory", async () => { return gameHistoryService.getGameHistoryByUser(player_id as string) }, { enabled: !!player_id, refetchOnWindowFocus: false });


    if (player.isLoading || player!.data.length == 0) return <Loader></Loader>
    if (!user) return <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">Please login to see this page</div>
    return (
        <main className="flex gap-2 p-4 h-full">
            <main className="w-full flex flex-col gap-3 items-center justify-start border-2 rounded-lg border-zinc-500">
                <div className="h-fit w-full p-2">
                    {
                        player.data.numberOfGames &&
                        <Chart data={{ wins: Object.values(player.data.numberOfGames).map((c: any) => c.wins).reduce((acc, num) => acc + num, 0), loses: Object.values(player.data.numberOfGames).map((c: any) => c.losses).reduce((acc, num) => acc + num, 0) }}></Chart>
                    }
                </div>
                <div className="text-xl p-2 flex gap-2 items-center text-zinc-100">
                    Replays
                </div>
                <div className="w-full gap-2 flex flex-col h-full p-2">
                    {!GameHistory.isLoading && GameHistory.data && GameHistory.data.map((game: any, i: number) => {
                        return (
                            <GameReplays link={`/games/${game.lobbyId}/${game.gameId}/replay`} key={i} pos={game.position.find((p: any) => p.player = user.customId) || {position: 0}} type={game.type} date={game.date}></GameReplays>
                        )
                    })}
                    {
                        !GameHistory.isLoading && GameHistory.data.length == 0 &&
                        <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
                            No game history found
                        </div>
                    }
                </div>
                <Pagination total={1} page={page} setPage={setPage}></Pagination>
            </main>
            <main className="lg:w-1/2 w-full bg-zinc-800 rounded-md p-3 h-full text-zinc-200">
                <div className="flex gap-2 p-6">
                    <div style={{ backgroundColor: getColorByInitials().background, color: getColorByInitials().text }} className="min-w-32 min-h-32 bg-red-600 rounded-full flex items-center justify-center text-4xl">{getUserInitials()}</div>
                    <div className="flex flex-col justify-center gap-3">
                        <div className="text-4xl">{player.data.firstName} {player.data.lastName}</div>
                        {
                            player.data.customId == user?.customId &&
                            <button className="text-zinc-300 bg-zinc-900 text-sm w-max hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="pen" size={16}></Icon> Edit profile</button>
                        }

                    </div>
                </div>

                <div className="flex gap-3 p-3 flex-col">
                    <h1>Statistics</h1>
                    <div className="flex gap-2 justify-between items-center font-bold">
                        <div className="flex items-center gap-1 text-lg">
                            {
                                player.data.numberOfGames &&
                                <>
                                    <Icon name="game" size={24} stroke></Icon>
                                    {Object.values(player.data.numberOfGames).map((c: any) => c.wins).reduce((acc, num) => acc + num, 0) + Object.values(player.data.numberOfGames).map((c: any) => c.losses).reduce((acc, num) => acc + num, 0)} Games
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-3 flex-col">
                    <h1>Rank</h1>
                    <div className="flex gap-2 justify-between items-center font-bold">
                        {player.data &&
                            <div style={{ color: getRankName(player.data.rank).color }} className="flex items-center gap-1 text-lg">
                                <div dangerouslySetInnerHTML={{ __html: getRankName(player.data.rank).icon }}></div>
                                {getRankName(player.data.rank).title}
                            </div>}

                        <div className="font-thin text-md">{player.data.rank} {getRankName(player.data.rank).max && "/"} <span className="text-[0.7rem]">{getRankName(player.data.rank).max}</span></div>
                    </div>
                    <div className="flex gap-2 flex-wrap font-thin relative">
                        <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>
                        <div style={{ width: `${getCurrentRank(player.data.rank)}%` }} className="rounded-full h-2 bg-green-400 z-50"></div>
                    </div>
                </div>

                <div className="flex gap-3 p-3 flex-col">
                    <h1>Achievements</h1>
                    <div className="grid 2xl:grid-cols-9 xl:grid-cols-6 grid-cols-4 gap-2 max-h-[40vh] overflow-y-auto">
                        {
                            player.data.achievements.map((achievement: any, i: number) => {
                                return (
                                    <Achievements key={i} imageSrc={achievement.image}  name={achievement.name} description={achievement.description}></Achievements>
                                )
                            })
                        }

                    </div>
                    {
                        player.data.achievements.length == 0 &&
                        <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
                            No achievements found
                        </div>
                    }
                </div>


                <div className="flex gap-3 p-3 flex-col">
                    <h1>Friends</h1>
                    <div className="flex gap-2 flex-wrap">
                        {
                            player.data.friends.map((friend: any, i: number) => {
                                return (
                                    <Link key={i} href={`/profile/${friend.customId}`}>
                                        <Friends name={friend.username} color={getColorByInitials(friend).background}></Friends>
                                    </Link>
                                )
                            })
                        }
                        {
                            player.data.friends.length == 0 &&
                            <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
                                No friends found
                            </div>
                        }
                    </div>
                </div>
            </main>
        </main>
    )
}

function GameReplays({ pos, type, date, link }: { pos: any, type: string, date: string, link: string }) {
    function getGameTypeImage() {
        switch (type) {
            case "UNO":
                return "/assets/images/uno.png";
            case "RUMMY":
                return "/assets/images/rummy.png";
            default:
                return "/assets/images/rummy.png";
        }
    }

    return (
        <div className={`w-full bg-zinc-700 rounded-md p-3 text-zinc-200 flex justify-between ${pos == 1 ? "border border-green-700" : ""}`}>
            <Image className="hidden md:flex" src={getGameTypeImage()} width={100} height={100} alt={type}></Image>
            <div className="flex flex-col gap-3 items-center justify-center">
                <div className="text-2xl">
                    #{pos.position}
                </div>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
                <div>
                    <Link href={link}>
                        <button className="flex justify-center items-center gap-1 bg-green-700 text-white p-2 px-2 rounded-xl justify-center hover:bg-green-600 flex items-center gap-1 duration-200"><Icon name="watch"></Icon>Watch</button>
                    </Link>
                </div>
                <div className="flex gap-1 justify-between items-end select-none">
                    <div className="font-thin text-xs">{new Date(date).toLocaleTimeString()}</div>
                    <div className="font-thin text-xs">-</div>
                    <div className="font-thin text-[0.5rem]">{new Date(date).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    )
}

function Achievements({ imageSrc, name, description }: { imageSrc: string, name: string, description?: string }) {

    const [show, setShow] = React.useState(false);
    return (
        <main className="flex">
            {show &&
                <main className="flex justify-center items-center w-screen h-screen fixed top-0 left-0 bg-[#00000050] z-[10000]">
                    <div className="bg-zinc-700 rounded-lg flex p-4 w-[30rem] h-64 relative">
                        <Image className="z-[100]" src={imageSrc} width={200} height={200} alt={name}></Image>

                        <div className="flex flex-col gap-3 px-8 justify-center">
                            <div className="font-bold text-3xl">{name}</div>
                            <div>{description}</div>
                        </div>

                        <div className="absolute top-3 right-3 cursor-pointer" onClick={() => { setShow(!show) }}>
                            <Icon name="close" size={24}></Icon>
                        </div>
                    </div>
                </main>
            }
            <Image onClick={() => { setShow(!show) }} className="z-[100] cursor-pointer" src={imageSrc} width={64} height={64} alt={name}></Image>
        </main>
    )
}

function Friends({ name, color }: { name: string, color: string }) {
    return (
        <main style={{ backgroundColor: color }} className={"flex justify-center items-center w-16 h-16 rounded-full text-xl"}>
            {name.toUpperCase()[0]}
        </main>
    )
}