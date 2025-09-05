import { StrokeIcon } from "@/assets/icons";
import Image from "next/image";
export default function PlayCards({ hasImage, hasIcon = true }: { hasImage?: boolean, hasIcon?: boolean }) {
    return (
        <div className="flex flex-col bg-zinc-800 border-b-4 border-b-zinc-900 h-full rounded-lg items-center justify-center hover:bg-zinc-600 cursor-pointer duration-200">
            {
                hasImage &&
                <div className="w-full h-full flex justify-center p-1 select-none">
                    <Image src={"/assets/icon.png"} width={232} height={100} alt="Icon"></Image>
                </div>
            }
            <div className="p-4 px-8 flex gap-3 items-center justify-left">
                {
                    hasIcon &&
                    <div>
                        <StrokeIcon name="game" size={32}></StrokeIcon>
                    </div>
                }
                <div className="text-3xl">Play Rummy</div>
            </div>
        </div>
    )
}