
import { Iplayer } from "@/interfaces/interface";
import { jwtDecode } from "jwt-decode";

export function getCookie(name: string) {
    if(typeof window === "undefined" || !document.cookie) return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function Logout() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function getUser() {
    const token = getCookie('token');
    if (!token) return null;
    if (typeof window === "undefined") return null;
    if (token === "undefined") return null;
    return jwtDecode(token) as Iplayer;
}

export function getUserInitials(){
    const user = getUser();
    if(!user) return null;
    return user.firstName[0] + user.lastName[0];
}