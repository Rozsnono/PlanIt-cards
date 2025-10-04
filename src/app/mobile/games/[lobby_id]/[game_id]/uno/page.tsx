"use client";
import Icon from "@/assets/icons";
import ErrorModal from "@/components/error.modal";
import { UserContext } from "@/contexts/user.context";
import { sortUnoCards } from "@/functions/card.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";
import { UnoService } from "@/services/game.service";
import { Timer } from "@/services/timer.service";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import ColorPicker from "../../../../components/colorpicker";
import { IP } from "@/enums/ip.enum";
import TurnDisplayComponent from "@/components/game/turn.display.component";
import Loading from "@/app/loading";
import FullscreenMode from "@/app/mobile/components/fullscreen.component";

const gameService = new UnoService();
const timerClass = new Timer();

export default function Game() {

    const lobby_id = useParams().lobby_id;
    const game_id = useParams().game_id;
    const router = useRouter();

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
    const [colorPickerShow, setCPshow] = useState(false);

    const [selectedCards, setSelectedCards] = useState<Icard[]>([]);
    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [choosedCard, setChoosedCard] = useState<Icard | null>(null);

    function checkIfCardIsSelected(card: Icard) {
        return selectedCards.find((e: Icard) => { return JSON.stringify(e) === JSON.stringify(card) });
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

    async function checkCard(card: Icard) {
        if (!user) return;
        setDraggedCard(card);
        setChoosedCard(card);
        if (!draggedCard) return;
        if (JSON.stringify(draggedCard) !== JSON.stringify(card)) return;

        if (card.isJoker) {
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

    function getCardSize() {
        switch (true) {
            case playerCards.length < 10: return { class: 'w-12', width: "6rem" };
            case playerCards.length < 15: return { class: 'w-10', width: "5rem" };
            case playerCards.length < 20: return { class: 'w-8', width: "4rem" };
            default: return { class: 'w-6', width: "3rem" };
        }
    }

    if (!game) return <Loading />;

    return (
        <main className="flex w-screen h-screen rounded-md p-3 relative select-none">
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
                        <div onClick={() => { router.push(`/games/${lobby_id}`) }} className="text-zinc-200 p-2 px-4 rounded-md border border-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 hover:text-zinc-800 flex items-center gap-1 cursor-pointer">
                            <Icon name="game" stroke></Icon>
                            Back to lobby
                        </div>
                    </div>
                </div>
            }

            <FullscreenMode />

            <main className="bg-rose-900 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <TurnDisplayComponent playerName={lobby!.users.find((u) => u._id === game.currentPlayer.playerId)?.username || null} />
                <TurnDisplayComponent playerName={lobby!.bots.find((u) => u._id === game.currentPlayer.playerId)?.name || null} />

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center z-10">
                    {
                        sortUnoCards(playerCards, true, 'abc').map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div onClick={() => { checkCard(card) }} className={`cursor-pointer ${getCardSize().class} overflow-visible hover:cursor-grab group rounded-lg duration-200 
                                         ${checkIfCardIsSelected(card) ? 'border-green-400 translate-y-[-1rem]' : ''}
                                         `}>
                                        <Image className={`${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-100 ring ring-green-700' : ''} ${drawedCard?.name === card.name && drawedCard?.pack === card.pack ? '' : ''} border-2 border-transparent rounded-lg`} style={{ width: getCardSize().width, maxWidth: getCardSize().width }} loading="eager" src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(card.name) || ''}></Image>
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
                </div>
                {
                    displayIsUno &&
                    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-[100]">
                        <div className="text-[8rem] text-white stroke-black font-bold font-mono animate-float-in-t">
                            UNO
                        </div>
                    </div>
                }

                <div className="absolute left-2 top-2 flex justify-center items-center gap-3">
                    <div onClick={drawingCard} className="w-[4rem] h-[4rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100">
                        <Icon name="draw" stroke size={24}></Icon>
                    </div>
                    {
                        playerCards.length == 2 && game.currentPlayer.playerId == user?._id && !isGameOver &&
                        <div onClick={() => { setIsUno(true) }} className={`justify-center items-center flex rounded-full bottom-4`}>
                            <div className={`w-[4rem] h-[4rem] bg-rose-900 rounded-full ring-[0.1rem] ring-lime-300 flex items-center justify-center text-xl group duration-100  group ${isUno ? 'shadow-lg shadow-white cursor-default' : 'text-lime-400 hover:scale-110 cursor-pointer '}`}>
                                <span className={`font-mono opacity-100 group-hover:flex flex duration-100 italic text-2xl group-hover:rotate-[0deg] ${isUno ? 'rotate-[0deg] text-lime-100' : 'rotate-[-25deg]'}`}>UNO</span>
                            </div>
                        </div>
                    }
                </div>

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[0.5rem] border-[#ffffff10] rounded-full h-[15rem] w-[15rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>

                    {
                        colorPickerShow &&
                        <ColorPicker choosen={(e) => { cardDropped(e) }}></ColorPicker>
                    }

                </div>

                <div className="fixed bottom-4 left-4 text-rose-200/40 text-sm z-1">
                    GameId: {game._id}
                </div>
            </main>

        </main>
    )
}