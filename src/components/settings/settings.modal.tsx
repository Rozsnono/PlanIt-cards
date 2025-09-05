import Icon from "@/assets/icons";
import { ModalClass } from "../filter.modal";
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settings.context";

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { settings, setSettings } = useContext(SettingsContext);
    if (!isOpen) return null;
    const modal = new ModalClass();

    function saveSettings(e: any) {
        // save settings

        e.preventDefault();

        setSettings({
            autoSort: e.target.autoSorting.checked
        })

        onClose();
    }

    return (
        <main className="w-screen h-screen bg-[#00000060] absolute top-0 p-6 z-[1000]">

            <form onSubmit={saveSettings} className={`bg-zinc-900 text-zinc-300 rounded-md p-6 w-96 h-96 flex flex-col gap-2 border border-zinc-600 relative duration-300`}>
                <h1 className="text-xl flex items-center gap-2"> <Icon name="settings"></Icon> Settings</h1>
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="bg-zinc-700 rounded-full p-1 hover:bg-zinc-600 duration-100"><Icon name="close"></Icon></button>
                </div>
                <hr className="w-full" />
                <div className="h-full flex flex-col gap-2 py-4">
                    <div className="flex w-full">
                        <label className="w-full" htmlFor="autoSorting">
                            Auto Sorting
                        </label >
                        <label className={`inline-flex items-center cursor-pointer`}>
                            <input type="checkbox" className="sr-only peer disabled:cursor-default " id="autoSorting" />
                            <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                        </label>
                    </div>


                </div>
                <div className="relative">
                    <button type="button" className="more-modal-button focus:ring-4 focus:ring-gray-600 rounded-lg p-2 px-4 bg-zinc-700 w-full flex items-center gap-1"> <Icon name="user"></Icon> Select profile</button>
                    <modal.SettingsModal className="w-full ">
                        <div className="p-2 hover:bg-zinc-600 rounded-lg cursor-pointer flex items-center gap-1"> <Icon name="user"></Icon> User profile 1</div>
                        <div className="p-2 hover:bg-zinc-600 rounded-lg cursor-pointer flex items-center gap-1"> <Icon name="user"></Icon> User profile 2</div>
                        <div className="p-2 hover:bg-zinc-600 rounded-lg cursor-pointer flex items-center gap-1"> <Icon name="user"></Icon> User profile 3</div>
                    </modal.SettingsModal>

                </div>
                <div className="flex gap-2 justify-between">
                    <button type="submit" className="bg-green-700 text-white p-2 px-4 rounded-md hover:bg-green-600 flex items-center gap-1"> <Icon name="save"></Icon> Save</button>
                    <button type="button" className="bg-sky-700 text-white p-2 px-4 rounded-md hover:bg-sky-600 flex items-center gap-1"> <Icon name="load-cloud"></Icon> Load</button>
                </div>
            </form>

        </main>
    )
}