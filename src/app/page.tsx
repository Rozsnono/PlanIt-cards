"use client";
import Image from "next/image";
import PlayCard from "@/components/home/play.cards";
import { useRouter } from "next/navigation";

export default function Home() {

    const route = useRouter();

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        route.replace("/mobile");
    }

    return (
        <main className="flex gap-2 h-full">
            <main className="w-full rounded-md p-3 text-zinc-200 h-full flex ">
                <div className="h-fit bg-[#3f3f46f0] h-full w-full rounded-xl flex justify-center items-center">
                    <Image src={"/assets/logo.png"} draggable={false} width={500} height={10} alt="Logo"></Image>
                </div>
            </main>
        </main>
    )
}