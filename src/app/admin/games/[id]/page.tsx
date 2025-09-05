"use client";

import CardsUrls from "@/contexts/cards.context";
import { IP } from "@/enums/ip.enum";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/assets/icons";
import { AdminService } from "@/services/admin.service";
import Loading from "@/app/loading";
import { sortRummyCards } from "@/functions/card.function";
import { LogService } from "@/services/log.service";

export function AdminGameDetails() {
    const param = useParams();
    const gameId = param.id as string;
    const socket = useRef<WebSocket | null>(null);
    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        data: {} as any,
    });

    const cards = {
        RUMMY: {
            suits: ['C', 'S', 'D', 'H'],
            cards: [
                { name: '2', value: 2, rank: 2 },
                { name: '3', value: 3, rank: 3 },
                { name: '4', value: 4, rank: 4 },
                { name: '5', value: 5, rank: 5 },
                { name: '6', value: 6, rank: 6 },
                { name: '7', value: 7, rank: 7 },
                { name: '8', value: 8, rank: 8 },
                { name: '9', value: 9, rank: 9 },
                { name: '10', value: 10, rank: 10 },
                { name: 'J', value: 10, rank: 11 },
                { name: 'Q', value: 10, rank: 12 },
                { name: 'K', value: 10, rank: 13 },
                { name: 'A', value: 10, rank: 14 }
            ],
            jokers: [
                { name: 'BJ', value: 10, rank: 50, isJoker: true, pack: 1 },
                { name: 'RJ', value: 10, rank: 50, isJoker: true, pack: 1 }
            ],
            getName(name: string, suit: string) {
                return name + suit;
            }
        },
        UNO: {
            suits: ['R', 'G', 'B', 'Y'],
            cards: [
                { name: '0', value: 0, rank: 0 },
                { name: '1', value: 1, rank: 1 },
                { name: '2', value: 2, rank: 2 },
                { name: '3', value: 3, rank: 3 },
                { name: '4', value: 4, rank: 4 },
                { name: '5', value: 5, rank: 5 },
                { name: '6', value: 6, rank: 6 },
                { name: '7', value: 7, rank: 7 },
                { name: '8', value: 8, rank: 8 },
                { name: '9', value: 9, rank: 9 },
                { name: 'R', value: 10, rank: 25 }, // Reverse
                { name: 'S', value: 11, rank: 26 }, // Skip
                { name: 'D2', value: 12, rank: 27 }, // Draw Two
            ],
            jokers: [
                {
                    name: 'WC', value: 50, rank: 30, isJoker: true, pack: 1 // Wild
                },
                {
                    name: 'W4', value: 50, rank: 28, isJoker: true, pack: 1 // Wild Draw Four
                }
            ],
            getName(name: string, suit: string) {
                return suit + name;
            }
        },
        SOLITAIRE: {
            suits: ['C', 'S', 'D', 'H'],
            cards: [
                { name: '2', value: 2, rank: 2 },
                { name: '3', value: 3, rank: 3 },
                { name: '4', value: 4, rank: 4 },
                { name: '5', value: 5, rank: 5 },
                { name: '6', value: 6, rank: 6 },
                { name: '7', value: 7, rank: 7 },
                { name: '8', value: 8, rank: 8 },
                { name: '9', value: 9, rank: 9 },
                { name: '10', value: 10, rank: 10 },
                { name: 'J', value: 10, rank: 11 },
                { name: 'Q', value: 10, rank: 12 },
                { name: 'K', value: 10, rank: 13 },
                { name: 'A', value: 10, rank: 14 },
            ],
            jokers: [
            ],
            getName(name: string, suit: string) {
                return name + suit;
            }
        }
    }

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
            new LogService().log("WebSocket is connected to admin games socket.");
            socket!.current!.send(JSON.stringify({ type: 'oneGame', id: gameId }));
        });

        socket!.current!.addEventListener('message', (event) => {
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
                                            <Icon onClick={() => { removeCardFromPlayer(key, index) }} name="trash" className="text-red-400 group-hover:opacity-100 -top-1 -right-1 opacity-0 cursor-pointer duration-200 absolute bg-zinc-100 w-4 h-4 rounded-full flex justify-center items-center"></Icon>
                                            <Image key={index} src={"/" + new CardsUrls().getFullCardUrl(card.name)} alt={card.name} width={64} height={100}></Image>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-zinc-400">Cards count: {state.data.playerCards[key].length}</p>


                                <div className="flex flex-wrap gap-2 absolute top-0 right-16 h-full items-center">
                                    <div className="relative cardParent">
                                        <Image src={newCards[key] ? ("/" + new CardsUrls().getFullCardUrl(newCards[key].name)) : "/assets/cards/rummy/gray_back.png"} alt={"Back"} width={64} height={100}></Image>
                                        <div className="cardSelect absolute bottom-12 right-12 w-fit h-fit bg-zinc-900 p-1 rounded-md flex flex-col overflow-y-auto z-50">
                                            {
                                                (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].suits.map((suit: string, index: number) => (
                                                    <div key={suit} className="flex gap-1">

                                                        {
                                                            (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].cards.map((value: any) => (
                                                                <button onFocus={() => { addCardToPlayer(key, { name: (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].getName(value.name, suit), rank: value.rank, suit: suit, value: value.value, pack: 1 }) }} key={value.name} className="h-16 w-8 flex justify-center items-center cursor-pointer">
                                                                    <Image src={"/" + new CardsUrls().getFullCardUrl((cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].getName(value.name, suit))} alt={(cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].getName(value.name, suit)} width={64} height={100}></Image>
                                                                </button>
                                                            ))
                                                        }


                                                        {index === 1 && (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers.length > 0 && (
                                                            <button onFocus={() => { addCardToPlayer(key, (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers[0]) }} className="h-16 w-8 flex justify-center items-center cursor-pointer">
                                                                <Image src={"/" + new CardsUrls().getFullCardUrl((cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers[0].name)} alt={(cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers[0].name} width={64} height={100}></Image>
                                                            </button>
                                                        )}
                                                        {index === 2 && (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers.length > 1 && (
                                                            <button onFocus={() => { addCardToPlayer(key, (cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers[1]) }} className="h-16 w-8 flex justify-center items-center cursor-pointer">
                                                                <Image src={"/" + new CardsUrls().getFullCardUrl((cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers[1].name)} alt={(cards as any)[state.data.secretSettings?.gameType || 'RUMMY'].jokers[1].name} width={64} height={100}></Image>
                                                            </button>
                                                        )}

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => { addCardToPlayerAndSend(key) }} className="absolute top-4 right-4 bg-zinc-600 hover:bg-zinc-500 text-white p-2 rounded-full transition-colors duration-200">
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
            <p className="text-zinc-400">Type: {game.secretSettings.gameType}</p>

            <p className="text-zinc-400">Current Player: {game.currentPlayer.playerId}</p>
            <p className="text-zinc-400">Current Player Time: {(game.secretSettings.timeLimit ? game.secretSettings.timeLimit : 180) - ((new Date().getTime() - new Date(game.currentPlayer.time).getTime()) / 1000)}</p>
            <p className="text-zinc-400">Time limit: {game.secretSettings.timeLimit ? game.secretSettings.timeLimit : 180}</p>
        </div>
    );
}

export default function GameDetails() {

    const param = useParams();
    const gameId = param.id as string;
    const socket = useRef<WebSocket | null>(null);
    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        data: {} as any,
        lobby: {} as any,
    });

    const [addCard, setAddCard] = useState<string>('');

    useEffect(() => {
        socket.current = new WebSocket(IP.ADMINGAMESOCKET);
        setState({ ...state, isLoading: true });


        socket!.current!.addEventListener('open', () => {
            new LogService().log("WebSocket is connected to admin games socket.");
            socket!.current!.send(JSON.stringify({ type: 'oneGame', id: gameId }));
        });

        socket!.current!.addEventListener('message', (event) => {
            if (JSON.parse(event.data as any).game._id === gameId) {
                try {
                    setState({ ...state, data: JSON.parse(event.data as any).game, lobby: JSON.parse(event.data as any).lobby, isLoading: false });
                } catch {
                    setState({ ...state, isLoading: false });
                }

            }
        });

        return () => {
            socket!.current!.close();
        };
    }, [])

    if (state.isLoading) {
        return (
            <Loading />
        );
    }

    function addCardToPlayerAndSend(playerId: string, card: any) {
        if (!playerId) return;
        if (!card) {
            setAddCard('');
            return;
        }
        const game = state.data;
        if (!game || !game.playerCards) return;
        game.playerCards[playerId] = game.playerCards[playerId].concat(card);
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

    function deleteGame() {
        if (!state.data._id) return;
        new AdminService().deleteGame(state.data._id).then(() => {
            alert('Game deleted successfully');
            window.location.href = '/admin/games';
        }).catch((error) => {
            console.error('Error deleting game:', error);
            alert('Failed to delete game');
        });
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-white text-2xl font-bold">Game Details</h1>
                <div className="flex space-x-3">
                    <button onClick={deleteGame} className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg">
                        End Game
                    </button>
                </div>
            </div>

            {/* Game Info Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <div className="text-white/60 text-sm mb-1">Game ID</div>
                        <div className="text-white font-mono text-sm">{state.data._id}</div>
                    </div>
                    <div>
                        <div className="text-white/60 text-sm mb-1">Players</div>
                        <div className="text-white font-semibold">{Object.keys(state.data.playerCards).length}</div>
                    </div>
                    <div>
                        <div className="text-white/60 text-sm mb-1">Status</div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/30">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Ongoing
                        </div>
                    </div>
                    <div>
                        <div className="text-white/60 text-sm mb-1">Created</div>
                        <div className="text-white text-sm">{new Date(state.data.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-white/60 text-sm mb-2">Current Turn</div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                C
                            </div>
                            <div>
                                <div className="text-white font-semibold">{state.lobby.users.find((u: any) => u._id === state.data.currentPlayer.playerId)?.username || state.lobby.bots.find((u: any) => u._id === state.data.currentPlayer.playerId)?.name}</div>
                                <div className="text-white/60 text-xs">Player ID: {state.data.currentPlayer.playerId}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white/60 text-sm">Time Remaining</div>
                            <div className="text-white font-mono text-lg">{(state.data.secretSettings.timeLimit ? state.data.secretSettings.timeLimit : 180) - ((new Date().getTime() - new Date(state.data.currentPlayer.time).getTime()) / 1000)}s</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Players Cards */}
            <div className="space-y-6">
                {Object.keys(state.data.playerCards).map((playerId, index) => (
                    <div key={playerId} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Player Header */}
                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center cursor-pointer hover:underline" onClick={() => changeCurrentPlayer(playerId)}>
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                        {playerId.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-white text-lg font-semibold">{state.lobby.users.find((u: any) => u._id === playerId)?.username || state.lobby.bots.find((u: any) => u._id === playerId)?.name}</div>
                                        <div className="text-white/60 text-sm font-mono">ID: {playerId}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white/60 text-sm">Cards</div>
                                    <div className="text-white text-2xl font-bold">{state.data.playerCards[playerId].length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Cards Display */}
                        <div className="px-6 pt-6 pb-6">
                            <div className="flex flex-wrap gap-2">
                                {sortRummyCards(state.data.playerCards[playerId]).map((card: any, cardIndex: number) => (
                                    <div
                                        onClick={() => { removeCardFromPlayer(playerId, cardIndex) }}
                                        key={cardIndex}
                                        className="rounded-lg flex items-center justify-center text-2xl shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer relative group"
                                    >
                                        <div className="absolute -top-1 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/50 rounded-full">
                                            <Icon name="trash" className="text-red-500"></Icon>
                                        </div>
                                        <Image src={("/" + new CardsUrls().getFullCardUrl(card.name))} alt={"Back"} width={40} height={50}></Image>
                                    </div>
                                ))}

                                {/* Add/Expand Button */}
                                <button onClick={() => setAddCard(playerId === addCard ? '' : playerId)} className="w-12 h-16 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center text-white/60 hover:bg-white/20 hover:border-white/50 transition-all duration-200">
                                    <Icon name="add" className="text-2xl"></Icon>
                                </button>
                            </div>
                        </div>

                        {
                            addCard && addCard === playerId &&
                            <div className="p-6 ">
                                <div className="flex flex-wrap gap-2">
                                    {(cards as any)[state.data.secretSettings.gameType!].getAllCards().map((card: any, cardIndex: number) => (
                                        <div
                                            onClick={() => { addCardToPlayerAndSend(playerId, card) }}
                                            key={cardIndex}
                                            className="min-w-[40px] rounded-lg flex items-center justify-center text-2xl shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer relative group"
                                        >
                                            <div className="absolute -top-1 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/70 rounded-full">
                                                <Icon name="add" className="text-blue-700"></Icon>
                                            </div>
                                            <Image src={("/" + new CardsUrls().getFullCardUrl(card.name))} alt={"Back"} width={40} height={50}></Image>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>


        </div>
    )
}

const cards = {
    RUMMY: {
        suits: ['C', 'S', 'D', 'H'],
        cards: [
            { name: '2', value: 2, rank: 2 },
            { name: '3', value: 3, rank: 3 },
            { name: '4', value: 4, rank: 4 },
            { name: '5', value: 5, rank: 5 },
            { name: '6', value: 6, rank: 6 },
            { name: '7', value: 7, rank: 7 },
            { name: '8', value: 8, rank: 8 },
            { name: '9', value: 9, rank: 9 },
            { name: '10', value: 10, rank: 10 },
            { name: 'J', value: 10, rank: 11 },
            { name: 'Q', value: 10, rank: 12 },
            { name: 'K', value: 10, rank: 13 },
            { name: 'A', value: 10, rank: 14 }
        ],
        jokers: [
            { name: 'BJ', value: 10, rank: 50, isJoker: true, pack: 1 },
            { name: 'RJ', value: 10, rank: 50, isJoker: true, pack: 1 }
        ],
        getAllCards() {
            const allCards: any = [];
            this.suits.forEach(suit => {
                this.cards.forEach(card => {
                    allCards.push({ ...card, name: "R_" + card.name + suit, suit: suit, pack: 1 });
                });
            });
            this.jokers.forEach(joker => {
                allCards.push({ ...joker, name: joker.name, suit: '', pack: 1 });
            });
            return allCards;
        }
    },
    UNO: {
        suits: ['R', 'G', 'B', 'Y'],
        cards: [
            { name: '0', value: 0, rank: 0 },
            { name: '1', value: 1, rank: 1 },
            { name: '2', value: 2, rank: 2 },
            { name: '3', value: 3, rank: 3 },
            { name: '4', value: 4, rank: 4 },
            { name: '5', value: 5, rank: 5 },
            { name: '6', value: 6, rank: 6 },
            { name: '7', value: 7, rank: 7 },
            { name: '8', value: 8, rank: 8 },
            { name: '9', value: 9, rank: 9 },
            { name: 'R', value: 10, rank: 25 }, // Reverse
            { name: 'S', value: 11, rank: 26 }, // Skip
            { name: 'D2', value: 12, rank: 27 }, // Draw Two
        ],
        jokers: [
            {
                name: 'WC', value: 50, rank: 30, isJoker: true, pack: 1 // Wild
            },
            {
                name: 'W4', value: 50, rank: 28, isJoker: true, pack: 1 // Wild Draw Four
            }
        ],
        getAllCards() {
            const allCards: any = [];
            this.suits.forEach(suit => {
                this.cards.forEach(card => {
                    allCards.push({ ...card, name: "U_" + suit + card.name, suit: suit, pack: 1 });
                });
            });
            this.jokers.forEach(joker => {
                allCards.push({ ...joker, name: joker.name, suit: '', pack: 1 });
            });
            return allCards;
        }
    },
    SOLITAIRE: {
        suits: ['C', 'S', 'D', 'H'],
        cards: [
            { name: '2', value: 2, rank: 2 },
            { name: '3', value: 3, rank: 3 },
            { name: '4', value: 4, rank: 4 },
            { name: '5', value: 5, rank: 5 },
            { name: '6', value: 6, rank: 6 },
            { name: '7', value: 7, rank: 7 },
            { name: '8', value: 8, rank: 8 },
            { name: '9', value: 9, rank: 9 },
            { name: '10', value: 10, rank: 10 },
            { name: 'J', value: 10, rank: 11 },
            { name: 'Q', value: 10, rank: 12 },
            { name: 'K', value: 10, rank: 13 },
            { name: 'A', value: 10, rank: 14 },
        ],
        jokers: [
        ],
        getName(name: string, suit: string) {
            return name + suit;
        }
    }
}