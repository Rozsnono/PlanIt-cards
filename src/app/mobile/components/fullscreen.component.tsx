"use client";

import Icon from "@/assets/icons";
import React from "react";
import { useEffect, useState } from "react";

export default function FullscreenMode() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {

        setIsFullscreen(Boolean(document.fullscreenElement));

        function onChange() {
            // document.fullscreenElement lehet null, ha nincs fullscreen
            setIsFullscreen(Boolean(document.fullscreenElement));
        }


        document.addEventListener("fullscreenchange", onChange);
        // WebKit prefix-ekhez is figyelhetünk (régebbi Safari/Chrome)
        document.addEventListener("webkitfullscreenchange" as any, onChange);


        return () => {
            document.removeEventListener("fullscreenchange", onChange);
            document.removeEventListener("webkitfullscreenchange" as any, onChange);
        };
    }, []);


    async function enterFullscreen() {
        const el = document.documentElement; // teljes oldal (body/html)
        try {
            // modern API
            if (el.requestFullscreen) {
                await el.requestFullscreen();
                return;
            }
            // WebKit (öröklődő régi implem.)
            const anyEl = el as any;
            if (anyEl.webkitRequestFullscreen) {
                anyEl.webkitRequestFullscreen();
                return;
            }
            if (anyEl.mozRequestFullScreen) {
                anyEl.mozRequestFullScreen();
                return;
            }
            if (anyEl.msRequestFullscreen) {
                anyEl.msRequestFullscreen();
                return;
            }
        } catch (err) {
            // hibakezelés: a felhasználó blokkolhatja, vagy a böngésző nem engedi
            // itt csak csendben kezeljük (tetszés szerint felugró üzenet)
            // console.error('Fullscreen error', err);
        }
    }

    async function exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                return;
            }
        } catch (err) {
            // hibakezelés: a felhasználó blokkolhatja, vagy a böngésző nem engedi
            // itt csak csendben kezeljük (tetszés szerint felugró üzenet)
            // console.error('Fullscreen error', err);
        }
    }

    return (
        <React.Fragment>
            {isFullscreen ?
                <button
                    onClick={exitFullscreen}
                    className="fixed bottom-4 right-4 bg-purple-700 text-white text-sm p-2 rounded-full shadow-lg z-[10001]"
                    aria-label="Exit fullscreen mode"
                    title="Exit fullscreen mode"
                >
                    <Icon name="exitFullScreen" className=""></Icon>
                </button>
                :
                <button
                    onClick={enterFullscreen}
                    className="fixed bottom-4 right-4 bg-indigo-700 text-white text-sm p-2 rounded-full shadow-lg z-[10001]"
                    aria-label="Enter fullscreen mode"
                    title="Enter fullscreen mode"
                >
                    <Icon name="fullScreen" className=""></Icon>
                </button>
            }

        </React.Fragment>
    )
}