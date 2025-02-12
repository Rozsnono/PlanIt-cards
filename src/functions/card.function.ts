import { Icard } from "@/interfaces/interface";

export function sortRummyCards(rummy: Icard[], autoSort?: boolean, sortType: "num" | "abc" | "" = "abc"): Icard[] {
    if (sortType == "") return rummy;
    if (!autoSort) if (sortType === "num") return rummy.sort((a, b) => { const rank = a.rank - b.rank; return rank === 0 ? a.suit.localeCompare(b.suit) : rank; });
    return rummy.sort((a, b) => { const suit = a.suit.localeCompare(b.suit); return suit === 0 ? a.rank - b.rank : suit; });
}

export function placeCardToIndex(playerCards: Icard[], index: number, card: Icard): Icard[] {
    playerCards.splice(index + 1, 0, card);
    playerCards.splice(playerCards.indexOf(card), 1);
    return playerCards;
}

export function dropCard(playerCards: Icard[], droppedCard: Icard, droppedCards: Icard[]): { playerCards: Icard[], droppedCards: Icard[] } {
    playerCards.splice(playerCards.indexOf(droppedCard), 1);
    droppedCards.push(droppedCard);
    return { playerCards, droppedCards };
}

export function drawCard(playerCards: Icard[], drawedCard: Icard): Icard[] {
    playerCards.push(drawedCard);
    return playerCards;
}

export function playCard(playerCards: Icard[], playingCards: Icard[]): { playerCards: Icard[], playedCards: Icard[] } {
    playerCards = playerCards.filter(card => {return !playingCards.find(pCard => { return pCard.rank === card.rank && pCard.suit === card.suit && pCard.pack === card.pack })});
    playingCards = playingCards.sort((a, b) => a.rank - b.rank); 
    return { playerCards, playedCards: playingCards };
}