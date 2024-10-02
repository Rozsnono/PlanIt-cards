"use client";
import { usePathname } from "next/navigation";
import { Context, createContext, useState } from "react";

export interface User {
    user: { _id: string, name: string, email: string, projects?: string[] } | null;
    setUser: (user: { _id: string, name: string, email: string, projects?: string[] }) => void;
}

export const UserContext = createContext<User>({
    user: { _id: '', name: '', email: '' },
    setUser: (user: { _id: string, name: string, email: string, projects?: string[] }) => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>();

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
