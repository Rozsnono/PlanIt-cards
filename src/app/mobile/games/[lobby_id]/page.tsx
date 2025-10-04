"use client";

import { UserContext } from "@/contexts/user.context";
import lobbyService from "@/services/lobby.service";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import FullscreenMode from "../../components/fullscreen.component";

export default function LobbyPage() {
    const lobby_id = useParams().lobby_id;
    const { user } = useContext(UserContext);
    const router = useRouter();


    useEffect(() => {
        const socket = new lobbyService().connectWebSocket(lobby_id as string, user!._id, (data: any) => {
            if (data.status) {
                new lobbyService().joinLobby(lobby_id as string).then((lobbyData: any) => {
                    if (lobbyData.error) {
                        router.replace("/mobile");
                    }
                }).catch((err) => {
                    console.error("Error joining lobby:", err);
                    router.replace("/mobile");
                });
            }
            if (data.game_over) {
                router.push(`/mobile`);
            }
            if (!data.lobby) return;

            if (data.lobby.game_id) {
                router.push(`/mobile/games/${lobby_id}/${data.lobby.game_id}/${data.lobby.settings.cardType.toLocaleLowerCase()}`);
            }

            if (data.lobby.users && !data.lobby.users.find((u: any) => u._id === user!._id)) {
                router.replace("/mobile");
            }
        });

        return () => {
            socket.close();
        };
    }, [lobby_id, user, router]);

    return (
        <main className="w-[100vw] h-[100vh] fixed z-[1000] flex justify-center items-center">

            <FullscreenMode />
            <div className="text-white text-center flex flex-col gap-6 p-3 h-full ">
                <div className="flex justify-center fixed top-8 w-full left-0">
                    <Image src={"/assets/logo.png"} width={200} height={100} alt="Logo"></Image>
                </div>
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col gap-6 items-center justify-center p-8 border border-purple-800/50 bg-black/20 rounded-lg">
                        <div className="text-2xl font-bold text-white/80">You are in the lobby</div>
                        <div className="text-lg font-bold text-white/50">Wait for the host to start the game...</div>
                    </div>
                </div>
                <div className="flex justify-center items-center">

                </div>
            </div>
        </main>
    );
}