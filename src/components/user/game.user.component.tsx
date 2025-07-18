import Icon from "@/assets/icons";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { Iplayer } from "@/interfaces/interface";

export default function GameUser({ user, currentPlayer }: { user: Iplayer, currentPlayer: string }) {
    return (
        <div className="w-16 h-16 relative group cursor-pointer">

            <div style={{ color: getColorByInitials(user).text, backgroundColor: getColorByInitials(user).background }} className="w-16 h-16 rounded-full flex text-zinc-300 items-center justify-center relative">
                {getUserInitials(user.firstName, user.lastName)}
                {currentPlayer === user._id &&
                    <div className="absolute -top-10 flex">
                        <div className="-rotate-[90deg] animate-bounce text-zinc-300">
                            <Icon name="card-d" size={44}></Icon>
                        </div>
                    </div>
                }
            </div>
            <div>
                <p className="text-zinc-300 text-center">{user.firstName}</p>
            </div>

            <div className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[3.5rem] left-4 bg-blue-500 hover:bg-blue-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                <Icon name="add-friend"></Icon>
            </div>
            <div className="absolute rounded-full w-8 h-8 top-0 group-hover:top-[5rem] left-4 bg-sky-500 hover:bg-sky-400 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-200">
                <Icon name="info"></Icon>
            </div>

        </div>
    )
}

export function GameBot({ bot, currentPlayer }: { bot: any, currentPlayer: string }) {
    return (
        <div className="w-16 h-16 relative group cursor-pointer">

            <div className="w-16 h-16 rounded-full flex text-zinc-300 items-center justify-center bg-zinc-500 border relative">
                <Icon name="robot" size={32} stroke></Icon>
                {currentPlayer === bot._id &&
                    <div className="absolute -top-10 flex">
                        <div className="-rotate-[90deg] animate-bounce">
                            <Icon name="card-d" size={44}></Icon>
                        </div>
                    </div>
                }
            </div>
            <div>
                <p className="text-zinc-300 text-center">{bot.name}</p>
            </div>

        </div>
    )
}