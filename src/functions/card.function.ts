import { Icard } from "@/interfaces/interface";

export function sortRummyCards(rummy: Icard[], autoSort?: boolean): Icard[] {
    if(!autoSort) return rummy;
    return rummy.sort((a, b) => {const suit = a.suit.localeCompare(b.suit); return suit === 0 ? a.rank - b.rank : suit;});
}