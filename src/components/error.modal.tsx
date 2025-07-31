import { useEffect } from "react"

export default function ErrorModal({ errorCode, closeError }: { errorCode: string | null, closeError: () => void }) {

    useEffect(() => {
        if (errorCode) {
            setTimeout(() => {
                closeError()
            }, 10000)
        }
    }, [errorCode, closeError])

    if (!errorCode) return null
    return (
        <main onClick={closeError} className="cursor-pointer fixed top-4 right-4 bg-gradient-to-br from-red-500/80 to-red-700/80 border-2 text-white p-4 px-8 rounded-lg z-[100] flex flex-col items-center">
            <div className="absolute -top-2 -left-2 bg-zinc-200 h-4 w-4 rounded-full animate-ping"></div>
            <p className="text-2xl">{errorCode}</p>
        </main>
    )
}
