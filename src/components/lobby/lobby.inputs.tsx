export default function LobbyInputs({ label, id, value, checkbox, buttons, buttonLabels, interval, min, max, input, inputType, disabled, show = true, onClick }: { label?: string, id: string, value: any, checkbox?: boolean, buttons?: boolean, buttonLabels?: string[], interval?: boolean, min?: number, max?: number, input?: boolean, inputType?: "text" | "number" | "tel" | "email", disabled?: boolean, show?: boolean, onClick: (e: any) => void }) {
    if (show === false) return null;

    function GetInputs() {
        if (checkbox) {
            return (
                <div className="flex items-center">

                    <label className={`inline-flex items-center ${disabled ? '' : 'cursor-pointer'}`}>
                        <input type="checkbox" disabled={disabled} className="sr-only peer disabled:cursor-default " id={id} onChange={(e) => { onClick(e.target.checked) }} checked={value} />
                        <div className="relative w-11 h-6 bg-purple-700/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>

                </div>
            )
        } else if (buttons) {
            return (
                <div className="w-full flex items-center gap-2">
                    {
                        buttonLabels?.map((buttonLabel, index) => (
                            <button key={index}
                                onClick={() => {
                                    onClick(buttonLabel);
                                }} type="button" disabled={disabled} className={`w-full px-4 py-2 text-sm font-medium border rounded-lg  hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${value === buttonLabel ? "text-zinc-100 bg-purple-500/70 ring-purple-400 ring-1 disabled:hover:bg-purple-500/70 disabled:hover:text-zinc-100" : "text-zinc-400 bg-purple-900/30 border-purple-800/50 disabled:hover:bg-purple-900/30 disabled:hover:text-zinc-400 hover:bg-purple-500/50"}`}>
                                {buttonLabel}
                            </button>
                        ))
                    }
                </div>
            )
        } else if (interval) {
            return (
                <div className="relative w-full">
                    <label htmlFor={id} className="sr-only">{label}</label>
                    <div className="relative flex gap-3 justify-start items-center">
                        {new Array(max).fill(0).slice(min! - 1).map((_, i) => {
                            return (
                                <div key={i} onClick={() => { if (disabled) return; onClick(min! + i) }} className={"w-8 h-8 rounded-full duration-200 z-50 " + (!disabled && " cursor-pointer group")}>
                                    {
                                        min! + i === value ?
                                            <div key={i} className="w-8 h-8 rounded-full bg-purple-400/70 ring ring-purple-400/70 duration-200 flex justify-center items-center cursor-default">
                                                <div className="opacity-100 text-zinc-300 text-[1rem] font-bold">{min! + i}</div>
                                            </div>
                                            :
                                            <div key={i} className="w-8 h-8 rounded-full bg-purple-800/50 ring ring-purple-500/50 group-hover:bg-purple-500/50 duration-200 flex justify-center items-center">
                                                <div className="opacity-100 text-zinc-500 group-hover:text-zinc-200 text-[1rem]">{min! + i}</div>
                                            </div>
                                    }

                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        } else if (input) {
            return (
                <div className="w-full flex items-center">
                    <input type={inputType} id={id} disabled={disabled} onChange={(e) => { onClick(e.target.value) }} value={value} className=" disabled:cursor-default bg-purple-700/50 border border-purple-500 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />
                </div>
            )
        }


    }

    if (checkbox) {
        return (
            <div className="flex text-zinc-200 items-center justify-between w-full">
                <label htmlFor={id} className="text-md cursor-pointer">{label}</label>
                <GetInputs />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full gap-2 text-zinc-200 items-start">
            <div className="text-md">{label}</div>

            <GetInputs />
        </div>
    )
}