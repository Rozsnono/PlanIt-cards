import Icon from '@/assets/icons'
import { MenuContext } from '@/contexts/menu.context';
import Image from 'next/image'
import Link from 'next/link';
import { useContext } from 'react';
import { FilterModal } from './filter.modal';
import { UserContext } from '@/contexts/user.context';
import React from 'react';

export default function Navbar() {

    const { user } = useContext(UserContext);
    const { isOpen, setOpen } = useContext(MenuContext);

    return (
        <main className="fixed top-0 left-0 w-screen bg-zinc-900 border-b border-zinc-400 z-50 select-none z-[100]" >
            <div className="flex justify-between items-center p-4 pe-8 ps-4">
                <div className="flex items-center justify-center gap-4 text-zinc-100">
                    <div className='cursor-pointer' onClick={() => { setOpen(!isOpen) }}>
                        <Icon name='menu' size={24}></Icon>
                    </div>

                    <Image src={"/assets/logo.png"} alt='Logo' width={120} height={100}></Image>
                </div>
                <UserHeader isLogged={!!user}></UserHeader>
            </div>
        </main>
    )
}


function UserHeader({ isLogged }: { isLogged: boolean }) {

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
                <div className='min-h-8 min-w-8 rounded-full flex items-center justify-center bg-red-600 opacity-70 group-hover:opacity-100 text-zinc-100 duration-100 '>RN</div>
                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white duration-100 cursor-pointer">
                    <div className="text-lg ">Rozs Norbert</div>
                    <Icon name='arrow-down'></Icon>
                </div>

            </button>

            <FilterModal className="top-16 right-6 border border-zinc-600 rounded-lg">
                <div className="flex items-center flex-col gap-2 w-48">
                    <Link href={"/profile"} className='w-full'><button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-400 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"> <Icon name="user" size={16}></Icon> Your profile</button></Link>
                    <Link href={"/settings"} className='w-full'><button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-400 w-full rounded-lg p-2 more-modal-input text-left flex gap-1 items-center"> <Icon name="settings" size={16}></Icon> Settings</button></Link>
                </div>
                <button className="text-zinc-300 bg-zinc-900 hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="sign-out" size={16}></Icon> Sign out</button>
            </FilterModal>
        </React.Fragment>
    )
}