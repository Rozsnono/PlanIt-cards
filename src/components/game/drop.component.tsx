import Icon from "@/assets/icons"
import { UserContext } from "@/contexts/user.context";
import { useContext } from "react";

export default function DropComponent({ isDropable, onDrop }: { isDropable: boolean, onDrop: () => void }) {

    const { user } = useContext(UserContext);

    if (isDropable) {
        return <div onClick={onDrop} className="absolute right-32 bottom-4">
            <div className="w-[3rem] h-[3rem] lg:w-[4.5rem] lg:h-[4.5rem] bg-green-800 rounded-full border-2 hover:border-4 flex items-center justify-center text-zinc-200 border-sky-300 text-xl cursor-pointer group duration-100">
                <span className="group-hover:opacity-100 opacity-100 duration-100">
                    <Icon name="drop" size={44} className="lg:flex hidden"></Icon>
                    <Icon name="drop" size={22} className="lg:hidden flex"></Icon>
                </span>
            </div>
        </div>
    }

    return <></>
}