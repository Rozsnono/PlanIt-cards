"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import { MenuContext } from "@/contexts/menu.context";
import Link from "next/link"
import { useContext } from "react";

export default function Sidebar() {


    const { isOpen } = useContext(MenuContext);

    return (
        <main className={`fixed top-0 h-screen w-48 bg-zinc-900 pt-16 z-40 duration-500 ${isOpen ? 'left-0' : 'left-[-300px]'} z-[99]`}>
            <div className="flex flex-col justify-between p-4 gap-5">
                <div className="flex flex-col gap-2">
                    <Link href={"/"}>
                        <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <Icon name="home"></Icon>
                            Home
                        </div>
                    </Link>
                </div>
                <hr />

                <Link href={"/observatory"}>
                    <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                        <StrokeIcon name="star"></StrokeIcon>
                        Observatory
                    </div>
                </Link>
                <hr />
                <div className="flex flex-col gap-2">
                    <Link href={"/games"}>
                        <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <StrokeIcon name="game"></StrokeIcon>
                            Games
                        </div>
                    </Link>
                </div>

                <hr />
                <div className="flex flex-col gap-2">
                    <Link href={"/snapszer1"}>
                        <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <Icon name="user"></Icon>
                            Rummy
                        </div>
                    </Link>
                    <Link href={"/snapszer2"}>
                        <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <Icon name="users"></Icon>
                            Robber Rummy
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    )
}