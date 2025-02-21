import Icon from "@/assets/icons";

export default function Help({ onClose }: { onClose?: () => void }) {
    return (
        <main className="flex gap-2 fixed left-0 top-16 p-4 w-full">
            <main className="w-full bg-[#3f3f46f0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="flex gap-2 justify-between w-full">
                    <div className="text-xl p-2">What the Rummy is?</div>
                    <div className="flex pt-1 cursor-pointer" onClick={onClose}>
                        <Icon name="close" size={24}></Icon>
                    </div>
                </div>
                <hr />
                <main className="w-full grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2 p-3">
                    ...
                </main>
            </main>
        </main>
    )
}