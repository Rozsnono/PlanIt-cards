"use client";
import Icon from "@/assets/icons";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RotationCheck() {

    const [orientation, setOrientation] = useState('unknown');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const getOrientation = () => {
            // 1) prefer Screen Orientation API ha van
            if (window.screen && window.screen.orientation && window.screen.orientation.type) {
                return window.screen.orientation.type.startsWith('portrait') ? 'portrait' : 'landscape';
            }
            // 2) matchMedia fallback
            if (window.matchMedia) {
                return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
            }
            // 3) window.innerWidth/innerHeight mint végső eshetőség
            return window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape';
        };

        const handleChange = () => setOrientation(getOrientation());

        // kezdeti állapot
        handleChange();

        // események felvétele
        // a modern approach: screen.orientation.onchange
        if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
            window.screen.orientation.addEventListener('change', handleChange);
        } else if (window.matchMedia) {
            const mq = window.matchMedia('(orientation: portrait)');
            // matchMedia.onchange modern; régebbi böngészőkön addListener
            if (mq.addEventListener) {
                mq.addEventListener('change', handleChange);
            } else if (mq.addListener) {
                mq.addListener(handleChange);
            }
            // továbbá window resize fallback:
            window.addEventListener('resize', handleChange);
        } else {
            window.addEventListener('resize', handleChange);
        }

        return () => {
            if (window.screen && window.screen.orientation && window.screen.orientation.removeEventListener) {
                window.screen.orientation.removeEventListener('change', handleChange);
            } else if (window.matchMedia) {
                const mq = window.matchMedia('(orientation: portrait)');
                if (mq.removeEventListener) {
                    mq.removeEventListener('change', handleChange);
                } else if (mq.removeListener) {
                    mq.removeListener(handleChange);
                }
                window.removeEventListener('resize', handleChange);
            } else {
                window.removeEventListener('resize', handleChange);
            }
        };
    }, []);

    if(orientation === 'landscape') {
        return null; // ne jelenítsen meg semmit, ha tájkép módban van
    }

    return (
        <main className="w-[100vw] h-[100vh] fixed z-[1000] bg-zinc-800/50 backdrop-blur-xl flex justify-center items-center">
            <div className="text-white text-center flex flex-col gap-6 p-3">
                <div className="flex justify-center fixed top-16 w-full left-0">
                    <Image src={"/assets/logo.png"} width={200} height={100} alt="Logo"></Image>
                </div>
                <div className="mobile flex justify-center relative animate-rotate-90">
                    <div className="rounded-md overflow-hidden border border-black h-64 w-32 bg-zinc-900 p-[0.1rem] z-[100] flex flex-col font-bold ">
                        <div className="w-full h-full rounded-md bg-zinc-950 flex flex-col justify-center items-center text-gray-500">
                            <Icon name="error" size={64} className="animate-rotate--90"></Icon>
                        </div>
                    </div>
                    <div className="absolute bg-black h-[2.5rem] w-16 ml-[4.3rem] top-12 rounded-[2px]"></div>
                    <div className="absolute bg-black h-[1rem] w-16 ml-[4.3rem] top-[5.8rem] rounded-[2px]"></div>
                    <div className="absolute bg-black rounded-full h-[0.5rem] w-[0.5rem] z-[1001] top-2"></div>
                </div>

                <div className="text-2xl px-6">
                    Oops! The mobile view is not available in this mode, please rotate your device.
                </div>
            </div>
        </main>
    )
}