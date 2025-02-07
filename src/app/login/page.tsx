"use client";
import Icon from "@/assets/icons"
import { UserContext } from "@/contexts/user.context";
import { getUser } from "@/functions/user.function";
import { Login } from "@/services/auth.service";
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function LogIn() {

    const router = useRouter();
    const { setUser } = useContext(UserContext);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        Login(e.target.username.value, e.target.password.value).then((data) => {
            if (data.message) {

                setError(data.message);
                setLoading(false);
                return;
            }
            setUser(getUser());
            router.replace('/');
            router.refresh();
        })

    }

    return (
        <main className="top-0 left-0 w-screen h-screen fixed flex lg:items-center md:items-center justify-center">

            <div className="bg-[#3f3f46f0] rounded-lg py-10 flex flex-col gap-6 justify-center w-[30rem] relative">

                <div className="absolute right-8 top-8 opacity-30">
                    <Image src="/assets/icon.png" width={80} height={80} alt="Icon"></Image>
                </div>

                <div className="flex items-center border-b border-zinc-500 gap-4 px-10 text-lg my-4 text-zinc-400 ">
                    <div className={`pb-4 border-b border-transparent border-zinc-300 text-zinc-100 duration-200 cursor-pointer`}>Log in</div>
                    <Link href={'/register'}>
                        <div className={`pb-4 border-b border-transparent hover:border-zinc-300 hover:text-zinc-100 duration-200 cursor-pointer`}>Register</div>
                    </Link>
                </div>
                <form action="submit" onSubmit={handleSubmit} method="POST" className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 px-10 py-4">
                        <input type="text" id="username" placeholder="Username" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                        <input type="password" id="password" placeholder="Password" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />

                    </div>

                    {error && <div className="text-red-500 text-center">{error}</div>}

                    <div className="flex items-center justify-center">
                        <button type="submit" disabled={loading} className="flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-800 text-zinc-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-1/2 disabled:bg-blue-900 disabled:text-zinc-400">
                            { loading && <span className="animate-spin"><Icon name="loader" size={18}></Icon></span> }
                            Log in
                        </button>
                    </div>
                </form>



                <div className="flex gap-2 items-center justify-center w-full opacity-50">
                    <button className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="google" size={18}></Icon></button>
                    <button className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="facebook" size={18}></Icon></button>
                    <button className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="github" size={18}></Icon></button>
                </div>
            </div>

        </main>
    )
}