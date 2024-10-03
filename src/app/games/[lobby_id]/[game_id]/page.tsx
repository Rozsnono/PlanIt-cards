import getCardUrl from "@/contexts/cards.context"
import Image from "next/image"

export default function Game() {

    const cardEnum = ["2","3","4", "5", "6", "7", "8", "9", "t", "j", "q", "k", "a"];

    const cards = new Array(10).fill(0).map((_, i) => `${}`);

    return (
        <main className="flex bg-[#3f3f46c0] w-full min-h-screen rounded-md p-3 relative">

            <main className="bg-green-800 rounded-md w-full relative">

                <div className="flex gap-1 w-full absolute bottom-0 p-2 justify-center">
                    <Image src={"/assets/cards/"+getCardUrl('2c')} width={100} height={100} alt="card"></Image>
                </div>
            </main>

        </main>
    )
}