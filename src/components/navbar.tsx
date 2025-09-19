import Icon from '@/assets/icons'
import { MenuContext } from '@/contexts/menu.context';
import Image from 'next/image'
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ModalClass } from './filter.modal';
import { UserContext } from '@/contexts/user.context';
import React from 'react';
import { getColorByInitials, getUserInitials, Logout } from '@/functions/user.function';
import { Iplayer } from '@/interfaces/interface';
import { usePathname, useRouter } from 'next/navigation';
import SettingsModal from './settings/settings.modal';
import { ProfileIcon } from '@/assets/profile-pics';
import LobbyService from '@/services/lobby.service';
import ProfileService from '@/services/profile.service';

export default function Navbar({ clear }: { clear?: boolean }) {

    const { user } = useContext(UserContext);

    const path = usePathname();
    const router = useRouter();

    const gameUrls = ['rummy', 'uno', 'solitaire', 'schnapps'];

    const dontShow = ['/login', '/register', '/verify', '/mobile'];




    const [userState, setUserState] = React.useState(false);

    const [u, setU] = useState<Iplayer | null>(user);


    React.useEffect(() => {
        setUserState(true);
        setU(user);
    }, [user]);

    if (dontShow.find((url) => path.includes(url))) {
        return null;
    }

    if (!userState) return (

        <main className="fixed top-3 left-0 w-screen z-[100] max-h-[4.2rem] flex justify-center">
            <main className="xl:w-3/4 w-[90%] rounded-xl bg-gradient-to-l from-purple-500/30 via-zinc-900/30 to-purple-500/30 backdrop-blur-xl border-2 z-50 select-none z-[100] max-h-[4.2rem] relative border-purple-600/50" >
                <div className="flex justify-between items-center p-4 pe-8 ps-4">
                    <div className="flex items-center justify-center gap-4 text-zinc-100 max-h-[4.2rem]">
                        <Image src={"/assets/logo.png"} alt='Logo' width={120} height={100}></Image>
                    </div>
                    <Menus user={null} isLogged={false}></Menus>
                    <div className='w-48 h-8 rounded-lg bg-purple-800/50 animate-pulse'></div>
                </div>
            </main>
        </main>
    );

    if ((gameUrls.find((url) => path.includes(url)) && !path.includes('end'))) {
        return (
            <main className='fixed top-4 left-4 z-[100] opacity-70 '>
                <div className='w-16 h-16 rounded-full flex flex-col justify-start items-center group relative hover:bg-transparent hover:h-96 duration-200'>
                    <div className='w-16 h-16 bg-zinc-900 z-50 p-2 rounded-full flex items-center justify-center border-2 border-zinc-600 '>
                        <Image src={"/assets/icon.png"} alt='Logo' width={120} height={100}></Image>
                    </div>

                    <div className='absolute top-2 group-hover:top-[4.5rem] left-0 w-full flex justify-center duration-200 cursor-pointer'>
                        <Link href={"/"}>
                            <div className='text-zinc-400 hover:text-white w-14 h-8 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-600'>
                                <Icon name='home' size={16}></Icon>
                            </div>
                        </Link>
                    </div>

                    <div className='absolute top-2 group-hover:top-[7rem] left-0 w-full flex justify-center duration-200 cursor-pointer'>
                        <Link href={"/observatory"}>
                            <div className='text-zinc-400 hover:text-white w-14 h-8 rounded-full bg-zinc-800 hover:bg-zinc-600 flex items-center justify-center '>
                                <Icon name='star' size={16} stroke></Icon>
                            </div>
                        </Link>
                    </div>

                    <div className='absolute top-2 group-hover:top-[9.5rem] left-0 w-full flex justify-center duration-200 cursor-pointer'>
                        <Link href={"/games"}>
                            <div className='text-zinc-400 hover:text-white w-14 h-8 rounded-full bg-zinc-800 hover:bg-zinc-600 flex items-center justify-center '>
                                <Icon name='game' size={16} stroke></Icon>
                            </div>
                        </Link>
                    </div>

                    {
                        user!.auth.includes("ADMIN") &&
                        <div className='absolute top-2 group-hover:top-[12rem] left-0 w-full flex justify-center duration-200 cursor-pointer'>
                            <Link href={"/admin"}>
                                <div className='text-zinc-400 hover:text-white w-14 h-8 rounded-full bg-zinc-800 hover:bg-zinc-600 flex items-center justify-center '>
                                    <Icon name='admin' size={16}></Icon>
                                </div>
                            </Link>
                        </div>
                    }


                </div>
            </main>
        )
    }

    return (

        <React.Fragment>

            <main className="fixed top-3 left-0 w-screen z-[100] max-h-[4.2rem] flex justify-center">
                <main className={`xl:w-3/4 w-[90%] rounded-xl bg-gradient-to-l from-purple-500/30 via-zinc-900/30 to-purple-500/30 backdrop-blur-xl border-2 z-50 select-none z-[100] max-h-[4.2rem] relative ${user?.auth.includes('ADMIN') ? 'border-red-600' : 'border-purple-600/50'}`} >
                    <div className="flex justify-between items-center p-4 pe-8 ps-4">
                        <div className="flex items-center justify-center gap-4 text-zinc-100 max-h-[4.2rem]">
                            <Image src={"/assets/logo.png"} alt='Logo' width={120} height={100}></Image>
                        </div>
                        <Menus user={user!} isLogged={!!user}></Menus>
                        <UserHeader isLogged={!!user}></UserHeader>
                    </div>
                </main>

                {
                    u?.gameInvites && u?.gameInvites.length > 0 &&
                    <main className='fixed top-3 right-3 z-[1000]'>
                        <div className='bg-zinc-800/50 backdrop-blur-md border border-purple-600/50 rounded-lg p-4 animate-float-in-l flex items-center justify-between gap-4'>
                            {u?.gameInvites[0].invitedBy?.settings &&
                                <ProfileIcon settings={u!.gameInvites[0].invitedBy!.settings} size={2} className='p-0' />
                            }
                            <div className="flex flex-col items-left text-zinc-300 group-hover:text-white duration-100 cursor-pointer relative">
                                <div className="text-xl font-bold">{u!.gameInvites[0].invitedBy!.username}</div>
                                <div className="text-sm text-zinc-400">{u!.gameInvites[0].gameType} game invite</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => {
                                    new LobbyService().joinLobby(u!.gameInvites[0].gameId, u!.gameInvites[0].lobbyCode as any).then(() => {
                                        router.push(`/games/${u!.gameInvites[0].gameId}`);
                                        router.refresh();
                                    });
                                    new ProfileService().deleteGameInvite(u!.gameInvites[0].gameId);
                                }} className="text-green-500 hover:text-green-400 transition-colors duration-200 hover:scale-110">
                                    <Icon name="check-empty" size={20}></Icon>
                                </button>
                                <button onClick={() => {
                                    new ProfileService().deleteGameInvite(u!.gameInvites[0].gameId);
                                    router.refresh();
                                }} className="text-red-500 hover:text-red-400 transition-colors duration-200 hover:scale-110">
                                    <Icon name="close" size={20}></Icon>
                                </button>
                            </div>
                        </div>
                    </main>
                }
            </main>
        </React.Fragment>

    )
}


function UserHeader({ isLogged }: { isLogged: boolean }) {
    const router = useRouter();

    const { user, setUser } = useContext(UserContext);

    const { isLowModeOn, setLowMode } = useContext(MenuContext);

    const [u, setU] = useState<Iplayer | null>(user);
    useEffect(() => {
        setU(user);
    }, [user]);

    const [settingsOpen, setSettingsOpen] = useState(false);

    const modal = new ModalClass();

    function LogOut() {
        router.replace('/');
        router.refresh();
        Logout();
        setUser(null);
        window.location.reload();
    }

    if (!isLogged && !u) {
        return (
            <div className="flex items-center gap-4 mr-4">
                <Link href={"/login"}><div className="text-zinc-300 text-lg cursor-pointer hover:text-white hover:font-bold duration-100">Log in</div></Link>
                <Link href={"/register"}><div className="text-zinc-300 text-lg cursor-pointer hover:text-white hover:font-bold duration-100">Register</div></Link>
            </div>
        )
    }

    return (
        <React.Fragment>

            <button className='more-modal-button bg-transparent border border-transparent flex items-center gap-2 mr-4 group cursor-pointer '>
                {u?.settings &&
                    <ProfileIcon settings={u!.settings} size={2} className='p-0' />
                }
                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white duration-100 cursor-pointer relative">
                    <div className="text-lg ">{u && u.firstName} {u && u.lastName}</div>
                    <Icon name='arrow-down'></Icon>
                </div>

            </button>

            <modal.FilterModal className="top-[4.3rem] right-6 border border-purple-600/50 rounded-lg">
                <div className="flex items-center flex-col gap-2 ">
                    <Link href={"/profile/" + u?.customId} className='w-full'>
                        <button className="hover:bg-zinc-700/50 text-zinc-300 w-full rounded-lg p-2 pe-16 more-modal-input text-left flex gap-1 items-center">
                            <Icon name="user" size={16} className='text-purple-400'></Icon> Your profile</button></Link>
                    <Link href={"/profile/" + u?.customId + "/friends"} className='w-full'>
                        <button className="hover:bg-zinc-700/50 text-zinc-300 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center relative">
                            <Icon name="users" size={16} className='text-purple-400'></Icon> Friends
                            {
                                u && typeof u!.pendingFriends === "number" && u!.pendingFriends > 0 &&
                                <div className='absolute top-[-0.1rem] right-[-0.1rem] w-2 h-2 bg-red-300 rounded-full animate-ping duration-400'></div>
                            }
                        </button>
                    </Link>
                    <button onClick={() => setLowMode(!isLowModeOn)} className="hover:bg-zinc-700/50 text-zinc-300 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center relative">
                        <Icon name={isLowModeOn ? "check-empty" : "circle"} size={16} className='text-purple-400'></Icon> Low priority mode
                    </button>
                </div>
                <button onClick={LogOut} className="text-red-400 hover:bg-zinc-950/50 rounded-lg flex items-center gap-1 p-2" ><Icon name="sign-out" size={16}></Icon> Sign out</button>
            </modal.FilterModal>
        </React.Fragment>
    )
}


function Menus({ isLogged, user }: { isLogged: boolean, user: any }) {
    const path = usePathname();
    if (!isLogged) {
        return null;
    }


    return (
        <React.Fragment>
            <div className="flex items-center gap-4 mr-4">
                <Link href={"/"}>
                    <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                        <Icon name="home"></Icon>
                        Home
                    </div>
                </Link>
                <Link href={"/observatory"}>
                    <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                        <Icon name="star" stroke></Icon>
                        Observatory
                    </div>
                </Link>
                <Link href={"/games"}>
                    <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                        <Icon name="game" stroke></Icon>
                        Games
                    </div>
                </Link>

                {
                    user &&
                    user!.auth.includes("ADMIN") &&
                    <Link href={"/admin/games"}>
                        <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <Icon name="admin"></Icon>
                            Admin
                        </div>
                    </Link>
                }

                {
                    user &&
                    user!.auth.includes("ADMIN") &&
                    path.includes("admin") &&
                    <React.Fragment>
                        <div className='border-l border-zinc-200 h-6'></div>
                        <Link href={"/admin/players"}>
                            <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                                <Icon name="users"></Icon>
                                Players
                            </div>
                        </Link>
                        <Link href={"/admin/games"}>
                            <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                                <Icon name="game" stroke></Icon>
                                Games
                            </div>
                        </Link>
                        <Link href={"/admin/histories"}>
                            <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                                <Icon name="card" stroke></Icon>
                                Game histories
                            </div>
                        </Link>
                    </React.Fragment>
                }

            </div>
        </React.Fragment>
    )
}