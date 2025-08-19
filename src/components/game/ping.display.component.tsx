import Icon from "@/assets/icons";
import { useEffect, useState } from "react";

export default function PingDisplayComponent({ ping }: { ping?: number }) {

    const [pinging, setPing] = useState(ping || 40);

    useEffect(() => {
        const interval = setInterval(() => {
            const dif = Math.random() * 20 - 10; // Simulate a ping value between 50 and 250 ms
            const newPing = pinging! + dif > 150 ? 150 : pinging! + dif < 10 ? 10 : pinging! + dif;
            setPing(parseFloat(newPing.toFixed(0))); // Simulate a ping value between 50 and 250 ms
        }, 3000); // Update ping every 3 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    if (!navigator.onLine) {
        return (
            <div className="fixed bottom-6 left-4 z-[100] py-4 px-1 rounded-lg flex gap-1 items-center text-zinc-200 orbitron">
                <Icon name={`wifi-off`} stroke className="animate-pulse"></Icon> <span>00 ms</span>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 left-4 z-[100] py-4 px-1 rounded-lg flex gap-1 items-center text-zinc-200 orbitron">
            <Icon name={`wifi-${pinging! > 50 ? pinging > 100 ? 'none' : "low" : "full"}`} className="animate-pulse"></Icon> <span>{pinging} ms</span>
        </div>
    );
}
