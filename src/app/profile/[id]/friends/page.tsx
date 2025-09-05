"use client";
import Icon from "@/assets/icons";
import { getColorByInitials, getUserInitials, getUserInitialsByName } from "@/functions/user.function";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { getRankName } from "@/interfaces/rank.enum";
import Pagination from "@/components/pagination";
import React from "react";
import ProfileService from "@/services/profile.service";
import { Iplayer } from "@/interfaces/interface";
import Link from "next/link";
import Loading from "@/app/loading";
import { ProfileIcon } from "@/assets/profile-pics";

export default function ProfilePage() {

    const player_id = useParams().id;

    const [page, setPage] = React.useState(1);

    const [search, setSearch] = React.useState("");

    const profileService = new ProfileService();


    function getPlayer() {
        return profileService.getProfileData(player_id as string).then(res => res.json());
    }

    function getPlayers() {
        return profileService.getPlayers(search).then(res => res.json());
    }

    const player = useQuery("player", getPlayer, { enabled: !!player_id, refetchOnWindowFocus: false });
    const players = useQuery("players", getPlayers, { enabled: !!player_id, refetchOnWindowFocus: false });


    if (player.isLoading || player!.data.length == 0 || players.isLoading) return <Loading />
    return (
        <main className="flex flex-col md:flex-row gap-6 justify-center w-full md:w-3/4 mx-auto h-full">
            <main className="w-full rounded-2xl flex flex-col p-6 gap-2">
                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="users" size={32}></Icon>
                        Your friends
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 w-full">

                        {/* <div className="flex items-center w-full relative">
                            <div className="flex gap-2 flex-wrap font-thin relative w-full">
                                <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>

                                {
                                    getRankName(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank).title !== getRankName(player.rank).title ?
                                        <React.Fragment>
                                            <div style={{ width: `${getCurrentRank(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank)}%` }} className="rounded-full h-2 bg-orange-400 z-50 animate-pulse duration-300"></div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div style={{ width: `${getCurrentRank(player.rank + data.data.rank.find((p: any) => p.player == player._id).rank)}%` }} className="rounded-full h-2 bg-orange-400 z-50 animate-pulse duration-300"></div>
                                            <div style={{ width: `${getCurrentRank(player.rank)}%` }} className="rounded-full h-2 bg-gradient-to-r from-purple-500/70 to-orange-600 z-50 absolute"></div>
                                        </React.Fragment>
                                }
                            </div>
                        </div> */}
                    </div>
                </div>

            </main>

            <main className="w-1/2 h-full rounded-2xl flex flex-col p-6 gap-6">
                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="users" size={32}></Icon>
                        Players
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 h-full">
                        <input value={search} onChange={(e) => { setSearch(e.target.value) }} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                players.refetch();
                            }
                        }} type="text" placeholder="Search players..." className="bg-transparent border border-purple-800/50 rounded-lg p-2 focus:outline-none focus:outline-purple-600/50 text-purple-100" />
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col p-2 gap-4 w-full">

                        {
                            players.data.data.map((player: Iplayer) => (
                                <Players key={player.customId} player={player}></Players>
                            ))
                        }
                    </div>
                </div>


                <div className="w-full rounded-2xl border border border-purple-800/50 bg-black/40 p-3 gap-2 flex flex-col">
                    <div className="text-purple-600 text-lg font-bold flex items-center gap-2 p-2">
                        <Icon name="pedding" size={32}></Icon>
                        Pending friends
                    </div>

                    <div className="border-b-[0.1rem] border-purple-800/50"></div>

                    <div className="flex flex-col gap-2 p-2 h-full">
                        {
                            player.data.pendingFriends.map((pending: Iplayer) => (
                                <Players key={pending.customId} player={pending} isPending onRefresh={() => { player.refetch(); }}></Players>
                            ))
                        }
                    </div>
                </div>

            </main>

        </main>
    )
}


function Players({ player, isFriend, isPending, onRefresh }: { player: Iplayer, isFriend?: boolean, isPending?: boolean, onRefresh?: () => void }) {

    return (
        <div className={`flex items-center justify-between gap-4 p-2 rounded-lg w-full hover:bg-purple-800/30 border border-purple-400/20 transition-colors duration-200 bg-purple-800/20`}>
            <div className="flex items-center gap-2">
                <ProfileIcon settings={player.settings} size={2} className="text-[1rem]" />
                <div className="text-lg font-bold text-zinc-300">{player!.username}</div>
            </div>
            {
                !isPending &&
                <div className="flex items-center">
                    <span style={{ color: getRankName(player.rank).color }} className="flex items-center gap-1 text-lg">
                        <div dangerouslySetInnerHTML={{ __html: getRankName(player.rank).icon }}></div>
                        {getRankName(player.rank).title}
                    </span>
                </div>
            }
            <div className="flex items-center gap-2">
                {
                    !isFriend && !isPending &&
                    <button onClick={() => { new ProfileService().createFriendRequest(player.customId) }} className="text-purple-600 hover:text-purple-400 transition-colors duration-200 hover:scale-110">
                        <Icon name="add-friend" size={20}></Icon>
                    </button>
                }
                {
                    isPending ?
                        <>
                            <Icon name="check-empty" onClick={() => { new ProfileService().acceptFriendRequest(player.customId); onRefresh!(); }} size={20} className="text-green-500 cursor-pointer hover:text-green-400 hover:scale-110 duration-200"></Icon>
                            <Icon name="close" size={20} className="text-red-500 cursor-pointer hover:text-red-400 hover:scale-110 duration-200"></Icon>
                        </>
                        : null
                }

                <Link href={`/profile/${player.customId}`} className="text-indigo-600 hover:text-indigo-400 transition-colors hover:scale-110 duration-200">
                    <Icon name="info" size={20}></Icon>
                </Link>
            </div>
        </div>
    )
}

