import { getCookie } from "@/functions/user.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";

export class GameService {
    private type: string = "rummy";
    constructor(type: "rummy" | "uno" | '' | 'solitaire') {
        this.type = type;
    }

    async getGame(lobby_id: string | any, gameId: string | any) {
        const response = await fetch(`/api/game/get/${lobby_id}/${gameId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async getGameHistory(playerId: string, gameId: string) {
        const response = await fetch(`/api/game_history/${playerId}/${gameId}`, {
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

    async drawFromDropped(lobbyId: string) {
        const response = await fetch(`/api/draw/dropped/${lobbyId}/${this.type}`, {
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

    public getDataFromWebsocket(object: any, socket: any, data: object): { lobby: any, game: any, playerCards: any, game_over?: boolean, refresh?: boolean } | null {
        if (object.refresh) {
            socket.send(JSON.stringify(data));
            return {lobby: null, game: null, playerCards: null, refresh: true};
        }
        if (object.game_over) {
            return { game_over: true, lobby: null, game: null, playerCards: null } as any;
        }
        if (!object.game){
            return { lobby: object.lobby, game: null, playerCards: null } as any;
        }
        if (!object.lobby) return null;
        return { lobby: object.lobby, game: object.game, playerCards: object.game.playerCards } as any;
    }

    public async putCard(lobbyId: string, body: { playedCards: { playedBy: string, cards: Icard[] }, placeCard: Icard }) {
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

    public async deleteGame(lobbyId: string) {
        const response = await fetch(`/api/delete/game/${lobbyId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }

}

export class UnoService extends GameService {
    constructor() {
        super("uno");
    }

    async drawCard(lobbyId: string) {
        const response = await fetch(`/api/draw/${lobbyId}/uno`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async dropCard(lobbyId: string, body: { droppedCard: Icard, color?: string }) {
        const response = await fetch(`/api/drop/${lobbyId}/uno`, {
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

export class SolitaireService extends GameService {
    constructor() {
        super("solitaire");
    }

    async drawCard(lobbyId: string) {
        const response = await fetch(`/api/draw/${lobbyId}/solitaire`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async placeCards(lobbyId: string, body: { placedCards: Icard[], placingCards: Icard[] }, index: number) {
        if(index > -1) {
            body.placingCards = body.placingCards.slice(index);
        }else{
            body.placingCards = body.placingCards;
        }
        const response = await fetch(`/api/put/${lobbyId}/solitaire`, {
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

    async playCard(lobbyId: string, body: { playedCards: Icard[], playingCard: Icard }): Promise<any> {
        const response = await fetch(`/api/play/${lobbyId}/solitaire`, {
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

    async restartGame(lobbyId: string, gameId: string) {
        const response = await fetch(`/api/restart/${lobbyId}/${gameId}/solitaire`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }

    async prevStep(lobbyId: string, gameId: string) {
        const response = await fetch(`/api/prevSteps/${lobbyId}/${gameId}/solitaire`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }

    async playWithPress(lobbyId: string, body: { playedCards: Icard[][], playingCard: Icard }) {
        const check = body.playedCards.find((cards: Icard[]) => {
            return cards.find((card: Icard) => {
                return card.suit === body.playingCard.suit;
            })
        })

        console.log("check", check, body.playingCard);

        if (check) {
            return this.playCard(lobbyId, { playedCards: check, playingCard: body.playingCard });
        }

    }
}