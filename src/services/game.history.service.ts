import { getCookie } from "@/functions/user.function";

export class GameHistoryService {
    constructor() {
    }

    async getGameHistory(ID: string, gameId: string|any) {
        const response = await fetch(`/api/game_history/${ID}/${gameId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

    async getGameHistoryByUser(ID: string) {
        const response = await fetch(`/api/game_history/${ID}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }

}