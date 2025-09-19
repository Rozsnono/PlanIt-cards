import Icon from "@/assets/icons";

export default function RightSideBar({ children, title, open, onClose, className }: Readonly<{ children: React.ReactNode, title?: string, open: boolean, onClose: () => void, className?: string }>) {


    return (
        <main className={`w-[35rem] h-screen rounded-lg fixed ${open ? 'right-0' : 'right-[-40rem]'} top-0 flex flex-col duration-500 z-[1000] bg-zinc-900`} >
            <main className={"w-full h-full border-2 border-purple-500/40 bg-gradient-to-br from-purple-700/20 to-indigo-800/20 pt-6 flex flex-col p-4 rounded-lg " + className}>
                {
                    title &&
                    <div className="w-full flex justify-between items-center">
                        <div className="text-lg font-bold ps-4">{title}</div>
                        <button onClick={onClose} className="text-zinc-300 hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
                            <Icon name="arrow-right" size={32}></Icon>
                        </button>
                    </div>
                }
                <div className="w-full h-full">
                    {children}
                </div>
            </main>

        </main>
    )

}

export function RightSideBarHeader({ onClose }: Readonly<{ onClose: () => void }>) {
    return (
        <button onClick={onClose} className="text-zinc-300 hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
            <Icon name="arrow-right" size={32}></Icon>
        </button>
    )
}