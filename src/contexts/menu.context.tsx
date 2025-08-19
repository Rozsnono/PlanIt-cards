"use client";
import { createContext } from "react";
import React, { useEffect } from "react";


export interface Menu {
    isLowModeOn: boolean;
    setLowMode: (isLowModeOn: boolean) => void;
}

export const MenuContext = createContext<Menu>({
    isLowModeOn: false,
    setLowMode: (isLowModeOn: boolean) => { },
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [isLowModeOn, setLowMode] = React.useState(false);

    useEffect(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('lowMode='));
        if (cookie) {
            const cLowMode = JSON.parse(cookie.split('=')[1]);
            setLowMode(cLowMode);
        }
    }, []);

    useEffect(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('lowMode='));
        if (!cookie) {
            saveModeToCookie(isLowModeOn, 'lowMode');
        } else {
            deleteToken('lowMode');
            saveModeToCookie(isLowModeOn, 'lowMode');
        }
    }, [isLowModeOn]);

    return (
        <MenuContext.Provider value={{ isLowModeOn, setLowMode }}>
            {children}
        </MenuContext.Provider>
    );
}

export function saveModeToCookie(mode: any, name: string) {
    if (typeof window !== "undefined" && mode) {
        document.cookie = `${name}=${JSON.stringify(mode)}; path=/; max-age=31536000;`;
    }
}

export function deleteToken(name: string) {
    if (typeof window !== "undefined") {
        document.cookie = `${name}=; path=/; max-age=0;`;
    }
}