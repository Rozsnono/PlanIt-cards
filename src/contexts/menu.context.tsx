"use client";
import { createContext } from "react";


export interface Menu {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

export const MenuContext = createContext<Menu>({
    isOpen: true,
    setOpen: (isOpen: boolean) => { },
});