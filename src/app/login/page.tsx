import Icon from "@/assets/icons"
import Image from "next/image"
import Link from "next/link"

export default function LogIn() {
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

                <div className="flex flex-col gap-4 px-10 py-4">
                    <input type="email" id="email" placeholder="Email" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />
                    <input type="password" id="password" placeholder="Password" className="bg-zinc-600 text-zinc-200 rounded-lg p-2" />

                </div>

                <div className="flex items-center justify-center">
                    <button className="bg-blue-600 text-zinc-200 rounded-lg p-2 w-1/2">Log in</button>
                </div>


                <div className="flex gap-2 items-center justify-center w-full opacity-50">
                    <button className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="google" size={18}></Icon></button>
                    <button className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="facebook" size={18}></Icon></button>
                    <button className="text-zinc-300 hover:bg-zinc-600 rounded-full p-1" ><Icon name="github" size={18}></Icon></button>
                </div>
            </div>

        </main>
    )
}