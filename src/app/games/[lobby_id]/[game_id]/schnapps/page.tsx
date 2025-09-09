"use client";
import Icon, { StrokeIcon } from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import Loader from "@/components/loader.component";
import { SettingsContext } from "@/contexts/settings.context";
import { UserContext } from "@/contexts/user.context";
import { dropCard, placeCardToIndex, playCard, sortSchnapsenCards, sortUnoCards } from "@/functions/card.function";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { Icard, Igame, Ilobby, Iplayer } from "@/interfaces/interface";
import { GameService, SchnappsService, UnoService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React, { use, useRef } from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import ColorPicker from "@/components/color.picker";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import { IP } from "@/enums/ip.enum";
import PingDisplayComponent from "@/components/game/ping.display.component";
import Loading from "@/app/loading";

const gameService = new SchnappsService();
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    const { settings } = useContext(SettingsContext);
    const [sortType, setSortType] = useState<"num" | "abc" | "">("");
    const [isGameOver, setIsGameOver] = useState(false);

    const trumps = {
        suits: ['A', 'B', 'H', 'L'],
        cards: [['A', 'T'], ['K', 'O'], ['U', '9']],
        call: { 1: 'Call', 6: 'Bettli', 7: 'Schnapps', 8: 'Gangli' }
    }

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
                console.log(JSON.parse(event.data));
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
    const [gameState, setGame] = useState<Igame | null>(null);
    const [lobbyState, setLobby] = useState<Ilobby | null>(null);
    const [nextTurnLoader, setNextTurnLoader] = useState(false);
    const [colorPickerShow, setCPshow] = useState(false);

    const [selectedCards, setSelectedCards] = useState<Icard[]>([]);
    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [choosedCard, setChoosedCard] = useState<Icard | null>(null);
    const [dragEnter, setDragEnter] = useState<number | null>(null);

    const [selectedTrump, setSelectedTrump] = useState<{ suit: string, cardName?: string, call?: string }>({ suit: 'H', cardName: 'S_AH', call: 'Call' });

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

    async function cardDropped() {
        const card = draggedCard || choosedCard;
        if (!card) return;
        if (!user) return;
        setCPshow(false);
        const res = await gameService.dropCard(lobbyState!._id, { droppedCard: card });
        setError(res.error);
        setDraggedCard(null);
    }

    async function checkCard() {
        if (!draggedCard) return;
        if (!user) return;
        setChoosedCard(draggedCard);
        cardDropped();
    }

    async function callTwenty(card?: Icard) {
        if (!card) return;
        if (!lobbyState) return;
        const res = await gameService.callTwenty(lobbyState._id, { droppedCard: card });
        setError(res.error);
        setCPshow(false);
        setDraggedCard(null);
    }

    const [timer, setTimer] = useState(60);

    const [displayTrump, setDisplayTrump] = useState(false);
    const [endOfTurn, setEndOfTurn] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    const [gameSettings, setGameSettings] = useState(gameState?.secretSettings || { timeLimit: 60 });

    useEffect(() => {
        if (!gameState) return;
        if (gameState.currentPlayer.playerId !== user?._id) return;
        setGameSettings(gameState.secretSettings);
        const interval = setInterval(() => {
            try {
                setTimer(parseInt(((new Date().getTime() - gameState.currentPlayer.time) / 1000).toFixed(0)));
            } catch { }
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState]);

    useEffect(() => {
        if (!gameState) return;
        setDisplayTrump(!!gameState.lastAction.actions);
        setTimeout(() => {
            setDisplayTrump(false);
        }, 2000);
    }, [gameState && gameState.lastAction.playerId]);

    useEffect(() => {
        if (!gameState) return;
        if (gameState.secretSettings.currentTurn > 1 && gameState.playedCards.length > 0 && gameState.currentPlayer.playerId !== user?._id && gameState.droppedCards.length == 0 && !isGameOver) {
            setEndOfTurn(true);
            switch (getSpaceByPlayerId(gameState.playedCards[gameState.playedCards.length - 1].playedBy)) {
                case 0:
                    setWinner('animate-group-and-leave-b');
                    break;
                case 1:
                    setWinner('animate-group-and-leave-l');
                    break;
                case 2:
                    setWinner('animate-group-and-leave-t');
                    break;
                case 3:
                    setWinner('animate-group-and-leave-r');
                    break;
            }
            setTimeout(() => {
                setEndOfTurn(false);
            }, 3000);
        }

    }, [gameState && gameState.secretSettings.currentTurn && gameState.playedCards.length]);

    const [error, setError] = useState<string | null>(null);

    function GetTrumpIcon({ suit }: { suit: string }) {
        switch (suit) {
            case 'H':
                return <Icon name="heart" size={64} className="text-red-600"></Icon>;
            case 'A':
                return <Icon name="acorn" size={64} className="text-zinc-200" stroke></Icon>;
            case 'B':
                return <Icon name="bell" size={64} className="text-yellow-700" stroke></Icon>;
            case 'L':
                return <Icon name="leaf" size={64} className="text-green-600"></Icon>;
            default:
                return null;
        }
    }

    function setTrumpSelection() {
        if (!selectedTrump.call || !selectedTrump.cardName || !selectedTrump.suit) return;
        if (!lobbyState) return;
        gameService.selectTrump(lobbyState._id, { selectedTrump: selectedTrump }).then((res) => {
            setError(res.error);
            setSelectedCards([]);
            setSelectedTrump({ suit: 'H', cardName: 'S_AH', call: 'Call' });
        });
    }

    function skipTrumpSelection() {
        if (!lobbyState) return;
        gameService.skipTrump(lobbyState._id).then((res) => {
            setError(res.error);
            setSelectedCards([]);
        });
    }

    function getPlayerBySpace(space: number, needCard?: boolean, isBot?: boolean): Icard | Iplayer | { _id: string, name: string, customId: string } | null | any {
        if (!lobbyState) return null;
        if (!gameState) return null;
        const index = (Object.keys(gameState.allCards).indexOf(user!._id) + space) % Object.keys(gameState.allCards).length;
        if (needCard) {
            return gameState.droppedCards.find((c: any) => c.droppedBy === Object.keys(gameState.allCards)[index])?.card;
        }
        if (isBot) {
            return lobbyState.bots.find((b) => b._id === Object.keys(gameState.allCards)[index]) || null;
        }
        return lobbyState.users.find((u) => u._id === Object.keys(gameState.allCards)[index]) || null;
    }
    function getSpaceByPlayerId(playerId: string) {
        if (!lobbyState) return null;
        if (!gameState) return null;
        return (Object.keys(gameState.allCards).indexOf(playerId) - Object.keys(gameState.allCards).indexOf(user!._id) + Object.keys(gameState.allCards).length) % Object.keys(gameState.allCards).length;
    }

    if (!gameState) return <Loading />

    return (
        <main className="flex w-full h-full rounded-md p-3 relative select-none">
            {
                isGameOver &&
                <div className="w-full h-full absolute z-[1000] bg-zinc-900/70 top-0 left-0 flex flex-col justify-center items-center">
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

            <main className="bg-orange-900 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }

                <PingDisplayComponent />
                <div className="flex justify-center items-center w-full h-full absolute gap-7">

                    {
                        !endOfTurn &&
                        <div className="flex relative z-50 w-[20rem] h-[20rem]" onDragOver={overDrag} onDrop={checkCard} >
                            <DroppedCardComponent card={getPlayerBySpace(2, true)} className="absolute w-[8rem] -top-16 left-[50%] translate-x-[-50%]" trumpSuit={gameState.lastAction.trump?.suit}></DroppedCardComponent>

                            <DroppedCardComponent card={getPlayerBySpace(0, true)} className="absolute w-[8rem] -bottom-16 left-[50%] translate-x-[-50%]" trumpSuit={gameState.lastAction.trump?.suit}></DroppedCardComponent>

                            <DroppedCardComponent card={getPlayerBySpace(1, true)} className="absolute w-[8rem] top-[50%] translate-y-[-50%] -left-16" trumpSuit={gameState.lastAction.trump?.suit}></DroppedCardComponent>

                            <DroppedCardComponent card={getPlayerBySpace(3, true)} className="absolute w-[8rem] bottom-[50%] translate-y-[50%] -right-16" trumpSuit={gameState.lastAction.trump?.suit}></DroppedCardComponent>
                        </div>
                    }

                    {
                        endOfTurn &&
                        <div className={"flex relative z-50 w-[20rem] h-[20rem] " + winner}  >
                            <div className="absolute w-[8rem] -top-16 left-[50%] translate-x-[-50%]">
                                <Image className="" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(gameState.playedCards[gameState.playedCards.length - 1].cards[2].name)} width={150} height={180} alt="card"></Image>
                            </div>

                            <div className="absolute w-[8rem] -bottom-16 left-[50%] translate-x-[-50%]">
                                <Image className="" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(gameState.playedCards[gameState.playedCards.length - 1].cards[0].name)} width={150} height={180} alt="card"></Image>
                            </div>

                            <div className="absolute w-[8rem] top-[50%] translate-y-[-50%] -left-16">
                                <Image className="" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(gameState.playedCards[gameState.playedCards.length - 1].cards[1].name)} width={150} height={180} alt="card"></Image>
                            </div>

                            <div className="absolute w-[8rem] bottom-[50%] translate-y-[50%] -right-16">
                                <Image className="" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(gameState.playedCards[gameState.playedCards.length - 1].cards[3].name)} width={150} height={180} alt="card"></Image>
                            </div>
                        </div>
                    }
                </div>

                <div className="absolute top-0 left-2 h-full flex flex-col justify-between items-center">
                    <div></div>

                    {
                        getPlayerBySpace(1, false, false) &&
                        <GameUser isCaller={gameState.lastAction.playerId === getPlayerBySpace(1, false, false)._id} user={getPlayerBySpace(1, false, false)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(1, false, false)._id]}></GameUser>
                    }
                    {
                        getPlayerBySpace(1, false, true) &&
                        <GameBot isCaller={gameState.lastAction.playerId === getPlayerBySpace(1, false, true)._id} bot={getPlayerBySpace(1, false, true)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(1, false, true)._id]}></GameBot>
                    }
                    <div></div>
                </div>

                <div className="absolute top-2 right-2 w-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        getPlayerBySpace(2, false, false) &&
                        <GameUser isCaller={gameState.lastAction.playerId === getPlayerBySpace(2, false, false)._id} isOnTop user={getPlayerBySpace(2, false, false)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(2, false, false)._id]}></GameUser>
                    }
                    {
                        getPlayerBySpace(2, false, true) &&
                        <GameBot isCaller={gameState.lastAction.playerId === getPlayerBySpace(2, false, true)._id} isOnTop bot={getPlayerBySpace(2, false, true)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(2, false, true)._id]}></GameBot>
                    }
                    <div></div>
                </div>

                <div className="absolute top-0 right-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        getPlayerBySpace(3, false, false) &&
                        <GameUser isCaller={gameState.lastAction.playerId === getPlayerBySpace(3, false, false)._id} user={getPlayerBySpace(3, false, false)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(3, false, false)._id]}></GameUser>
                    }
                    {
                        getPlayerBySpace(3, false, true) &&
                        <GameBot isCaller={gameState.lastAction.playerId === getPlayerBySpace(3, false, true)._id} bot={getPlayerBySpace(3, false, true)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(3, false, true)._id]}></GameBot>
                    }
                    <div></div>
                </div>


                <div className={`flex gap-1 w-full absolute bottom-0 p-2 justify-center ${gameState.currentPlayer.playerId !== user?._id || gameState.secretSettings.currentTurn == 1 ? 'pointer-events-none' : ''}`}>
                    {
                        sortSchnapsenCards(playerCards, true, 'abc').map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable className={`cursor-pointer w-16 overflow-visible hover:cursor-grab group rounded-lg duration-200 relative
                                         ${checkIfCardIsSelected(card) ? 'border-green-400 translate-y-[-1rem]' : ''}
                                         ${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-10' : ''}
                                         
                                         `}>
                                        <Image onDragEnter={(e) => { onDragEnter(e, i) }} className={`${drawedCard?.name === card.name && drawedCard?.pack === card.pack ? 'ring ring-sky-600' : ''} border-2 border-transparent group-hover:border-green-400 rounded-lg`} style={{ width: "8rem", maxWidth: "8rem" }} loading="eager" onDragEnd={() => { setDraggedCard(null) }} onDragStart={() => { startDrag(card) }} onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={100} height={100} alt={card.name}></Image>
                                        {
                                            card.isJoker && card.rank == 4 && gameState.droppedCards.length === 0 && gameState.currentPlayer.playerId === user?._id &&
                                            <button onClick={() => { callTwenty(card) }} className="absolute -top-14 rounded-full bg-gradient-to-br from-orange-600/60 to-yellow-600/40 w-12 h-12 flex justify-center items-center text-zinc-100 text-xl cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-white/30">
                                                {gameState.lastAction.trump!.suit === card.suit ? 40 : 20}
                                            </button>
                                        }
                                    </div>
                                    <div onDragOver={overDrag} className={`${draggedCard && JSON.stringify(draggedCard) !== JSON.stringify(card) && dragEnter === i ? "w-[5.8rem]" : "w-0"} bg-[#00000040] rounded-lg duration-100`}>
                                        {draggedCard &&
                                            <Image className="opacity-75" loading="eager" onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(draggedCard.name)} width={100} height={100} alt={new CardsUrls().getUnoCardUrl(draggedCard.name)}></Image>
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }

                    {
                        gameState.currentPlayer.playerId == user?._id && !isGameOver &&
                        <div style={{ width: `${Math.floor(75 - (timer / gameSettings.timeLimit) * 75)}%`, backgroundColor: `${timer > (gameSettings.timeLimit - (gameSettings.timeLimit / 6)) ? '#ec003f' : '#9ae600'}` }} className="absolute -top-20 h-4 bg-emerald-500 rounded-xl duration-500">
                            <div className="absolute -top-6 w-full flex justify-center items-center text-sm text-zinc-200">
                                {gameSettings.timeLimit - timer < 0 ? 0 : gameSettings.timeLimit - timer}s
                            </div>
                        </div>
                    }
                </div>
                {
                    displayTrump && !endOfTurn && gameState.secretSettings.currentTurn < 3 &&
                    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-[100]">
                        <div className="text-[8rem] text-white stroke-black font-bold font-mono animate-float-in-t flex flex-col justify-center items-center gap-4">
                            <div >
                                <Image className="w-48" src={"/" + new CardsUrls().getFullCardUrl(gameState.lastAction.trump!.card)} width={400} height={400} alt={new CardsUrls().getFullCardUrl(gameState.lastAction.trump!.card)!}></Image>
                            </div>
                            {(trumps.call as any)[gameState.lastAction.actions]}
                        </div>
                    </div>
                }

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        {gameState.lastAction.trump!.suit ?
                            <Icon name={gameState.lastAction.trump!.suit === 'H' ? 'heart' :
                                (gameState.lastAction.trump!.suit === 'A' ? 'acorn' :
                                    (gameState.lastAction.trump!.suit === 'B' ? 'bell' : 'leaf'))
                            }
                                stroke={gameState.lastAction.trump!.suit === 'A' || gameState.lastAction.trump!.suit === 'B' ? true : false}
                                size={256} className="opacity-10 text-white"></Icon> :
                            <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                        }
                    </div>
                </div>

                {
                    gameState.playedCards.length > 0 && gameState.lastAction.points &&
                    <main className="fixed bottom-4 right-4 z-[10] ">

                        {
                            gameState.lastAction.points![user!._id] > 0 &&
                            <React.Fragment>
                                <main className="bg-zinc-900/50 backdrop-blur-md p-2 rounded-lg flex flex-col gap-2 items-center group cursor-zoom-in">
                                    <Image loading="eager" src={"/assets/cards/schnapps/back.png"} width={100} height={100} alt={"Back"}></Image>
                                    <div className="absolute bottom-[105%] -left-44 flex flex-col bg-black/30 rounded-lg group-hover:opacity-100 opacity-0 duration-200 pointer-events-none p-2 gap-2">

                                        {
                                            gameState.playedCards.filter((f) => f.playedBy === user?._id).map((cards, i) => {
                                                return (
                                                    <div key={i} className="w-full flex gap-2">

                                                        {
                                                            cards.cards.map((card, j) => {
                                                                return (
                                                                    <Image key={j} loading="eager" className="w-16 h-fit" src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={50} height={50} alt={card.name}></Image>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </main>

                            </React.Fragment>
                        }


                        <div className="text-zinc-200 font-bold text-3xl absolute right-[105%] bottom-2 right-2">


                            {
                                (gameState.lastAction.points![user!._id] || 0) + (
                                    gameState.lastAction.isUno ?
                                        (
                                            gameState.lastAction.trumpWith === user!._id && gameState.lastAction.playerId === user!._id ?
                                                0 :
                                                gameState.lastAction.trumpWith !== user!._id && gameState.lastAction.playerId === user!._id ?
                                                    (gameState.lastAction.points![gameState.lastAction.trumpWith!] || 0) :
                                                    gameState.lastAction.trumpWith === user!._id && gameState.lastAction.playerId !== user!._id ?
                                                        (gameState.lastAction.points![gameState.lastAction.playerId!] || 0) :
                                                        0
                                        ) : 0
                                )
                            }
                        </div>


                    </main>
                }


                {
                    gameState && gameState.secretSettings.currentTurn == 1 && gameState.currentPlayer.playerId === user?._id &&
                    <main className="fixed bottom-4 right-4 z-[100] bg-zinc-900/50 backdrop-blur-md p-4 rounded-lg flex flex-col gap-2 items-center">
                        <div className="text-zinc-200 font-bold text-lg uppercase">
                            Set trump and call
                        </div>
                        <hr className="w-full my-2" />
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">

                                {
                                    trumps.suits.map((suit, i) => {
                                        return (
                                            <div key={i} onClick={() => { setSelectedTrump({ suit: suit }) }} className={`w-fit h-fit rounded-lg p-2 bg-zinc-800/50 flex justify-center items-center gap-2 hover:bg-zinc-600/50 hover:scale-110 duration-200 cursor-pointer hover:shadow-md hover:shadow-zinc-300/20 ${selectedTrump.suit === suit ? 'ring-2 ring-green-400' : ''}`}>
                                                <GetTrumpIcon suit={suit} />
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="flex flex-col gap-2">

                                {
                                    trumps.cards.map((cards, i) => {
                                        return (
                                            <div key={i} className="flex gap-1">
                                                {
                                                    cards.map((card, j) => {
                                                        return (
                                                            <div key={j} onClick={() => { setSelectedTrump({ suit: selectedTrump.suit, cardName: `S_${card}${selectedTrump.suit}` }) }} className={`w-fit h-fit rounded-lg p-2 bg-zinc-800/50 flex justify-center items-center gap-2 hover:bg-zinc-600/50 hover:scale-110 duration-200 cursor-pointer hover:shadow-md hover:shadow-zinc-300/20 ${selectedTrump.cardName === `S_${card}${selectedTrump.suit}` ? 'ring-2 ring-green-400' : ''}`}>
                                                                <Image className="w-fit h-fit" src={`/${new CardsUrls().getFullCardUrl('S_' + card + selectedTrump.suit)}`} width={40} height={40} alt={`${selectedTrump.suit} ${card}`}></Image>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }

                            </div>

                            <div className="flex flex-col gap-2 justify-between">
                                <div className="flex flex-col gap-2">
                                    {
                                        Object.values(trumps.call).map((call, i) => {
                                            return (
                                                <div key={i} onClick={() => { setSelectedTrump({ ...selectedTrump, call: call }) }} className={`w-36 text-zinc-100 h-fit rounded-lg p-2 bg-zinc-800/50 flex justify-center items-center gap-2 hover:scale-110 duration-200 cursor-pointer hover:shadow-md hover:shadow-zinc-300/20 ${selectedTrump.call === call ? 'ring-2 ring-green-400' : ''}`}>
                                                    {call}
                                                </div>
                                            )
                                        })
                                    }
                                </div>


                                <div className="flex gap-1 h-full">
                                    <button onClick={skipTrumpSelection} className="bg-gradient-to-br p-2 from-emerald-600/80 to-green-400/60 rounded-lg text-zinc-200 font-bold text-lg hover:scale-110 duration-200 cursor-pointer hover:shadow-md hover:shadow-zinc-300/20 w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed">
                                        Skip
                                    </button>
                                </div>
                                <div className="flex gap-1 h-full">
                                    <button onClick={setTrumpSelection} disabled={!(selectedTrump.call && selectedTrump.cardName && selectedTrump.suit)} className="bg-gradient-to-br p-2 from-red-600 to-red-400 rounded-lg text-zinc-200 font-bold text-lg hover:scale-110 duration-200 cursor-pointer hover:shadow-md hover:shadow-zinc-300/20 w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed">
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>


                    </main>
                }

                <div className="fixed bottom-4 left-4 text-rose-200/40">
                    GameId: {gameState._id}
                </div>
            </main>

        </main>
    )
}

function DroppedCardComponent({ card, className, trumpSuit }: { card: Icard | null | undefined | any, className?: string, trumpSuit?: string }) {
    if (!card) return null;
    return (
        <div className={className}>
            {
                card.showedBy &&
                <div className="absolute -bottom-6 -right-4 text-zinc-200 text-md w-8 h-8 rounded-full bg-orange-800 flex justify-center items-center">{card.suit === trumpSuit ? 40 : 20}</div>
            }
            <Image className="" draggable={false} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={150} height={180} alt="card"></Image>
        </div>
    );
}