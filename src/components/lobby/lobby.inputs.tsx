export default function LobbyInputs({ label, id, value, checkbox, buttons, buttonLabels, interval, min, max, input, inputType, disabled, show = true, onClick }: { label?: string, id: string, value: any, checkbox?: boolean, buttons?: boolean, buttonLabels?: string[], interval?: boolean, min?: number, max?: number, input?: boolean, inputType?: "text" | "number" | "tel" | "email", disabled?: boolean, show?: boolean, onClick: (e: any) => void }) {
    if (show === false) return null;

    function GetInputs() {
        if (checkbox) {
            return (
                <div className="w-full flex items-center">

                    <label className={`inline-flex items-center cursor-pointer`}>
                        <input type="checkbox" disabled={disabled} className="sr-only peer disabled:cursor-default " id={id} onChange={(e)=>{onClick(e.target.checked)}} checked={value} />
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
                                }} type="button" disabled={disabled} className={`w-full px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-lg hover:bg-zinc-700 hover:text-gray-200 focus:z-10 focus:ring-2 focus:ring-gray-500 disabled:cursor-default focus:text-gray-100 ${value === buttonLabel ? "text-gray-100 bg-zinc-600 ring-gray-500 ring-1" : "bg-zinc-800"}`}>
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
                    <input disabled={disabled} onChange={(e)=>{onClick(e.target.value)}} value={value} id={id} type="range" min={min} max={max} className="w-full h-2 bg-zinc-600 rounded-lg appearance-none disabled:cursor-default cursor-pointer" />
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Min {min}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Max {max}</span>
                    </div>
                </div>
            )
        } else if (input) {
            return (
                <div className="w-full flex items-center">
                    <input type={inputType} id={id} disabled={disabled} onChange={(e)=>{onClick(e.target.value)}} value={value} className=" disabled:cursor-default bg-zinc-700 border border-zinc-900 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="12345" />
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