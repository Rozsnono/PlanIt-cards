"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import Loader from "@/components/loader.component";
import { SettingsContext } from "@/contexts/settings.context";
import { UserContext } from "@/contexts/user.context";
import { dropCard, placeCardToIndex, playCard, sortRummyCards } from "@/functions/card.function";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";
import { GameService, UnoService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import ColorPicker from "@/components/color.picker";
import GameUser, { GameBot } from "@/components/user/game.user.component";

const gameService = new UnoService();
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    const { settings } = useContext(SettingsContext);
    const [sortType, setSortType] = useState<"num" | "abc" | "">("");

    const [playerCards, setPlayerCards] = useState<Icard[]>([]);

    useEffect(() => {
        const socket = new WebSocket("ws://192.168.0.13:8080");

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', (event) => {
            const { playerCards, lobby, game, game_over } = gameService.getDataFromWebsocket(JSON.parse(event.data), socket, { _id: lobby_id, player_id: user!._id }) ?? {};
            console.log("Data from websocket");
            if (game_over) {
                router.push(`/games/${lobby_id}/${game_id}/uno/end`);
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
                if (game.currentPlayer.playerId === user?._id) {
                    setSelectedCards(playerCards.filter((card: any) => { return game.droppedCards[game.droppedCards.length - 1].card.suit === card.suit || game.droppedCards[game.droppedCards.length - 1].card.rank === card.rank || card.isJoker }));
                } else {
                    setSelectedCards([]);
                }
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
    const [nextTurnLoader, setNextTurnLoader] = useState(false);
    const [colorPickerShow, setCPshow] = useState(false);

    const [selectedCards, setSelectedCards] = useState<Icard[]>([]);
    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [choosedCard, setChoosedCard] = useState<Icard | null>(null);
    const [dragEnter, setDragEnter] = useState<number | null>(null);

    function checkIfCardIsSelected(card: Icard) {
        return selectedCards.find((e: Icard) => { return JSON.stringify(e) === JSON.stringify(card) });
    }

    function startDrag(e: Icard) {
        setTimeout(() => { setDraggedCard(e); }, 0);
    }

    function overDrag(e: unknown | any) {
        e.preventDefault();
    }

    function onDragEnter(e: unknown | any, i: number) {
        e.preventDefault();
        setDragEnter(i);
    }

    function dropDrag(index: number) {
        setDragEnter(null);
        if (!draggedCard) return;
        if (!user) return;
        setPlayerCards(placeCardToIndex(playerCards, index, draggedCard));
        setDraggedCard(null);
    }

    async function cardDropped(color?: string) {
        const card = draggedCard || choosedCard;
        if (!card) return;
        if (!user) return;
        setCPshow(false);
        const res = await gameService.dropCard(lobby!._id, { droppedCard: card, color: color });
        setError(res.error);
        setDraggedCard(null);
    }

    async function checkCard() {
        if (!draggedCard) return;
        if (!user) return;
        setChoosedCard(draggedCard);

        if (draggedCard.isJoker) {
            setCPshow(true);
        } else {
            cardDropped();
        }
    }

    async function drawingCard() {
        if (!user) return;
        if (!lobby) return;
        const res = await gameService.drawCard(lobby!._id);
        setError(res.error);
    }


    const [timer, setTimer] = useState(180);

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                setTimer(parseInt(((new Date().getTime() - game.currentPlayer.time) / 1000).toFixed(0)));
            } catch { }
        }, 1000);
        return () => clearInterval(interval);
    }, [game]);

    const [error, setError] = useState<string | null>(null);

    if (!game) return <Loader></Loader>

    return (
        <main className="flex w-full h-full rounded-md p-3 relative">

            <main className="bg-rose-900 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <div className="flex justify-center items-center w-full h-full absolute gap-7">

                    <div className="flex relative z-50" onDragOver={overDrag} onDrop={checkCard} >
                        {
                            game.droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1" draggable={false} src={"/assets/cards/uno/" + new CardsUrls().getUnoCardUrl(game.droppedCards[game.droppedCards.length - 2].card.name)} width={150} height={180} alt="card"></Image>
                        }
                        {
                            game.droppedCards.length > 0 &&
                            <Image className="relative right-1 bottom-1 rotate-12 border border-transparent rounded-lg" src={"/assets/cards/uno/" + new CardsUrls().getUnoCardUrl(game.droppedCards[game.droppedCards.length - 1].card.name)} width={150} height={180} alt="card"></Image>
                        }
                    </div>
                </div>

                <div className="flex gap-10 w-full absolute top-2 p-2 justify-center">
                    <div className="flex relative cursor-pointer z-50">
                        <Image className="relative top-1 left-1" draggable={false} src={"/assets/cards/uno/Deck.png"} width={150} height={180} alt="card"></Image>
                        <Image onClick={drawingCard} draggable={false} className="absolute border-2 border-transparent hover:border-green-500 rounded-3xl" src={"/assets/cards/uno/Deck.png"} width={230} height={200} alt="card"></Image>
                    </div>

                </div>

                <div className="absolute top-0 left-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        lobby?.users.filter((u) => { return u._id !== user?._id }).slice(0, lobby?.users.length / 2).map((user, j) => {
                            return (
                                <GameUser key={j} user={user} currentPlayer={game.currentPlayer.playerId}></GameUser>
                            )
                        })
                    }

                    {
                        lobby?.bots.slice(0, lobby?.bots.length / 2).map((bot, j) => {
                            return (
                                <GameBot key={j} bot={bot} currentPlayer={game.currentPlayer.playerId}></GameBot>
                            )
                        })
                    }
                    <div></div>
                </div>

                <div className="absolute top-0 right-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        lobby?.users.filter((u) => { return u._id !== user?._id }).slice(lobby?.users.length / 2).map((user, j) => {
                            return (
                                <GameUser key={j} user={user} currentPlayer={game.currentPlayer.playerId}></GameUser>
                            )
                        })
                    }

                    {
                        lobby?.bots.slice(lobby?.bots.length / 2).map((bot, j) => {
                            return (
                                <GameBot key={j} bot={bot} currentPlayer={game.currentPlayer.playerId}></GameBot>
                            )
                        })
                    }
                    <div></div>
                </div>

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    {
                        sortRummyCards(playerCards, settings?.autoSort, sortType).map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable className={`cursor-pointer w-12 overflow-visible hover:cursor-grab group rounded-lg duration-200 ${checkIfCardIsSelected(card) ? 'border-green-400 translate-y-[-1rem]' : ''} ${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-10' : ''}`}>
                                        <Image onDragEnter={(e) => { onDragEnter(e, i) }} className="border-2 border-transparent group-hover:border-green-400 rounded-lg" style={{ width: "6rem", maxWidth: "6rem" }} loading="eager" onDragEnd={() => { setDraggedCard(null) }} onDragStart={() => { startDrag(card) }} onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/assets/cards/uno/" + new CardsUrls().getUnoCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getUnoCardUrl(card.name)}></Image>
                                    </div>
                                    <div onDragOver={overDrag} className={`${draggedCard && JSON.stringify(draggedCard) !== JSON.stringify(card) && dragEnter === i ? "w-[5.8rem]" : "w-0"} bg-[#00000040] rounded-lg duration-100`}>
                                        {draggedCard &&
                                            <Image className="opacity-75" loading="eager" onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/assets/cards/uno/" + new CardsUrls().getUnoCardUrl(draggedCard.name)} width={100} height={100} alt={new CardsUrls().getUnoCardUrl(draggedCard.name)}></Image>
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }

                    <div className="absolute left-16 bottom-4 flex justify-center items-center gap-3">
                        <div onClick={() => { setSortType('abc') }} className="w-[4rem] h-[4rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100">
                            <Icon name="sort-abc" size={24}></Icon>
                        </div>
                        <div onClick={() => { setSortType('num') }} className="w-[4rem] h-[4rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100">
                            <Icon name="sort-num" size={24}></Icon>
                        </div>
                    </div>

                    {
                        game.currentPlayer.playerId == user?._id && !nextTurnLoader &&
                        <div key={timer} className={`absolute right-10 h-[5rem] w-[5rem] justify-center items-center flex rounded-full border-2 border-lime-300 bottom-4`}
                            style={{ background: `conic-gradient(#bef264 ${360 - ((timer) * 360 / 180)}deg, transparent 0deg)` }}
                        >
                            <div className="w-[4.5rem] h-[4.5rem] bg-rose-900 rounded-full border-2 flex items-center justify-center text-zinc-200 border-lime-300 text-xl cursor-pointer group duration-100">
                                <span className="group-hover:opacity-0 group-hover:hidden flex opacity-100 duration-100">{180 - timer > 0 ? 180 - timer : 0}s</span>
                                <span className="group-hover:opacity-100 group-hover:flex hidden opacity-0 duration-100"><Icon name="check-empty" size={44}></Icon></span>
                            </div>
                        </div>
                    }

                    {
                        nextTurnLoader &&
                        <div key={timer} className={`absolute right-10 h-[5rem] w-[5rem] justify-center items-center flex rounded-full border-2 border-lime-300 bottom-4`}
                            style={{ background: `conic-gradient(#bef264 ${360 - ((0) * 360 / 180)}deg, transparent 0deg)` }}
                        >
                            <div className="w-[4.5rem] h-[4.5rem] bg-rose-900 rounded-full border-2 flex items-center justify-center text-lime-200 border-lime-300 text-xl cursor-pointer group duration-100">
                                <span className="opacity-100 group-hover:flex flex duration-100 animate-spin"><Icon name="loader" size={44}></Icon></span>
                            </div>
                        </div>
                    }
                </div>

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>

                    {
                        colorPickerShow &&
                        <ColorPicker choosen={(e) => { cardDropped(e) }}></ColorPicker>
                    }

                </div>
            </main>

        </main>
    )
}