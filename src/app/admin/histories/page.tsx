"use client";
import { AdminService } from "@/services/admin.service";

export default function AdminHistoriesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold text-zinc-200 mb-4">Game Histories</h1>
            <p className="text-zinc-400">This page is under construction. Stay tuned for updates!</p>
            <div className="mt-4">
                <button onClick={() => { new AdminService().deleteAllHistories() }} className="p-3 px-5 border bg-zinc-700 text-zinc-100 rounded-lg border-zinc-500 hover:border-zinc-400 hover:bg-zinc-600 duration-200">Erase all histories</button>
            </div>
        </div>
    );
}