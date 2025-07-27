"use client";
import Icon from "@/assets/icons";
import Loader from "@/components/loader.component";
import { UserContext } from "@/contexts/user.context";
import { AdminService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";

export default function AdminGamesPage() {

    const { user } = useContext(UserContext);
    const adminService = new AdminService();

    const router = useRouter();

    // if(!user?.auth.includes('ADMIN')) {router.back(); return <></>}

    const data = useQuery('users', async () => { return adminService.getAllGames() });

    return (
        <main className="w-full rounded-md p-5 min-h-screen text-zinc-200 relative gap-2">
            <div className={`w-full flex justify-center items-center h-full pt-2`}>
                {data.data &&
                    <NewTable games={data.data} isLoading={data.isLoading} />
                }
            </div>
        </main>
    );
}
export function NewTable({ games, isLoading }: { games: any[]; isLoading: boolean }) {

    const router = useRouter();
    if (isLoading) {
        return <div className="w-full flex justify-center items-center h-full pt-2"><Loader /></div>;
    }
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl w-full ">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10">
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Game</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Type</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Players</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Status</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Created</th>
                            <th className="text-right py-4 px-6 text-white/90 font-semibold text-sm ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.length > 0 ? (
                            games.map((game: any, index: number) => (
                                <tr key={game._id} className="border-b border-white/5 hover:bg-white/5 group transition-all duration-300">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                                <Icon name="game" stroke className="text-purple-800" strokeWidth={2} size={24}></Icon>
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">{game._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-200 border border-violet-500/30">
                                            {game.secretSettings.gameType}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <span className="text-white font-semibold mr-2">{Object.keys(game.playerCards).length}</span>
                                            <span className="text-white/60 text-sm">players</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/30">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                            Active
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-white/60 text-sm">{new Date(game.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </td>
                                    <td className="py-4 px-6 flex items-center justify-end space-x-2">
                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button onClick={() => { router.push('/admin/games/' + game._id) }} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200" title="Configure">
                                                <Icon name="settings"></Icon>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200" title="More">
                                                <Icon name="more"></Icon>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-16 px-6 text-center">
                                    <div className="text-white/40 mb-2 text-lg">No games created</div>
                                    <div className="text-white/30 text-sm">Create your first game to get started</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}