import mongoose from "mongoose";

const UnoRank = {
    18: "Double",
    16: "Skip",
    15: "Reverse",
    20: "Wild",
    24: "Wild Draw Four",
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

    public dealCards(users: mongoose.Types.ObjectId[] | string[], numberOfCards?: number): { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> } {
        const playerCards: { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> } = {};
        const NoC = numberOfCards || 10;
        const numberOfPlayers = users.length;
        for (let i = 0; i < numberOfPlayers; i++) {
            playerCards[users[i].toString()] = [];
        }
        let playerIndex = 0;
        while (playerIndex < numberOfPlayers) {
            playerCards[users[playerIndex].toString()] = this.getCards(playerIndex === 0 ? NoC + 1 : NoC);
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
}

export class RummyDealer extends CardDealer {
    constructor(cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>) {
        super(cards);
    }

    public validatePlay(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>, playerCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>, playedCards: Array<{ playedBy: string, cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }> }>, playerId: string): string {
        if (typeof deck === "undefined") {
            return "No cards selected";
        }
        if (!deck.every(card => playerCards.find(playerCards => JSON.stringify(playerCards) === JSON.stringify(card)))) {
            return "Invalid card selected";
        }
        if (deck.length < 3) {
            return "Minimum 3 cards required";
        }
        if (deck.length > 13) {
            return "Maximum 13 cards allowed";
        }
        if (!playedCards.find(card => card.playedBy === playerId)) {
            if (deck.map(card => card.value).reduce((a, b) => a + b) < 30) {
                return "Minimum 30 points required";
            }
        }

        const sameRankSuits = [deck[0].suit];
        const isSameRank = deck.every((card, index) => {
            if (index === 0) return true;
            if (sameRankSuits.includes(card.suit)) return false;
            if (card.rank === deck[index - 1].rank || card.isJoker) { sameRankSuits.push(card.suit) }
            return card.rank === deck[index - 1].rank || card.isJoker;
        });

        const isValidSequence = this.isValidSequence(deck);
        if (isSameRank || isValidSequence) return "Valid";
        return "Invalid sequence";
    }

    private isValidSequence(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number, value: number }>): boolean {
        const tryWithRanks = (cards: typeof deck, aceHigh: boolean) => {
            const sortedDeck = [...cards].map(card => ({
                ...card,
                rank: card.rank === 14 && aceHigh ? 14 : 1
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
        };

        return tryWithRanks(deck, false) || tryWithRanks(deck, true);
    }

}