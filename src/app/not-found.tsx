import Icon from "@/assets/icons";

export default function Error(){
    return (
        <main className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center text-zinc-300">
            <div className="flex items-center text-[5rem]">4<Icon name="error" size={64}></Icon>4</div>
            <div className="text-lg">Page not found!</div>
        </main>
    )
}