"use client";
import { getUser } from "@/functions/user.function";
import { Iplayer } from "@/interfaces/interface";
import { createContext, useState } from "react";

export interface User {
    user: Iplayer | null;
    setUser: (user: Iplayer) => void;
}

export const UserContext = createContext<User>({
    user: { _id: '1', username: '', email: '', rank: 0, firstName: '', lastName: '', numberOfGames: {} },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUser: (user: Iplayer) => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Iplayer|null>(getUser());

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
