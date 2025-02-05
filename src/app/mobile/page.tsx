import Icon from "@/assets/icons";

export default function Mobile() {
    return (
        <main className="w-[100vw] h-[100vh] fixed z-[1000] bg-zinc-700 flex justify-center items-center">
            <div className="text-white text-center flex flex-col gap-3 p-3">

                <div className="mobile flex justify-center relative">
                    <div className="rounded-md overflow-hidden border border-black h-64 w-32 bg-zinc-900 p-1 z-[100]">
                        <div className="w-full h-full rounded-md bg-zinc-950 flex justify-center items-center text-gray-500">
                            <Icon name="error" size={64}></Icon>
                        </div>
                    </div>
                    <div className="absolute bg-black h-[2.5rem] w-16 ml-[4.3rem] top-12 rounded-[2px]"></div>
                    <div className="absolute bg-black h-[1rem] w-16 ml-[4.3rem] top-[5.8rem] rounded-[2px]"></div>
                </div>

                <div>
                    Oops! The mobile view is not available yet, but we're working on it.
                </div>
                <div className="font-bold">Coming soon! 🚀📱</div>
            </div>
        </main>
    )
}