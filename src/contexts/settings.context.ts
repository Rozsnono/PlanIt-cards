"use client";
import { createContext } from "react";

interface Isettings {
    autoSort: boolean;
}

export interface Settings {
    settings: Isettings | null;
    setSettings: (settings: Isettings | null) => void;
}

export const SettingsContext = createContext<Settings>({
    settings: { autoSort: false },
    setSettings: (settings: Isettings | null) => { },
});