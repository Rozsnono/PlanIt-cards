import { useEffect, useState } from "react"

export default function TurnDisplayComponent({ playerName }: { playerName: string | null }) {

    const [display, setDisplay] = useState(false);

    useEffect(() => {
        if (playerName) {
            setDisplay(true);
            setTimeout(() => {
                setDisplay(false); // Reset playerName after 3 seconds
            }, 3000)
        }
    }, [playerName])

    if (!playerName || !display) return null
    return (
        <main className="fixed top-0 left-0 w-full flex pt-8 justify-center z-[1000] animate-float-in-t">
            <div className="bg-white p-4 rounded shadow w-fit h-fit ">
                <p className="text-xl">{playerName}&apos;s Turn</p>
            </div>
        </main>
    )
}