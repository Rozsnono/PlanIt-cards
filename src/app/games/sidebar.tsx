import Icon from "@/assets/icons";

export default function RightSideBar({ children, title, open, onClose }: Readonly<{ children: React.ReactNode, title?: string, open: boolean, onClose: () => void }>) {

    
    return (
        <main className={`w-[40rem] h-screen bg-zinc-900 p-4 rounded-lg fixed ${open ? 'right-0' : 'right-[-40rem]'} top-0 flex flex-col pt-20 duration-500 z-50`} >
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
    )

}

export function RightSideBarHeader({ onClose }: Readonly<{ onClose: () => void }>) {
    return (
        <button onClick={onClose} className="text-zinc-300 hover:text-white hover:font-bold duration-200 flex items-center gap-1 hover:gap-2">
            <Icon name="arrow-right" size={32}></Icon>
        </button>
    )
}