"use client";
import Loader from "@/components/loader.component";
import LobbyCard from "@/components/lobby/lobby";
import { UserContext } from "@/contexts/user.context";
import { Igame } from "@/interfaces/interface";
import { AdminService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import React from "react";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import Icon from "@/assets/icons";
import CardsUrls from "@/contexts/cards.context";

export default function AdminPage() {
    const { user } = useContext(UserContext);
    const adminService = new AdminService();

    const router = useRouter();

    // if(!user?.auth.includes('ADMIN')) {router.back(); return <></>}

    const data = useQuery('users', async () => { return adminService.getAllGames() });

    const [selectedGame, setSelectedGame] = useState<any | null>(null);

    const [cardName, setCardName] = useState<{ [id: string]: string }>({});

    async function addCard(user: any, index: number) {
        const selected = selectedGame;
        const res = await adminService.CardValueByName(cardName[index], selected.settings.cardType);
        if (!res) return;
        selected.game_id.playerCards[user].push(res.value);
        setSelectedGame((prev: any) => ({ ...prev, game_id: { ...prev.game_id, playerCards: selected.game_id.playerCards } }));
        setCardName(prev => ({ ...prev, [index]: "" }));
    }

    function removeCard(user: any, index: number, cardName: any) {
        const selected = selectedGame;
        selected.game_id.playerCards[user] = selected.game_id.playerCards[user].filter((card: any) => JSON.stringify(card) !== JSON.stringify(cardName));
        setSelectedGame((prev: any) => ({ ...prev, game_id: { ...prev.game_id, playerCards: selected.game_id.playerCards } }));
    }

    function saveModifications() {
        adminService.modifyGame(selectedGame.game_id).then(data => {
            console.log(data);
        });
    }

    function setNextTurn(playerId: string) {
        adminService.nextTurn(selectedGame.game_id._id, playerId).then(data => {
            console.log(data);
        });
    }

    return (
        <main className="flex gap-2 h-full">
            <main className="w-full rounded-md p-3 h-full text-zinc-200 relative flex gap-2 overflow-y-auto">
                <div className="w-1/4 flex flex-col gap-2">
                    {data.isLoading && <Loader></Loader>}
                    {data.isError && <div>Error</div>}
                    {data.isSuccess && !data.isLoading && !data.isError && data.data && data.data.map((l: any, index: number) => (
                        <span key={index} className="cursor-pointer" onClick={() => { setSelectedGame(l); console.log(l) }}>
                            <LobbyCard lobbyDatas={l as any} lobbyNumber={index} isAdmin></LobbyCard>
                        </span>
                    ))}
                </div>

                <div className="w-full">
                    {selectedGame &&
                        <div key={selectedGame.game_id} className="bg-zinc-800 p-2 rounded-md flex flex-col gap-2">
                            {
                                selectedGame.game_id && selectedGame.game_id.playerCards &&
                                Object.values(selectedGame.game_id.playerCards).map((cards: any, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <div onClick={() => { setNextTurn(Object.keys(selectedGame.game_id.playerCards)[index]) }} className="w-1/6 overflow-x-auto flex items-center justify-center gap-1 cursor-pointer bg-zinc-700 text-gray-200 text-sm rounded-lg p-2 hover:bg-zinc-600">
                                            {
                                                selectedGame.game_id.currentPlayer && selectedGame.game_id.currentPlayer.playerId === Object.keys(selectedGame.game_id.playerCards)[index] &&
                                                <div className="bg-green-400 text-zinc-800 p-1 rounded-lg"></div>
                                            }
                                            {(selectedGame.users.find((u: any) => { return u._id === Object.keys(selectedGame.game_id.playerCards)[index] }) || { username: "Bot" + index }).username}
                                        </div>
                                        <div className="w-full flex gap-1 overflow-x-auto">

                                            {cards.map((card: any, i: number) => (
                                                <React.Fragment key={i}>
                                                    <div onClick={() => { removeCard(Object.keys(selectedGame.game_id.playerCards)[index], index, card) }} className={`cursor-pointer w-12 overflow-visible hover:cursor-pointer group rounded-lg duration-200`}>
                                                        <Image className="border-2 border-transparent group-hover:border-green-400 rounded-lg" style={{ width: "3rem", maxWidth: "3rem" }} loading="eager" src={"/assets/cards/" + selectedGame.settings.cardType + '/' + (selectedGame.settings.cardType.toLowerCase() === 'rummy' ? new CardsUrls().getCardUrl(card.name) : new CardsUrls().getUnoCardUrl(card.name))} width={100} height={100} alt={new CardsUrls().getCardUrl(card.name)}></Image>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        <div className="w-1/6 flex">
                                            <div className="">
                                                {
                                                    cardName[index] && cardName[index].length > 1 &&
                                                    <div className={`cursor-pointer w-12 overflow-visible hover:cursor-pointer group rounded-lg duration-200`}>
                                                        <Image className="border-2 border-transparent group-hover:border-green-400 rounded-lg" style={{ width: "3rem", maxWidth: "3rem" }} loading="eager" src={"/assets/cards/" + selectedGame.settings.cardType + '/' + (selectedGame.settings.cardType.toLowerCase() === 'rummy' ? new CardsUrls().getCardUrl(cardName[index]) : new CardsUrls().getUnoCardUrl(cardName[index]))} width={100} height={100} alt={new CardsUrls().getCardUrl(cardName[index])}></Image>
                                                    </div>
                                                }
                                            </div>
                                            <div className="w-full flex gap-1">
                                                <input onChange={(e) => { setCardName(prev => ({ ...prev, [index]: e.target.value })) }} value={cardName[index]} type="text" className="disabled:cursor-default bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex w-full p-2 h-min" />
                                                <button onClick={() => { addCard(Object.keys(selectedGame.game_id.playerCards)[index], index) }} className="w-min p-2 flex justify-center items-center bg-zinc-700 hover:bg-zinc-600 rounded-lg "><Icon name={"add"}></Icon></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className="flex gap-2">
                                <button onClick={saveModifications} className="w-full p-2 flex justify-center items-center bg-emerald-700 hover:bg-emerald-600 rounded-lg ">Save modifications</button>
                            </div>
                        </div>}
                </div>
            </main>
        </main>
    )
}