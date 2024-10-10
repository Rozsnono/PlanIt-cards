
import { Iplayer } from "@/interfaces/interface";
import { jwtDecode } from "jwt-decode";

export function Login(username: string, password: string) {
    return fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 'error') {
                throw new Error(data.message);
            }
            saveInCookie(data.token);
            return data;
        });
}

function saveInCookie(data: string) {
    document.cookie = `token=${data}; path=/`;
}

export function getCookie(name: string) {
    if(typeof window === "undefined" || !document.cookie) return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function Logout() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Register(register: any) {
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(register),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 'error') {
                throw new Error(data.message);
            }
            saveInCookie(data.token);
            return data;
        });
}

export function getUser() {
    const token = getCookie('token');
    if (!token) return null;
    if (typeof window === "undefined") return null;
    if (token === "undefined") return null;
    return jwtDecode(token) as Iplayer;
}