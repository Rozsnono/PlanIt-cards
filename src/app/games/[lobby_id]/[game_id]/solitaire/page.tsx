"use client";
import Icon from "@/assets/icons";
import Loader from "@/components/loader.component";
import CardsUrls from "@/contexts/cards.context";
import { UserContext } from "@/contexts/user.context";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";
import { SolitaireService } from "@/services/game.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useContext, useState } from "react";

const gameService = new SolitaireService();


export default function Game() {

    const { user } = useContext(UserContext);


    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    const [playedCards, setPlayerCards] = useState<Icard[][]>([]);

    const [game, setGame] = useState<Igame | null>(null);
    const [lobby, setLobby] = useState<Ilobby | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', (event) => {
            const { playerCards, lobby, game, game_over } = gameService.getDataFromWebsocket(JSON.parse(event.data), socket, { _id: lobby_id, player_id: user!._id }) ?? {};
            console.log("Data from websocket");
            if (game_over) {
                router.push(`/games/${lobby_id}/${game_id}/end`);
                console.log("Game Over");
                socket.close();
            }
            if (playerCards) {
                setPlayerCards(playerCards);
            }
            if (lobby) {
                setLobby(lobby);
            }
            if (game) {
                setGame(game);
            }
        });

        return () => {
            socket.close();
        };
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [draggedPack, setDraggedPack] = useState<Icard[] | null>([]);
    const [dragEnter, setDragEnter] = useState<number | null>(null);

    function startDrag(e: Icard, e2: Icard[]) {
        setTimeout(() => { setDraggedCard(e); setDraggedPack(e2) }, 0);
    }

    function overDrag(e: unknown | any) {
        e.preventDefault();
    }

    function onDragEnter(e: unknown | any, i: number) {
        e.preventDefault();
        setDragEnter(i);
    }

    function onDragDrop(e: unknown | any) {
        if (!draggedCard) { return; }
        if (draggedPack) {
            const index = draggedPack.findIndex(card => card === draggedCard);
            if (index > -1) {
                gameService.placeCards(lobby_id as string, { placedCards: e.cards, placingCards: draggedPack.splice(index) }).then(data => {
                    console.log(data);
                });
            } else {
                gameService.placeCards(lobby_id as string, { placedCards: e.cards, placingCards: [draggedCard] }).then(data => {
                    console.log(data);
                });
            }
        } else {
            gameService.placeCards(lobby_id as string, { placedCards: e.cards, placingCards: [draggedCard] }).then(data => {
                console.log(data);
            });
        }
    }

    function drawCard() {
        if (isLoading) return;
        setIsLoading(true);
        gameService.drawCard(lobby_id as string).then(data => {
            setIsLoading(false);
        });
    }

    function playCard(pack: Icard[]) {
        if (isLoading) return;
        setIsLoading(true);
        gameService.playCard(lobby_id as string, { playedCards: pack, playingCard: draggedCard as Icard }).then(data => {
            setIsLoading(false);
            if (data.info) {
                router.push(`/games/${lobby_id}/${game_id}/solitaire/end`);
            }
        });
    }

    function restartGame() {
        if (isLoading) return;
        setIsLoading(true);
        gameService.restartGame(lobby_id as string, game_id as string).then(data => {
            router.replace(`/games/${lobby_id}/${game_id}/solitaire`);
            router.refresh();
            setIsLoading(false);
        });
    }

    function playWithPress(selectedCard: Icard) {
        if (isLoading) return;
        setIsLoading(true);
        gameService.playWithPress(lobby_id as string, { playedCards: Object.values(game!.playerCards), playingCard: selectedCard }).then(data => {
            setIsLoading(false);
            if (data.info) {
                router.push(`/games/${lobby_id}/${game_id}/solitaire/end`);
            }
        });
    }

    return (
        <main className="flex w-full h-full rounded-md p-3 relative">

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center select-none">

                <div className="flex justify-center items-start w-full h-3/4 absolute py-8 z-50">
                    <div className="flex gap-3">
                        {game && game!.playedCards.map((pack, index) => (
                            <div key={index} className="flex relative" onDragEnter={(e) => onDragEnter(e, index)} onDrop={() => { onDragDrop(pack) }} onDragOver={overDrag} >
                                {pack.cards.map((card, i) => (
                                    i === 0 ?
                                        <Image onClick={card.isJoker ? () => { playWithPress(card) } : () => { }} onDragStart={card.isJoker ? () => { startDrag(card, pack.cards) } : () => { }} key={i} draggable={!!card.isJoker} className={`border-2 border-transparent ${card.isJoker ? 'hover:border-green-500 cursor-pointer' : ''} rounded-lg`} src={card.isJoker ? ("/assets/cards/rummy/" + new CardsUrls().getCardUrl(card.name)) : '/assets/cards/rummy/gray_back.png'} width={100} height={110} alt="card"></Image>
                                        :
                                        <Image onClick={card.isJoker ? () => { playWithPress(card) } : () => { }} onDragStart={card.isJoker ? () => { startDrag(card, pack.cards) } : () => { }} key={i} draggable={!!card.isJoker} style={{ top: `${i * 2}rem` }} className={`absolute border-2 border-transparent ${card.isJoker ? 'hover:border-green-500 cursor-pointer' : ''} rounded-lg`} src={card.isJoker ? ("/assets/cards/rummy/" + new CardsUrls().getCardUrl(card.name)) : '/assets/cards/rummy/gray_back.png'} width={100} height={110} alt="card"></Image>
                                ))}
                                {pack.cards.length == 0
                                    &&
                                    <div className="border rounded-xl w-[5.5rem]"></div>
                                }
                            </div>
                        ))}

                    </div>
                </div>


                <div className="flex justify-between w-1/2 absolute top-2 p-2 justify-center" >
                    <div className="flex gap-3">
                        {game && game.playerCards && Object.values(game!.playerCards).map((pack, index) => {
                            return (
                                <div key={index} className="flex relative" onDrop={() => { playCard(pack) }} onDragOver={overDrag} >
                                    <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md"></div>
                                    <Image draggable={false} className="absolute border-2 border-transparent hover:border-green-500 rounded-lg " src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(pack[pack.length - 1].name)} width={140} height={110} alt="card"></Image>
                                </div>
                            )
                        })}
                        {
                            game &&
                            new Array(4 - (Object.values(game.playerCards).length || 0)).fill(0).map((_, i) => (
                                <div key={i} className="flex relative" onDrop={() => { playCard([]) }} onDragOver={overDrag} >
                                    <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md"></div>

                                </div>
                            ))
                        }
                    </div>

                    <div className="flex gap-3">

                        <div className="flex relative" >
                            <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md"></div>
                            {
                                game?.droppedCards[game.droppedCards.length - 1] &&
                                <Image onClick={() => { playWithPress(game.droppedCards[game.droppedCards.length - 1].card) }} draggable={true} onDragStart={() => { startDrag(game.droppedCards[game.droppedCards.length - 1].card, null) }} className="absolute border-2 border-transparent hover:border-green-500 rounded-lg cursor-pointer" src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(game.droppedCards[game.droppedCards.length - 1].card.name)} width={140} height={110} alt="card"></Image>
                            }
                        </div>
                        <div className="flex relative cursor-pointer" onClick={drawCard}>
                            <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[6rem] border border-zinc-400 rounded-md"></div>
                            {game && game.shuffledCards.length > 0 &&
                                <>
                                    <Image draggable={false} className="absolute border-2 border-transparent hover:border-green-500 rounded-lg" src={"/assets/cards/rummy/gray_back.png"} width={140} height={110} alt="card"></Image>
                                    <Image className="absolute top-1 left-1 " draggable={false} src={"/assets/cards/rummy/gray_back.png"} width={140} height={100} alt="card"></Image>
                                </>
                            }
                        </div>
                    </div>

                </div>


                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>

                <div className="absolute left-20 top-4 flex justify-center items-center gap-3">
                    <div onClick={restartGame} className="w-[3rem] h-[3rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100">
                        <Icon name="refresh" size={24} stroke></Icon>
                    </div>
                </div>
            </main>

        </main>
    )
}