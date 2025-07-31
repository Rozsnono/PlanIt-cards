import Icon from "@/assets/icons";
import { ProfileIcon } from "@/assets/profile-pics";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { Iplayer } from "@/interfaces/interface";

export default function GameUser({ user, currentPlayer, cardNumber }: { user: Iplayer, currentPlayer: string, cardNumber?: number }) {
    return (
        <div className="w-16 h-16 relative group cursor-pointer">

            <ProfileIcon settings={user.settings} size={4} initials={getUserInitials(user.firstName, user.lastName)} />

            {currentPlayer === user._id &&
                <div className="absolute -top-10 flex items-center justify-center w-full">
                    <div className="-rotate-[90deg] animate-bounce text-zinc-300">
                        <Icon name="card-d" size={44}></Icon>
                    </div>
                </div>
            }
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

export function GameBot({ bot, currentPlayer, cardNumber }: { bot: any, currentPlayer: string, cardNumber?: any }) {
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
            <div className="flex items-center justify-center text-zinc-300 ">
                <Icon name="card" stroke></Icon>
                <span className="text-zinc-300 text-sm">{cardNumber}</span>
            </div>

        </div>
    )
}