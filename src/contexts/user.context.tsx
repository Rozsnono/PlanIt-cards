"use client";
import { Iplayer } from "@/interfaces/interface";
import { createContext } from "react";

export interface User {
    user: Iplayer | null;
    setUser: (user: Iplayer | null) => void;
}

export const UserContext = createContext<User>({
    user: null,
    setUser: (user: Iplayer | null) => { },
});
