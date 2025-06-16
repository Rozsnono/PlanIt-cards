import Icon from "@/assets/icons";
import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="flex flex-col h-full w-64 bg-zinc-900 text-white rounded-md shadow-lg ring-2 ring-zinc-600">
            <div className="flex items-center justify-center h-16 border-b border-zinc-500">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2 p-4 text-zinc-400">
                    <li>
                        <Link href="/admin" className="flex item-center gap-2 px-4 py-2 rounded hover:text-zinc-100 hover:gap-3 hover:font-bold duration-200"> <Icon name="home" size={24} /> Home</Link>
                    </li>
                    <li>
                        <Link href="/admin/players" className="flex item-center gap-2 px-4 py-2 rounded hover:text-zinc-100 hover:gap-3 hover:font-bold duration-200"> <Icon name="users" size={24} /> Players</Link>
                    </li>
                    <li>
                        <Link href="/admin/lobbies" className="flex item-center gap-2 px-4 py-2 rounded hover:text-zinc-100 hover:gap-3 hover:font-bold duration-200"> <Icon name="table" size={24} /> Lobbies</Link>
                    </li>
                    <li>
                        <Link href="/admin/games" className="flex item-center gap-2 px-4 py-2 rounded hover:text-zinc-100 hover:gap-3 hover:font-bold duration-200"> <Icon name="game" size={24} stroke/> Games</Link>
                    </li>
                    <li>
                        <Link href="/admin/histories" className="flex item-center gap-2 px-4 py-2 rounded hover:text-zinc-100 hover:gap-3 hover:font-bold duration-200"> <Icon name="card" size={24} stroke /> Game histories</Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
}