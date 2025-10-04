"use client";
import Icon from "@/assets/icons";
import { ProfileIcon } from "@/assets/profile-pics";
import { UserContext } from "@/contexts/user.context";
import { Logout } from "@/functions/user.function";
import LobbyService from "@/services/lobby.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Mobile() {

    const route = useRouter();
    const { user, setUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);

    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && typeof window !== 'undefined') {
        route.replace("/");
    }

    function LogOut() {
        route.replace('/mobile/login');
        route.refresh();
        Logout();
        setUser(null);
    }

    const [roomCode, setRoomCode] = useState('');


    function joinLobby() {
        if (!roomCode) { return; }
        setIsLoading(true);
        new LobbyService().JoinByRoomCode(parseInt(roomCode)).then((data) => {
            if (data.error) { return; }
            route.replace(`/mobile/games/${data.lobby._id}`);
            route.refresh();
        }).catch((err) => {
            setIsError("Error joining lobby. Please try again.");
            console.error("Error joining lobby:", err);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <main className="top-0 left-0 w-screen h-screen fixed flex lg:items-center md:items-center justify-center">

            <div className="border-purple-800/50 bg-gradient-to-br from-black/50 via-zinc-950/50 to-purple-950/50 border-2 rounded-lg py-10 flex flex-col gap-6 justify-center w-full h-full relative">

                <div className="absolute right-8 top-8 opacity-60">
                    <Image src="/assets/icon.png" width={80} height={80} alt="Icon"></Image>
                </div>

                <div className="flex items-center border-b border-purple-800/50 gap-4 px-10 text-lg my-4 text-zinc-400 ">
                    <div className={`pb-4 border-b border-transparent border-purple-600 text-zinc-100 duration-200 cursor-pointer`}>Join</div>
                </div>
                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 px-10 py-4">
                        <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} type="number" id="username" placeholder="Enter code" className="bg-purple-800/30 text-zinc-200 rounded-lg p-2 text-center" />
                    </div>

                    {isError && <div className="text-red-500 text-center">{isError}</div>}

                    <div className="flex items-center justify-center">
                        <button type="button" onClick={joinLobby} disabled={isLoading} className="flex justify-center items-center gap-2 bg-gradient-to-tl from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-zinc-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-1/2 disabled:bg-blue-900 disabled:text-zinc-400">
                            {isLoading && <span className="animate-spin"><Icon name="loader" size={18}></Icon></span>}
                            Join
                        </button>
                    </div>
                </form>

                <div className="flex justify-center items-center absolute bottom-6 w-full">
                    {
                        user ?
                            <button onClick={LogOut} className='more-modal-button bg-transparent border border-transparent flex items-center gap-2 mr-4 group cursor-pointer '>
                                {user?.settings &&
                                    <ProfileIcon settings={user!.settings} size={2} className='p-0' />
                                }
                                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white duration-100 cursor-pointer relative">
                                    <div className="text-lg ">{user && user.firstName} {user && user.lastName}</div>
                                    <Icon name='close'></Icon>
                                </div>

                            </button>
                            :
                            <div className="flex items-center gap-4 mr-4">
                                <Link href={"/mobile/login"}><div className="text-zinc-300 text-lg cursor-pointer hover:text-white hover:font-bold duration-100">Log in</div></Link>
                            </div>
                    }
                </div>
            </div>


        </main>
    )

    return (
        <main className="w-[100vw] h-[100vh] fixed z-[1000] flex justify-center items-center">
            <div className="text-white text-center flex flex-col gap-6 p-3 h-full">
                <div className="flex justify-center fixed top-16 w-full left-0">
                    <Image src={"/assets/logo.png"} width={300} height={100} alt="Logo"></Image>
                </div>
                <div className="flex items-center justify-center h-full">
                    {
                        user &&
                        <div className="flex flex-col gap-6 items-center justify-center p-8 border border-purple-800/50 bg-purple-900/20 rounded-lg">
                            <div className="text-lg font-bold text-white/80">Room code:</div>
                            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} className=" disabled:cursor-default bg-purple-700/50 border border-purple-500 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-center" placeholder="Enter Code" />
                            <button onClick={joinLobby} className="bg-purple-600 hover:bg-purple-700 duration-200 text-purple-200 font-bold py-2 px-4 rounded-lg w-full flex justify-center items-center gap-2">
                                <Icon name="join" size={20}></Icon>
                                Join
                            </button>
                        </div>
                    }

                </div>

            </div>
        </main>
    )
}