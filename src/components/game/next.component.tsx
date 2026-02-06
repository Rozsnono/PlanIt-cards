import Icon from "@/assets/icons"
import { UserContext } from "@/contexts/user.context";
import { useContext } from "react";

export default function NextTurnComponent({ nextTurn, nextTurnLoader, isGameOver, gameState, timer }: { nextTurn: () => void, nextTurnLoader: boolean, isGameOver: boolean, gameState: any, timer: number }) {

    const { user } = useContext(UserContext);

    if (gameState.currentPlayer.playerId == user?._id && !nextTurnLoader && !isGameOver) {
        return <div onClick={nextTurn} className="absolute right-10 bottom-4">
            <div className="w-[3rem] h-[3rem] lg:w-[4.5rem] lg:h-[4.5rem] bg-green-800 rounded-full border-2 hover:border-4 flex items-center justify-center text-zinc-200 border-lime-300 text-xl cursor-pointer group duration-100">
                <span className="group-hover:opacity-100 opacity-100 duration-100">
                    <Icon name="check-empty" size={44} className="lg:flex hidden"></Icon>
                    <Icon name="check-empty" size={22} className="lg:hidden flex"></Icon>
                </span>
            </div>
        </div>
    }

    if (nextTurnLoader) {
        return <div key={timer} className={`absolute right-10 h-[5rem] w-[5rem] justify-center items-center flex rounded-full border-2 border-lime-300 bottom-4`}
            style={{ background: `conic-gradient(#bef264 ${360 - ((0) * 360 / 180)}deg, transparent 0deg)` }}
        >
            <div className="w-[3rem] h-[3rem] lg:w-[4.5rem] lg:h-[4.5rem] bg-green-800 rounded-full border-2 flex items-center justify-center text-lime-200 border-lime-300 text-xl cursor-pointer group duration-100">
                <span className="opacity-100 group-hover:flex flex duration-100 animate-spin">
                    <Icon name="loader" size={44} className="lg:flex hidden"></Icon>
                    <Icon name="loader" size={22} className="lg:hidden flex"></Icon>
                </span>
            </div>
        </div>
    }
    return <></>
}