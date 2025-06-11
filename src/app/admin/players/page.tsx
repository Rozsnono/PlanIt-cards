import Icon from "@/assets/icons";

export default function AdminPlayerPage() {
    return (
        <main className="w-full rounded-md p-5 min-h-screen text-zinc-200 relative gap-2">
            <div className="flex justify-between items-center pb-1">
                <div className="text-xl p-2 flex gap-2 items-center">
                    <Icon name="admin" size={24}></Icon>
                    Players
                </div>
            </div>
            <hr />
            <div className={`w-full flex justify-center items-center h-full pt-2`}>
                <p className="text-zinc-400">This page is under construction.</p>
            </div>
        </main>
    );
}