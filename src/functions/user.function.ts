
import { UserContext } from "@/contexts/user.context";
import { Iplayer } from "@/interfaces/interface";
import { LogService } from "@/services/log.service";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

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
    if (!user) {
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

export class PlayerWebSocket {
    private socket: WebSocket | null = null;
    private url: string;
    private user: Iplayer | null = null;
    private setUser: (user: Iplayer | null) => void;

    constructor(url: string, user: Iplayer | null, setUser: (user: Iplayer | null) => void) {
        this.url = url;
        this.user = user;
        this.setUser = setUser;
        console.log("Constructor: setUser is", setUser);
        // setUser(user); // Initialize user in the context
    }

    connect() {
        if (this.socket) return;

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            new LogService().log("Player connected to the server successfully.");
        };

        this.socket.onmessage = (event) => {
            const parsed = JSON.parse(event.data);

            if (this.user?.customId === parsed.customId) {


                const updatedUser = {
                    ...this.user,
                    settings: parsed.settings || this.user!.settings,
                    pendingFriends: parsed.pendingFriends.length || 0,
                } as Iplayer;
                this.setUser(updatedUser); // THIS should trigger setUserData()
                this.user = updatedUser;
                this.saveInCookie(parsed.token);
            } else {
                console.warn("customId mismatch or user is null.");
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed.");
            this.socket = null;
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    private saveInCookie(data: string) {
        const time = new Date(new Date().setDate(new Date().getDate() + 5)).toUTCString();
        const cookie = `token=${encodeURIComponent(data)}; expires=${time}; path=/;`;
        document.cookie = cookie;
    }

    send(message: string) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open. Cannot send message.");
            return;
        }
        this.socket.send(message);
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}