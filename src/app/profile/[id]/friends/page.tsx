"use client";
import Icon from "@/assets/icons";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { getRankName } from "@/interfaces/rank.enum";
import Pagination from "@/components/pagination";
import React from "react";
import ProfileService from "@/services/profile.service";
import { Iplayer } from "@/interfaces/interface";
import Link from "next/link";

export default function ProfilePage() {

    const player_id = useParams().id;

    const [page, setPage] = React.useState(1);

    const profileService = new ProfileService();


    function getPlayer() {
        return profileService.getProfileData(player_id as string).then(res => res.json());
    }

    const player = useQuery("player", getPlayer, { enabled: !!player_id, refetchOnWindowFocus: false });


    if (player.isLoading || player!.data.length == 0) return <div>Loading...</div>
    return (
        <main className="flex gap-2 flex-row-reverse">
            <main className="w-full flex flex-col gap-3 p-3 items-center justify-start max-h-screen">
                <div className="h-fit w-full flex items-center text-zinc-100 p-3 ">
                    <h1>Friends requests</h1>
                </div>
                <div className="w-full gap-2 flex flex-col h-full">
                    <FriendRequest playerInfo={{ firstName: "Náspár", lastName: "Gorbert", rank: 700, customId: "526f7a734e6f7262657274db9a881e3d8590d4dd" } as Iplayer}></FriendRequest>
                </div>
                <Pagination total={1} page={page} setPage={setPage}></Pagination>
            </main>
            <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="flex gap-3 p-3 flex-col">
                    <h1>Your friends</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        <Friends playerInfo={{ firstName: "Náspár", lastName: "Gorbert", rank: 700, customId: "526f7a734e6f7262657274db9a881e3d8590d4dd" } as Iplayer}></Friends>
                        <Friends playerInfo={{ firstName: "Gáspár", lastName: "Gorbert", rank: 1400, customId: "526f7a734e6f7262657274db9a881e3d8590d4dd" } as Iplayer}></Friends>
                        <Friends playerInfo={{ firstName: "Ráspár", lastName: "Norbert", rank: 2500, customId: "526f7a734e6f7262657274db9a881e3d8590d4dd" } as Iplayer}></Friends>
                        <Friends playerInfo={{ firstName: "Záspár", lastName: "Zorbert", rank: 100, customId: "526f7a734e6f7262657274db9a881e3d8590d4dd" } as Iplayer}></Friends>
                    </div>
                </div>
            </main>
        </main>
    )
}

function Friends({ playerInfo }: { playerInfo: Iplayer }) {
    return (
        <Link href={`/profile/${playerInfo.customId}`} className="flex gap-2 items-center justify-center flex-col p-3 bg-zinc-700 rounded-md cursor-pointer select-none hover:bg-zinc-600 duration-100">
            <div style={{ backgroundColor: getColorByInitials(getUserInitials(playerInfo.firstName, playerInfo.lastName)!).background, color: getColorByInitials(getUserInitials(playerInfo.firstName, playerInfo.lastName)!).text }} className={"flex justify-center items-center w-16 h-16 rounded-full text-xl"}>
                {getUserInitials(playerInfo.firstName, playerInfo.lastName)}
            </div>
            <div className="flex flex-col gap-1">
                <h1>{playerInfo.firstName} {playerInfo.lastName}</h1>
                <h2 style={{ color: getRankName(playerInfo.rank).color }} className="text-[0.7rem] flex justify-center items-center w-full font-bold">
                    <div dangerouslySetInnerHTML={{ __html: getRankName(playerInfo.rank).icon }}></div>
                    {getRankName(playerInfo.rank).title}
                </h2>
            </div>
        </Link>
    )
}

function FriendRequest({ playerInfo }: { playerInfo: Iplayer }) {
    return (
        <main className="flex gap-2 items-center text-gray-100 justify-between p-3 bg-zinc-700 rounded-md select-none hover:bg-zinc-600 duration-100">
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
            <div className="flex gap-2">
                <button className="border-2 border-green-500 bg-green-500 p-2 rounded-md px-4 hover:bg-green-600 flex justify-center items-center gap-1 duration-200"> <Icon name="add-friend"></Icon> Accept</button>
                <button className="border-2 border-red-500 p-2 rounded-md px-4 hover:border-red-600 hover:bg-zinc-700 flex justify-center items-center gap-1 text-red-400 hover:text-red-300 duration-200"><Icon name="cancel-friend"></Icon> Decline</button>
            </div>
        </main>
    )
}