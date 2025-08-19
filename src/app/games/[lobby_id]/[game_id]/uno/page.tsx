"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import Loader from "@/components/loader.component";
import { SettingsContext } from "@/contexts/settings.context";
import { UserContext } from "@/contexts/user.context";
import { dropCard, placeCardToIndex, playCard, sortUnoCards } from "@/functions/card.function";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";
import { GameService, UnoService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React, { use, useRef } from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import ColorPicker from "@/components/color.picker";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import { IP } from "@/enums/ip.enum";
import TurnDisplayComponent from "@/components/game/turn.display.component";
import PingDisplayComponent from "@/components/game/ping.display.component";
import Loading from "@/app/loading";

const gameService = new UnoService();
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    const { settings } = useContext(SettingsContext);
    const [sortType, setSortType] = useState<"num" | "abc" | "">("");
    const [isGameOver, setIsGameOver] = useState(false);

    const [playerCards, setPlayerCards] = useState<Icard[]>([]);

    const [drawedCard, setDrawedCard] = useState<Icard | null>(null);
    const playerCardsRef = useRef<Icard[]>([]);

    useEffect(() => {
        const socket = new WebSocket(IP.WEBSOCKET);

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', async (event) => {
            try {
                const { playerCards, lobby, game, game_over, refresh } = gameService.getDataFromWebsocket(JSON.parse(event.data), socket, { _id: lobby_id, player_id: user!._id }) ?? {};
                if (refresh) {
                    return;
                }
                if (game_over) {
                    if (game) {
                        setGame(game);
                    }
                    setIsGameOver(true);
                    console.log("Game Over");
                    socket.close();
                    return;
                }
                if (!lobby && !game) {
                    router.push(`/games`);
                    socket.close();
                    return;
                }
                if (!game && !lobby.game_id && !game_over && !isGameOver) {
                    router.push(`/games/${lobby_id}`);
                    socket.close();
                    return;
                }
                if (lobby) {
                    setLobby(lobby);
                }
                if (game) {
                    setGame(game);
                    if (game.currentPlayer.playerId === user?._id) {
                        if (game.lastAction && game.lastAction.playerId !== user?._id && game.lastAction.actions >= 25) {
                            //TODO
                        } else {
                            setSelectedCards(playerCards.filter((card: any) => { return game.droppedCards[game.droppedCards.length - 1].card.suit === card.suit || game.droppedCards[game.droppedCards.length - 1].card.rank === card.rank || card.isJoker }));
                        }
                    } else {
                        setSelectedCards([]);
                    }
                    if (game.currentPlayer == user?._id) {
                        timerClass.start();
                    }
                }
                if (playerCards) {
                    const tmpDrawedCard = game.playerCards.find((e: Icard) => playerCardsRef.current.filter((pc: Icard) => { return JSON.stringify(pc) === JSON.stringify(e) }).length == 0) || null;
                    if (game.currentPlayer.playerId === user?._id && game.drawedCard.lastDrawedBy === user?._id) {
                        setDrawedCard(tmpDrawedCard);
                    }
                    setPlayerCards(playerCards);
                    playerCardsRef.current = playerCards;
                }
            } catch {
                router.push(`/games`);
                socket.close();
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
        const res = await gameService.dropCard(lobby!._id, { droppedCard: card, color: color, isUno: isUno });
        console.log(res);
        setError(res.res.error);
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


    const [timer, setTimer] = useState(60);
    const [isUno, setIsUno] = useState(false);

    const [displayIsUno, setDisplayIsUno] = useState(false);

    const [gameSettings, setGameSettings] = useState(game?.secretSettings || { timeLimit: 60 });

    useEffect(() => {
        if (!game) return;
        if (game.currentPlayer.playerId !== user?._id) return;
        setGameSettings(game.secretSettings);
        const interval = setInterval(() => {
            try {
                setTimer(parseInt(((new Date().getTime() - game.currentPlayer.time) / 1000).toFixed(0)));
            } catch { }
        }, 1000);
        return () => clearInterval(interval);
    }, [game]);

    useEffect(() => {
        if (!game) return;
        setDisplayIsUno(game.lastAction.isUno || false);
        setTimeout(() => {
            setDisplayIsUno(false);
            setIsUno(false);
        }, 1000);
    }, [game && game.lastAction.isUno]);

    const [error, setError] = useState<string | null>(null);

    if (!game) return <Loading />;

    return (
        <main className="flex w-full h-full rounded-md p-3 relative select-none">
            {
                isGameOver &&
                <div className="w-full h-full absolute z-[100] bg-zinc-900/70 top-0 left-0 flex flex-col justify-center items-center">
                    <div className="text-5xl text-zinc-200 font-bold p-4 rounded-md animate-pulse">
                        Game Over
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="text-sm text-zinc-400 font-bold p-4 rounded-md">
                            Checkout the game history and statistics.
                        </div>
                        <div onClick={() => { router.push(`/games/${lobby_id}/${game_id}/result`) }} className="text-zinc-200 p-2 px-4 rounded-md border border-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 hover:text-zinc-800 flex items-center gap-1 cursor-pointer">
                            <Icon name="game" stroke></Icon>
                            Statistics
                        </div>
                    </div>
                </div>
            }

            <main className="bg-rose-900 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <TurnDisplayComponent playerName={lobby!.users.find((u) => u._id === game.currentPlayer.playerId)?.username || null} />
                <TurnDisplayComponent playerName={lobby!.bots.find((u) => u._id === game.currentPlayer.playerId)?.name || null} />

                <div className="flex justify-center items-center w-full h-full absolute gap-7">

                    <div className="flex relative z-50" onDragOver={overDrag} onDrop={checkCard} >
                        {
                            game.droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(game.droppedCards[game.droppedCards.length - 2].card.name)} width={150} height={180} alt="card"></Image>
                        }
                        {
                            game.droppedCards.length > 0 &&
                            <Image className="relative right-1 bottom-1 rotate-12 border border-transparent rounded-lg" src={"/" + new CardsUrls().getFullCardUrl(game.droppedCards[game.droppedCards.length - 1].card.name)} width={150} height={180} alt="card"></Image>
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
                        lobby?.users.filter((u) => { return u._id !== user?._id }).slice(0, lobby?.users.length / 2).reverse().map((user, j) => {
                            return (
                                <GameUser key={j} user={user} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[user._id]}></GameUser>
                            )
                        })
                    }
                    {
                        lobby?.bots.slice(0, lobby?.bots.length / 2).reverse().map((bot, j) => {
                            return (
                                <GameBot key={j} bot={bot} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[bot.customId.replace('-', '')]}></GameBot>
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
                                <GameUser key={j} user={user} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[user._id]}></GameUser>
                            )
                        })
                    }

                    {
                        lobby?.bots.slice(lobby?.bots.length / 2).map((bot, j) => {
                            return (
                                <GameBot key={j} bot={bot} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[bot.customId.replace('-', '')]}></GameBot>
                            )
                        })
                    }
                    <div></div>
                </div>

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    {
                        sortUnoCards(playerCards, true, 'abc').map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable className={`cursor-pointer w-12 overflow-visible hover:cursor-grab group rounded-lg duration-200 
                                         ${checkIfCardIsSelected(card) ? 'border-green-400 translate-y-[-1rem]' : ''}
                                         ${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-10' : ''}
                                         
                                         `}>
                                        <Image onDragEnter={(e) => { onDragEnter(e, i) }} className={`${drawedCard?.name === card.name && drawedCard?.pack === card.pack ? 'ring ring-sky-600' : ''} border-2 border-transparent group-hover:border-green-400 rounded-lg`} style={{ width: "6rem", maxWidth: "6rem" }} loading="eager" onDragEnd={() => { setDraggedCard(null) }} onDragStart={() => { startDrag(card) }} onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(card.name)}></Image>
                                    </div>
                                    <div onDragOver={overDrag} className={`${draggedCard && JSON.stringify(draggedCard) !== JSON.stringify(card) && dragEnter === i ? "w-[5.8rem]" : "w-0"} bg-[#00000040] rounded-lg duration-100`}>
                                        {draggedCard &&
                                            <Image className="opacity-75" loading="eager" onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(draggedCard.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(draggedCard.name)}></Image>
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }

                    {
                        game.lastAction.actions > 25 && game.lastAction.playerId != user?._id && game.currentPlayer.playerId == user?._id &&
                        <div className="absolute -top-4 h-4 duration-500">
                            <Icon name="skip" size={128} stroke strokeWidth={2} className="text-red-950"></Icon>
                        </div>
                    }

                    {
                        game.currentPlayer.playerId == user?._id && !isGameOver && game.lastAction.actions < 25 && game.lastAction.playerId !== user?._id &&
                        <div style={{ width: `${Math.floor(75 - (timer / gameSettings.timeLimit) * 75)}%`, backgroundColor: `${timer > (gameSettings.timeLimit - (gameSettings.timeLimit / 6)) ? '#ec003f' : '#9ae600'}` }} className="absolute -top-10 h-4 bg-emerald-500 rounded-xl duration-500">
                            <div className="absolute -top-6 w-full flex justify-center items-center text-sm text-zinc-200">
                                {gameSettings.timeLimit - timer < 0 ? 0 : gameSettings.timeLimit - timer}s
                            </div>
                        </div>
                    }

                    {
                        playerCards.length == 2 && game.currentPlayer.playerId == user?._id && !isGameOver &&
                        <div onClick={() => { setIsUno(true) }} className={`absolute right-10 justify-center items-center flex rounded-full bottom-4`}>
                            <div className={`w-[6rem] h-[6rem] bg-rose-900 rounded-full ring-[0.3rem] ring-lime-300 flex items-center justify-center text-xl group duration-100  group ${isUno ? 'shadow-lg shadow-white cursor-default' : 'text-lime-400 hover:scale-110 cursor-pointer '}`}>
                                <span className={`font-mono opacity-100 group-hover:flex flex duration-100 italic text-4xl group-hover:rotate-[0deg] ${isUno ? 'rotate-[0deg] text-lime-100' : 'rotate-[-25deg]'}`}>UNO</span>
                            </div>
                        </div>
                    }
                </div>
                {
                    displayIsUno &&
                    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-[100]">
                        <div className="text-[8rem] text-white stroke-black font-bold font-mono animate-float-in-t">
                            UNO
                        </div>
                    </div>
                }

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>

                    {
                        colorPickerShow &&
                        <ColorPicker choosen={(e) => { cardDropped(e) }}></ColorPicker>
                    }

                </div>

                <div className="fixed bottom-4 left-4 text-rose-200/40">
                    GameId: {game._id}
                </div>
            </main>

        </main>
    )
}