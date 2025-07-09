"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/assets/icons";
import Link from "next/link";

export default function Home() {

    const route = useRouter();

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        route.replace("/mobile");
    }

    return (
        <main className="gap-2 h-full overflow-y-scroll md:px-96 px-24">

            <div className="flex flex-col items-center justify-center h-[70%]">
                <Image
                    src="/assets/icon.png"
                    alt="Planit Cards Logo"
                    width={200}
                    height={200}
                    className="mb-4"
                />
                <div className="text-5xl text-zinc-100 font-bold mb-4 genos">Planit Cards</div>
                <div className="text-zinc-400 text-lg mb-8 genos">Play your cards right!</div>

                <Link href="/games">
                    <button className="flex items-center rounded-full px-8 py-4 bg-gradient-to-l from-purple-700 to-blue-700 text-zinc-100 text-2xl hover:from-purple-800 hover:to-blue-800 hover:scale-105 duration-200">Start playing</button>
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 ">
                <Cards
                    title="Strategic Gameplay"
                    desc="Master the art of card strategy and outsmart your opponents with tactical moves and calculated risks."
                    icon={<Icon name="game" size={32} stroke />}
                    color={{ from: 'from-purple-500', to: 'to-blue-500' }}
                ></Cards>

                <Cards
                    title="Multiplayer Fun"
                    desc="Challenge your friends or play with players from around the world in exciting multiplayer matches."
                    icon={<Icon name="users" size={32} />}
                    color={{ from: 'from-indigo-500', to: 'to-emerald-500' }}
                ></Cards>

                <Cards
                    title="Variety of Games"
                    desc="Explore a wide range of card games, from classic favorites to modern twists, ensuring endless entertainment."
                    icon={<Icon name="card" size={32} stroke />}
                    color={{ from: 'from-yellow-500', to: 'to-purple-500' }}
                ></Cards>
            </div>


            <div className="flex flex-col items-center justify-center mt-48 mb-16 w-full gap-8">
                <div className="text-center">
                    <div className="text-4xl text-zinc-100 font-bold genos">Planit statistics</div>
                    <div className="text-lg text-zinc-400">Track our progress through the cosmos!</div>
                </div>
                <div className="grid grid-cols-4 gap-6 w-2/3">
                    <StatCards number={1000} title="Players" color="text-purple-500"></StatCards>
                    <StatCards number={50} title="Games" color="text-indigo-500"></StatCards>
                    <StatCards number={200} title="Tournaments" color="text-yellow-500"></StatCards>
                    <StatCards number={3000} title="Matches Played" color="text-pink-500"></StatCards>
                </div>
            </div>


            <div className="flex items-center justify-center mt-48 mb-8">
                <PlayCards></PlayCards>
            </div>

        </main>
    )
}

function Cards({ title, desc, icon, color }: { title: string, desc: string, icon: React.ReactNode, color: { from: string, to: string } }) {
    return (
        <div className="border-zinc-800/40 border bg-zinc-900/60 backdrop-blur-lg text-zinc-200 flex flex-col items-start gap-5 p-8 rounded-xl w-fit hover:scale-105 duration-200">
            <div className={`min-w-16 min-h-16 rounded-xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center`}>
                {icon}
            </div>
            <div className="flex w-full h-full flex-col gap-2">
                <div className="text-5xl genos">{title}</div>
                <div className="text-zinc-400 italic">{desc}</div>
            </div>
        </div>
    )
}

function StatCards({ number, title, color }: { number: number, title: string, color: string }) {

    function formatNumber(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className={`border-zinc-800/40 border bg-zinc-900/60 backdrop-blur-lg text-zinc-200 flex flex-col items-center gap-2 p-4 rounded-xl w-full hover:scale-105 duration-200`}>
            <div className={`text-3xl font-bold ${color}`}>{formatNumber(number)}</div>
            <div className="text-zinc-400 text-sm">{title}</div>
        </div>
    )
}

function PlayCards() {
    return (
        <div className="border-zinc-800/40 border bg-zinc-900/60 backdrop-blur-lg text-zinc-200 flex flex-col items-center gap-5 p-8 rounded-3xl w-fit shadow-2xl hover:shadow-none duration-200">
            <div className={`min-w-16 min-h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center`}>
                <Icon name="tutorial" size={32} stroke strokeWidth={1.5}></Icon>
            </div>
            <div className="flex w-full h-full flex-col gap-2 text-center">
                <div className="text-5xl genos">First time here?</div>
                <div className="text-zinc-400 italic">Now you can start the tutorial to understand the game mechanics and strategies.</div>
            </div>
            <Link href="/tutorial">
                <button className="flex items-center rounded-full px-6 py-2 bg-gradient-to-l from-purple-700 to-blue-700 text-zinc-100 text-lg hover:from-purple-800 hover:to-blue-800 hover:scale-105 duration-200">
                    Start tutorial
                </button>
            </Link>
        </div>
    )
}