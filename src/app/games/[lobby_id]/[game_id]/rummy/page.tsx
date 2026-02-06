"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import Loader from "@/components/loader.component";
import { SettingsContext } from "@/contexts/settings.context";
import { UserContext } from "@/contexts/user.context";
import { dropCard, placeCardToIndex, playCard, sortRummyCards } from "@/functions/card.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";
import { GameService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import { IP } from "@/enums/ip.enum";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import gameModel from "../../../../../../api/src/models/game.model";
import Loading from "@/app/loading";
import PlayerDisplay from "@/components/game/player.display.component";
import GameOver from "@/components/game/over.componet";
import SortsComponent from "@/components/game/sorts.component";
import NextTurnComponent from "@/components/game/next.component";
import DropComponent from "@/components/game/drop.component";

const gameService = new GameService("rummy");
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    const { settings } = useContext(SettingsContext);
    const [sortType, setSortType] = useState<"num" | "abc" | "">("");
    const [isGameOver, setIsGameOver] = useState(false);

    const [playerCardsState, setPlayerCards] = useState<Icard[]>([]);
    const [drawedCard, setDrawedCard] = useState<Icard | null>(null);
    const playerCardsRef = useRef<Icard[]>([]);

    useEffect(() => {
        const socket = new WebSocket(IP.WEBSOCKET);

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', (event) => {
            const { playerCards, lobby, game, game_over, refresh } = gameService.getDataFromWebsocket(JSON.parse(event.data), socket, { _id: lobby_id, player_id: user!._id }) ?? {};
            if (refresh) {
                return;
            }
            if (game_over) {
                setIsGameOver(true);
                setNextTurnLoader(false);
                console.log("Game Over");
                socket.close();
                return;
            }
            if (!game && !game_over && !isGameOver) {
                router.push(`/games/${lobby_id}`);
                socket.close();
                return;
            }
            if (playerCards) {
                const tmpDrawedCard = game.playerCards.find((e: Icard) => playerCardsRef.current.filter((pc: Icard) => { return JSON.stringify(pc) === JSON.stringify(e) }).length == 0) || null;
                setDrawedCard(tmpDrawedCard);
                setPlayerCards(playerCards);
                playerCardsRef.current = playerCards;
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
    const [gameState, setGame] = useState<Igame | any>();
    const [lobby, setLobby] = useState<Ilobby>();
    const [nextTurnLoader, setNextTurnLoader] = useState(false);

    const [selectedCards, setSelectedCards] = useState<Icard[]>([]);
    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [dragEnter, setDragEnter] = useState<number | null>(null);

    function selectCard(card: Icard) {
        if (selectedCards.find((e: Icard) => { return JSON.stringify(e) === JSON.stringify(card) })) {
            return setSelectedCards(selectedCards.filter((e: Icard) => { return JSON.stringify(e) !== JSON.stringify(card) }));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    }

    function checkIfCardIsSelected(card: Icard) {
        let c = [...sortRummyCards(playerCardsState, settings?.autoSort, sortType)];
        return card === c.reverse().find((e: Icard) => selectedCards.find((sc: Icard) => { return JSON.stringify(sc) === JSON.stringify(e) }));
    }
    function checkIfCardsIsSelected(card: Icard) {
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
        setPlayerCards(placeCardToIndex(playerCardsState, index, draggedCard));
        setDraggedCard(null);
    }

    async function cardDropped() {
        if (!draggedCard) return;
        if (!user) return;

        const res = await gameService.dropCard(lobby!._id, { droppedCard: draggedCard });
        setError(res.error);
        setDraggedCard(null);
    }

    async function cardDroppedByClick() {
        if (selectedCards.length > 1 || selectedCards.length === 0) return;
        if (!user) return;

        const res = await gameService.dropCard(lobby!._id, { droppedCard: selectedCards[0] });
        setError(res.error);
        setDraggedCard(null);
        setSelectedCards([]);
    }

    async function playCards() {
        if (!user) return;
        if (selectedCards.length < 3) {
            return;
        }
        const res = await gameService.playCard(lobby!._id, { playedCards: selectedCards })
        setError(res.error);
        setSelectedCards([]);
    }

    async function drawingCard() {
        if (!user) return;
        if (!lobby) return;
        const res = await gameService.drawCard(lobby!._id);
        setError(res.error);
    }

    async function drawingFromDropped() {
        if (!user) return;
        if (!lobby) return;
        const res = await gameService.drawFromDropped(lobby!._id);
        setError(res.error);
    }

    async function drawingFromTrump() {
        if (!user) return;
        if (!lobby) return;
        const res = await gameService.drawFromTrump(lobby!._id);
        setError(res.error);
    }

    async function cardPlacingDrop(playedCard: { playedBy: string, cards: Icard[] }) {
        if (!playedCard) return;
        if (!user) return;
        const res = await gameService.putCard(lobby!._id, { playedCards: playedCard, placeCard: draggedCard! });
        setError(res.error);
        setDraggedCard(null);
    }

    const [timer, setTimer] = useState(180);

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                setTimer(parseInt(((new Date().getTime() - gameState.currentPlayer.time) / 1000).toFixed(0)));
            } catch { }
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState]);

    async function nextTurn() {
        if (!user) return;
        setNextTurnLoader(true);
        const res = await gameService.nextTurn(lobby!._id);
        if (!res.error) {
            timerClass.stop();
            setTimer(180);
            gameState.currentPlayer.playerId = null;
        } else {
            setError(res.error);
        }
        setNextTurnLoader(false);
    }

    const [error, setError] = useState<string | null>(null);

    if (!gameState) return <Loading />

    return (
        <main className="flex w-full h-full rounded-md p-3 relative">

            <GameOver type="RUMMY" isGameOver={isGameOver} lobbyId={lobby_id!} gameId={game_id!}></GameOver>

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <div className="flex justify-center items-center w-full h-full absolute py-8">
                    <div className="border border-[#cccccc10] rounded-md w-2/3 h-2/3 flex flex-wrap gap-10 z-50 p-1" onDrop={playCards} onDragOver={overDrag} >
                        {
                            gameState.playedCards.length > 0 && gameState.playedCards.map((e: { playedBy: string, cards: Icard[] }, i: number) => {
                                return (
                                    <div key={i} className={`flex gap-1 h-min group`}>
                                        {
                                            e.cards.map((card: Icard, j: number) => {
                                                return (
                                                    <div onDrop={() => { cardPlacingDrop(e) }} key={j} className="w-8 h-16 relative group cursor-pointer overflow-visible">
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

                <div className="flex gap-16 w-full absolute top-2 p-2 justify-center items-start">
                    <div className="flex relative cursor-pointer">
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[5rem] border border-zinc-400 rounded-md z-10"></div>
                        <Image className="absolute top-1 left-1 z-10" draggable={false} src={"/assets/cards/rummy/gray_back.png"} width={140} height={100} alt="card"></Image>
                        <Image onClick={drawingCard} draggable={false} className="absolute border-2 border-transparent hover:border-green-500 rounded-lg z-10" src={"/assets/cards/rummy/gray_back.png"} width={140} height={110} alt="card"></Image>
                        {
                            gameState.lastAction.trump &&
                            <Image onClick={drawingFromTrump} className="absolute left-8 top-0 rotate-90 hover:ring-2 hover:ring-green-500 rounded-lg" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(gameState.lastAction.trump.card.name)} width={140} height={100} alt="card"></Image>

                        }
                    </div>

                    <div className="lg:flex relative hidden" onDragOver={overDrag} onDrop={cardDropped} >
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[5rem] h-[5rem] border border-zinc-400 rounded-md"></div>

                        {
                            gameState.droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1 " draggable={false} src={"/" + new CardsUrls().getFullCardUrl(gameState.droppedCards[gameState.droppedCards.length - 2].card.name)} width={100} height={60} alt="card"></Image>
                        }
                        {
                            gameState.droppedCards.length > 0 &&
                            <Image onClick={drawingFromDropped} className="absolute right-1 bottom-1 rotate-12 border border-transparent hover:border-green-300 rounded-lg cursor-pointer" src={"/" + new CardsUrls().getFullCardUrl(gameState.droppedCards[gameState.droppedCards.length - 1].card.name)} width={140} height={100} alt="card"></Image>
                        }
                    </div>

                    <div className="flex relative lg:hidden" onDragOver={overDrag} onDrop={cardDropped} >
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.8rem] w-[3rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[5.4rem] h-[4rem] border border-zinc-400 rounded-md"></div>
                        {
                            gameState.droppedCards.length > 0 &&
                            <Image onClick={drawingFromDropped} className="absolute right-1 bottom-1 border border-transparent hover:border-green-300 rounded-lg cursor-pointer h-[5rem] w-auto" src={"/" + new CardsUrls().getFullCardUrl(gameState.droppedCards[gameState.droppedCards.length - 1].card.name)} width={80} height={60} alt="card"></Image>
                        }
                    </div>
                </div>

                <PlayerDisplay lobby={lobby!} game={gameState} user={user}></PlayerDisplay>


                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    {
                        sortRummyCards(playerCardsState, settings?.autoSort, sortType).map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable onClick={() => { selectCard(card) }}
                                        className={`cursor-pointer w-6 lg:w-12 overflow-visible hover:cursor-grab group rounded-lg duration-200 
                                        ${checkIfCardIsSelected(card) ? 'w-20 ' : ''} 
                                        ${checkIfCardsIsSelected(card) ? 'border-green-400 -translate-y-[0.5rem]' : ''} 
                                        ${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-10' : ''}
                                        `}>
                                        <Image onDragEnter={(e) => { onDragEnter(e, i) }} className={`border-2 border-transparent group-hover:border-green-400 rounded-lg lg:w-[6rem] lg:max-w-[6rem] w-[3rem] max-w-[3rem] duration-200
                                        ${gameState.currentPlayer.playerId === user?._id && gameState.droppedCards.length > 0 && gameState.droppedCards[gameState.droppedCards.length - 1].droppedBy != user?._id && drawedCard === card && gameState.drawedCard.lastDrawedBy === user?._id ? 'ring ring-sky-600' : ''}
                                            `} loading="eager" onDragEnd={() => { setDraggedCard(null) }} onDragStart={() => { startDrag(card) }} onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(card.name) || ''}></Image>
                                    </div>
                                    <div onDragOver={overDrag} className={`${draggedCard && JSON.stringify(draggedCard) !== JSON.stringify(card) && dragEnter === i ? "w-[5.8rem]" : "w-0"} bg-[#00000040] rounded-lg duration-100`}>
                                        {draggedCard &&
                                            <Image className="opacity-75" loading="eager" onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(draggedCard.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(draggedCard.name) || ''}></Image>
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }

                    {
                        gameState.currentPlayer.playerId == user?._id && !nextTurnLoader &&
                        <div style={{ width: `${Math.floor(75 - (timer / 180) * 75)}%`, backgroundColor: `${timer > 150 ? '#ec003f' : '#9ae600'}` }} className="absolute -top-6 h-2 lg:h-4 bg-emerald-500 rounded-xl duration-500">
                            <div className="absolute -top-3 lg:-top-6 w-full flex justify-center items-center text-sm text-zinc-200">
                                {180 - timer}s
                            </div>
                        </div>
                    }

                    <SortsComponent setSortType={setSortType}></SortsComponent>

                    <NextTurnComponent nextTurn={nextTurn} nextTurnLoader={nextTurnLoader} isGameOver={isGameOver} gameState={gameState} timer={timer}></NextTurnComponent>

                    <DropComponent isDropable={gameState.currentPlayer.playerId == user?._id && selectedCards.length > 0} onDrop={cardDroppedByClick}></DropComponent>
                </div>

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>

                <div className="fixed bottom-4 left-4 text-emerald-200/40">
                    GameId: {gameState._id}
                </div>
            </main>

        </main>
    )
}