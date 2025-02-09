
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

export function getColorByInitials(initials: string) {
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF5", "#F5FF33", "#FF8C33",
        "#8C33FF", "#33FF8C", "#FF3333", "#33A8FF", "#A8FF33", "#5733FF", "#FF5733", "#FFAA33",
        "#33FFAA", "#AA33FF", "#FF3357", "#3357FF", "#FFAA57", "#57FFAA", "#AA57FF", "#33FFA8"
    ];

    if (!initials || initials.length === 0) return { background: "#CCCCCC", text: "#000000" };

    const normalizedInitials = initials.toUpperCase();
    const charCodeSum = normalizedInitials.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const background = colors[charCodeSum % colors.length];

    // Kontrasztos betűszín választása (fekete vagy fehér)
    const text = getContrastColor(background);

    return { background, text };
}

// Kontrasztos szövegszín kiszámítása
function getContrastColor(hex: string): string {
    // Hex szín RGB-re bontása
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    // Szín fényerejének kiszámítása (perceived brightness)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "#000000" : "#FFFFFF"; // Világos háttér → fekete szöveg, sötét háttér → fehér szöveg
}

