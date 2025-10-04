"use client";
import Icon from "@/assets/icons";
import { GameService } from "@/services/game.service";
import { useRouter } from "next/navigation";

export default function GameOver({ isGameOver, lobbyId, gameId, type, hasResult = true }: { isGameOver: boolean, lobbyId: string | any; gameId: string | any; type: 'RUMMY' | 'UNO' | 'SCHNAPPS'; hasResult?: boolean }) {

    const router = useRouter();

    async function StartRematch() {
        const gameService = new GameService(type.toLocaleLowerCase() as any);
        console.log('HERE 1');
        const deleteRes = await gameService.deleteGame(gameId as string);
        console.log('HERE 2');
        const startRes = await gameService.startGame(lobbyId as string);
        if (startRes?.error) { return; }
        console.log('HERE 3');
        router.push(`/games/${lobbyId}`);
        router.refresh();
    }

    if (!isGameOver) {
        return null
    }

    if (!hasResult) {
        return (
            <div className="w-full h-full absolute z-[1000] bg-zinc-900/70 top-0 left-0 flex flex-col justify-center items-center">
                <div className="text-5xl text-zinc-200 font-bold p-4 rounded-md animate-pulse">
                    Game Over
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="text-sm text-zinc-400 font-bold p-4 rounded-md">
                        Checkout the game history and statistics.
                    </div>
                    <div onClick={() => { router.push(`/games/${lobbyId}`) }} className="text-zinc-200 p-2 px-4 rounded-md border border-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 hover:text-zinc-800 flex items-center gap-1 cursor-pointer">
                        <Icon name="game" stroke></Icon>
                        Back to lobby
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="w-full h-full absolute z-[1000] bg-zinc-900/70 top-0 left-0 flex flex-col justify-center items-center">
            <div className="text-5xl text-zinc-200 font-bold p-4 rounded-md animate-pulse">
                Game Over
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                <div className="text-sm text-zinc-400 font-bold p-4 rounded-md">
                    Checkout the game history and statistics.
                </div>
                <div onClick={() => { router.push(`/games/${lobbyId}/${gameId}/result`) }} className="text-zinc-200 p-2 px-8 rounded-md border border-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 hover:text-zinc-800 flex items-center gap-1 cursor-pointer">
                    <Icon name="chart"></Icon>
                    Statistics
                </div>
                <div onClick={StartRematch} className="text-zinc-200 p-2 px-8 rounded-md border border-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 hover:text-zinc-800 flex items-center gap-1 cursor-pointer">
                    <Icon name="game" stroke></Icon>
                    Rematch
                </div>
            </div>
        </div>
    )
}