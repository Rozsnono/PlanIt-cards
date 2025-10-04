"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import Loader from "@/components/loader.component";
import { UserContext } from "@/contexts/user.context";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";
import { GameService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import { IP } from "@/enums/ip.enum";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import Loading from "@/app/loading";
import PlayerDisplay from "@/components/game/player.display.component";

const gameService = new GameService("rummy");
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    useEffect(() => {
        const socket = new WebSocket(IP.WEBSOCKET);

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', (event) => {
            const { playerCards, lobby, game, game_over } = gameService.getDataFromWebsocket(JSON.parse(event.data), socket, { _id: lobby_id, player_id: user!._id }) ?? {};
            console.log("Data from websocket");
            if (game_over) {
                router.push(`/games/${lobby_id}/${game_id}/rummy/result`);
                console.log("Game Over");
                socket.close();
            }
            if (lobby) {
                setLobby(lobby);
            }
            if (game) {
                setGame(game);
                if (game.currentPlayer == user?._id) {
                    timerClass.start();
                }
            }
        });

        return () => {
            socket.close();
        };
    }, [])

    const { user } = useContext(UserContext);
    const [game, setGame] = useState<Igame | any>();
    const [lobby, setLobby] = useState<Ilobby>();


    const [error, setError] = useState<string | null>(null);

    if (!game) return <Loading />

    return (
        <main className="flex w-full h-full rounded-md p-3 relative">

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <div className="flex justify-center items-center w-full h-full absolute py-8">
                    <div className="border border-[#cccccc10] rounded-md w-2/3 h-2/3 flex flex-wrap gap-10 z-50 p-1" >
                        {
                            game.playedCards.length > 0 && game.playedCards.map((e: { playedBy: string, cards: Icard[] }, i: number) => {
                                return (
                                    <div key={i} className={`flex gap-1 h-min group`}>
                                        {
                                            e.cards.map((card: Icard, j: number) => {
                                                return (
                                                    <div key={j} className="w-8 h-16 relative group cursor-pointer overflow-visible">
                                                        <Image className={`card-animation w-16 max-w-16 rounded-md border border-transparent ${e.playedBy === user?._id ? ' group-hover:border-green-500' : ""} `} key={j} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={70} height={60} alt={new CardsUrls().getFullCardUrl(card.name) || ''}></Image>
                                                        {j === 0 && <div className="opacity-0 group-hover:opacity-100 absolute group-hover:bottom-[-3.6rem] bottom-0 text-zinc-300 left-0 w-16 z-[-1] duration-200 ">{lobby?.users.find(user => user._id === e.playedBy)?.firstName || e.playedBy}</div>}
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
                            game.droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(game.droppedCards[game.droppedCards.length - 2].card.name)} width={140} height={100} alt="card"></Image>
                        }
                        {
                            game.droppedCards.length > 0 &&
                            <Image className="absolute right-1 bottom-1 rotate-12 border border-transparent hover:border-green-300 rounded-lg cursor-pointer" src={"/" + new CardsUrls().getFullCardUrl(game.droppedCards[game.droppedCards.length - 1].card.name)} width={140} height={100} alt="card"></Image>
                        }
                    </div>
                </div>

                <PlayerDisplay lobby={lobby!} game={game} user={user} isDisplay></PlayerDisplay>


                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>
            </main>
            <div className="fixed bottom-4 left-4 text-emerald-200/40">
                GameId: {game._id}
            </div>
        </main>
    )
}