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
import Loading from "@/app/loading";
import PlayerDisplay from "@/components/game/player.display.component";

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
                router.push(`/games/${lobby_id}/${game_id}/uno/result`);
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
    }, [])

    const { user } = useContext(UserContext);
    const [game, setGame] = useState<Igame | any>();
    const [lobby, setLobby] = useState<Ilobby>();

    const [error, setError] = useState<string | null>(null);

    if (!game) return <Loading />;

    return (
        <main className="flex w-full h-full rounded-md p-3 relative">

            <main className="bg-rose-900 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <div className="flex justify-center items-center w-full h-full absolute gap-7">

                    <div className="flex relative z-50" >
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
                    <div className="flex relative z-50">
                        <Image className="relative top-1 left-1" draggable={false} src={"/assets/cards/uno/Deck.png"} width={150} height={180} alt="card"></Image>
                        <Image draggable={false} className="absolute border-2 border-transparent rounded-3xl" src={"/assets/cards/uno/Deck.png"} width={230} height={200} alt="card"></Image>
                    </div>

                </div>

                <PlayerDisplay lobby={lobby!} game={game} user={user}></PlayerDisplay>


                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>

                <div className="fixed bottom-4 left-4 text-rose-200/40">
                    GameId: {game._id}
                </div>
            </main>


        </main>
    )
}