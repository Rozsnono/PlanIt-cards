import { getCookie } from "@/functions/user.function";

export async function getLobbyData() {
    const token = getCookie("token");
    const response = await fetch(`/api/get`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
}

export async function createLobby(lobbySettings: any) {
    const token = getCookie("token");

    const response = await fetch("/api/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ settings: lobbySettings }),
    });

    return response.json();
}
