import { getCookie } from "@/functions/user.function";
import { Ilobby } from "@/interfaces/interface";
import { error } from "console";

export default class LobbyService {

    public async getLobbyData(payload: any) {
        const token = getCookie("token");
        const response = await fetch(`/api/get?` + this.convertPayloadFromObject(payload), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.json();
    }

    private convertPayloadFromObject(payload: any) {
        return new URLSearchParams(payload).toString();
    }

    public async joinLobby(lobbyId: string, lobbyCode?: string) {
        const response = await fetch(`/api/join/${lobbyId}`, {
            method: "PUT",
            headers: {
                body: JSON.stringify({ password: lobbyCode }),
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        const data = await response.json();
        return data.lobby as Ilobby;
    };

    public async sendChatMessage(lobbyId: string, userId: string, chat: string) {
        await fetch(`/api/chat/${lobbyId}`, {
            method: "PUT",
            body: JSON.stringify({ sender: userId, message: chat, time: new Date().toISOString(), type: "text" }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
    };

    public async editLobby(lobbyId: string, lobby: any) {
        const response = await fetch(`/api/update`, {
            method: "PUT",
            body: JSON.stringify({ ...lobby, _id: lobbyId }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    public async createLobby(lobbySettings: any) {
        const token = getCookie("token");

        const response = await fetch("/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ settings: lobbySettings }),
        });

        return response.json();
    }

    public connectWebSocket(lobbyId: string, userId: string, onMessage: (data: any) => void) {
        const socket = new WebSocket("ws://localhost:8080");

        socket.addEventListener('open', () => {
            console.log('WebSocket is connected');
            socket.send(JSON.stringify({ _id: lobbyId, player_id: userId }));
        });

        socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch {
                onMessage({ error: "An error occurred" });
            }
        });

        return socket;

    }

}