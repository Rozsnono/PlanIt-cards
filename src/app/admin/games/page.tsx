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
            <div className="flex justify-between items-center pb-1">
                <div className="text-xl p-2 flex gap-2 items-center">
                    <Icon name="admin" size={24}></Icon>
                    Games
                </div>
            </div>
            <hr />
            <div className={`w-full flex justify-center items-center h-full pt-2`}>
                {/* <Table data={data.data} isLoading={data.isLoading} /> */}
            </div>
        </main>
    );
}

// export function Table({ data, isLoading, isError }: { data?: any[], isLoading?: boolean, isError?: boolean }) {

//     const router = useRouter();

//     if (isLoading) {
//         return <div className="w-full flex justify-center items-center h-full pt-2"><Loader /></div>;
//     }
//     return (
//         <table className="w-full text-left">
//             <thead className="border-b border-zinc-200">
//                 <tr>
//                     <th className="py-3">
//                         <Icon name="" size={16} />
//                     </th>
//                     <th className="">
//                         <div className="w-full flex items-center gap-2 text-center border-r border-l ps-1 border-zinc-200">
//                             <Icon name="game" size={16} stroke />
//                             Game ID
//                         </div>
//                     </th>
//                     <th className="">
//                         <div className="w-full flex items-center gap-2 text-center border-r border-zinc-200">
//                             <Icon name="card" size={16} stroke />
//                             Type
//                         </div>
//                     </th>
//                     <th className="">
//                         <div className="w-full flex items-center gap-2 text-center border-r border-zinc-200">
//                             <Icon name="users" size={16} />
//                             Number of players
//                         </div>
//                     </th>
//                     <th className="">
//                         <div className="w-full flex items-center gap-2 text-center border-r border-zinc-200">
//                             <Icon name="user" size={16} />
//                             Created by
//                         </div>
//                     </th>
//                     <th className="">
//                         <div className="w-full flex items-center gap-2 text-center border-r border-zinc-200">
//                             <Icon name="calendar" size={16} />
//                             Created at
//                         </div>
//                     </th>
//                     <th className="">
//                         <div className="w-full flex items-center justify-center gap-2 text-center">
//                             Actions
//                         </div>
//                     </th>
//                 </tr>
//             </thead>
            
//             <tbody>
//                 {
//                     data && data.map((game: any, index: number) => (
//                         <React.Fragment key={game._id}>
//                             <tr className="hover:bg-zinc-800 duration-200 transition-all">
//                                 <td className="p-2">{index + 1}</td>
//                                 <td className="p-2">{game.game_id._id}</td>
//                                 <td className="p-2">{game.settings.cardType}</td>
//                                 <td className="p-2">{game.users.length + game.bots.length}</td>
//                                 <td className="p-2">{game.createdBy.username}</td>
//                                 <td className="p-2">{new Date(game.createdAt).toLocaleString()}</td>
//                                 <td className="p-2">
//                                     <div onClick={() => { router.push('/admin/games/' + game._id) }} className="text-zinc-200 p-2 px-4 rounded-md bg-zinc-900 hover:bg-blue-800 focus:bg-zinc-800 flex justify-center items-center gap-1 cursor-pointer duration-200 transition-all">
//                                         <Icon name="search"></Icon>
//                                     </div>
//                                 </td>
//                             </tr>
//                         </React.Fragment>
//                     ))
//                 }
//                 {/* Rows will be populated here */}
//             </tbody>
//         </table>
//     )
// }