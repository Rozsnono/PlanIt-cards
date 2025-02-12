import { getCookie } from "@/functions/user.function";

export default class ProfileService {
    public async getProfileData(id: string) {
        return fetch(`/api/player/${id}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
    }

    public async getProfileHome(id: string) {
        return fetch(`/api/player/${id}/home`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
    }
}