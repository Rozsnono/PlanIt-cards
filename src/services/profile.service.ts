import { getCookie } from "@/functions/user.function";

export async function getProfileData(id: string) {
    return fetch(`/api/player/${id}`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
}

export async function getProfileHome(id: string) {
    return fetch(`/api/player/${id}/home`, { method: "GET", headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie("token")}` } });
}