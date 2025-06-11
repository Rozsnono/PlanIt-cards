"use client";
import Image from "next/image";
import PlayCard from "@/components/home/play.cards";
import { useRouter } from "next/navigation";
import Icon from "@/assets/icons";

export default function Home() {

    const route = useRouter();

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        route.replace("/mobile");
    }

    return (
        <main className="gap-2 h-full overflow-y-scroll">
            <main className="w-full rounded-md p-3 text-zinc-200 h-full flex ">
                <div className="h-fit bg-[#3f3f46f0] h-full w-full rounded-xl flex justify-center items-center">
                    <Image className="sticky top-24 left-6" src={"/assets/logo.png"} draggable={false} width={500} height={10} alt="Logo"></Image>
                </div>
            </main>
            <main className="w-full h-full flex flex-col gap-4 p-3">
                <Card></Card>    
            </main>
        </main>
    )
}

function Card({children}: {children?: React.ReactNode}) {

    const route = useRouter();
    return (
        <div className="w-1/2 border border-zinc-500 rounded-lg flex bg-zinc-800 px-8 py-4 gap-3">
            <div className="flex flex-col text-pretty w-full text-zinc-200 py-8">
                <div className="text-zinc-100 font-bold text-2xl">First time here?</div>
                <div className="text-zinc-400 text-sm">Here you can start the tutorial to understand</div>
            </div>
            <div className="flex w-1/3 h-full justify-center items-center">
                <div onClick={()=>{route.push('/games/tutorial/rummy')}} className="bg-zinc-700 w-full h-full flex justify-center items-center p-3 rounded-lg text-zinc-200 cursor-pointer hover:bg-zinc-600 transition-all duration-200">
                    <Icon name="game" size={36} stroke></Icon>
                </div>
            </div>
        </div>
    )
}