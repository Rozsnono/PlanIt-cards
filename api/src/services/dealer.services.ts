import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import { Icard } from "../interfaces/interface";

const UnoRank = {
    18: "Double",
    16: "Skip",
    15: "Reverse",
    20: "Wild",
    21: "Wild",
    23: "Wild Draw Four",
    24: "Wild Draw Four"
}

export default class CardDealer {

    private cards;

    public deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>;

    constructor(
        cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>
    ) {
        this.cards = cards;
        this.deck = cards;
    }

    public shuffleDeck(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> = this.cards): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        let currentIndex = deck.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        this.deck = deck;
        return deck;
    }

    public dealCards(users: mongoose.Types.ObjectId[] | string[], numberOfCards?: number, firstOneDraws: boolean = true): { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> } {
        const playerCards: { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> } = {};
        const NoC = numberOfCards || 10;
        const numberOfPlayers = users.length;
        for (let i = 0; i < numberOfPlayers; i++) {
            playerCards[users[i].toString()] = [];
        }
        let playerIndex = 0;
        while (playerIndex < numberOfPlayers) {
            playerCards[users[playerIndex].toString()] = this.getCards(playerIndex === 0 && firstOneDraws ? NoC + 1 : NoC);
            playerIndex++;
        }
        return playerCards;
    }

    private getCards(numberOfCards: number = 10) {
        const cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> = [];

        for (let i = 0; i < numberOfCards; i++) {
            cards.push(this.deck.pop()!);
        }
        return cards;
    }

    public drawCard(numberOfCards: number): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        const removedCards = this.deck.splice(-numberOfCards, numberOfCards);
        return removedCards;
    }

    public firstCard(): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        const removedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> = [];
        do {
            removedCards.push(this.deck.splice(-1, 1) as any);
        } while (removedCards[removedCards.length - 1].value > 9)

        return removedCards;

    }

    public validateDrop(droppedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>, droppedCard: { name: string, rank: number, suit: string, isJoker?: boolean, pack: number }): boolean {
        if (droppedCards.length === 0) {
            return true;
        }
        if (droppedCard.isJoker) {
            return true;
        }
        const isSameRank = droppedCards.every(card => card.rank === droppedCard.rank);
        const isSameSuit = droppedCards.every(card => card.suit === droppedCard.suit);
        return isSameRank || isSameSuit;
    }


}

export class UnoDealer extends CardDealer {
    constructor(cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>) {
        super(cards);
    }

    public reShuffleDeck(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        let currentIndex = deck.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        this.deck = deck;
        return deck;
    }

    public validateDrop(droppedCards: Array<{ name: string; rank: number; suit: string; isJoker?: boolean; pack: number; value: number; }>, droppedCard: { name: string; rank: number; suit: string; isJoker?: boolean; pack: number; }): boolean {
        if (droppedCards.length === 0) {
            return true;
        }
        if (droppedCard.isJoker) {
            return true;
        }
        const isSameRank = droppedCards[droppedCards.length - 1].rank === droppedCard.rank;
        const isSameSuit = droppedCards[droppedCards.length - 1].suit === droppedCard.suit;
        return isSameRank || isSameSuit;
    }

    public validStartCard(): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        const removedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> = [];
        let card: { name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number };
        do {
            card = this.deck.pop()!;
            removedCards.push(card);
        } while (card.rank > 10 || card.isJoker)


        return removedCards;
    }

    public reShuffleCards(playedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        this.deck = playedCards.concat(this.deck);
        return this.deck;
    }

}

export class RummyDealer extends CardDealer {
    constructor(cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>) {
        super(cards);
    }

    public chooseTrumpCard(): { suit: string, card: { name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number } } {
        let trumpCard;
        do {
            trumpCard = this.deck[Math.floor(Math.random() * this.deck.length)];
        } while (!trumpCard || trumpCard.isJoker);
        this.deck = this.deck.filter(card => card !== trumpCard);
        if (!trumpCard) throw new Error("No cards left in the deck");
        return { suit: trumpCard.suit, card: trumpCard };
    }

    public validatePlay(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>, playerCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>, puttingCard?: boolean): string {
        if (typeof deck === "undefined") {
            return ERROR.CARD_NOT_FOUND;
        }
        if (!puttingCard && !deck.every(card => playerCards.find(playerCards => JSON.stringify(playerCards) === JSON.stringify(card)))) {
            return ERROR.INVALID_CARD_SELECTED;
        }
        if (deck.length < 3) {
            return ERROR.MIN_3_CARDS;
        }
        if (deck.length > 13) {
            return ERROR.MAX_13_CARDS;
        }

        const isSameRank = this.isValidSet(deck);
        const isValidSequence = this.isValidSequence(deck, false) || this.isValidSequence(deck, true);
        if (isSameRank || isValidSequence) return "Valid";
        return ERROR.INVALID_SEQUENCE;
    }

    private isValidSet(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>): boolean {
        const sortedDeck = [...deck].sort((a, b) => a.rank - b.rank || a.suit.localeCompare(b.suit));
        const sameRankSuits = [sortedDeck[0].suit];
        const isSameRank = sortedDeck.every((card, index) => {
            if (index === 0) return true;
            if (sameRankSuits.includes(card.suit) && !card.isJoker) { return false };
            if (card.rank === sortedDeck[index - 1].rank && !card.isJoker) { sameRankSuits.push(card.suit) }
            return card.rank === sortedDeck[index - 1].rank || card.isJoker;
        });
        return isSameRank;
    }


    private isValidSequence(cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>, aceHigh: boolean): boolean {
        const sortedDeck = [...cards].map(card => ({
            ...card,
            rank: card.rank === 14 ? (aceHigh ? 1 : 14) : card.rank,
        })).sort((a, b) => (a.isJoker ? -1 : b.isJoker ? 1 : a.rank - b.rank));

        const suit = sortedDeck.find(card => !card.isJoker)?.suit;
        const isSameSuit = sortedDeck.every(card => card.isJoker || card.suit === suit);

        if (!isSameSuit) return false;

        let jokerCount = sortedDeck.filter(card => card.isJoker).length;
        let lastRank = null;


        for (const card of sortedDeck) {
            if (card.isJoker) continue;

            if (lastRank !== null) {
                const gap = card.rank - lastRank - 1;

                if (gap > jokerCount) {
                    return false;
                }

                jokerCount -= gap;
            }

            lastRank = card.rank;
        }

        return true;
    }

    public isValidToNext(playedCards: { playedBy: string, cards: any[] }[], playerId: string) {
        if (playedCards.length === 0) return true;
        if (playedCards.filter(cards => cards.playedBy === playerId).length === 0) return true;
        if (playedCards.filter(cards => cards.playedBy === playerId).flatMap(obj => obj.cards).reduce((acc, item) => acc + item.value, 0) < 51) return false;
        return true;
    }

    public cardsToReturn(playedCards: { playedBy: string, cards: any[] }[], playerId: string): any {
        const cards = playedCards.filter(cards => cards.playedBy === playerId);
        if (!cards) return [];
        const cardsToReturn = cards.flatMap(obj => obj.cards);
        const playedCardsToReturn = playedCards.filter(cards => cards.playedBy !== playerId);
        return { cardsToReturn, playedCardsToReturn };
    }

    public rankingMelds(deck: Icard[]): { completedDeck: Icard[] } {
        if (deck.length === 0) return { completedDeck: [] };

        const jokers = deck.filter(card => card.isJoker);
        let nonJokers = deck.filter(card => !card.isJoker);
        nonJokers.sort((a, b) => a.rank - b.rank);
        if (nonJokers[nonJokers.length - 1].rank === 14 && nonJokers[nonJokers.length - 2].rank < 13) {
            nonJokers = nonJokers.map(card => {
                if (card.rank === 14) {
                    return { ...card, rank: 1, value: 1 }; // Convert Ace to 1
                }
                return card;
            });
            nonJokers.sort((a, b) => a.rank - b.rank);
        }

        if (jokers.length === 0) return { completedDeck: nonJokers };

        const completedDeck: Icard[] = [];

        for (let i = 0; i < nonJokers.length; i++) {
            completedDeck.push(nonJokers[i]);

            if (jokers.length > 0 && i < nonJokers.length - 1) {
                let currentRank = nonJokers[i].rank;
                const nextRank = nonJokers[i + 1].rank;

                while (nextRank > currentRank + 1 && jokers.length > 0) {
                    const missingRank = currentRank + 1;
                    const joker = jokers.pop()!;
                    const assignedJoker = { ...joker, rank: missingRank };

                    completedDeck.push(assignedJoker);

                    currentRank++;
                }
            }
        }

        while (jokers.length > 0) {
            completedDeck.push(jokers.pop()!);
        }

        return { completedDeck };
    }


}

export class SolitaireDealer extends CardDealer {
    constructor(cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>) {
        super(cards);
    }

    public dealCard(): Array<{ playedBy: string, cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> }> {
        const playerCards: Array<{ playedBy: string, cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> }> = [];
        for (let i = 0; i < 7; i++) {
            const cards = this.deck.splice(0, i + 1);
            cards[cards.length - 1].isJoker = true;
            playerCards.push({ playedBy: "user", cards: cards });
        }
        return playerCards;
    }

    public validatePlace(placingCards: Icard[], placedCards: Icard[]): boolean {
        if (placedCards.length === 0 && placingCards[0].rank == 13) return true;
        if (placedCards[placedCards.length - 1].rank - 1 !== placingCards[0].rank) return false;
        if (placedCards[placedCards.length - 1].suit === placingCards[0].suit) return false;
        return true;
    }

    public validatePlay(playingCard: Icard, playedCards: Icard[]): boolean {
        if (playedCards.length === 0 && playingCard.rank == 1) return true;
        if (playedCards[playedCards.length - 1].rank + 1 !== playingCard.rank) return false;
        if (playedCards[playedCards.length - 1].suit !== playingCard.suit) return false;
        return true;
    }
}

export class SchnappsDealer extends CardDealer {
    constructor(cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>) {
        super(cards);
    }

    public reShuffleDeck(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        let currentIndex = deck.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        this.deck = deck;
        return deck;
    }

    public validatePlaying(
        droppedCard: Icard,
        droppedCards: Array<Icard>,
        playerCards: Array<Icard>,
        trumpSuit: string,
        actions: number = 1,
        currentTurn: number = 1
    ): boolean {
        if (droppedCards.length === 0) {
            return true;
        }

        const lastDroppedCard = droppedCards.filter((card) => card.suit === droppedCards[0].suit && (droppedCards[0].suit == trumpSuit ? true : card.suit !== trumpSuit)).sort((a, b) => b.rank - a.rank)[0] || droppedCards[0];

        let hasTrump, trumpCard;

        switch (true) {
            case [1, 7].includes(actions):
                hasTrump = droppedCards.find(card => card.suit === trumpSuit) && droppedCards[0].suit !== trumpSuit;
                trumpCard = hasTrump ? droppedCards.sort((a, b) => b.rank - a.rank).find(card => card.suit === trumpSuit)! : null;

                if (droppedCard.suit === lastDroppedCard.suit && hasTrump) {
                    return true;
                }
                if (droppedCard.suit === lastDroppedCard.suit && droppedCard.rank < lastDroppedCard.rank && playerCards.find(card => card.rank > lastDroppedCard.rank && card.suit === droppedCard.suit)) {
                    return false;
                }
                if (droppedCard.suit !== lastDroppedCard.suit && droppedCard.suit !== trumpSuit && playerCards.find(card => card.suit === lastDroppedCard.suit)) {
                    return false;
                }
                if (droppedCard.suit !== lastDroppedCard.suit && droppedCard.suit === trumpSuit && hasTrump && trumpCard && trumpCard.rank > lastDroppedCard.rank && playerCards.find(card => card.suit === trumpCard!.suit && card.rank > trumpCard!.rank)) {
                    return false;
                }
                break;
            case [6].includes(actions):
                if (droppedCard.suit === lastDroppedCard.suit) {
                    return true;
                }
                if (droppedCard.suit === lastDroppedCard.suit && droppedCard.rank < lastDroppedCard.rank && playerCards.find(card => card.rank > lastDroppedCard.rank && card.suit === droppedCard.suit)) {
                    return false;
                }
                if (droppedCard.suit !== lastDroppedCard.suit && droppedCard.suit !== trumpSuit && playerCards.find(card => card.suit === lastDroppedCard.suit)) {
                    return false;
                }
                break;
            case [8].includes(actions):
                if (currentTurn > 2) {
                    if (droppedCard.suit === lastDroppedCard.suit) {
                        return true;
                    }
                    if (droppedCard.suit === lastDroppedCard.suit && droppedCard.rank < lastDroppedCard.rank && playerCards.find(card => card.rank > lastDroppedCard.rank && card.suit === droppedCard.suit)) {
                        return false;
                    }
                    if (droppedCard.suit !== lastDroppedCard.suit && droppedCard.suit !== trumpSuit && playerCards.find(card => card.suit === lastDroppedCard.suit)) {
                        return false;
                    }
                } else {
                    hasTrump = droppedCards.find(card => card.suit === trumpSuit) && droppedCards[0].suit !== trumpSuit;
                    trumpCard = hasTrump ? droppedCards.sort((a, b) => b.rank - a.rank).find(card => card.suit === trumpSuit)! : null;

                    if (droppedCard.suit === lastDroppedCard.suit && hasTrump) {
                        return true;
                    }
                    if (droppedCard.suit === lastDroppedCard.suit && droppedCard.rank < lastDroppedCard.rank && playerCards.find(card => card.rank > lastDroppedCard.rank && card.suit === droppedCard.suit)) {
                        return false;
                    }
                    if (droppedCard.suit !== lastDroppedCard.suit && droppedCard.suit !== trumpSuit && playerCards.find(card => card.suit === lastDroppedCard.suit)) {
                        return false;
                    }
                    if (droppedCard.suit !== lastDroppedCard.suit && droppedCard.suit === trumpSuit && hasTrump && trumpCard && trumpCard.rank > lastDroppedCard.rank && playerCards.find(card => card.suit === trumpCard!.suit && card.rank > trumpCard!.rank)) {
                        return false;
                    }
                }
                break;
            default:
                break;
        }


        return true;
    }

    public validateNextTurn(
        droppedCards: Array<{ droppedBy: string, card: Icard }> | any,
        trumpSuit: string,
    ) {
        let winnerCard: Icard = droppedCards[0].card;
        droppedCards.forEach((droppedCard: any) => {
            if (!winnerCard) {
                winnerCard = droppedCard.card;
            } else if (winnerCard.suit === trumpSuit && droppedCard.card.suit === trumpSuit && droppedCard.card.rank > winnerCard.rank) {
                winnerCard = droppedCard.card;
            } else if (winnerCard.suit !== trumpSuit && droppedCard.card.suit === trumpSuit) {
                winnerCard = droppedCard.card;
            } else if (winnerCard.suit === droppedCard.card.suit && droppedCard.card.rank > winnerCard.rank) {
                winnerCard = droppedCard.card;
            }
        })

        return { winner: droppedCards.find((droppedCard: any) => droppedCard.card.rank === winnerCard.rank && droppedCard.card.suit === winnerCard.suit)!.droppedBy, cards: droppedCards.map((droppedCard: any) => droppedCard.card) };
    }

    public validStartCard(): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        const removedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> = [];
        let card: { name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number };
        do {
            card = this.deck.pop()!;
            removedCards.push(card);
        } while (card.rank > 10 || card.isJoker)


        return removedCards;
    }

    public reShuffleCards(playedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> {
        this.deck = playedCards.concat(this.deck);
        return this.deck;
    }

}