import { getCookie } from "@/functions/user.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";

export class GameService {
    private type: string = "rummy";
    constructor(type: "rummy"|"uno"|'') {
        this.type = type;
    }

    async getGame(lobby_id: string|any, gameId: string|any) {
        const response = await fetch(`/api/game/get/${lobby_id}/${gameId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async startGame(lobbyId: string) {
        const response = await fetch(`/api/start/${lobbyId}/${this.type}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async drawCard(lobbyId: string) {
        const response = await fetch(`/api/draw/${lobbyId}/${this.type}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async dropCard(lobbyId: string, body: { droppedCard: Icard }) {
        const response = await fetch(`/api/drop/${lobbyId}/${this.type}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }

    async playCard(lobbyId: string, body: { playedCards: Icard[] }) {
        const response = await fetch(`/api/play/${lobbyId}/${this.type}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }

    async nextTurn(lobbyId: string,) {
        const response = await fetch(`/api/next/${lobbyId}/${this.type}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }

    public getDataFromWebsocket(object: any, socket: any, data: object): { lobby: any, game: any, playerCards: any, game_over?: boolean } | null {
        if (object.refresh) {
            socket.send(JSON.stringify(data));
            return null;
        }
        if(object.game_over){
            return { game_over: true } as any;
        }
        if (!object.lobby) return null;
        return { lobby: object.lobby, game: object.game, playerCards: object.playerCard };
    }

    public async putCard(lobbyId: string, body: { playedCards: {playedBy: string, cards: Icard[]}, placeCard: Icard}){
        const response = await fetch(`/api/put/${lobbyId}/${this.type}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        
        const res = await response.json();
        return res;
    }

}