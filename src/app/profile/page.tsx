import Icon from "@/assets/icons";

export default function ProfilePage() {
    return (
        <main className="flex gap-2">
            <main className="w-full"></main>
            <main className="w-1/2 bg-[#3f3f46c0] rounded-md p-3 min-h-screen text-zinc-200">
                <div className="flex gap-2 p-6">
                    <div className="min-w-32 min-h-32 bg-red-600 rounded-full flex items-center justify-center text-2xl">RN</div>
                    <div className="flex flex-col justify-center gap-3">
                        <div className="text-4xl">Rozs Norbert</div>
                        <button className="text-zinc-300 bg-zinc-900 text-sm w-max hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="pen" size={16}></Icon> Edit profile</button>

                    </div>
                </div>
            </main>
        </main>
    )
}