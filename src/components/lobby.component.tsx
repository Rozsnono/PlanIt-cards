"use client";

import Icon from "@/assets/icons";
import { useState } from "react";

export function LobbyComponent({ form, setFormData, save, canEdit, title, cancel }: { form: any, setFormData: (e: any) => void, save: () => void, canEdit: boolean, title: string, cancel: () => void }) {

    const [edit, setEdit] = useState(false);

    return (
        <main className="lg:w-1/2 w-full min-h-screen bg-[#3f3f46c0] rounded-md flex flex-col p-3 text-zinc-300">

            <div className="flex w-full justify-between items-center pb-4">
                <div></div>
                <div className="text-2xl">{title}</div>
                {canEdit &&
                    <div className="cursor-pointer" onClick={() => { setEdit(!edit); cancel(); }}>
                        {
                            edit ?
                                <Icon name="close" size={24}></Icon>
                                :
                                <Icon name="pen" size={24}></Icon>

                        }
                    </div>
                }
            </div>

            <hr />

            <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-14 h-full select-none">


                <div className="flex flex-col gap-6 ">


                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Number of users</div>


                        <div className="relative w-full">
                            <label htmlFor="numberOfPlayers" className="sr-only">Number of users</label>
                            <input disabled={!edit} onChange={setFormData} value={form['numberOfPlayers']} id="numberOfPlayers" type="range" min="2" max="8" className="w-full h-2 bg-zinc-600 rounded-lg appearance-none disabled:cursor-default cursor-pointer" />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Min 2</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{form['numberOfPlayers']}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Max 8</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Type</div>

                        <div className="w-full flex items-center">
                            <button onClick={() => { setFormData({ target: { id: "cardType", value: "RUMMY" } }) }} disabled={!edit} type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-s-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${form["cardType"] === 'RUMMY' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                RUMMY
                            </button>
                            <button onClick={() => { setFormData({ target: { id: "cardType", value: "UNO" } }) }} disabled={true} type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-e-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${form["cardType"] === 'UNO' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                UNO
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Robber Rummy</div>

                        <div className="w-full flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" className="sr-only peer disabled:cursor-default " id="robberRummy" onChange={setFormData} checked={form['robberRummy'] === true} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        form['robberRummy'] === true &&
                        <div className="flex gap-2 text-zinc-200 items-center italic">
                            <Icon name="info" size={100}></Icon> <span className="text-[.8rem]">Robber Rummy enhances traditional Rummy with several key changes. users can draw any card from the discard pile but must take all cards above it, adding strategic depth. The game continues until a player reaches 500 points, making it more competitive over multiple rounds, unlike classic Rummy, which often ends when a player goes out. Additionally, users can add cards to opponents’ melds, promoting more interaction between users. These elements make Robber Rummy faster-paced and more engaging than its traditional counterpart.</span>
                        </div>
                    }

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Private lobby</div>

                        <div className="w-full flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" className="sr-only peer disabled:cursor-default " id="privateLobby" onChange={setFormData} checked={form['privateLobby'] === true} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        form['privateLobby'] === true &&
                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Lobby password</div>

                            <div className="w-full flex items-center">

                                <input disabled={!edit} type="text" id="lobbyCode" onChange={setFormData} value={form['lobbyCode'] === null ? "" : form['lobbyCode']} className=" disabled:cursor-default bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />

                            </div>
                        </div>
                    }

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Unranked</div>

                        <div className="w-full flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" value="" className="sr-only peer" id="unranked" onChange={setFormData} checked={form['unranked'] === true} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Fill with Robots</div>

                        <div className="w-full flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" value="" className="sr-only peer" id="fillWithRobots" onChange={setFormData} checked={form['fillWithRobots'] === true} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        form['fillWithRobots'] === true &&
                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Number of Robots</div>

                            <div className="relative w-full">
                                <label htmlFor="numberOfRobots" className="sr-only">Labels range</label>
                                <input disabled={!edit} id="numberOfRobots" onChange={setFormData} value={form['numberOfRobots']} type="range" min={1} max={form['numberOfPlayers']} className="w-full disabled:cursor-default h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Min 1</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{form['numberOfRobots']}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Max {form['numberOfPlayers']}</span>
                                </div>
                            </div>
                        </div>
                    }


                    {
                        edit &&
                        <div className="flex w-full justify-center">
                            <button onClick={save} className="bg-emerald-600 w-1/2 rounded-lg p-2 px-5 text-zinc-200 font-bold hover:bg-emerald-500 duration-200 focus:ring-2 ">Save</button>
                        </div>
                    }


                </div>

            </div>
        </main>
    )
}