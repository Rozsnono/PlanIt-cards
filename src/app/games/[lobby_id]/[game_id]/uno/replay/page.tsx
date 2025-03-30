"use client";
import Icon from "@/assets/icons";
import Loader from "@/components/loader.component";
import { UserContext } from "@/contexts/user.context";
import { getColorByInitials, getUserInitialsByName } from "@/functions/user.function";
import { Icard } from "@/interfaces/interface";
import { GameHistoryService } from "@/services/game.history.service";
import Image from "next/image"
import { useParams } from "next/navigation";
import React from "react";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import CardsUrls from "@/contexts/cards.context";
import ErrorPage from "@/components/error";

export default function Game() {

    const game_id = useParams().game_id;
    const { user } = useContext(UserContext);

    const [turn, setTurn] = useState(1);

    const gameHistoryService = new GameHistoryService();

    const gameHistory = useQuery('game', async () => { return gameHistoryService.getGameHistory(user!.customId, game_id) });

    if (gameHistory.isLoading) return <Loader></Loader>;
    if (gameHistory.isError) return null;
    if (gameHistory.data === null) return null;
    if (gameHistory.data === undefined) return null;
    if (gameHistory.data.error) return <ErrorPage></ErrorPage>;

    return (
        <main className="flex bg-[#3f3f46c0] w-full min-h-screen rounded-md p-3 relative select-none">

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center">
                <div className="flex justify-center items-center w-full h-full absolute py-8">
                    <div className="border border-[#cccccc10] rounded-md w-2/3 h-2/3 flex flex-wrap gap-10 z-50 p-1" >
                        {
                            gameHistory.data.turns[turn].playedCards && gameHistory.data.turns[turn].playedCards.map((e: { playedBy: string, cards: Icard[] }, i: number) => {
                                return (
                                    <div key={i} className={`flex gap-1 h-min group`}>
                                        {
                                            e.cards.map((card: Icard, j: number) => {
                                                return (
                                                    <div key={j} className="w-8 h-16 relative group cursor-pointer overflow-visible">
                                                        <Image className={`card-animation w-16 max-w-16 rounded-md border border-transparent ${e.playedBy === user?._id ? ' group-hover:border-green-500' : ""} `} key={j} src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(card.name)} width={70} height={60} alt={new CardsUrls().getCardUrl(card.name)}></Image>
                                                        {j === 0 && <div className="opacity-0 group-hover:opacity-100 absolute group-hover:bottom-[-3.6rem] bottom-0 left-0 w-16 z-[-1] duration-200">{e.playedBy}</div>}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="flex gap-10  w-full absolute top-2 p-2 justify-center">
                    <div className="flex relative cursor-pointer">
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[6rem] border border-zinc-400 rounded-md"></div>
                        <Image className="absolute top-1 left-1" draggable={false} src={"/assets/cards/rummy/gray_back.png"} width={140} height={100} alt="card"></Image>
                        <Image draggable={false} className="absolute border-2 border-transparent hover:border-green-500 rounded-lg" src={"/assets/cards/rummy/gray_back.png"} width={140} height={110} alt="card"></Image>
                    </div>

                    <div className="flex relative">
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md"></div>

                        {
                            gameHistory.data.turns[turn].droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1" draggable={false} src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(gameHistory.data.turns[turn].droppedCards[gameHistory.data.turns[turn].droppedCards.length - 2].card.name)} width={140} height={100} alt="card"></Image>
                        }
                        {
                            gameHistory.data.turns[turn].droppedCards.length > 0 &&
                            <Image className="absolute right-1 bottom-1 rotate-12 border border-transparent hover:border-green-300 rounded-lg cursor-pointer" src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(gameHistory.data.turns[turn].droppedCards[gameHistory.data.turns[turn].droppedCards.length - 1].card.name)} width={140} height={100} alt="card"></Image>
                        }
                    </div>
                </div>

                <div className="absolute top-0 left-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        gameHistory.data.players.filter((u: any, i: number) => { return i % 2 === 0 && u._id !== user?.customId }).map((user: any, j: number) => {
                            return (
                                <div key={j} className="w-16 h-16 relative group cursor-pointer">
                                    {
                                        user.name.split(' ').length > 1 ?
                                            <div style={{ color: getColorByInitials(user).text, backgroundColor: getColorByInitials(user).background }} className="w-16 h-16 rounded-full flex text-zinc-300 items-center justify-center">
                                                {getUserInitialsByName(user.name)}
                                            </div>
                                            :
                                            <div className="w-16 h-16 rounded-full flex text-zinc-300 items-center justify-center bg-zinc-500 border">
                                                <Icon name="robot" size={32} stroke></Icon>
                                            </div>

                                    }
                                    <div>
                                        <p className="text-zinc-300 text-center">{user.name}</p>
                                    </div>

                                    <div className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[3.5rem] left-4 bg-blue-500 hover:bg-blue-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                                        <Icon name="add-friend"></Icon>
                                    </div>
                                    <div className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[5rem] left-4 bg-sky-500 hover:bg-sky-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                                        <Icon name="info"></Icon>
                                    </div>

                                </div>
                            )
                        })
                    }
                    <div></div>
                </div>

                <div className="absolute top-0 right-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        gameHistory.data.players.filter((u: any, i: number) => { return i % 2 === 1 && u._id !== user?.customId }).map((user: any, j: number) => {
                            return (
                                <div key={j} className="w-16 h-16 relative group cursor-pointer">
                                    {
                                        user.name.split(' ').length > 1 ?
                                            <div style={{ color: getColorByInitials(user).text, backgroundColor: getColorByInitials(user).background }} className="w-16 h-16 rounded-full flex text-zinc-300 items-center justify-center">
                                                {getUserInitialsByName(user.name)}
                                            </div>
                                            :
                                            <div className="w-16 h-16 rounded-full flex text-zinc-300 items-center justify-center bg-zinc-500 border">
                                                <Icon name="robot" size={32} stroke></Icon>
                                            </div>

                                    }
                                    <div>
                                        <p className="text-zinc-300 text-center">{user.name}</p>
                                    </div>

                                    <div className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[3.5rem] left-4 bg-blue-500 hover:bg-blue-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                                        <Icon name="add-friend"></Icon>
                                    </div>
                                    <div className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[5rem] left-4 bg-sky-500 hover:bg-sky-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                                        <Icon name="info"></Icon>
                                    </div>

                                </div>
                            )
                        })
                    }
                    <div></div>
                </div>

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    {
                        gameHistory.data.turns[turn].playerCards.map((card: any, i: number) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable className={`cursor-pointer w-12 overflow-visible hover:cursor-grab group rounded-lg duration-200`}>
                                        <Image className="border-2 border-transparent group-hover:border-green-400 rounded-lg" style={{ width: "6rem", maxWidth: "6rem" }} loading="eager" src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getCardUrl(card.name)}></Image>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }

                    <div className="absolute right-10 bottom-4 flex justify-center items-center gap-3">
                        <div onClick={() => { setTurn(turn => turn > 1 ? turn - 1 : turn) }} className="w-[2rem] h-[2rem] rounded-full border-2 border-green-300 text-green-300 hover:border-green-100 hover:text-green-100 flex justify-center items-center cursor-pointer duration-100">
                            <Icon name="arrow-left" size={24}></Icon>
                        </div>
                        <div className="w-[2rem] h-[2rem] rounded-full border-y-2 border-green-300 text-green-300 flex justify-center items-center cursor-pointer duration-100">
                            {turn}
                        </div>
                        <div onClick={() => { setTurn(turn => turn < Object.keys(gameHistory.data.turns).length ? turn + 1 : turn) }} className="w-[2rem] h-[2rem] rounded-full border-2 border-green-300 text-green-300 hover:border-green-100 hover:text-green-100 flex justify-center items-center cursor-pointer duration-100">
                            <Icon name="arrow-right" size={24}></Icon>
                        </div>
                    </div>
                </div>

                <div className="absolute top-2 left-2">
                    <div className="flex justify-center items-center text-xl text-emerald-600 gap-1">
                        <div className="animate-pulse">
                            <Icon name="watch" size={24}></Icon>
                        </div>
                        Replay
                    </div>
                </div>

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>
            </main>

        </main>
    )
}