import { getCookie } from "@/functions/user.function";
import { Icard, Igame, Ilobby } from "@/interfaces/interface";

export class GameService {
    private type: string = "rummy";
    constructor(type: "rummy" | "uno" | '' | 'solitaire' | 'schnapps') {
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

    async RecalibrateHistory(_id: string, gameId: string) {
        const response = await fetch(`/api/recalibrate/${_id}/${gameId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async startGame(lobbyId: string, timeLimit?: number) {
        const response = await fetch(`/api/start/${lobbyId}/${this.type}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ timeLimit: timeLimit || null })
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

    async drawFromTrump(lobbyId: string) {
        const response = await fetch(`/api/draw/trump/${lobbyId}/${this.type}`, {
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
            return { lobby: null, game: null, playerCards: null, refresh: true };
        }
        if (object.game_over || object.game?.secretSettings?.isGameOver) {
            return { game_over: true, lobby: null, game: object.game || null, playerCards: null } as any;
        }
        if (!object.game) {
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

    async checkPlayerTurn(lobbyId: string) {
        const response = await fetch(`/api/check/${lobbyId}/uno`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async nextTurn(lobbyId: string): Promise<any> {
        const response = await fetch(`/api/next/${lobbyId}/uno`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async dropCard(lobbyId: string, body: { droppedCard: Icard, color?: string, isUno?: boolean }) {
        const start = performance.now();
        const response = await fetch(`/api/drop/${lobbyId}/uno`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        const end = performance.now();
        return { res, time: (end - start) / 10 };
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
        if (index > -1) {
            body.placingCards = body.placingCards.slice(index);
        } else {
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


        if (check) {
            return this.playCard(lobbyId, { playedCards: check, playingCard: body.playingCard });
        }

    }

    async doneCards(lobbyId: string) {
        const response = await fetch(`/api/done/${lobbyId}/solitaire`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });
        const res = await response.json();
        return res;
    }
}

export class SchnappsService extends GameService {
    constructor() {
        super("schnapps");
    }

    async selectTrump(lobbyId: string, body: { selectedTrump: { suit: string, cardName?: string, call?: string } }) {
        const response = await fetch(`/api/select/${lobbyId}/schnapps`, {
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

    async callTwenty(lobbyId: string, body: { droppedCard: Icard, color?: string, isUno?: boolean }) {
        const response = await fetch(`/api/call/${lobbyId}/schnapps`, {
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