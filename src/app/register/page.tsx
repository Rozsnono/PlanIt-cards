"use client";
import Icon from "@/assets/icons"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";


export default function Register() {


    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    })

    function settingFormData(data: any, key: string) {
        setFormData({
            ...formData,
            [key]: data
        })
    }

    async function formAction(e: any) {
        console.log(formData)
    }

    return (
        <main className="top-0 left-0 w-screen h-screen fixed flex lg:items-center md:items-center justify-center">

            <form action={formAction} className="bg-[#3f3f46f0] rounded-lg py-10 flex flex-col gap-6 justify-center w-[30rem] relative">

                <div className="absolute right-8 top-8 opacity-30">
                    <Image src="/assets/icon.png" width={80} height={80} alt="Icon"></Image>
                </div>

                <div className="flex items-center border-b border-zinc-500 gap-4 px-10 text-lg my-4 text-zinc-400 ">
                    <Link href={'/login'}>
                        <div className={`pb-4 border-b border-transparent hover:border-zinc-300 hover:text-zinc-100 duration-200 cursor-pointer`}>Log in</div>
                    </Link>
                    <div className={`pb-4 border-b border-transparent border-zinc-300 text-zinc-100 duration-200 cursor-pointer`}>Register</div>
                </div>

                <div className="flex flex-col gap-4 px-10 py-4">
                    <input required value={formData.username} onChange={(e)=>{settingFormData(e.target.value, 'username')}} type="text" id="username" placeholder="Username" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required value={formData.name} onChange={(e)=>{settingFormData(e.target.value, 'name')}} type="text" id="name" placeholder="Full name" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required value={formData.email} onChange={(e)=>{settingFormData(e.target.value, 'email')}} type="email" id="email" placeholder="Email" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required value={formData.password} onChange={(e)=>{settingFormData(e.target.value, 'password')}} type="password" id="password" placeholder="Password" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required value={formData.confirmPassword} onChange={(e)=>{settingFormData(e.target.value, 'confirmPassword')}} type="password" id="confirm-password" placeholder="Confirm password" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <div className="flex">
                        <label onClick={()=>{settingFormData(!formData.terms, 'terms')}} className="hover:bg-zinc-600 rounded-full p-1 text-zinc-400 cursor-pointer " ><Icon name={formData.terms ? 'check': 'circle'} size={18}></Icon></label>
                        <label onClick={()=>{settingFormData(!formData.terms, 'terms')}} className="cursor-pointer text-zinc-400 select-none">Accept terms and conditions</label>
                        <input required checked={formData.terms} onChange={(e)=>{settingFormData(e.target.value, 'terms')}} type="checkbox" id="terms" className="hidden" />
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <button type="submit" className="bg-green-600 text-zinc-200 rounded-lg p-2 w-1/2">Register</button>
                </div>

                <div className="flex gap-2 items-center justify-center w-full opacity-50">
                    <button type="button" className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="google" size={18}></Icon></button>
                    <button type="button" className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="facebook" size={18}></Icon></button>
                    <button type="button" className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="github" size={18}></Icon></button>
                </div>
            </form>

        </main>
    )
}