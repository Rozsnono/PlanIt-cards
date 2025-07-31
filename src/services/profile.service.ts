import { getCookie } from "@/functions/user.function";

export default class ProfileService {
    public async getProfileData(id: string) {
        return fetch(`/api/player/${id}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
    }

    public async getFriends(username: string) {
        return fetch(`/api/get/player/friends?username=${username}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } })
            .then(res => res.json())
            .then(data => data);
    }

    public async getPlayers(username: string) {
        return fetch(`/api/players?username=${username}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
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

    public async acceptFriendRequest(customId: string) {
        return fetch(`/api/players/friend/accept`, {
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

    public async createGameInvite(lobbyId: string, playerId: string) {
        return fetch(`/api/players/game/invite/${lobbyId}/${playerId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` }
        });
    }

    public async deleteGameInvite(inviteId: string) {
        return fetch(`/api/players/game/invite/${inviteId}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` }
        });
    }
}