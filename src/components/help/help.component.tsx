"use client";
import Icon from "@/assets/icons";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Help() {
    const [helperOpen, setHelperOpen] = useState(false);
    const path = usePathname();

    function getHelperComponent() {
        if (path.includes('rummy')) {
            return <RummyHelper opened={helperOpen} setOpened={setHelperOpen} />;
        } else if (path.includes('uno')) {
            return <UNOHelper opened={helperOpen} setOpened={setHelperOpen} />;
        } else if (path.includes('solitaire')) {
            return <SolitaireHelper opened={helperOpen} setOpened={setHelperOpen} />;
        }
    }

    return (

        <>
            {
                (path.includes('rummy') || path.includes('uno') || path.includes('solitaire') || path.includes('schnapsen')) && !path.includes('end') &&
                <div className="fixed right-4 top-4 z-50">
                    <button onClick={() => { setHelperOpen(!helperOpen) }} className="bg-gradient-to-l from-blue-500 to-sky-500 text-zinc-100 p-2 px-2 rounded-full hover:bg-blue-500 w-12 h-12 duration-200 flex items-center justify-center relative group">
                        <div className="flex items-center justify-center z-50">
                            <Icon name="info" />
                        </div>

                        <div className="absolute h-full top-0 flex items-center">
                            <div className="bg-sky-500 text-sm text-zinc-100 p-1 px-2 rounded-lg duration-200 flex items-center justify-center text-sm group-hover:-translate-x-2/3 -translate-x-1/4 opacity-0 group-hover:opacity-100">
                                Need&nbsp;some&nbsp;help?
                            </div>
                        </div>

                    </button>
                </div>
            }
            {

                helperOpen &&
                <div className="fixed h-full top-0 right-0 bg-gradient-to-b p-2 from-zinc-900/90 to-zinc-700/90 w-[40rem] z-[999] rounded-l-lg ring-2 ring-zinc-500 animate-fade-in-l">
                    {getHelperComponent()}
                </div>
            }
        </>
    )
}

export function RummyHelper({ opened, setOpened }: { opened: boolean, setOpened: (opened: boolean) => void }) {

    if (!opened) return null;

    return (
        <div className={"relative h-full w-full flex flex-col p-4 gap-3"}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-zinc-100 font-semibold">How to play rummy?</h1>
                <button onClick={() => setOpened(!opened)} className="text-zinc-100 hover:text-zinc-300 duration-200">
                    {opened ? <Icon name="close" /> : <Icon name="menu" />}
                </button>
            </div>
            <hr />
            <div className={`flex-1 overflow-y-auto duration-200`}>
                <p className="text-zinc-300 mt-4">
                    Rummy is a card game where the objective is to form sets or sequences of cards. Players draw and discard cards to create valid combinations.
                </p>
                <ul className="list-disc pl-5 mt-2 text-zinc-300">
                    <li>Each player is dealt a hand of cards.</li>
                    <li>Players take turns drawing and discarding cards.</li>
                    <li>Valid combinations include sets (three or four cards of the same rank) and sequences (three or more consecutive cards of the same suit).</li>
                    <li>The game ends when a player forms valid combinations with all their cards.</li>
                </ul>
                <p className="text-zinc-300 mt-4">
                    For more detailed rules, you can refer to the official <a href="https://en.wikipedia.org/wiki/Rummy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Wikipedia page</a>.
                </p>
            </div>
        </div>
    );
}

export function UNOHelper({ opened, setOpened }: { opened: boolean, setOpened: (opened: boolean) => void }) {
    if (!opened) return null;

    return (
        <div className="relative h-full w-full flex flex-col p-4 gap-3">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-zinc-100 font-semibold">How to play UNO?</h1>
                <button onClick={() => setOpened(!opened)} className="text-zinc-100 hover:text-zinc-300 duration-200">
                    {opened ? <Icon name="close" /> : <Icon name="menu" />}
                </button>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto duration-200">
                <p className="text-zinc-300 mt-4">
                    UNO is a fast-paced card game where the goal is to be the first to get rid of all your cards.
                </p>
                <ul className="list-disc pl-5 mt-2 text-zinc-300">
                    <li>Each player is dealt 7 cards at the start.</li>
                    <li>Players take turns matching a card from their hand with the top card of the discard pile by color or number.</li>
                    <li>Special cards (Skip, Reverse, Draw Two, Wild, Wild Draw Four) change the game flow.</li>
                    <li>You must say UNO when you have one card left.</li>
                    <li>The first player to discard all their cards wins the round.</li>
                </ul>
                <p className="text-zinc-300 mt-4">
                    More details can be found on the official <a href="https://en.wikipedia.org/wiki/Uno_(card_game)" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Wikipedia page</a>.
                </p>
            </div>
        </div>
    );
}

export function SolitaireHelper({ opened, setOpened }: { opened: boolean, setOpened: (opened: boolean) => void }) {
    if (!opened) return null;

    return (
        <div className="relative h-full w-full flex flex-col p-4 gap-3">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-zinc-100 font-semibold">How to play Solitaire?</h1>
                <button onClick={() => setOpened(!opened)} className="text-zinc-100 hover:text-zinc-300 duration-200">
                    {opened ? <Icon name="close" /> : <Icon name="menu" />}
                </button>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto duration-200">
                <p className="text-zinc-300 mt-4">
                    Solitaire (also known as Klondike) is a single-player card game where the goal is to build up four foundation piles by suit in ascending order.
                </p>
                <ul className="list-disc pl-5 mt-2 text-zinc-300">
                    <li>Cards are arranged in seven tableau columns, with only the top card face-up.</li>
                    <li>You can move cards between columns in descending order and alternating colors.</li>
                    <li>Empty tableau spaces can be filled with a King.</li>
                    <li>Draw cards from the stock pile to help make moves.</li>
                    <li>Win by moving all cards to the foundation piles in the correct order.</li>
                </ul>
                <p className="text-zinc-300 mt-4">
                    Learn more about the rules on the <a href="https://en.wikipedia.org/wiki/Klondike_(solitaire)" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Wikipedia page</a>.
                </p>
            </div>
        </div>
    );
}

