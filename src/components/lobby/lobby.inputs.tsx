export default function LobbyInputs({ label, id, value, checkbox, buttons, buttonLabels, interval, min, max, input, inputType, disabled, show = true, onClick }: { label?: string, id: string, value: any, checkbox?: boolean, buttons?: boolean, buttonLabels?: string[], interval?: boolean, min?: number, max?: number, input?: boolean, inputType?: "text" | "number" | "tel" | "email", disabled?: boolean, show?: boolean, onClick: (e: any) => void }) {
    if (show === false) return null;

    function GetInputs() {
        if (checkbox) {
            return (
                <div className="w-full flex items-center">

                    <label className={`inline-flex items-center ${disabled ? '' : 'cursor-pointer'}`}>
                        <input type="checkbox" disabled={disabled} className="sr-only peer disabled:cursor-default " id={id} onChange={(e) => { onClick(e.target.checked) }} checked={value} />
                        <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                    </label>

                </div>
            )
        } else if (buttons) {
            return (
                <div className="w-full flex items-center">
                    {
                        buttonLabels?.map((buttonLabel, index) => (
                            <button key={index}
                                onClick={() => {
                                    onClick(buttonLabel);
                                }} type="button" disabled={disabled} className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${value === buttonLabel ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1 disabled:hover:bg-zinc-600 disabled:hover:text-gray-100" : "bg-zinc-800 disabled:hover:bg-transparent disabled:hover:text-zinc-400"}`}>
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
                    <div className="relative flex justify-between items-center">
                        <div className="w-full absolute bg-zinc-600 h-1"></div>
                        {new Array(max).fill(0).slice(min! - 1).map((_, i) => {
                            return (
                                <div key={i} onClick={() => { if(disabled) return; onClick(min! + i) }}  className={"w-3 h-3 rounded-full  duration-200 z-50 " + (!disabled && " cursor-pointer group")}>
                                    {
                                        min! + i === value ?
                                            <div key={i} className="w-3 h-3 rounded-full bg-zinc-200 scale-150 duration-200 flex justify-center items-center cursor-default">
                                                <div className="opacity-100 text-zinc-900 text-[.6rem]">{min! + i}</div>
                                            </div>
                                            :
                                            <div key={i} className="w-3 h-3 rounded-full bg-zinc-400 group-hover:scale-150 group-hover:-translate-y-2 duration-200 flex justify-center items-center">
                                                <div className="group-hover:opacity-100 opacity-0 text-zinc-900 text-[.6rem]">{min! + i}</div>
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
                    <input type={inputType} id={id} disabled={disabled} onChange={(e) => { onClick(e.target.value) }} value={value} className=" disabled:cursor-default bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />
                </div>
            )
        }


    }

    return (
        <div className="flex gap-2 text-zinc-200 items-center ">
            <div className="text-md w-1/3">{label}</div>

            <GetInputs />
        </div>
    )
}