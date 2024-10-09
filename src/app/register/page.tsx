"use client";
import Icon from "@/assets/icons"
import { Register } from "@/functions/user.function";
import Image from "next/image"
import Link from "next/link"


export default function RegisterPage() {

    async function formAction(e: any) {

        e.preventDefault();

        const username = e.target.username.value;
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const body = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        
        Register(body);

    }

    return (
        <main className="top-0 left-0 w-screen h-screen fixed flex lg:items-center md:items-center justify-center">

            <form onSubmit={formAction} className="bg-[#3f3f46f0] rounded-lg py-10 flex flex-col gap-6 justify-center w-[30rem] relative">

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
                    <input required type="text" id="username" placeholder="Username" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required type="text" id="firstName" placeholder="First name" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required type="text" id="lastName" placeholder="Last name" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required type="email" id="email" placeholder="Email" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required type="password" id="password" placeholder="Password" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input required type="password" id="confirmPassword" placeholder="Confirm password" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    {/* <div className="flex">
                        <label onClick={() => { settingFormData(!formData.terms, 'terms') }} className="hover:bg-zinc-600 rounded-full p-1 text-zinc-400 cursor-pointer " ><Icon name={formData.terms ? 'check' : 'circle'} size={18}></Icon></label>
                        <label onClick={() => { settingFormData(!formData.terms, 'terms') }} className="cursor-pointer text-zinc-400 select-none">Accept terms and conditions</label>
                        <input required checked={formData.terms} onChange={(e) => { settingFormData(e.target.value, 'terms') }} type="checkbox" id="terms" className="hidden" />
                    </div> */}
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