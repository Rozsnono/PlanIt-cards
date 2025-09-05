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
import { useQuery } from "@tanstack/react-query";
import CardsUrls from "@/contexts/cards.context";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import Loading from "@/app/loading";

export default function Game() {

    const game_id = useParams().game_id;
    const { user } = useContext(UserContext);

    const [turn, setTurn] = useState(1);

    const gameHistoryService = new GameHistoryService();

    const gameHistory = useQuery({
        queryKey: ['game', user!.customId, game_id],
        queryFn: async () => {
            return await gameHistoryService.getGameHistory(user!.customId, game_id);
        }
    });

    if (gameHistory.isLoading) return <Loading />;
    if (gameHistory.isError) return null;

    function getCurrentTurn(): {
        playerCards: { [player_id: string]: Icard[] },
        playedCards: { playedBy: string, cards: Icard[] }[],
        droppedCards: { playerId: string, card: Icard }[],
    } | null {
        const currentTurn = gameHistory.data?.turns[turn];
        if (currentTurn) {
            return currentTurn;
        }
        return null;
    }

    return (
        <main className="flex w-full h-full rounded-md p-3 relative select-none">

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center">
                <div className="flex justify-center items-center w-full h-full absolute py-8">
                    <div className="border border-[#cccccc10] rounded-md w-2/3 h-2/3 flex flex-wrap gap-10 z-50 p-1">
                        {
                            getCurrentTurn()!.playedCards.map((e: { playedBy: string, cards: Icard[] }, i: number) => {
                                return (
                                    <div key={i} className={`flex gap-1 h-min group`}>
                                        {
                                            e.cards.map((card: Icard, j: number) => {
                                                return (
                                                    <div key={j} className="w-8 h-16 relative group cursor-pointer overflow-visible">
                                                        <Image className={`card-animation w-16 max-w-16 rounded-md border border-transparent`} key={j} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={70} height={60} alt={new CardsUrls().getFullCardUrl(card.name)||''}></Image>
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
                    <div className="flex relative">
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[6rem] border border-zinc-400 rounded-md"></div>
                        <Image className="absolute top-1 left-1" draggable={false} src={"/assets/cards/rummy/gray_back.png"} width={140} height={100} alt="card"></Image>
                        <Image draggable={false} className="absolute border-2 border-transparent rounded-lg" src={"/assets/cards/rummy/gray_back.png"} width={140} height={110} alt="card"></Image>
                    </div>

                    <div className="flex relative" >
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md"></div>

                        {
                            getCurrentTurn()!.droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(getCurrentTurn()!.droppedCards[getCurrentTurn()!.droppedCards.length - 2].card.name)} width={140} height={100} alt="card"></Image>
                        }
                        {
                            getCurrentTurn()!.droppedCards.length > 0 &&
                            <Image className="absolute right-1 bottom-1 rotate-12 border border-transparent rounded-lg" src={"/" + new CardsUrls().getFullCardUrl(getCurrentTurn()!.droppedCards[getCurrentTurn()!.droppedCards.length - 1].card.name)} width={140} height={100} alt="card"></Image>
                        }
                    </div>
                </div>

                {/* <div className="absolute top-0 left-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        gameHistory.data.users.filter((u, i) => { return i % 2 === 0 && u._id !== user?._id }).map((user, j) => {
                            return (
                                <GameUser key={j} user={user} currentPlayer={''}></GameUser>
                                <></>
                            )
                        })
                    }
                    <div></div>
                </div> */}

                {/* <div className="absolute top-0 right-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        gameHistory.data.users.filter((u, i) => { return i % 2 === 1 && u._id !== user?._id }).map((user, j) => {
                            return (
                                <GameUser key={j} user={user} currentPlayer={''}></GameUser>
                                <></>
                            )
                        })
                    }
                    <div></div>
                </div> */}

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    {
                        getCurrentTurn()!.playerCards[user!._id].map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div
                                        className={`w-12 overflow-visible group rounded-lg duration-200`}>
                                        <Image draggable={false} className={`border-2 border-transparent rounded-lg`} style={{ width: "6rem", maxWidth: "6rem" }} loading="eager" src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(card.name)||''}></Image>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }


                </div>


                {
                    <div style={{ width: `${((turn - 1) / Object.keys(gameHistory.data.turns).length) * 100}%` }} className="absolute bottom-48 h-4 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-xl duration-200">
                        <div className="absolute -top-6 w-full flex justify-center items-center text-sm text-zinc-200">

                        </div>
                    </div>
                }

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>

                <div className="absolute top-5 left-[5rem]">
                    <div className="flex items-center gap-1 text-xl text-green-300">
                        <Icon name="watch" className="animate-pulse" size={24}></Icon>
                        Replay
                    </div>
                </div>

                <div className="absolute bottom-5 left-5">
                    <div className="flex items-center gap-1 text-xl text-green-300">
                        <Icon name="users" className="animate-pulse" size={24}></Icon>
                        Players: {gameHistory.data.users.length}
                    </div>

                    <div className="flex items-center gap-1 text-xl text-green-300">
                        <Icon name="settings" className="animate-pulse" size={24}></Icon>
                        Turn: {turn}
                    </div>
                </div>



                <div className="absolute bottom-5 right-5">
                    <div className="flex items-center gap-1 text-xl text-green-300">
                        <Icon name="double-arrow-left" className={`cursor-pointer ${turn > 1 ? 'hover:animate-pulse ' : 'text-green-700'}`} size={48} onClick={() => {
                            if (turn > 1) {
                                setTurn(1);
                            }
                        }}></Icon>
                        <Icon name="arrow-left" className={`cursor-pointer ${turn > 1 ? 'hover:animate-pulse ' : 'text-green-700'}`} size={48} onClick={() => {
                            if (turn > 1) {
                                setTurn(turn - 1);
                            }
                        }}></Icon>
                        <Icon name="arrow-right" className={`cursor-pointer ${turn - 1 < Object.values(gameHistory.data.turns).length - 1 ? 'hover:animate-pulse ' : 'text-green-700'}`} size={48} onClick={() => {
                            if (turn - 1 < Object.values(gameHistory.data.turns).length - 1) {
                                setTurn(turn + 1);
                            }
                        }}></Icon>
                        <Icon name="double-arrow-right" className={`cursor-pointer ${turn - 1 < Object.values(gameHistory.data.turns).length - 1 ? 'hover:animate-pulse ' : 'text-green-700'}`} size={48} onClick={() => {
                            if (turn - 1 < Object.values(gameHistory.data.turns).length - 1) {
                                setTurn(Object.values(gameHistory.data.turns).length);
                            }
                        }}></Icon>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-4 left-4 text-emerald-200/40">
                GameId: {gameHistory.data.gameId}
            </div>

        </main>
    )
}