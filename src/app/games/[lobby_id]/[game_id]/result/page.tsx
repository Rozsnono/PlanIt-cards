"use client";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Link from "next/link";
import Icon from "@/assets/icons";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GameService } from "@/services/game.service";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/user.context";
import Loading from "@/app/loading";
import React from "react";
import { ProfileIcon } from "@/assets/profile-pics";

export default function End() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const { user } = useContext(UserContext);

    const [player, setPlayer] = useState<any>(null);

    const router = useRouter();

    const gameSerivce = new GameService('');
    const data = useQuery({
        queryKey: ['game-history', game_id!.toString()],
        queryFn: async () => {
            return await gameSerivce.getGameHistory(user!.customId, game_id!.toString());
        }
    });

    function getPosition(position: number) {
        switch (position) {
            case 1:
                return "1st";
            case 2:
                return "2nd";
            case 3:
                return "3rd";
            default:
                return position + "th";
        }
    }

    useEffect(() => {
        if (data.data) {
            setPlayer(data.data.users.find((u: any) => u.customId === user!.customId));
        }
    }, [data.data]);

    async function returnToLobby() {
        await gameSerivce.deleteGame(lobby_id as string);
        router.push('/games/' + lobby_id);
    }

    async function recalibrateResult() {
        await gameSerivce.RecalibrateHistory(data.data._id, game_id!.toString());
        data.refetch();
    }

    async function StartRematch() {
        const gameService = new GameService(data.data.type.toLocaleLowerCase() as any);
        console.log('HERE 1');
        const deleteRes = await gameService.deleteGame(game_id as string).catch(() => { return; });
        if (deleteRes?.error) { return; }
        console.log('HERE 2');
        const startRes = await gameService.startGame(lobby_id as string);
        if (startRes?.error) { return; }
        console.log('HERE 3');
        router.push(`/games/${lobby_id}`);
        router.refresh();
    }

    if (data.isLoading || !player) {
        return <Loading></Loading>;
    }

    function toTimeString(num: number) {
        num = num / 1000;
        const time = [Math.floor(Math.floor(num / 3600) % 60), Math.floor((num / 60) % 60), Math.floor(num % 60)];
        return time.join(':').replace(/(\d+):(\d+):(\d+)/, (_, h, m, s) => `${h}h ${h > 100 ? '' : m + 'm'} ${h > 0 ? '' : s + 's'}`);
    }

    return (
        <main className="flex flex-col md:flex-row gap-6 justify-center w-full md:w-3/4 mx-auto h-full">
            <main className="w-1/2 h-full rounded-2xl flex flex-col p-6 gap-6">
                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="flex gap-4 p-4">
                        <ProfileIcon settings={player.settings} size={4} className="p-1" />
                        {/* <div style={{ backgroundColor: getColorByInitials(player).background, color: getColorByInitials(player).text }} className="min-w-16 min-h-16 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-xl shadow-md shadow-zinc-500 hover:scale-105">{getUserInitials()}</div> */}
                        <div className="flex flex-col justify-center gap-1">
                            <div className="text-3xl font-bold text-zinc-300">{player!.firstName} {player!.lastName}</div>
                            <div className="text-purple-400 text-lg flex items-center gap-2">
                                <div style={{ color: getRankName(player.rank).color }} className="flex items-center gap-1 text-lg">
                                    <div dangerouslySetInnerHTML={{ __html: getRankName(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank).icon }}></div>
                                    {getRankName(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank).title}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="chart" size={32}></Icon>
                        Statistics
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 w-full">
                        <div className="flex items-center gap-2 justify-between w-full">
                            <span className="text-zinc-300 text-lg font-bold">Place:</span>
                            <span className="text-purple-400 text-lg font-bold">{getPosition(data.data.position.find((p: any) => p.player == player._id).pos)}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between w-full">
                            <span className="text-zinc-300 text-lg font-bold">Rank:</span>
                            <span className="text-purple-400 text-lg font-bold">{getRankName(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank).title}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between w-full">
                            <span className="text-zinc-300 text-lg font-bold">Rank gain:</span>
                            <span className="text-purple-400 text-lg font-bold">{data.data.rank.find((p: any) => p.player == player._id).rank > 0 ? '+' : '-'} {Math.abs(data.data.rank.find((p: any) => p.player == player._id).rank)}</span>
                        </div>

                        <div className="flex items-center w-full relative">
                            <div className="flex gap-2 flex-wrap font-thin relative w-full">
                                <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>

                                {
                                    getRankName(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank).title !== getRankName(player.rank).title ?
                                        <React.Fragment>
                                            <div style={{ width: `${getCurrentRank(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank)}%` }} className="rounded-full h-2 bg-orange-400 z-50 animate-pulse duration-300"></div>
                                        </React.Fragment> :
                                        (
                                            data.data.rank.find((p: any) => p.player == player._id).rank < 0 ?
                                                <React.Fragment>
                                                    <div style={{ width: `${getCurrentRank(player.rank)}%` }} className="rounded-full h-2 bg-red-700 z-50 animate-pulse duration-300"></div>
                                                    <div style={{ width: `${getCurrentRank(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank)}%` }} className="rounded-full h-2 bg-gradient-to-r from-purple-500/70 to-orange-600 z-50 absolute"></div>
                                                </React.Fragment> :
                                                <React.Fragment>
                                                    <div style={{ width: `${getCurrentRank(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank)}%` }} className="rounded-full h-2 bg-orange-400 z-50 animate-pulse duration-300"></div>
                                                    <div style={{ width: `${getCurrentRank(player.rank)}%` }} className="rounded-full h-2 bg-gradient-to-r from-purple-500/70 to-orange-600 z-50 absolute"></div>
                                                </React.Fragment>
                                        )

                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="action" size={32}></Icon>
                        Actions
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 h-full">
                        {
                            data.data.type !== 'SOLITAIRE' && data.data.type !== 'SCHNAPPS' &&
                            <Link href={`/games/${lobby_id}/${game_id}/${data.data.type.toLowerCase()}/replay`} className="text-zinc-200 justify-center bg-gradient-to-r from-purple-500/70 to-pink-300/50 p-2 px-4 rounded-md hover:bg-zinc-400 focus:bg-zinc-800 flex items-center gap-1 ">
                                <Icon name="watch"></Icon>
                                Watch replay
                            </Link>
                        }
                        <button onClick={StartRematch} className="text-zinc-200 justify-center bg-gradient-to-r from-indigo-400/70 to-purple-500/50 p-2 px-4 rounded-md hover:bg-zinc-400 focus:bg-zinc-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800">
                            <Icon name="game" stroke></Icon>
                            Start rematch
                        </button>
                        <button disabled={data.data.position[0].pos !== 0} onClick={recalibrateResult} className="text-zinc-200 justify-center bg-gradient-to-r from-rose-400/70 to-red-500/50 p-2 px-4 rounded-md hover:bg-zinc-400 focus:bg-zinc-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800">
                            <Icon name="refresh" stroke></Icon>
                            Recalibrate result
                        </button>
                        <div onClick={returnToLobby} className="text-zinc-200 p-2 px-4 justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 focus:bg-zinc-800 flex items-center gap-1 cursor-pointer">
                            <Icon name="join"></Icon>
                            Return to lobby
                        </div>
                    </div>
                </div>

            </main>
            <main className="w-full rounded-2xl flex flex-col p-6 gap-2">

                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="trophy" size={32} stroke></Icon>
                        Resutls
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 h-full">

                        {
                            data.data.position.sort((a: any, b: any) => a.pos - b.pos).map((p: any, index: number) => {
                                const u = data.data.users.find((u: any) => u._id === p.player);
                                if (u.name) {
                                    return (
                                        <Players key={u._id} player={u} place={data.data.position.find((p: any) => p.player == u._id).pos} rankGained={0} isBot={true}></Players>
                                    )
                                }
                                return (
                                    <Players key={u._id} player={u} place={data.data.position.find((p: any) => p.player == u._id).pos} rankGained={data.data.rank.find((p: any) => p.player == u._id).rank} isPlayer={u._id == player._id}></Players>
                                )
                            })
                        }
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex gap-4 w-full">
                        <div className="w-full p-4 flex flex-col gap-2 items-center justify-center bg-zinc-800/50 rounded-lg">
                            <div className="text-zinc-200 text-2xl font-bold">{Object.keys(data.data.turns).length}</div>
                            <div className="text-zinc-500 text-sm">Total rounds</div>
                        </div>

                        <div className="w-full p-4 flex flex-col gap-2 items-center justify-center bg-zinc-800/50 rounded-lg">
                            <div className="text-zinc-200 text-2xl font-bold">{data.data.users.length}</div>
                            <div className="text-zinc-500 text-sm">Total players</div>
                        </div>

                        <div className="w-full p-4 flex flex-col gap-2 items-center justify-center bg-zinc-800/50 rounded-lg">
                            <div className="text-zinc-200 text-2xl font-bold">{toTimeString(new Date().setTime(new Date(data.data.endedAt).getTime() - new Date(data.data.createdAt).getTime()))}</div>
                            <div className="text-zinc-500 text-sm">Match duration</div>
                        </div>
                    </div>
                </div>
            </main>
        </main>
    )
}

function Players({ player, place, rankGained, isPlayer, isBot }: { player: any, place: number, rankGained: number, isPlayer?: boolean, isBot?: boolean }) {

    function PlaceBadge({ place }: { place: number }) {
        switch (place) {
            case 1:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex justify-center items-center text-zinc-100 text-lg font-bold">1</div>
                );
            case 2:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-400 to-gray-400 flex justify-center items-center text-zinc-100 text-lg font-bold">2</div>
                );
            case 3:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-700 to-amber-500 flex justify-center items-center text-zinc-100 text-lg font-bold">3</div>
                );
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-700 flex justify-center items-center text-zinc-100 text-lg font-bold">{place}</div>
                );
        }
    }

    if (isBot) {
        return (
            <div className={`cursor-default flex items-center justify-between w-full gap-2 rounded-lg p-2 px-4 hover:scale-[1.01] transition-all duration-200 ${place == 1 ? "border border-purple-800/50 bg-purple-800/50 ring-2 ring-purple-600/50" : "border border-zinc-700/50 bg-zinc-800/50"}`}>
                <div className="">
                    <PlaceBadge place={place} />
                </div>
                <div className="flex items-center gap-2 col-span-2">
                    <div className="w-8 h-8 bg-zinc-600 text-zinc-200 border-zinc-200/50 border rounded-full flex items-center justify-center text-sm"><Icon name="robot" stroke></Icon></div>
                    <div className="text-lg font-bold text-zinc-300">{player!.name}</div>
                </div>
                <div className="flex items-center">
                    <div className="rounded-xl border border-orange-900/50 bg-orange-800/50 px-2 p-1 text-xs text-orange-500">Bot</div>
                </div>
            </div>
        )
    }

    return (
        <div className={`cursor-default flex items-center justify-between w-full gap-2 rounded-lg p-2 px-4 hover:scale-[1.01] transition-all duration-200 ${place == 1 ? "border border-purple-800/50 bg-purple-800/50 ring-2 ring-purple-600/50" : "border border-zinc-700/50 bg-zinc-800/50"}`}>
            <div className="">
                <PlaceBadge place={place} />
            </div>
            <div className="flex items-center gap-2 col-span-2">
                <ProfileIcon settings={player.settings} size={2} className="" initials={getUserInitials(player.firstName, player.lastName)} />

                <div className="text-lg font-bold text-zinc-300">{player!.firstName} {player!.lastName}</div>
                {isPlayer &&
                    <div className="rounded-xl border border-purple-700/50 bg-purple-600/50 px-2 p-1 text-xs text-purple-200">You</div>
                }
            </div>
            <div className="flex items-center">
                <div style={{ color: getRankName(player.rank + rankGained).color }} className="flex items-center gap-1 text-lg">
                    <div dangerouslySetInnerHTML={{ __html: getRankName(player.rank + rankGained).icon }}></div>
                    {getRankName(player.rank + rankGained).title}
                </div>
            </div>
        </div>
    )
}