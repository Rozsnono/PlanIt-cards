"use client";
import Icon from "@/assets/icons";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import Pagination from "@/components/pagination";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/loader.component";
import { getRankName } from "@/interfaces/rank.enum";

export default function AdminPlayerPage() {


    const data = useQuery({
        queryKey: ['admin-players'],
        queryFn: async () => {
            return new AdminService().getPlayers(`page=${page.current}&limit=${6}`);
        }
    });

    const [isNew, setIsNew] = useState(false);

    function handleCreatePlayer(form: any) {
        const username = form.username;
        const firstName = form.firstName;
        const lastName = form.lastName;
        const email = form.email;
        const password = form.password;

        if (!username || !firstName || !lastName || !email || !password) {
            alert("All fields are required");
            return;
        }

        const body = {
            username,
            firstName,
            lastName,
            email,
            password
        };

        new AdminService().createPlayer(body).then((response: any) => {
            if (response.error) {
                alert(response.error);
                return;
            }
            alert("Player created successfully");
            data.refetch();
            setIsNew(false);
        });
    }

    function handleDeletePlayer(customId: string) {
        if (confirm("Are you sure you want to delete this player?")) {
            new AdminService().deletePlayer(customId).then((response: any) => {
                if (response.error) {
                    alert(response.error);
                    return;
                }
                alert("Player deleted successfully");
                data.refetch();
            });
        }
    }

    const page = useRef(1);

    return (
        <main className="w-full rounded-md p-5 min-h-screen text-zinc-200 relative gap-2">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Players</h1>
                <button onClick={() => setIsNew(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg">
                    Add player
                </button>
            </div>
            <div className={`w-full flex justify-center items-center h-full pt-2`}>
                {data.isLoading && <Loader />}
                {data.data &&
                    <NewTable players={data.data.data} isLoading={data.isLoading} onDelete={handleDeletePlayer} isNew={isNew} onCreate={handleCreatePlayer} />
                }
            </div>
        </main>
    )

    return (
        <main className="w-full flex rounded-md p-5 h-full text-zinc-200 relative gap-2">

            <div className="w-full flex flex-col gap-2 ">
                {data.isLoading && <div className="flex items-center justify-center h-full"><Icon name="loader" className="animate-spin" /></div>}
                {data.isError && <div className="text-red-500">Error loading players</div>}
                {data.data && data.data.error && <div className="text-red-500">{data.data.error}</div>}
                {data.data && !data.data.error && data.data.data.map((player: any, index: number) => (
                    <div key={index} className="p-3 bg-zinc-800 rounded-md mb-2 hover:bg-zinc-700 transition-colors cursor-pointer flex flex-col gap-1 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="user" size={24} />
                                <span className="font-bold">{player.username}</span>
                            </div>
                            <p className="text-right">Custom ID: {player.customId}</p>
                        </div>
                        <p>{player.firstName} {player.lastName}</p>
                        <p>Email: {player.email}</p>
                        <p>Rank: {player.rank}</p>
                        <div className="absolute bottom-2 right-2 flex gap-1">
                            <Icon name="trash" className="cursor-pointer text-red-500" onClick={() => { handleDeletePlayer(player.customId) }} />
                        </div>

                    </div>
                ))}
                {
                    data.data && !data.data.error &&
                    <Pagination total={data.data.total} page={page.current} setPage={(e) => { page.current = e; data.refetch(); }} />
                }
            </div>
            <form onSubmit={handleCreatePlayer} className="flex flex-col w-1/2 border rounded-lg bg-zinc-800 border-zinc-700 h-fit p-3 gap-6">
                <div className="">
                    <h2 className="text-lg font-bold w-full text-center">New Player</h2>
                </div>

                <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Username" id="username" className="p-2 bg-zinc-900 rounded-md" />
                    <input type="text" placeholder="First Name" id="firstName" className="p-2 bg-zinc-900 rounded-md" />
                    <input type="text" placeholder="Last Name" id="lastName" className="p-2 bg-zinc-900 rounded-md" />
                    <input type="email" placeholder="Email" id="email" className="p-2 bg-zinc-900 rounded-md" />
                    <input type="password" placeholder="Password" id="password" className="p-2 bg-zinc-900 rounded-md" />
                </div>

                <button type="submit" className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 transition-colors">Create Player</button>
            </form>
        </main>
    );
}

export function NewTable({ players, isLoading, onDelete, isNew, onCreate }: { players: any[]; isLoading: boolean; onDelete: (id: string) => void; isNew: boolean; onCreate: (data: any) => void }) {

    // const router = useRouter();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: new Date().toISOString().split('T')[0]
    });

    function onCreating(form: any) {
        onCreate(form);
        setForm({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: new Date().toISOString().split('T')[0]
        });
    }



    if (isLoading) {
        return <div className="w-full flex justify-center items-center h-full pt-2"><Loader /></div>;
    }
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl w-full ">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10">
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Player</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Username</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Email</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Games</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Winrate</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Rank</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Status</th>
                            <th className="text-left py-4 px-6 text-white/90 font-semibold text-sm">Created</th>
                            <th className="text-right py-4 px-6 text-white/90 font-semibold text-sm ">Actions</th>
                        </tr>
                    </thead>
                    <tbody key={'a1'}>
                        {
                            isNew &&
                            <tr key={'new1'} className="border-b border-white/5 hover:bg-white/5 group transition-all duration-300">
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                            <Icon name="add" className="text-purple-800" strokeWidth={2} size={24}></Icon>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} type="text" placeholder="Player FirstName" className="bg-transparent border-b border-white/30 focus:border-white/60 outline-none transition-all duration-200 p-2 w-32" />
                                            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} type="text" placeholder="Player LastName" className="bg-transparent border-b border-white/30 focus:border-white/60 outline-none transition-all duration-200 p-2 w-32" />
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-white font-semibold">
                                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} type="text" placeholder="Player Username" className="bg-transparent border-b border-white/30 focus:border-white/60 outline-none transition-all duration-200 p-2" />
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-white font-semibold">
                                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Player Email" className="bg-transparent border-b border-white/30 focus:border-white/60 outline-none transition-all duration-200 p-2" />
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <span className="text-white font-semibold mr-2">0</span>
                                        <span className="text-white/60 text-sm">games</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <span className="text-white font-semibold mr-1">0</span>
                                        <span className="text-white/60 text-sm">%</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div style={{ color: getRankName(0).color }} className="flex items-center gap-1 text-sm">
                                        <div dangerouslySetInnerHTML={{ __html: getRankName(0).icon }}></div>
                                        {getRankName(0).title}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-sky-500/20 to-sky-500/20 text-sky-200 border border-sky-500/30">
                                        <span className="w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                                        Creating
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-white/60 text-sm">{new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </td>
                                <td className="py-4 px-6 flex items-center justify-end space-x-2">
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {/* <button onClick={() => { router.push('/admin/games/' + game._id) }} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200" title="Configure">
                                                <Icon name="settings"></Icon>
                                            </button> */}

                                        <button onClick={() => { onCreating(form); }} className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200" title="Add">
                                            <Icon name="add"></Icon>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                        {players.length > 0 ? (
                            players.map((player: any, index: number) => (
                                <tr key={player._id} className="border-b border-white/5 hover:bg-white/5 group transition-all duration-300">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                                <Icon name="user" className="text-purple-800" strokeWidth={2} size={24}></Icon>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-semibold">{player.firstName} {player.lastName}</span>
                                                <div className="text-white/60 text-xs">{player.customId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-white font-semibold">{player.username}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-white font-semibold">{player.email}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <span className="text-white font-semibold mr-2">{player.gamesStats.numberOfGames}</span>
                                            <span className="text-white/60 text-sm">games</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <span className="text-white font-semibold mr-1">{player.gamesStats.winRate}</span>
                                            <span className="text-white/60 text-sm">%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div style={{ color: getRankName(player.rank).color }} className="flex items-center gap-1 text-sm">
                                            <div dangerouslySetInnerHTML={{ __html: getRankName(player.rank).icon }}></div>
                                            {getRankName(player.rank).title}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/30">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                            Active
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-white/60 text-sm">{new Date(player.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </td>
                                    <td className="py-4 px-6 flex items-center justify-end space-x-2">
                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {/* <button onClick={() => { router.push('/admin/games/' + game._id) }} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200" title="Configure">
                                                <Icon name="settings"></Icon>
                                            </button> */}

                                            <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200" title="More">
                                                <Icon name="more"></Icon>
                                            </button>

                                            <button onClick={() => onDelete(player.customId)} className="p-2 text-red-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200" title="More">
                                                <Icon name="trash"></Icon>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-16 px-6 text-center">
                                    <div className="text-white/40 mb-2 text-lg">No players created</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}