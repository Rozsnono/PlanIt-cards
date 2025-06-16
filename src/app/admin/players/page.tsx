"use client";
import Icon from "@/assets/icons";
import { useQuery } from "react-query";
import { AdminService } from "@/services/admin.service";
import Pagination from "@/components/pagination";
import { useRef, useState } from "react";

export default function AdminPlayerPage() {


    const data = useQuery('admin-players', ()=>{return new AdminService().getPlayers(`page=${page.current}&limit=${6}`)}, {});

    function handleCreatePlayer(event: any) {
        event.preventDefault();
        const username = event.target.username.value;
        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

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
            event.target.reset();
            data.refetch();
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
                            <Icon name="trash" className="cursor-pointer text-red-500" onClick={()=>{handleDeletePlayer(player.customId)}}/> 
                        </div>

                    </div>
                ))}
                {
                    data.data && !data.data.error &&
                    <Pagination total={data.data.total} page={page.current} setPage={(e)=>{page.current = e; data.refetch();}} />
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