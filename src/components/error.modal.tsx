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
        <main onClick={closeError} className="cursor-pointer fixed top-4 right-4 bg-zinc-700 border-2 text-white p-4 px-8 rounded-lg z-[100] flex flex-col items-center">
            <div className="absolute -top-2 -left-2 bg-zinc-200 h-4 w-4 rounded-full animate-ping"></div>
            <p className="text-2xl">{ERROR[errorCode as keyof typeof ERROR]}</p>
        </main>
    )
}

enum ERROR {
    "0o1402" = "You need to drop a card!",
    "0o1403" = "You need to have at least 3 cards to drop!",
    "0o1404" = "Card not found!",
    "0o1405" = "Invalid card selected!",
    "0o1406" = "Invalid sequence!",
    "0o1407" = "Not your turn!",
    "0o1408" = "No card played!",
    "0o1413" = "You can't have more than 13 cards!",
    "0o1501" = "You need to have a minimum of 51 value in your hand!",
    "0o1502" = "You've already drawn a card!",
    "0o1503" = "You've already dropped",

    "NOT_IN_LOBBY" = "0o2401",
    "LOBBY_NOT_FOUND" = "0o2404",
    "INVALID_LOBBY" = "0o2405",
    "INVALID_PASSWORD" = "0o2406",
    "LOBBY_FULL" = "0o2407",
    "ALREADY_IN_LOBBY" = "0o2408",

    "USER_NOT_FOUND" = "0o3404",

    "GAME_ALREADY_STARTED" = "0o4401",
    "GAME_NOT_FOUND" = "0o4404",

    "GAME_HISTORY_NOT_FOUND" = "0o5404",

    "NO_AUTH" = "0o6401",
    "INVALID_TOKEN" = "0o6402",
    "INVALID_AUTH" = "0o6403",
    "INVALID_USER" = "0o6406",
    "ALERADY_REGISTERED" = "0o6407",

    "AN_ERROR_OCCURRED" = "0o0400",

}