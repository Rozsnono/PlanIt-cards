import { getCookie } from "@/functions/user.function";
import { Ilobby } from "@/interfaces/interface";

export const connectWebSocket = (lobbyId: string, userId: string, onMessage: (data: any) => void) => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener('open', () => {
        console.log('WebSocket is connected');
        socket.send(JSON.stringify({ _id: lobbyId, player_id: userId }));
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    });

    return socket;
};

export const joinLobby = async (lobbyId: string) => {
    const response = await fetch(`/api/join/${lobbyId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie("token")}`
        }
    });

    const data = await response.json();
    return data.lobby as Ilobby;
};

export const sendChatMessage = async (lobbyId: string, userId: string, chat: string) => {
    await fetch(`/api/chat/${lobbyId}`, {
        method: "PUT",
        body: JSON.stringify({ sender: userId, message: chat, time: new Date().toISOString(), type: "text" }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie("token")}`
        }
    });
};

export const startGame = async (lobbyId: string) => {
    const response = await fetch(`/api/start/${lobbyId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie("token")}`
        }
    });

    return await response.json();
};
