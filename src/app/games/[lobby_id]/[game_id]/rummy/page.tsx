"use client";
import Icon from "@/assets/icons";
import getCardUrl from "@/contexts/cards.context"
import { SettingsContext } from "@/contexts/settings.context";
import { UserContext } from "@/contexts/user.context";
import { sortRummyCards } from "@/functions/card.function";
import { getCookie } from "@/functions/user.function";
import { Icard, Igame } from "@/interfaces/interface";
import Image from "next/image"
import { useParams } from "next/navigation";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function Game() {

    const game_id = useParams().game_id;
    const lobby_id = useParams().lobby_id;
    
    const { settings } = useContext(SettingsContext);

    const [playerCards, setPlayerCards] = useState<Icard[]>([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobby_id, player_id: user!._id }));
        });

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if (data.playerCard) {
                setPlayerCards(data.playerCard);
            }
            if (data.game) {
                setGame(data.game);
            }
        });

        return () => {
            socket.close();
        };
    }, [])

    const { user } = useContext(UserContext);
    const [game, setGame] = useState<Igame>(
        {
            _id: "1", shuffledCards: [], currentPlayer: "1", playerCards: {
                "1": [
                    { name: "2c", rank: 2, suit: "c" },
                    { name: "3c", rank: 3, suit: "c" },
                    { name: "4c", rank: 4, suit: "c" },
                    { name: "5c", rank: 5, suit: "c" },
                    { name: "6c", rank: 6, suit: "c" },
                    { name: "7c", rank: 7, suit: "c" },
                    { name: "8c", rank: 8, suit: "c" },
                    { name: "9c", rank: 9, suit: "c" },
                    { name: "10c", rank: 10, suit: "c" },
                    { name: "jc", rank: 11, suit: "c" }
                ]
            }, playedCards: [], droppedCards: []
        }
    );

    const positionEnum = [
        "top-[30%] left-2 rotate-[-90deg]",
        "top-2 left-[30%]",
        "top-[20%] right-2 rotate-90",
        "top-[70%] left-2 rotate-[-90deg]",
        "top-2 left-[10%]",
        "top-2 right-[25%]",
        "top-[60%] right-2 rotate-90"
    ]

    const [selectedCards, setSelectedCards] = useState<Icard[]>([]);
    const [draggedCard, setDraggedCard] = useState<Icard | null>(null);
    const [droppedCard, setDroppedCard] = useState<Icard[]>([]);

    const [dragOver, setDragOver] = useState<number | null>(null);

    function selectCard(card: Icard) {
        if (selectedCards.find((e: Icard) => { return JSON.stringify(e) === JSON.stringify(card) })) {
            return setSelectedCards(selectedCards.filter((e: Icard) => { return JSON.stringify(e) !== JSON.stringify(card) }));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    }

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
        setDragOver(i);
    }

    function dropDrag(index: number) {
        setDragOver(null);
        if (!draggedCard) return;
        if (!user) return;
        const draggedIndex = playerCards.indexOf(draggedCard);

        const tmpCards = playerCards;
        tmpCards.splice(draggedIndex, 1);
        tmpCards.splice(index, 0, draggedCard);
        setPlayerCards(tmpCards);
        setDraggedCard(null);
    }

    function cardDropped() {
        if (!draggedCard) return;
        if (!user) return;
        setDroppedCard([...droppedCard, draggedCard]);
        setGame({ ...game, droppedCards: [...game.droppedCards, draggedCard] });
        const cards = game.playerCards[user._id];
        setGame({ ...game, playerCards: { ...game.playerCards, [user._id]: cards.filter((e: Icard) => { return JSON.stringify(e) !== JSON.stringify(draggedCard) }) } });
        setDraggedCard(null);
    }

    function playCards() {
        if (!user) return;
        if (selectedCards.length < 3) {
            return;
        }
        const playedCards = [...game.playedCards, selectedCards.sort((a: Icard, b: Icard) => { return a.rank - b.rank })];
        const playerCards = game.playerCards[game.currentPlayer].filter((e: Icard) => { return !selectedCards.find((card: Icard) => { return JSON.stringify(card) === JSON.stringify(e) }) });
        setGame({ ...game, playerCards: { ...game.playerCards, [user._id]: playerCards }, playedCards: playedCards });
        setSelectedCards([]);
    }

    const [timer, setTimer] = useState(180);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer - 1);
            if (timer === 0) {
                setTimer(0);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);


    return (
        <main className="flex bg-[#3f3f46c0] w-full min-h-screen rounded-md p-3 relative">

            <main className="bg-green-800 rounded-md w-full relative flex justify-center items-center">

                <div className="flex justify-center items-center w-full h-full absolute">
                    <div className="border border-[#cccccc10] rounded-md w-2/3 h-2/3 flex flex-wrap gap-4 z-50 p-1" onDrop={playCards} onDragOver={overDrag} >
                        {
                            game.playedCards && game.playedCards.map((e: Icard[], i: number) => {
                                return (
                                    <div key={i} className="flex gap-1 h-min">
                                        {
                                            e.map((card: Icard, j: number) => {
                                                return (
                                                    <Image className="card-animation" key={j} src={"/assets/cards/" + getCardUrl(card.name)} width={70} height={60} alt={getCardUrl(card.name)}></Image>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="flex gap-10 w-full absolute top-2 p-2 justify-center">
                    <div className="flex relative cursor-pointer ">
                        <div className="h-[9rem] w-24 border border-zinc-400 rounded-md"></div>
                        <Image className="absolute left-1 top-0" draggable={false} src={"/assets/cards/gray_back.png"} width={100} height={100} alt="card"></Image>
                        <Image draggable={false} className="absolute right-1 bottom-1 border border-transparent hover:border-green-300 rounded-lg" src={"/assets/cards/gray_back.png"} width={110} height={110} alt="card"></Image>
                    </div>
                    <div className="flex relative" onDragOver={overDrag} onDrop={cardDropped} >
                        <div className="h-[9rem] w-24 border border-zinc-400 rounded-md"></div>
                        {
                            droppedCard.length > 1 &&
                            <Image className="absolute left-1 top-1 rotate-1" draggable={false} src={"/assets/cards/" + getCardUrl(droppedCard[droppedCard.length - 2].name)} width={100} height={100} alt="card"></Image>
                        }
                        {
                            droppedCard.length > 0 &&
                            <Image className="absolute right-1 bottom-1 rotate-12 border border-transparent hover:border-green-300 rounded-lg cursor-pointer" src={"/assets/cards/" + getCardUrl(droppedCard[droppedCard.length - 1].name)} width={100} height={100} alt="card"></Image>
                        }
                    </div>
                </div>

                {
                    new Array(4).fill(0).map((_, j) => {
                        return (
                            <div key={j} className={`absolute flex gap-1 ${positionEnum[j]}`}>
                                <div className="w-12 h-12 relative group cursor-pointer">

                                    <div style={{ rotate: positionEnum[j].includes("rotate-90") ? "270deg" : (positionEnum[j].includes("rotate") ? "90deg" : "0deg") }} className="w-12 h-12 rounded-full bg-zinc-500 flex text-zinc-300 items-center justify-center">
                                        <Icon name="user"></Icon>
                                    </div>

                                    <div style={{ rotate: positionEnum[j].includes("rotate-90") ? "270deg" : (positionEnum[j].includes("rotate") ? "90deg" : "0deg") }} className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[2rem] left-2 bg-blue-500 hover:bg-blue-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                                        <Icon name="add-friend"></Icon>
                                    </div>
                                    <div style={{ rotate: positionEnum[j].includes("rotate-90") ? "270deg" : (positionEnum[j].includes("rotate") ? "90deg" : "0deg") }} className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[3.5rem] left-2 bg-sky-500 hover:bg-sky-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                                        <Icon name="info"></Icon>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                }

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    {
                        sortRummyCards(playerCards, settings?.autoSort).map((card, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div draggable onClick={() => { selectCard(card) }} className={`cursor-pointer w-12 overflow-visible hover:cursor-grab group rounded-lg duration-200 ${checkIfCardIsSelected(card) ? 'border-green-400 translate-y-[-1rem]' : ''} ${draggedCard && JSON.stringify(draggedCard) === JSON.stringify(card) ? 'opacity-10' : ''}`}>
                                        <Image onDragEnter={(e) => { onDragEnter(e, i) }} className="border-2 border-transparent group-hover:border-green-400 rounded-lg" style={{ width: "6rem", maxWidth: "6rem" }} loading="eager" onDragEnd={() => { setDraggedCard(null) }} onDragStart={() => { startDrag(card) }} onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/assets/cards/" + getCardUrl(card.name)} width={100} height={100} alt={getCardUrl(card.name)}></Image>
                                    </div>
                                    <div onDragOver={overDrag} onDrop={() => { dropDrag(i) }} className={`${draggedCard && JSON.stringify(draggedCard) !== JSON.stringify(card) && dragOver === i ? "w-[5.8rem]" : "w-0"} bg-[#00000040] rounded-lg duration-100`}>
                                        {draggedCard &&
                                            <Image className="opacity-75" loading="eager" onDrop={() => { dropDrag(i) }} onDragOver={overDrag} src={"/assets/cards/" + getCardUrl(draggedCard.name)} width={100} height={100} alt={getCardUrl(draggedCard.name)}></Image>
                                        }
                                    </div>
                                    {
                                        // <div onDragOver={(e) => { overDragChoose(e, i + 1) }} onDrop={() => { dropDrag(i + 1) }} className={`bg-[#00000040] ${dragOver === i + 1 ? 'w-24' : 'w-8'} rounded-lg flex justify-center items-center text-gray-500 duration-200 ${!draggedCard ? 'w-0' : ''}`}>{draggedCard && "+"}</div>
                                    }
                                </React.Fragment>
                            )
                        })
                    }

                    <div key={timer} className="absolute right-10 h-[5rem] w-[5rem] justify-center items-center flex rounded-2xl border border-lime-300 bottom-4"
                        style={{ background: `conic-gradient(#bef264 ${(180 - timer) * 360 / 180}deg, transparent 0deg)` }}
                    >
                        <div className="w-[4.5rem] h-[4.5rem] bg-green-800 rounded-xl border flex items-center justify-center text-zinc-200 border-lime-300 text-xl hover:bg-green-600 cursor-pointer group duration-100">
                            <span className="group-hover:opacity-0 group-hover:hidden flex opacity-100 duration-100">{timer}s</span>
                            <span className="group-hover:opacity-100 group-hover:flex hidden opacity-0 duration-100">Ready</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-10 border-[2rem] border-[#ffffff10] rounded-full h-[30rem] w-[30rem] flex justify-center items-center">
                        <Image loading="eager" src={"/assets/icon.png"} width={300} height={300} draggable={false} alt="" className="opacity-10"></Image>
                    </div>
                </div>
            </main>

        </main>
    )
}