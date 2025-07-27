import Icon from "@/assets/icons";
import React, { useEffect } from "react";
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

export default function LobbySettings({ getForm, save, canEdit, title, cancel, onlyNew, children, justForm, changing }: { getForm?: any, save: (e: any) => void, canEdit?: boolean, title: string, cancel?: () => void, onlyNew?: boolean, children?: any, justForm?: boolean, changing?: (form: any) => void }) {

    const [edit, setEdit] = React.useState(canEdit || false);

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
        if (id === 'cardType') {
            if (value === 'RUMMY') {
                settingFormDataWithCondition({ id: "cardType", value: 'RUMMY' }, { id: "numberOfPlayers", value: 4 }, (parseInt(form['numberOfPlayers']) > 6 || parseInt(form['numberOfPlayers']) < 2));
            } else if (value === 'UNO') {
                settingFormDataWithCondition({ id: "cardType", value: 'UNO' }, { id: "numberOfPlayers", value: 4 }, (parseInt(form['numberOfPlayers']) > 8 || parseInt(form['numberOfPlayers']) < 2));
            } else if (value === 'SOLITAIRE') {
                settingFormDataWithCondition({ id: "cardType", value: 'SOLITAIRE' }, { id: "numberOfPlayers", value: 1 }, true);

            }
        } else if (id === 'numberOfPlayers') {
            settingFormDataWithCondition({ id: "numberOfPlayers", value: value }, { id: "numberOfRobots", value: parseInt(value) - 1 }, parseInt(form['numberOfRobots']) > parseInt(value) - 1);
        } else {
            settingFormData({ target: { id, value } });
        }
    }

    useEffect(() => {
        if (changing) {
            changing(form);
        }
    }, [form]);

    const inputs = [
        { label: "Number of Players", id: "numberOfPlayers", value: form['numberOfPlayers'] || 4, interval: true, min: minNumber[form['cardType'] || 'RUMMY'], max: maxNumber[form['cardType'] || 'RUMMY'], disabled: onlyNew || !edit },
        { label: "Type", id: "cardType", value: form['cardType'] || "RUMMY", buttons: true, buttonLabels: ["RUMMY", "UNO", "SOLITAIRE"], disabled: onlyNew || !edit },
        { label: "Private lobby", id: "privateLobby", value: form['privateLobby'], checkbox: true, disabled: onlyNew || !edit },
        { label: "Lobby password", id: "lobbyCode", value: form['lobbyCode'] || 12345, input: true, inputType: "text", show: form['privateLobby'] === true, disabled: onlyNew || !edit },
        { label: "Unranked", id: "unranked", value: form['unranked'], checkbox: true, disabled: onlyNew || !edit, show: form['cardType'] !== 'SOLITAIRE' },
        { label: "Fill with Robots", id: "fillWithRobots", value: form['fillWithRobots'], checkbox: true, disabled: onlyNew || !edit || form['cardType'] === 'SOLITAIRE', show: form['cardType'] !== 'SOLITAIRE' },
        { label: "Number of Robots", id: "numberOfRobots", value: form['numberOfRobots'] || 1, interval: true, min: 1, max: parseInt(form['numberOfPlayers']) - 1, show: form['fillWithRobots'] === true, disabled: onlyNew || !edit },
        { label: "Difficulty", id: "robotsDifficulty", value: form['robotsDifficulty'] || 'EASY', buttons: true, buttonLabels: ["EASY", "MEDIUM", "HARD"], show: form['fillWithRobots'] === true, disabled: true },
    ]

    const inputsNew = [
        { label: "Number of Players", id: "numberOfPlayers", value: form['numberOfPlayers'] || 4, interval: true, min: minNumber[form['cardType'] || 'RUMMY'], max: maxNumber[form['cardType'] || 'RUMMY'] },
        { label: "Type", id: "cardType", value: form['cardType'] || "RUMMY", buttons: true, buttonLabels: ["RUMMY", "UNO", "SOLITAIRE"] },
        { label: "Private lobby", id: "privateLobby", value: form['privateLobby'], checkbox: true },
        { label: "Lobby password", id: "lobbyCode", value: form['lobbyCode'] || 12345, input: true, inputType: "text", show: form['privateLobby'] === true },
        { label: "Unranked", id: "unranked", value: form['unranked'], checkbox: true, show: form['cardType'] !== 'SOLITAIRE' },
        { label: "Fill with Robots", id: "fillWithRobots", value: form['fillWithRobots'], checkbox: true, show: form['cardType'] !== 'SOLITAIRE' },
        { label: "Number of Robots", id: "numberOfRobots", value: form['numberOfRobots'] || 1, interval: true, min: 1, max: parseInt(form['numberOfPlayers'] || 4) - 1, show: form['fillWithRobots'] === true },
        { label: "Difficulty", id: "robotsDifficulty", value: form['robotsDifficulty'] || 'EASY', buttons: true, buttonLabels: ["EASY", "MEDIUM", "HARD"], show: form['fillWithRobots'] === true },
    ]

    function checkBeforeSave(form: any) {
        if (form['cardType'] === "SOLITAIRE") {
            form['numberOfRobots'] = 0;
            form['fillWithRobots'] = false;
            form['unranked'] = false;
        }
        save(form);
    }

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
                        <button onClick={() => { checkBeforeSave(form) }} className="bg-sky-700 text-white p-2 px-5 rounded-md hover:bg-sky-600 flex items-center gap-1">
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

            {!justForm &&
                <>
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
                </>
            }

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

            </div>
        </React.Fragment>
    )
}