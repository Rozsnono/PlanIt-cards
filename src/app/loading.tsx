import Icon from "@/assets/icons";

export default function Loading() {
    return (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-zinc-900/40 backdrop-blur-xl z-[100]">
            <div className="flex items-center text-zinc-500 text-[10rem] loader-animation relative">
                <Icon name="loader-1" size={256}></Icon>
            </div>
            <div className="flex items-center text-zinc-400 text-[10rem] loader-animation-2 absolute">
                <Icon name="loader-2" size={340}></Icon>
            </div>
        </div>
    )
}