import Icon from "@/assets/icons";

export default function Loading(){
    return (
        <main className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center text-zinc-300">
            <div className="flex items-center text-gray-100 text-[5rem] animate-spin"><Icon name="loader" size={64}></Icon></div>
        </main>
    )
}