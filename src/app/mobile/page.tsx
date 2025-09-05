"use client";
import Icon from "@/assets/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Mobile() {

    const route = useRouter();

    if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        route.replace("/");
    }
    
    return (
        <main className="w-[100vw] h-[100vh] fixed z-[1000] bg-zinc-800 flex justify-center items-center">
            <div className="text-white text-center flex flex-col gap-6 p-3">
                <div className="flex justify-center fixed top-16 w-full left-0">
                    <Image src={"/assets/logo.png"} width={200} height={100} alt="Logo"></Image>
                </div>
                <div className="mobile flex justify-center relative">
                    <div className="rounded-md overflow-hidden border border-black h-64 w-32 bg-zinc-900 p-[0.1rem] z-[100] flex flex-col font-bold">
                        <div className="w-full h-full rounded-md bg-zinc-950 flex flex-col justify-center items-center text-gray-500">
                            <Icon name="error" size={64}></Icon>
                            Error
                        </div>
                    </div>
                    <div className="absolute bg-black h-[2.5rem] w-16 ml-[4.3rem] top-12 rounded-[2px]"></div>
                    <div className="absolute bg-black h-[1rem] w-16 ml-[4.3rem] top-[5.8rem] rounded-[2px]"></div>
                    <div className="absolute bg-black rounded-full h-[0.5rem] w-[0.5rem] z-[1001] top-2"></div>
                </div>

                <div className="text-2xl px-6">
                    Oops! The mobile view is not available yet, but we&apos;re working on it.
                </div>
                <div className="font-bold">Coming soon! 🚀📱</div>
            </div>
        </main>
    )
}