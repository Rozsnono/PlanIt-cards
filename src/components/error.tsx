import Icon from "@/assets/icons";

export default function ErrorPage() {
    return (
        <main className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center text-zinc-300 select-none gap-2">
            <div className="flex items-center text-[5rem]">4<Icon name="error" size={64}></Icon>4</div>
            <div className="text-4xl">Page not found!</div>
            <div className="text-center text-xs">
                <div className="">Please check the URL and try again.</div>
                <div className="">If you think this is a mistake, please contact support.</div>
            </div>
        </main>
    )
}