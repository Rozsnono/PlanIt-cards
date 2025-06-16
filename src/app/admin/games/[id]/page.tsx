"use client";

import CardsUrls from "@/contexts/cards.context";
import { IP } from "@/enums/ip.enum";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/assets/icons";
import { AdminService } from "@/services/admin.service";

export default function AdminGameDetails() {
    const param = useParams();
    const gameId = param.id as string;
    const socket = useRef<WebSocket | null>(null);
    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        data: {} as any,
    });

    const [newCards, setNewCards] = useState<{ [player_id: string]: { name: string, value: number, suit: string, rank: number, isJoker?: boolean, pack: 1 } | null, }>({});

    function addCardToPlayer(playerId: string, card?: { name: string, value: number, suit: string, rank: number, isJoker?: boolean, pack: 1 }) {
        if (!playerId) return;
        if (!card) {
            setNewCards((prev) => ({ ...prev, [playerId]: null }));
        } else {
            setNewCards((prev) => ({ ...prev, [playerId]: card }));
        }

    }

    function addCardToPlayerAndSend(playerId: string) {
        if (!playerId) return;
        if (!newCards[playerId]) return;
        const game = state.data;
        if (!game || !game.playerCards) return;
        game.playerCards[playerId] = game.playerCards[playerId].concat(newCards[playerId]);
        setNewCards((prev) => ({ ...prev, [playerId]: null }));
        new AdminService().modifyGame(game);
    }

    function removeCardFromPlayer(playerId: string, cardIndex: number) {
        if (!playerId || !state.data.playerCards || !state.data.playerCards[playerId]) return;
        const game = state.data;
        game.playerCards[playerId].splice(cardIndex, 1);
        new AdminService().modifyGame(state.data);
    }

    function changeCurrentPlayer(playerId: string) {
        if (!playerId || !state.data.currentPlayer) return;
        const game = state.data;
        game.currentPlayer.playerId = playerId;
        game.currentPlayer.time = new Date().getTime();
        game.droppedCards[game.droppedCards.length - 1].playerId = null;
        game.drawedCard.lastDrawedBy = null;
        new AdminService().modifyGame(game);
    }

    useEffect(() => {
        socket.current = new WebSocket(IP.ADMINGAMESOCKET);
        setState({ ...state, isLoading: true });


        socket!.current!.addEventListener('open', (event: any) => {
            console.log('WebSocket is connected');
            socket!.current!.send(JSON.stringify({ type: 'oneGame', id: gameId }));
        });

        socket!.current!.addEventListener('message', (event) => {
            console.log('WebSocket message received:', JSON.parse(event.data as any));
            if (JSON.parse(event.data as any)._id === gameId) {
                try {
                    setState({ ...state, data: JSON.parse(event.data as any), isLoading: false });
                } catch {
                    setState({ ...state, isLoading: false });
                }
            }
        });

        return () => {
            socket!.current!.close();
        };
    }, [])

    return (
        <div className="flex flex-col items-center h-full ">
            {state.isLoading ? (
                <div className="w-full flex justify-center items-center h-full pt-2">
                    <div className="loader"></div>
                </div>
            ) : state.isError ? (
                <div className="text-red-500">Error loading game details</div>
            ) : (
                <div className="w-full p-5 bg-zinc-800 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-zinc-200 mb-4">Game Details</h1>
                    <GameCard game={state.data} />

                    <hr />

                    Players cards:
                    <div className="w-full flex flex-col gap-4 mt-4 relative">
                        {Object.keys(state.data.playerCards || {}).map((key) => (
                            <div key={key} className="bg-zinc-700 p-4 rounded-lg shadow-md flex flex-col gap-2 relative">
                                <h2 className="text-xl font-semibold text-zinc-200 relative">
                                    <div className="w-fit cursor-pointer hover:underline" onClick={() => { changeCurrentPlayer(key) }}>
                                    Player: {key}
                                    </div>
                                    {state.data.currentPlayer.playerId === key &&
                                        <span className="bg-green-400 absolute -top-1 -left-2 w-2 h-2 rounded-full"></span>
                                    }
                                </h2>
                                <div className="flex flex-wrap gap-2 relative">
                                    {state.data.playerCards[key].map((card: any, index: number) => (
                                        <div key={index} className="relative group">
                                            <Icon onClick={()=>{removeCardFromPlayer(key, index)}} name="trash" className="text-red-400 group-hover:opacity-100 -top-1 -right-1 opacity-0 cursor-pointer duration-200 absolute bg-zinc-100 w-4 h-4 rounded-full flex justify-center items-center"></Icon>
                                            <Image key={index} src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl(card.name)} alt={card.name} width={64} height={100}></Image>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-zinc-400">Cards count: {state.data.playerCards[key].length}</p>


                                <div className="flex flex-wrap gap-2 absolute top-0 right-16 h-full items-center">
                                    <div className="relative cardParent">
                                        <Image src={newCards[key] ? ("/assets/cards/rummy/" + new CardsUrls().getCardUrl(newCards[key].name)) : "/assets/cards/rummy/gray_back.png"} alt={"Back"} width={64} height={100}></Image>
                                        <div className="cardSelect absolute bottom-12 right-12 w-fit h-fit bg-zinc-900 p-1 rounded-md flex flex-col overflow-y-auto z-50">
                                            {
                                                ['C', 'S', 'D', 'H'].map((suit) => (
                                                    <div key={suit} className="flex gap-1">
                                                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((value) => (
                                                            <button onFocus={() => { addCardToPlayer(key, { name: (value > 10 ? (value == 11 ? 'J' : (value === 12 ? 'Q' : value === 13 ? 'K' : 'A')) : value) + suit, rank: value, suit: suit, value: value, pack: 1 }) }} key={value} className="h-16 w-8 flex justify-center items-center cursor-pointer">
                                                                <Image src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl((value > 10 ? (value == 11 ? 'J' : (value === 12 ? 'Q' : value === 13 ? 'K' : 'A')) : value) + suit)} alt={value + suit} width={64} height={100}></Image>
                                                            </button>
                                                        ))}
                                                        {suit === 'S' && (
                                                            <button onFocus={() => { addCardToPlayer(key, { name: 'BJ', rank: 50, suit: 'B', value: 50, isJoker: true, pack: 1 }) }} className="h-16 w-8 flex justify-center items-center cursor-pointer">
                                                                <Image src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl('BJ')} alt="BJ" width={64} height={100}></Image>
                                                            </button>
                                                        )}
                                                        {suit === 'D' && (
                                                            <button onFocus={() => { addCardToPlayer(key, { name: 'RJ', rank: 50, suit: 'R', value: 50, isJoker: true, pack: 1 }) }} className="h-16 w-8 flex justify-center items-center cursor-pointer">
                                                                <Image src={"/assets/cards/rummy/" + new CardsUrls().getCardUrl('RJ')} alt="RJ" width={64} height={100}></Image>
                                                            </button>
                                                        )}

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <button onClick={()=>{addCardToPlayerAndSend(key)}} className="absolute top-4 right-4 bg-zinc-600 hover:bg-zinc-500 text-white p-2 rounded-full transition-colors duration-200">
                                    <Icon name="add" size={24}></Icon>
                                </button>
                            </div>
                        ))}

                        {Object.keys(state.data.playerCards || {}).length === 0 && (
                            <div className="text-zinc-400">No players cards available</div>
                        )}

                    </div>
                </div>
            )}

        </div>
    )
}


function GameCard({ game }: { game: any }) {
    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-zinc-200">{game._id}</h2>
            <p className="text-zinc-400">Players: {Object.values(game.playerCards).length}</p>
            <p className="text-zinc-400">Created at: {new Date(game.createdAt).toLocaleString()}</p>

            <p className="text-zinc-400">Current Player: {game.currentPlayer.playerId}</p>
            <p className="text-zinc-400">Current Player Time: {(game.secretSettings.timeLimit ? game.secretSettings.timeLimit : 180)-((new Date().getTime() - new Date(game.currentPlayer.time).getTime()) / 1000 )}</p>
            <p className="text-zinc-400">Time limit: {game.secretSettings.timeLimit ? game.secretSettings.timeLimit : 180}</p>
        </div>
    );
}