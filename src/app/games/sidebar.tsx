import Icon from "@/assets/icons";

export default function RightSideBar({ children, title, open, onClose, className }: Readonly<{ children: React.ReactNode, title?: string, open: boolean, onClose: () => void, className?: string }>) {


    return (
        <main className={`w-[40rem] h-screen p-4 rounded-lg fixed ${open ? 'right-0' : 'right-[-40rem]'} top-0 flex flex-col duration-500 z-[1000]`} >
            <main className={"w-full h-full border-2 border-zinc-500 bg-zinc-900 pt-6 flex flex-col p-4 rounded-lg " + className}>
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