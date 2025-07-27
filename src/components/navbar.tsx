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

export default function Navbar({ clear }: { clear?: boolean }) {

    const { user } = useContext(UserContext);
    const { isOpen, setOpen } = useContext(MenuContext);

    const path = usePathname();

    const [userState, setUserState] = React.useState(false);


    React.useEffect(() => {
        setUserState(true);
    }, [user]);

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

    if ((path.includes('rummy') || path.includes('uno') || path.includes('solitaire')) && !path.includes('end')) {
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
            </main>
        </React.Fragment>

    )
}


function UserHeader({ isLogged }: { isLogged: boolean }) {
    const router = useRouter();

    const { user } = useContext(UserContext);

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
        window.location.reload();
    }

    if (!isLogged) {
        return (
            <div className="flex items-center gap-4 mr-4">
                <Link href={"/login"}><div className="text-zinc-300 text-lg cursor-pointer hover:text-white hover:font-bold duration-100">Sign in</div></Link>
                <Link href={"/register"}><div className="text-zinc-300 text-lg cursor-pointer hover:text-white hover:font-bold duration-100">Sign up</div></Link>
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
                    <div className="text-lg ">{u!.firstName} {u!.lastName}</div>
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
                                typeof u!.pendingFriends === "number" && u!.pendingFriends > 0 &&
                                <div className='absolute top-[-0.1rem] right-[-0.1rem] w-2 h-2 bg-red-300 rounded-full animate-ping duration-400'></div>
                            }
                        </button>
                    </Link>
                    {/* <button onClick={() => { setSettingsOpen(true) }} className="hover:bg-zinc-700/50 text-zinc-400 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"> <Icon name="settings" size={16}></Icon> Settings</button> */}
                </div>
                <button onClick={LogOut} className="text-red-400 hover:bg-zinc-950/50 rounded-lg flex items-center gap-1 p-2" ><Icon name="sign-out" size={16}></Icon> Sign out</button>
            </modal.FilterModal>


            <SettingsModal isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }}>
            </SettingsModal>
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