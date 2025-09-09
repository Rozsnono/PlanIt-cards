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
import React from "react";
import { useContext, useEffect, useState } from "react";
import CardsUrls from "@/contexts/cards.context";
import GameUser, { GameBot } from "@/components/user/game.user.component";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const gameService = new GameService("rummy");

const Alobby = {
    "_id": "tutorial-lobby-rummy",
    "users": [
        {
            "_id": "tutorial-player-rummy",
            "customId": "tutorial-player-rummy",
            "firstName": "Tutorial",
            "lastName": "Player",
            "email": "tutorial.player@example.com",
            "username": "tutorial.player",
            "rank": 20,
            "settings": {
                "backgroundColor": "#FF3333",
                "textColor": "#FFFFFF"
            }
        }
    ],
    "bots": [
        {
            "_id": "bot0",
            "name": "Cardy",
            "customId": "bot-0"
        }
    ],
    "mutedPlayers": [],
    "settings": {
        "numberOfPlayers": 2,
        "lobbyCode": null,
        "fillWithRobots": true,
        "numberOfRobots": 1,
        "robotsDifficulty": "EASY",
        "cardType": "RUMMY",
        "_id": "tutorial-lobby-rummy"
    },
    "chat": [],
    "createdBy": "tutorial-player-rummy",
    "createdAt": "2025-05-27T15:12:01.704Z",
    "game_id": "tutorial-game-rummy"
};

const Agame = {
    "_id": 'tutorial-game-rummy',
    "currentPlayer": {
        "playerId": "tutorial-player-rummy",
        "time": 1748358723816
    },
    "playerCards": {
        "you": [
            {
                "name": "R_8C",
                "rank": 8,
                "suit": "C",
                "pack": 2,
                "value": 8
            },
            {
                "name": "R_AH",
                "rank": 14,
                "suit": "H",
                "pack": 1,
                "value": 10
            },
            {
                "name": "R_8H",
                "rank": 8,
                "suit": "H",
                "pack": 2,
                "value": 8
            },
            {
                "name": "R_5D",
                "rank": 5,
                "suit": "D",
                "pack": 1,
                "value": 5
            },
            {
                "name": "R_6D",
                "rank": 6,
                "suit": "D",
                "pack": 2,
                "value": 6
            },
            {
                "name": "R_7D",
                "rank": 7,
                "suit": "D",
                "pack": 2,
                "value": 7
            }

        ],
        "bot0": [
            {
                "name": "R_KC",
                "rank": 14,
                "suit": "C",
                "pack": 1,
                "value": 10
            },
            {
                "name": "R_10C",
                "rank": 10,
                "suit": "C",
                "pack": 2,
                "value": 10
            },
        ]
    },
    "shuffledCards": [
        {
            "name": "R_10D",
            "rank": 10,
            "suit": "D",
            "pack": 2,
            "value": 10
        },
        {
            "name": "R_4C",
            "rank": 4,
            "suit": "C",
            "pack": 2,
            "value": 4
        }
    ],
    "drawedCard": {
        "lastDrawedBy": "67e9979b4e5aaf158e357987",
        "_id": {
            "$oid": "6835d643b9b5174c8e893ef3"
        }
    },
    "playedCards": [
        {
            "playedBy": "Cardy",
            "cards": [
                {
                    "name": "R_3D",
                    "rank": 3,
                    "suit": "D",
                    "pack": 1,
                    "value": 3
                },
                {
                    "name": "R_3H",
                    "rank": 3,
                    "suit": "H",
                    "pack": 2,
                    "value": 3
                },
                {
                    "name": "R_3S",
                    "rank": 3,
                    "suit": "S",
                    "pack": 1,
                    "value": 3
                }
            ],
        },
        {
            "playedBy": "Cardy",
            "cards": [
                {
                    "name": "R_9C",
                    "rank": 9,
                    "suit": "C",
                    "pack": 1,
                    "value": 9
                },
                {
                    "name": "R_10C",
                    "rank": 10,
                    "suit": "C",
                    "pack": 1,
                    "value": 10
                },
                {
                    "name": "R_JC",
                    "rank": 11,
                    "suit": "C",
                    "pack": 1,
                    "value": 10
                },
                {
                    "name": "R_QC",
                    "rank": 12,
                    "suit": "C",
                    "pack": 1,
                    "value": 10
                }
            ],
        },
        {
            "playedBy": "You",
            "cards": [
                {
                    "name": "R_5H",
                    "rank": 5,
                    "suit": "H",
                    "pack": 1,
                    "value": 5
                },
                {
                    "name": "R_6H",
                    "rank": 6,
                    "suit": "H",
                    "pack": 2,
                    "value": 6
                },
                {
                    "name": "R_7H",
                    "rank": 7,
                    "suit": "H",
                    "pack": 1,
                    "value": 7
                },
                {
                    "name": "R_RJ",
                    "rank": 50,
                    "suit": "R",
                    "pack": 2,
                    "value": 50,
                    "isJoker": true
                },
                {
                    "name": "R_9H",
                    "rank": 9,
                    "suit": "H",
                    "pack": 2,
                    "value": 9
                }
            ],
        }
    ],
    "droppedCards": [
        {
            "droppedBy": "67e9979b4e5aaf158e357987",
            "card": {
                "name": "R_2C",
                "rank": 2,
                "suit": "C",
                "pack": 1,
                "value": 2
            },
        },
        {
            "droppedBy": "bot0",
            "card": {
                "name": "R_4D",
                "rank": 4,
                "suit": "D",
                "pack": 1,
                "value": 4
            },
        },
    ],
    "createdAt": {
        "$date": "2025-05-27T15:12:03.817Z"
    }
};

const stepsData = [
    {
        step: 0,
        description: "Welcome to the Rummy tutorial! In this tutorial, you will learn how to play Rummy.",
    },
    {
        step: 1,
        description: "You can draw a card from the deck.",
    },
    {
        step: 2,
        description: "You can sort your cards by number by pushing this button.",
    },
    {
        step: 3,
        description: "You also can sort your cards by name by pushing this button.",
    },
    {
        step: 4,
        description: "You can play a set of cards (3 or more cards of the same rank) or a sequence (3 or more cards in a sequence of the same suit) by selecting each one of them.",
    },
    {
        step: 5,
        description: "You can play a set of cards (3 or more cards of the same rank) or a sequence (3 or more cards in a sequence of the same suit) by selecting each one of them.",
    },
    {
        step: 6,
        description: "You can play a set of cards (3 or more cards of the same rank) or a sequence (3 or more cards in a sequence of the same suit) by selecting each one of them.",
    },
    {
        step: 7,
        description: "After you selected the cards you want to play, you can drop them by dragging them to the middle of the table.",
    },
    {
        step: 8,
        description: "Now you have to drop a card from your hand to the dropped cards pile.",
    },
    {
        step: 9,
        description: "You can see your remaining playing time here.",
    },
    {
        step: 10,
        description: "After you finished your turn, you can click on the next turn button to end your turn and wait for your next turn.",
    },
    {
        step: 11,
        description: "You can see which player is playing currently by who has a card icon.",
    },
    {
        step: 12,
        description: "You can draw a card from the dropped cards pile by clicking on it.",
    },
    {
        step: 13,
        description: "After you draw a card from the dropped cards pile, you need to play it by selecting it.",
    },
    {
        step: 14,
        description: "After you selected one card, you can place it to your or another player's played cards by dragging it to the right place.",
    },
    {
        step: 15,
        description: "If you have more card to place, you can place them but only one by one.",
    },
    {
        step: 16,
        description: "If you have more card to place, you can place them but only one by one.",
    },
    {
        step: 17,
        description: "If you have a card that can place to a Joker's place, you can do that and the Joker will be yours.",
    },
    {
        step: 18,
        description: "If you have a card that can place to a Joker's place, you can do that and the Joker will be yours.",
    },
    {
        step: 19,
        description: "Now you have only one step left to win the game. You need to drop the last card to the dropped cards pile.",
    },
    {
        step: 20,
        description: "Now you have only one step left to win the game. You need to drop the last card to the dropped cards pile.",
    },
    {
        step: 21,
        description: "Congratulations! You have finished the tutorial. Now you can play the game.",
    }
]

export default function Game() {

    const route = useRouter();

    const { settings } = useContext(SettingsContext);
    const [sortType, setSortType] = useState<"num" | "abc" | "">("");

    const [steps, setSteps] = useState<number>(0);

    const [playerCards, setPlayerCards] = useState<Icard[]>([]);

    useEffect(() => {
        setLobby(Alobby as any);
        setGame(Agame);
        setPlayerCards(sortRummyCards(Agame.playerCards["you"], false, "abc"));

    }, [])

    const { user } = useContext(UserContext);
    const [game, setGame] = useState<Igame | any>();
    const [lobby, setLobby] = useState<Ilobby>();

    const [selectedCards, setSelectedCards] = useState<Icard[]>([]);
    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [dragEnter, setDragEnter] = useState<number | null>(null);

    function selectCard(card: Icard) {
        if (steps !== 4 && steps !== 5 && steps !== 6 && steps !== 13 && steps !== 15 && steps !== 17 && steps !== 19) return;

        if (selectedCards.find((e: Icard) => { return JSON.stringify(e) === JSON.stringify(card) })) {
            return setSelectedCards(selectedCards.filter((e: Icard) => { return JSON.stringify(e) !== JSON.stringify(card) }));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
        nextTurn();
    }

    function checkIfCardIsSelected(card: Icard) {
        let c = [...sortRummyCards(playerCards, settings?.autoSort, sortType)];
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
        setPlayerCards(placeCardToIndex(playerCards, index, draggedCard));
        setDraggedCard(null);
    }

    async function cardDropped() {
        if (steps !== 8 && steps !== 20) return;
        if (!draggedCard) return;
        if (!user) return;

        setGame({
            ...game, droppedCards: [...game.droppedCards, { droppedBy: user._id, card: draggedCard }],
            playerCards: { ...game.playerCards, ['you']: game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) }) }
        });
        setPlayerCards(playerCards.filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) }));
        setDraggedCard(null);
        nextTurn();
    }

    async function playCards() {
        if (steps !== 7) return;
        if (!user) return;
        if (selectedCards.length < 3) {
            return;
        }
        setGame({
            ...game,
            playedCards: [...game.playedCards, { playedBy: 'You', cards: selectedCards.sort((a, b) => a.rank - b.rank) }],
            playerCards: { ...game.playerCards, ['you']: game.playerCards['you'].filter((c: Icard) => { return !selectedCards.find(sc => JSON.stringify(sc) === JSON.stringify(c)) }) }
        });
        setPlayerCards(game.playerCards['you'].filter((c: Icard) => { return !selectedCards.find(sc => JSON.stringify(sc) === JSON.stringify(c)) }));
        setSelectedCards([]);
        nextTurn();

    }

    async function drawingCard() {
        if (steps !== 1) return;
        if (!user) return;
        if (!lobby) return;
        setGame({
            ...game,
            drawedCard: { lastDrawedBy: 'you', _id: new Date().getTime().toString() },
            playerCards: { ...game.playerCards, ['you']: [...game.playerCards['you'], game.shuffledCards[0]] },
            shuffledCards: game.shuffledCards.slice(1)
        })
        setPlayerCards([...playerCards, game.shuffledCards[0]]);
        nextTurn();
    }

    async function drawingFromDropped() {
        if (steps !== 12) return;
        if (!user) return;
        if (!lobby) return;
        if (game.droppedCards.length === 0) return;
        setGame({
            ...game,
            drawedCard: { lastDrawedBy: 'you', _id: new Date().getTime().toString() },
            playerCards: { ...game.playerCards, ['you']: [...game.playerCards['you'], game.droppedCards[game.droppedCards.length - 1].card] },
            droppedCards: game.droppedCards.slice(0, game.droppedCards.length - 1)
        })
        setPlayerCards([...playerCards, game.droppedCards[game.droppedCards.length - 1].card]);
        nextTurn();

    }

    async function cardPlacingDrop(playedCard: { playedBy: string, cards: Icard[] }) {
        if (steps !== 14 && steps !== 16 && steps !== 18) return;
        if (!playedCard) return;
        if (!user) return;

        switch (steps) {
            case 14:
                setGame({
                    ...game,
                    playedCards: game.playedCards.map((e: { playedBy: string, cards: Icard[] }) => {
                        if (e.cards.find(c => c.name === 'R_JC')) {
                            return { ...e, cards: [...e.cards, draggedCard!].sort((a, b) => a.rank - b.rank) };
                        }
                        return e;
                    }),
                    playerCards: { ...game.playerCards, ['you']: game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) }) }
                });
                setPlayerCards(game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) }));
                break;
            case 16:
                setGame({
                    ...game,
                    playedCards: game.playedCards.map((e: { playedBy: string, cards: Icard[] }) => {
                        if (e.cards.find(c => c.name === 'R_JC')) {
                            return { ...e, cards: [...e.cards, draggedCard!].sort((a, b) => a.rank - b.rank) };
                        }
                        return e;
                    }),
                    playerCards: { ...game.playerCards, ['you']: game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) }) }
                });
                setPlayerCards(game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) }));
                break;
            case 18:
                setGame({
                    ...game,
                    playedCards: game.playedCards.map((e: { playedBy: string, cards: Icard[] }) => {
                        if (e.cards.find(c => c.name === 'R_6H')) {
                            return { ...e, cards: [...e.cards, draggedCard!].sort((a, b) => a.rank - b.rank).filter((c: Icard) => !c.isJoker) };
                        }
                        return e;
                    }),
                    playerCards: {
                        ...game.playerCards, ['you']: game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) })
                    }
                });
                setPlayerCards([...game.playerCards['you'].filter((c: Icard) => { return JSON.stringify(c) !== JSON.stringify(draggedCard) })]);
                break;
        }

        setDraggedCard(null);
        nextTurn();
    }

    const [timer, setTimer] = useState(34);

    async function nextTurn() {
        setSteps(steps + 1);
    }

    const [error, setError] = useState<string | null>(null);

    function botPlay() {
        if (steps !== 11) return;

        setGame({
            ...game,
            droppedCards: [...game.droppedCards, { droppedBy: 'bot0', card: game.playerCards['bot0'][0] }],
        })
        nextTurn();
    }

    function checkStepsInCards(card: Icard) {
        switch (steps) {
            case 4: if (card.name === "R_5D") return ' ring-4 ring-red-500 '; break;
            case 5: if (card.name === "R_6D") return ' ring-4 ring-red-500 '; break;
            case 6: if (card.name === "R_7D") return ' ring-4 ring-red-500 '; break;
            case 7: if (card.name === "R_5D" || card.name === "R_6D" || card.name === "R_7D") return ' ring-4 ring-red-500 '; break;
            case 8: if (card.name === "R_10D") return ' ring-4 ring-red-500 '; break;
            case 13: if (card.name === "R_KC") return ' ring-4 ring-red-500 '; break;
            case 14: if (card.name === "R_KC") return ' ring-4 ring-red-500 '; break;
            case 15: if (card.name === "R_8C") return ' ring-4 ring-red-500 '; break;
            case 16: if (card.name === "R_8C") return ' ring-4 ring-red-500 '; break;
            case 17: if (card.name === "R_8H") return ' ring-4 ring-red-500 '; break;
            case 18: if (card.name === "R_8H") return ' ring-4 ring-red-500 '; break;
            case 19: if (card.name === "R_AH") return ' ring-4 ring-red-500 '; break;
            case 20: if (card.name === "R_AH") return ' ring-4 ring-red-500 '; break;
        }
    }

    if (!game) return <Loading></Loading>

    return (
        <main className="flex w-full h-full rounded-md p-3 relative">

            {
                steps === 21 &&
                <div className="w-full h-full absolute z-[100] bg-zinc-900/70 top-0 left-0 flex flex-col justify-center items-center">
                    <div className="text-5xl text-zinc-200 font-bold p-4 rounded-md animate-pulse">
                        Game Over
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="text-sm text-zinc-400 font-bold p-4 rounded-md">
                            {stepsData.find((s) => s.step === steps)?.description || "Congratulations! You have finished the tutorial. Now you can play the game."}
                        </div>
                        <div onClick={() => { route.push(`/games`) }} className="text-zinc-200 p-2 px-4 rounded-md border border-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 hover:text-zinc-800 flex items-center gap-1 cursor-pointer">
                            <Icon name="game" stroke></Icon>
                            Games
                        </div>
                    </div>
                </div>
            }

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center">
                {
                    error && <ErrorModal errorCode={error} closeError={() => { setError(null) }}></ErrorModal>
                }
                <div className="flex justify-center items-center w-full h-full absolute py-8">
                    <div className={"border border-[#cccccc10] rounded-md w-2/3 h-2/3 flex flex-wrap gap-10 z-50 p-1" + (steps == 7 ? ' ring-4 ring-red-500 ' : '')} onDrop={playCards} onDragOver={overDrag} >
                        {
                            game.playedCards.length > 0 && game.playedCards.map((e: { playedBy: string, cards: Icard[] }, i: number) => {
                                return (
                                    <div key={i} className={`flex gap-1 h-min group`}>
                                        {
                                            e.cards.map((card: Icard, j: number) => {
                                                return (
                                                    <div onDrop={() => { cardPlacingDrop(e) }} key={j} className="w-8 h-16 relative group cursor-pointer overflow-visible">
                                                        <Image className={`card-animation w-16 max-w-16 rounded-md border border-transparent ${e.playedBy === user?._id ? ' group-hover:border-green-500' : ""} ${(((steps === 14 || steps === 16) && e.cards.find(c => c.name === 'JC') || (steps === 18 && e.cards.find(c => c.name === '6H'))) ? ' ring-4 ring-red-500 ' : '')}`} key={j} src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={70} height={60} alt={new CardsUrls().getFullCardUrl(card.name)||''}></Image>
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

                {
                    steps != 21 &&
                    <div className="absolute top-6 w-[60%] gap-[20%] flex text-zinc-200 text-2xl text-pretty font-mono text-justify">
                        <div className="w-full">
                            {
                                stepsData.find((s) => s.step === steps)?.description || "No more steps available."
                            }
                        </div>
                        <div className="w-full"></div>
                    </div>
                }

                <div className="flex gap-10  w-full absolute top-2 p-2 justify-center">
                    <div className="flex relative cursor-pointer">
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[6rem] border border-zinc-400 rounded-md"></div>
                        <Image className="absolute top-1 left-1" draggable={false} src={"/assets/cards/rummy/gray_back.png"} width={140} height={100} alt="card"></Image>
                        <Image onClick={drawingCard} draggable={false} className={"absolute border-2 border-transparent hover:border-green-500 rounded-lg z-50"} src={"/assets/cards/rummy/gray_back.png"} width={140} height={110} alt="card"></Image>
                        {steps === 1 &&
                            <div className="absolute 2xl:w-[5rem] lg:w-[4.7rem] md:w-[3.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[6rem] rounded-lg ring-[0.6rem] ring-red-500 animate-pulse"></div>
                        }
                    </div>

                    <div className="flex relative" onDragOver={overDrag} onDrop={cardDropped} >
                        <div className="2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md"></div>

                        {
                            game.droppedCards.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1 " draggable={false} src={"/" + new CardsUrls().getFullCardUrl(game.droppedCards[game.droppedCards.length - 2].card.name)} width={140} height={100} alt="card"></Image>
                        }
                        {
                            game.droppedCards.length > 0 &&
                            <Image onClick={drawingFromDropped} className={"absolute right-1 bottom-1 rotate-12 border border-transparent hover:border-green-300 rounded-lg cursor-pointer z-50" + ((steps === 12 || steps === 20) ? ' ring-4 ring-red-500 ' : '')} src={"/" + new CardsUrls().getFullCardUrl(game.droppedCards[game.droppedCards.length - 1].card.name)} width={140} height={100} alt="card"></Image>
                        }
                        {
                            steps === 8 &&
                            <div className="absolute 2xl:w-[5rem] lg:w-[4.7rem] md:w-[4.7rem] 2xl:h-[7.6rem] lg:h-[7rem] md:h-[7rem] border border-zinc-400 rounded-md ring-4 ring-red-500 animate-pulse"></div>

                        }
                    </div>
                </div>

                <div className="absolute top-0 right-2 h-full flex flex-col justify-between items-center">
                    <div></div>
                    {
                        lobby?.bots.filter((u, i) => { return i % 2 === 0 }).map((bot, j) => {
                            return (
                                <div className="relative" key={j} onClick={() => { botPlay(); }}>
                                    {
                                        steps === 11 &&
                                        <div className="ring-4 ring-red-500 rounded-full absolute top-0 left-0 w-full h-full animate-pulse"></div>
                                    }
                                    <GameBot bot={bot} currentPlayer={steps == 11 ? bot._id : ''}></GameBot>
                                </div>
                            )
                        })
                    }
                    <div></div>
                </div>

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center z-50">
                    {
                        sortRummyCards(playerCards, settings?.autoSort, sortType).map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable onClick={() => { selectCard(card) }} className={`cursor-pointer w-12 overflow-visible hover:cursor-grab group rounded-lg duration-200 ${checkIfCardIsSelected(card) ? 'w-20 ' : ''} ${checkIfCardsIsSelected(card) ? 'border-green-400 -translate-y-[0.5rem]' : ''} ${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-10' : ''}`}>
                                        <Image onDragEnter={(e) => { onDragEnter(e, i) }}
                                            className={`${checkStepsInCards(card)} border-2 border-transparent group-hover:border-green-400 rounded-lg`}
                                            style={{ width: "6rem", maxWidth: "6rem" }} loading="eager"
                                            onDragEnd={() => { setDraggedCard(null) }} onDragStart={() => { startDrag(card) }} onDrop={() => { dropDrag(i) }} onDragOver={overDrag}
                                            src={"/" + new CardsUrls().getFullCardUrl(card.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(card.name)||''}>
                                        </Image>
                                    </div>
                                    <div onDragOver={overDrag} className={`${draggedCard && JSON.stringify(draggedCard) !== JSON.stringify(card) && dragEnter === i ? "w-[5.8rem]" : "w-0"} bg-[#00000040] rounded-lg duration-100`}>
                                        {draggedCard &&
                                            <Image className="opacity-75" loading="eager" onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/" + new CardsUrls().getFullCardUrl(draggedCard.name)} width={100} height={100} alt={new CardsUrls().getFullCardUrl(draggedCard.name)||''}></Image>
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        })
                    }

                    {
                        steps !== 11 && steps != 21 &&
                        <div key={timer} style={{ width: `${Math.floor(75 - (timer / 180) * 75)}%`, backgroundColor: `${timer > 150 ? '#ec003f' : '#9ae600'}` }} className={"absolute -top-8 h-4 bg-emerald-500 rounded-xl duration-200 " + (steps === 9 ? ' ring-4 ring-red-500 ' : '')}>
                            <div className="absolute -top-6 w-full flex justify-center items-center text-sm text-zinc-200">
                                {180 - timer}s
                            </div>
                        </div>
                    }

                    <div className="absolute left-10 bottom-4 flex justify-center items-center gap-3">
                        <div onClick={() => { setSortType('abc'); nextTurn(); }} className={"w-[4rem] h-[4rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100" + (steps === 3 ? ' ring-[0.6rem] ring-red-500 animate-pulse' : '')}>
                            <Icon name="sort-abc" size={24}></Icon>
                        </div>
                        <div onClick={() => { setSortType('num'); nextTurn(); }} className={"w-[4rem] h-[4rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100" + (steps === 2 ? ' ring-[0.6rem] ring-red-500 animate-pulse' : '')}>
                            <Icon name="sort-num" size={24}></Icon>
                        </div>
                    </div>

                    {
                        steps !== 11 && steps != 21 &&
                        <div className="">
                            <div onClick={nextTurn} className={"absolute right-10 bottom-4 z-50" + (steps === 0 || steps === 9 || steps === 10 ? '  scaling ' : '')}>
                                <div className="w-[4.5rem] h-[4.5rem] bg-green-800 rounded-full border-2 hover:border-4 flex items-center justify-center text-zinc-200 border-lime-300 text-xl cursor-pointer group duration-100">
                                    <span className="group-hover:opacity-100 opacity-100 duration-100"><Icon name="check-empty" size={44}></Icon></span>
                                </div>
                            </div>
                        </div>

                    }
                </div>

                <div className="w-full h-full flex justify-center items-center select-none">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>
            </main>

        </main>
    )
}