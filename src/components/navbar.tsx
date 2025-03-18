import Icon from '@/assets/icons'
import { MenuContext } from '@/contexts/menu.context';
import Image from 'next/image'
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';
import { FilterModal, ModalClass } from './filter.modal';
import { UserContext } from '@/contexts/user.context';
import React from 'react';
import { getColorByInitials, getUserInitials, Logout } from '@/functions/user.function';
import { Iplayer } from '@/interfaces/interface';
import { useRouter } from 'next/navigation';
import SettingsModal from './settings/settings.modal';

export default function Navbar({ clear }: { clear?: boolean }) {

    const { user } = useContext(UserContext);
    const { isOpen, setOpen } = useContext(MenuContext);


    const [userState, setUserState] = React.useState(false);


    React.useEffect(() => {
        setUserState(true);
    }, [user]);

    if (!userState) return (

        <main className="fixed top-3 left-0 w-screen z-[100] max-h-[4.2rem] flex justify-center">
            <main className="w-3/4 rounded-xl bg-zinc-900 border-2 border-zinc-600 z-50 select-none z-[100] max-h-[4.2rem]" >
                <div className="flex justify-between items-center p-4 pe-8 ps-4">
                    <div className="flex items-center justify-center gap-4 text-zinc-100 max-h-[4.2rem]">
                        <Image src={"/assets/logo.png"} alt='Logo' width={120} height={100}></Image>
                    </div>
                    <Menus user={null} isLogged={!!user}></Menus>
                    <div className='w-48 h-8 rounded-lg bg-zinc-800 animate-pulse'></div>
                </div>
            </main>
        </main>
    );

    if (clear) {
        return (
            <main className='fixed top-4 left-4 z-[100] opacity-70'>
                <div className='w-16 h-16 bg-zinc-900 rounded-full flex justify-center items-center group relative'>
                    <div className='w-full h-full bg-zinc-900 z-50 p-2 rounded-full flex items-center justify-center border-2 border-zinc-600 '>
                        <Image src={"/assets/icon.png"} alt='Logo' width={120} height={100}></Image>
                    </div>

                    <Link href={"/"}>
                        <div className='absolute text-zinc-400 hover:text-white bottom-2 group-hover:-bottom-[2rem] left-3 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center duration-200 cursor-pointer'>
                            <Icon name='home' size={16}></Icon>
                        </div>
                    </Link>

                    <Link href={"/observatory"}>
                        <div className='absolute text-zinc-400 hover:text-white bottom-2 group-hover:-bottom-[4.1rem] left-3 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center duration-200 cursor-pointer'>
                            <Icon name='star' stroke size={16}></Icon>
                        </div>
                    </Link>

                    <Link href={"/games"}>
                        <div className='absolute text-zinc-400 hover:text-white bottom-2 group-hover:-bottom-[6.2rem] left-3 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center duration-200 cursor-pointer'>
                            <Icon name='game' stroke size={16}></Icon>
                        </div>
                    </Link>

                    {
                        user!.auth.includes("ADMIN") &&
                        <Link href={"/admin"}>
                            <div className='absolute text-zinc-400 hover:text-white bottom-2 group-hover:-bottom-[8.3rem] left-3 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center duration-200 cursor-pointer'>
                                <Icon name='admin' size={16}></Icon>
                            </div>
                        </Link>
                    }


                </div>
            </main>
        )
    }

    return (

        <React.Fragment>

            <main className="fixed top-3 left-0 w-screen z-[100] max-h-[4.2rem] flex justify-center">
                <main className="w-3/4 rounded-xl bg-zinc-900 border-2 border-zinc-600 z-50 select-none z-[100] max-h-[4.2rem] relative" >
                    <div className="flex justify-between items-center p-4 pe-8 ps-4">
                        <div className="flex items-center justify-center gap-4 text-zinc-100 max-h-[4.2rem]">
                            <Image src={"/assets/logo.png"} alt='Logo' width={120} height={100}></Image>
                        </div>
                        <Menus user={user!} isLogged={!!user}></Menus>
                        <UserHeader isLogged={!!user} user={user!}></UserHeader>
                    </div>
                </main>
            </main>
        </React.Fragment>

    )
}


function UserHeader({ isLogged, user }: { isLogged: boolean, user: Iplayer }) {
    const router = useRouter();

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
                <div style={{ backgroundColor: getColorByInitials(getUserInitials()).background, color: getColorByInitials(getUserInitials()).text }} className='min-h-8 min-w-8 rounded-full flex items-center justify-center bg-red-600 opacity-70 group-hover:opacity-100 text-zinc-100 duration-100 '>
                    {getUserInitials()}
                </div>
                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white duration-100 cursor-pointer">
                    <div className="text-lg ">{user!.firstName} {user!.lastName}</div>
                    <Icon name='arrow-down'></Icon>
                </div>

            </button>

            <modal.FilterModal className="top-16 right-6 border border-zinc-600 rounded-lg">
                <div className="flex items-center flex-col gap-2 w-48">
                    <Link href={"/profile/" + user?.customId} className='w-full'><button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-400 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"> <Icon name="user" size={16}></Icon> Your profile</button></Link>
                    <Link href={"/profile/" + user?.customId + "/friends"} className='w-full'>
                        <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-400 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center relative">
                            <Icon name="users" size={16}></Icon> Friends
                            {
                                typeof user?.peddingFriends === "number" && user?.peddingFriends > 0 &&
                                <div className='absolute top-[-0.1rem] right-[-0.1rem] w-2 h-2 bg-red-400 rounded-full '></div>
                            }
                        </button>
                    </Link>
                    <button onClick={() => { setSettingsOpen(true) }} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-400 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"> <Icon name="settings" size={16}></Icon> Settings</button>
                </div>
                <button onClick={LogOut} className="text-zinc-300 bg-zinc-900 hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="sign-out" size={16}></Icon> Sign out</button>
            </modal.FilterModal>


            <SettingsModal isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }}>
            </SettingsModal>
        </React.Fragment>
    )
}


function Menus({ isLogged, user }: { isLogged: boolean, user: any }) {
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
                    <Link href={"/admin"}>
                        <div className="text-zinc-300 text-md hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <Icon name="admin"></Icon>
                            Admin
                        </div>
                    </Link>
                }

            </div>
        </React.Fragment>
    )
}