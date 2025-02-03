"use client";
import Icon from "@/assets/icons";
import Chart from "@/components/chart";
import { getCookie, getUserInitials } from "@/functions/user.function";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import Image from "next/image";

export default function ProfilePage() {

    const player_id = useParams().id;

    function getPlayer() {
        return fetch(`/api/player/${player_id}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } }).then(res => res.json());
    }

    const player = useQuery("player", getPlayer, { enabled: !!player_id, refetchOnWindowFocus: false });

    if (player.isLoading || player!.data.length == 0) return <div>Loading...</div>
    return (
        <main className="flex gap-2">
            <main className="w-full flex flex-col gap-3 justify-start items-center h-full">
                <Chart></Chart>
                <div className="w-full gap-2 flex flex-col">
                    <GameReplays pos={1} type="RUMMY" date="2024.12.25-17:00"></GameReplays>
                    <GameReplays pos={3} type="RUMMY" date="2024.12.23-17:00"></GameReplays>
                    <GameReplays pos={2} type="RUMMY" date="2024.12.25-12:00"></GameReplays>
                    <GameReplays pos={4} type="RUMMY" date="2024.12.25-11:00"></GameReplays>
                </div>
            </main>
            <main className="w-1/2 bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="flex gap-2 p-6">
                    <div className="min-w-32 min-h-32 bg-red-600 rounded-full flex items-center justify-center text-2xl">{getUserInitials()}</div>
                    <div className="flex flex-col justify-center gap-3">
                        <div className="text-4xl">{player.data.firstName} {player.data.lastName}</div>
                        <button className="text-zinc-300 bg-zinc-900 text-sm w-max hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="pen" size={16}></Icon> Edit profile</button>

                    </div>
                </div>
            </main>
        </main>
    )
}

function GameReplays({ pos, type, date }: { pos: number, type: string, date: string }) {
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
            <Image src={getGameTypeImage()} width={100} height={100} alt={type}></Image>
            <div className="flex flex-col gap-3 items-center justify-center">
                <div className="text-2xl">
                    #{pos}
                </div>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
                <div>
                    <button className="flex justify-center items-center gap-1 bg-green-700 text-white p-2 px-2 rounded-xl justify-center hover:bg-green-600 flex items-center gap-1 duration-200"><Icon name="watch"></Icon>Watch</button>
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