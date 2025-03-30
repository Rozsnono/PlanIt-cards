import Icon from "@/assets/icons";
import React from "react";
import LobbyInputs from "./lobby.inputs";

enum maxNumber {
    "RUMMY" = 6,
    "UNO" = 8,
    "SOLITAIRE" = 1
}

enum minNumber {
    "RUMMY" = 2,
    "UNO" = 2,
    "SOLITAIRE" = 1
}

export default function LobbySettings({ getForm, save, canEdit, title, cancel, onlyNew, children }: { getForm?: any, save: (e: any) => void, canEdit?: boolean, title: string, cancel?: () => void, onlyNew?: boolean, children?: any }) {

    const [edit, setEdit] = React.useState(false);

    const [form, setForm] = React.useState(getForm || {});

    function settingFormData(e: any) {
        const obj = { [e.target.id]: e.target.checked || e.target.value };
        setForm((prev: any) => ({ ...prev, ...obj }));
    }

    function settingFormDataWithCondition(always: any, maybe: any, condition: boolean) {
        if (condition) {
            const obj = { [always.id]: always.value, [maybe.id]: maybe.value };
            setForm((prev: any) => ({ ...prev, ...obj }));
        } else {
            const obj = { [always.id]: always.value };
            setForm((prev: any) => ({ ...prev, ...obj }));
        }
    }

    function settingForm(id: string, value: any) {
        console.log(id, value);
        if (id === 'cardType') {
            if (value === 'RUMMY') {
                settingFormDataWithCondition({ id: "cardType", value: 'RUMMY' }, { id: "numberOfPlayers", value: 4 }, (parseInt(form['numberOfPlayers']) > 6 || parseInt(form['numberOfPlayers']) < 2));
            } else if (value === 'UNO') {
                settingFormDataWithCondition({ id: "cardType", value: 'UNO' }, { id: "numberOfPlayers", value: 4 }, (parseInt(form['numberOfPlayers']) > 8 || parseInt(form['numberOfPlayers']) < 2));
            } else if(value === 'SOLITAIRE') {
                settingFormDataWithCondition({ id: "cardType", value: 'SOLITAIRE' }, { id: "numberOfPlayers", value: 1 }, true);

            }
        } else if (id === 'numberOfPlayers') {
            settingFormDataWithCondition({ id: "numberOfPlayers", value: value }, { id: "numberOfRobots", value: parseInt(value) - 1 }, parseInt(form['numberOfRobots']) > parseInt(value) - 1);
        } else {
            settingFormData({ target: { id, value } });
        }
    }

    const inputs = [
        { label: "Number of Players", id: "numberOfPlayers", value: form['numberOfPlayers'] || 4, interval: true, min: minNumber[form['cardType'] || 'RUMMY'], max: maxNumber[form['cardType'] || 'RUMMY'], disabled: onlyNew || !edit },
        { label: "Type", id: "cardType", value: form['cardType'] || "RUMMY", buttons: true, buttonLabels: ["RUMMY", "UNO", "SOLITAIRE"], disabled: onlyNew || !edit },
        { label: "Private lobby", id: "privateLobby", value: form['privateLobby'], checkbox: true, disabled: onlyNew || !edit },
        { label: "Lobby password", id: "lobbyCode", value: form['lobbyCode'] || 12345, input: true, inputType: "text", show: form['privateLobby'] === true, disabled: onlyNew || !edit },
        { label: "Unranked", id: "unranked", value: form['unranked'], checkbox: true, disabled: onlyNew || !edit, show: form['cardType'] !== 'SOLITAIRE'  },
        { label: "Fill with Robots", id: "fillWithRobots", value: form['fillWithRobots'], checkbox: true, disabled: onlyNew || !edit || form['cardType'] === 'SOLITAIRE', show: form['cardType'] !== 'SOLITAIRE'  },
        { label: "Number of Robots", id: "numberOfRobots", value: form['numberOfRobots'] || 1, interval: true, min: 1, max: parseInt(form['numberOfPlayers']) - 1, show: form['fillWithRobots'] === true, disabled: onlyNew || !edit },
        { label: "Difficulty", id: "robotsDifficulty", value: form['robotsDifficulty'] || 'EASY', buttons: true, buttonLabels: ["EASY", "MEDIUM", "HARD"], show: form['fillWithRobots'] === true, disabled: true }
    ]

    const inputsNew = [
        { label: "Number of Players", id: "numberOfPlayers", value: form['numberOfPlayers'] || 4, interval: true, min: minNumber[form['cardType'] || 'RUMMY'], max: maxNumber[form['cardType'] || 'RUMMY'] },
        { label: "Type", id: "cardType", value: form['cardType'] || "RUMMY", buttons: true, buttonLabels: ["RUMMY", "UNO", "SOLITAIRE"] },
        { label: "Private lobby", id: "privateLobby", value: form['privateLobby'], checkbox: true },
        { label: "Lobby password", id: "lobbyCode", value: form['lobbyCode'] || 12345, input: true, inputType: "text", show: form['privateLobby'] === true },
        { label: "Unranked", id: "unranked", value: form['unranked'], checkbox: true, show: form['cardType'] !== 'SOLITAIRE'  },
        { label: "Fill with Robots", id: "fillWithRobots", value: form['fillWithRobots'], checkbox: true, show: form['cardType'] !== 'SOLITAIRE' },
        { label: "Number of Robots", id: "numberOfRobots", value: form['numberOfRobots'] || 1, interval: true, min: 1, max: parseInt(form['numberOfPlayers'] || 4) - 1, show: form['fillWithRobots'] === true },
        { label: "Difficulty", id: "robotsDifficulty", value: form['robotsDifficulty'] || 'EASY', buttons: true, buttonLabels: ["EASY", "MEDIUM", "HARD"], show: form['fillWithRobots'] === true }
    ]

    if (onlyNew) {
        return (
            <React.Fragment>
                <div className="flex w-full justify-between items-center pb-4">
                    <div></div>
                    <div className="text-2xl">{title}</div>
                    <div>
                        {children}
                    </div>
                </div>

                <hr />

                <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-14 h-full select-none">


                    <div className="flex flex-col gap-6 ">
                        {
                            inputsNew.map((input, index) => (
                                <LobbyInputs key={index}
                                    label={input.label} value={input.value}
                                    id={input.id} onClick={(e) => { settingForm(input.id, e) }}
                                    checkbox={input.checkbox} interval={input.interval}
                                    max={input.max as number} buttons={input.buttons}
                                    min={input.min as number}
                                    buttonLabels={input.buttonLabels} input={input.input}
                                    inputType={input.inputType as any} show={input.show}
                                />
                            ))
                        }
                    </div>

                    <div className="flex gap-2 px-4 mb-3 justify-center" >
                        <button onClick={() => { save(form) }} className="bg-sky-700 text-white p-2 px-5 rounded-md hover:bg-sky-600 flex items-center gap-1">
                            <Icon name="join"></Icon>
                            Create
                        </button>
                    </div>

                </div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <div className="flex w-full justify-between items-center pb-4">
                <div></div>
                <div className="text-2xl">{title}</div>
                {canEdit && false ?
                    <div className="cursor-pointer" onClick={() => { setEdit(!edit); }}>
                        {
                            edit ?
                                <Icon name="close" size={24}></Icon>
                                :
                                <Icon name="pen" size={24}></Icon>

                        }
                    </div> : <div></div>
                }
            </div>

            <hr />

            <div className="relative text-zinc-200 px-4 py-4 flex flex-col gap-14 h-full select-none">
                <div className="flex flex-col gap-6 ">
                    {
                        inputs.map((input, index) => (
                            <LobbyInputs key={index}
                                label={input.label} value={input.value}
                                id={input.id} onClick={(e) => { settingForm(input.id, e) }}
                                checkbox={input.checkbox} interval={input.interval}
                                max={input.max as number} buttons={input.buttons}
                                min={input.min as number} disabled={input.disabled}
                                buttonLabels={input.buttonLabels} input={input.input}
                                inputType={input.inputType as any} show={input.show}
                            />
                        ))
                    }
                </div>

                {/* <div className="flex flex-col gap-6 ">


                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Number of Players</div>


                        <div className="relative w-full">
                            <label htmlFor="numberOfPlayers" className="sr-only">Number of users</label>
                            <input disabled={!edit} onChange={(e) => {
                                settingFormDataWithCondition({ id: "numberOfPlayers", value: e.target.value }, { id: "numberOfRobots", value: parseInt(e.target.value) - 1 }, parseInt(form['numberOfRobots']) > parseInt(form['numberOfPlayers']) - 1);
                            }} value={form['numberOfPlayers']} id="numberOfPlayers" type="range" min="2" max={maxNumber[form['cardType']]} className="w-full h-2 bg-zinc-600 rounded-lg appearance-none disabled:cursor-default cursor-pointer" />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Min 2</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{form['numberOfPlayers']}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Max {maxNumber[form['cardType']]}</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Type</div>

                        <div className="w-full flex items-center">
                            <button
                                onClick={() => {
                                    settingFormDataWithCondition({ id: "cardType", value: 'RUMMY' }, { id: "numberOfPlayers", value: 4 }, parseInt(form['numberOfPlayers']) > 6);
                                }} disabled={!edit} type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-s-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${form["cardType"] === 'RUMMY' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                RUMMY
                            </button>
                            <button
                                onClick={() => {
                                    settingFormDataWithCondition({ id: "cardType", value: 'UNO' }, { id: "numberOfPlayers", value: 4 }, parseInt(form['numberOfPlayers']) > 8);
                                }} disabled={!edit} type="button" className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-e-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${form["cardType"] === 'UNO' ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
                                UNO
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center justify-between w-full">
                        <div className="text-md w-1/3">Private lobby</div>

                        <div className="flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" className="sr-only peer disabled:cursor-default " id="privateLobby" onChange={settingFormData} checked={form['privateLobby'] === true} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    {
                        form['privateLobby'] === true &&
                        <div className="flex gap-2 text-zinc-200 items-center">
                            <div className="text-md w-1/3">Lobby password</div>

                            <div className="w-full flex items-center">

                                <input disabled={!edit} type="text" id="lobbyCode" onChange={settingFormData} value={form['lobbyCode'] === null ? "" : form['lobbyCode']} className=" disabled:cursor-default bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />

                            </div>
                        </div>
                    }

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Unranked</div>

                        <div className="w-full flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" value="" className="sr-only peer" id="unranked" onChange={settingFormData} checked={form['unranked'] === true} />
                                <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>

                        </div>
                    </div>

                    <div className="flex gap-2 text-zinc-200 items-center">
                        <div className="text-md w-1/3">Fill with Robots</div>

                        <div className="w-full flex items-center">

                            <label className={`inline-flex items-center ${edit ? "cursor-pointer" : ""}`}>
                                <input disabled={!edit} type="checkbox" value="" className="sr-only peer" id="fillWithRobots" onChange={settingFormData} checked={form['fillWithRobots'] === true} />
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
                                <input disabled={!edit} id="numberOfRobots" onChange={settingFormData} value={form['numberOfRobots']} type="range" min={1} max={form['numberOfPlayers'] - 1} className="w-full disabled:cursor-default h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Min 1</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{form['numberOfRobots']}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Max {form['numberOfPlayers'] - 1}</span>
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


                </div> */}

            </div>

            {edit &&
                <div className="flex gap-2 px-4 mb-3 justify-center" >
                    <button onClick={() => { save(form) }} className="bg-green-700 text-white p-2 px-5 rounded-md hover:bg-green-600 flex items-center gap-1">
                        <Icon name="pen"></Icon>
                        Save
                    </button>
                </div>
            }
        </React.Fragment>
    )
}