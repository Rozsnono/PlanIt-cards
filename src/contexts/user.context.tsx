"use client";
import { Iplayer } from "@/interfaces/interface";
import { createContext } from "react";
import React, { useEffect } from "react";

export interface User {
    user: Iplayer | null;
    setUser: (user: Iplayer | null) => void;
}

export const UserContext = createContext<User>({
    user: null,
    setUser: (user: Iplayer | null) => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<Iplayer | null>(getUserFromCookie('planit_user'));

    useEffect(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('planit_user='));
        if (cookie) {
            const cUser = JSON.parse(cookie.split('=')[1]);
            setUser(cUser);
        }
    }, []);

    useEffect(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('planit_user='));
        if (!cookie) {
            saveUserToCookie(user, 'planit_user');
        } else if (user == null) {
            deleteUserFromCookie('planit_user');
        }
    }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

function getUserFromCookie(name: string): Iplayer | null {
    if (typeof window !== "undefined") {
        const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
        if (cookie) {
            return JSON.parse(cookie.split('=')[1]);
        }
    }
    return null;
}

export function saveUserToCookie(user: Iplayer | null, name: string) {
    if (typeof window !== "undefined" && user) {
        document.cookie = `${name}=${JSON.stringify(user)}; path=/; max-age=31536000;`;
    }
}

export function deleteUserFromCookie(name: string) {
    if (typeof window !== "undefined") {
        document.cookie = `${name}=; path=/; max-age=0;`;
    }
}