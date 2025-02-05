"use client";
import Image from "next/image";
import PlayCard from "@/components/home/play.cards";
import { useRouter } from "next/navigation";

export default function Home() {

    const route = useRouter();

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        route.replace("/mobile");
    }

    return (
        <main className="flex gap-2">
            <main className="w-full bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="w-full flex justify-center p-4 select-none">
                    <Image src={"/assets/logo.png"} draggable={false} width={500} height={500} alt="Logo"></Image>

                </div>

                <div className="w-full flex gap-3 items-end justify-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <PlayCard></PlayCard>
                        <PlayCard></PlayCard>
                        <PlayCard></PlayCard>
                    </div>

                    <PlayCard hasImage></PlayCard>
                    <PlayCard hasImage></PlayCard>
                    <PlayCard hasImage></PlayCard>

                </div>
            </main>
        </main>
    )
}