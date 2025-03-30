import { getCookie } from "@/functions/user.function";

export class AdminService {
    constructor() { }

    public async getAllGames() {
        const response = await fetch(`/api/lobby/get/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();
    }


    public async CardValueByName(name: string, type: 'rummy' | 'uno') {
        const response = await fetch(`/api/card/value/${name}/${type}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            }
        });

        return await response.json();

    }

    public async modifyGame(body: any) {
        const response = await fetch(`/api/modify/` + body._id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(body)
        });

        return await response.json();

    }

    public async nextTurn(id: string, playerId: string) {
        const response = await fetch(`/api/next/game/` + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify({ playerId: playerId })
        });

        return await response.json();
    }
}