import { getCookie } from "@/functions/user.function";

export default class ProfileService {
    public async getProfileData(id: string) {
        return fetch(`/api/player/${id}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
    }

    public async getPlayers() {
        return fetch(`/api/players`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
    }

    public async getProfileHome(id: string) {
        return fetch(`/api/player/${id}/home`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
    }

    public async createFriendRequest(customId: string) {
        return fetch(`/api/players/friend`, {
            method: "POST",
            body: JSON.stringify({ customId }),
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` }
        });
    }

    public async updateProfile(id: string, body: any) {
        return fetch(`/api/player/edit/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` }
        });
    }
}