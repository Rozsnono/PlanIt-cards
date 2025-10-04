"use client";
import Icon from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import { UserContext } from "@/contexts/user.context";
import { Icard, Igame, Ilobby, Iplayer } from "@/interfaces/interface";
import { SchnappsService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import { IP } from "@/enums/ip.enum";
import PingDisplayComponent from "@/components/game/ping.display.component";
import Loading from "@/app/loading";
import GameOver from "@/components/game/over.componet";

const gameService = new SchnappsService();
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

    const [isGameOver, setIsGameOver] = useState(false);

    const trumps = {
        suits: ['A', 'B', 'H', 'L'],
        cards: [['A', 'T'], ['K', 'O'], ['U', '9']],
        call: { 1: 'Call', 6: 'Bettli', 7: 'Schnapps', 8: 'Gangli' }
    }

    useEffect(() => {
        const socket = new WebSocket(IP.WEBSOCKET);

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', async (event) => {
            try {
                const { lobby, game, game_over, refresh } = gameService.getDataFromWebsocket(JSON.parse(event.data), socket, { _id: lobby_id, player_id: user!._id }) ?? {};
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


    const [displayTrump, setDisplayTrump] = useState(false);
    const [endOfTurn, setEndOfTurn] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);


    useEffect(() => {
        if (!gameState) return;
        if (gameState.currentPlayer.playerId !== user?._id) return;
        const interval = setInterval(() => {
            try {
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
            <GameOver type="SCHNAPPS" isGameOver={isGameOver} lobbyId={lobby_id!} gameId={game_id!}></GameOver>


            <main className="bg-orange-900 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }

                <div className="flex justify-center items-center w-full h-full absolute gap-7">

                    {
                        !endOfTurn &&
                        <div className="flex relative z-50 w-[20rem] h-[20rem]">
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

                <div className="absolute bottom-12 right-2 w-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        getPlayerBySpace(0, false, false) &&
                        <GameUser isCaller={gameState.lastAction.playerId === getPlayerBySpace(0, false, false)._id} user={getPlayerBySpace(0, false, false)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(0, false, false)._id]}></GameUser>
                    }
                    {
                        getPlayerBySpace(0, false, true) &&
                        <GameBot isCaller={gameState.lastAction.playerId === getPlayerBySpace(0, false, true)._id} bot={getPlayerBySpace(0, false, true)} currentPlayer={gameState.currentPlayer.playerId} cardNumber={gameState.allCards[getPlayerBySpace(0, false, true)._id]}></GameBot>
                    }
                    <div></div>
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


                        


                    </main>
                }

                <div className="fixed bottom-4 left-4 text-rose-200/40 flex flex-col">
                    <span>
                        GameId: {gameState._id}
                    </span>
                    <span>
                        Room Code: {lobbyState?.settings.roomCode || 'N/A'}
                    </span>
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