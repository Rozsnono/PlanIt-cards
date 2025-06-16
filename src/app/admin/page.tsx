"use client";
import Loader from "@/components/loader.component";
import LobbyCard from "@/components/lobby/lobby";
import { UserContext } from "@/contexts/user.context";
import { Igame } from "@/interfaces/interface";
import { AdminService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import Icon from "@/assets/icons";
import CardsUrls from "@/contexts/cards.context";
import { IP } from "@/enums/ip.enum";
import LineChart, { BarChart, ChartCards, DoughnutChart, PolarChart } from "./components/chart";

export default function AdminPage() {
    const { user } = useContext(UserContext);
    const adminService = new AdminService();

    const router = useRouter();

    const socket = useRef<WebSocket | null>(null);
    const [state, setState] = useState({
        isLoading: true,
        isError: false,
        data: {} as any,
    });


    useEffect(() => {
        socket.current = new WebSocket(IP.ADMINSOCKET);
        setState({ ...state, isLoading: true });


        socket!.current!.addEventListener('open', (event: any) => {
            console.log('WebSocket is connected');
            socket!.current!.send(JSON.stringify({ type: 'getAllGames' }));
            try {
                setState({ ...state, data: JSON.parse(event.data as any), isLoading: false });
            } catch {
                setState({ ...state, isLoading: false });
            }
        });

        socket!.current!.addEventListener('message', (event) => {
            console.log('WebSocket message received:', event);
            try {
                setState({ ...state, data: JSON.parse(event.data as any), isLoading: false });
            } catch {
                setState({ ...state, isLoading: false });
            }
        });

        return () => {
            socket!.current!.close();
        };
    }, [])

    // if(!user?.auth.includes('ADMIN')) {router.back(); return <></>}

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

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [10, 20, 30, 25];



    return (
        <main className="flex gap-2 h-full">
            <main className="w-full rounded-md p-3 h-full text-zinc-200 relative flex gap-2 overflow-y-auto">
                {state.isLoading && <Loader></Loader>}
                {state.isError && <div>Error</div>}
                {state.data.users &&
                    <div className="flex flex-wrap gap-5 p-2 rounded-lg w-full">
                        <ChartCards title="Registered users" type="bar" labels={state.data.users.labels.map((l) => `${l.split('-')[0]} ${months[parseInt(l.split('-')[1]) - 1]}.`)} data={state.data.users.data} datasets={{ label: 'Registered user', borderColor: '#acacac', backgroundColor: '#5e5e5e' }} />
                        <ChartCards title="Games and Lobbies" type="doughnut" labels={['Games', 'Lobbies']} data={[state.data.game_number, state.data.lobby_number]} datasets={{ label: 'Count', colors: ['#5e5e5e', '#8c8c8c'] }} />
                        <ChartCards title="Game types" type="polar" labels={state.data.types.labels} data={state.data.types.data} datasets={{ label: 'Lobby count', borderColor: ['#54545d', '#9f9fa9', '#0084d1'], backgroundColor: ['#e7000b', '#9f9fa9', '#0084d1'] }} />
                    </div>
                }

            </main>
        </main>
    )
}