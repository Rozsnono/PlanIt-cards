
import { Iplayer } from "@/interfaces/interface";
import { jwtDecode } from "jwt-decode";

export function getCookie(name: string) {
    if (typeof window === "undefined" || !document.cookie) return null;
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

export function getUserInitials(firstName?: string, lastName?: string) {
    if (!firstName || !lastName) {
        const user = getUser();
        return user!.firstName[0] + user!.lastName[0];
    }

    return firstName[0] + lastName[0];
}

export function getUserInitialsByName(name: string) {
    const [firstName, lastName] = name.split(" ");
    return getUserInitials(firstName, lastName);
}

export function getColorByInitials(user?: Iplayer | null) {
    if(!user){
        const user = getUser();
        return { background: user!.settings.backgroundColor, text: user!.settings.textColor };
    }
    return { background: user.settings.backgroundColor, text: user.settings.textColor };
}

function getContrastColor(hex: string): string {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "#000000" : "#FFFFFF";
}

