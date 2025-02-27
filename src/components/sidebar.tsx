"use client";
import Help from "@/components/help/help.component";
import Icon, { StrokeIcon } from "@/assets/icons";
import { MenuContext } from "@/contexts/menu.context";
import { UserContext } from "@/contexts/user.context";
import Link from "next/link"
import React from "react";
import { useContext } from "react";

export default function Sidebar() {


    const { isOpen } = useContext(MenuContext);

    const { user } = useContext(UserContext);

    const [isHelpOpen, setIsHelpOpen] = React.useState(false);
    const [userState, setUserState] = React.useState(false);

    React.useEffect(() => {
        setUserState(true);
    }, []);



    if (!userState) return (
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

                <React.Fragment>
                    <hr />
                    <div className="flex flex-col gap-2">
                        <div className="text-transparent text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2 bg-zinc-800 animate-pulse rounded-lg">
                            <StrokeIcon name="game"></StrokeIcon>
                            Games
                        </div>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2">
                        <div className="text-transparent text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2 bg-zinc-800 animate-pulse rounded-lg">
                            <StrokeIcon name="card"></StrokeIcon>
                            Rummy
                        </div>
                        <div className="text-transparent text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2 bg-zinc-800 animate-pulse rounded-lg">
                            <StrokeIcon name="card"></StrokeIcon>
                            UNO
                        </div>
                    </div>
                </React.Fragment>
            </div>
        </main>
    );

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
                {
                    user &&
                    <React.Fragment>
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
                            <a href={"/games?cardType=RUMMY"}>
                                <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                                    <StrokeIcon name="card"></StrokeIcon>
                                    Rummy
                                </div>
                            </a>
                            <a href={"/games?cardType=UNO"}>
                                <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                                    <StrokeIcon name="card"></StrokeIcon>
                                    UNO
                                </div>
                            </a>
                        </div>
                    </React.Fragment>
                }


                <div onClick={() => { setIsHelpOpen(!isHelpOpen) }}>
                    <div className="text-zinc-300 cursor-pointer text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2 absolute bottom-4">
                        <Icon name="info"></Icon>
                        Need help?
                    </div>
                </div>

                {
                    isHelpOpen &&
                    <Help onClose={() => { setIsHelpOpen(false) }}></Help>
                }

            </div>
        </main>
    )
}