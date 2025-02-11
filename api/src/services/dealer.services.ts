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

    public deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }>;
    
    constructor(
        cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }>
    ) {
        this.cards = cards;
        this.deck = cards;
    }

    public shuffleDeck(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }> = this.cards): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }> {
        let currentIndex = deck.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        this.deck = deck;
        return deck;
    }

    public dealCards(users: mongoose.Types.ObjectId[], numberOfCards?: number): { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }> } {
        const playerCards: { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }> } = {};
        const NoC = numberOfCards || 10;
        const numberOfPlayers = users.length;
        for (let i = 0; i < numberOfPlayers; i++) {
            playerCards[users[i].toString()] = [];
        }
        let playerIndex = 0;
        while (playerIndex < numberOfPlayers) {
            playerCards[users[playerIndex].toString()] = this.getCards(playerIndex === 0 ? NoC+1 : NoC);
            playerIndex++;
        }
        return playerCards;
    }

    private getCards(numberOfCards: number = 10){
        const cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }> = [];

        for (let i = 0; i < numberOfCards; i++) {
            cards.push(this.deck.pop()!);
        }
        return cards;
    }

    public drawCard(numberOfCards: number): Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }> {
        const removedCards = this.deck.splice(-numberOfCards, numberOfCards);
        return removedCards;
    }

    public validatePlay(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }>, playerCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }>): boolean {
        if(typeof deck === "undefined"){
            return true;
        }
        if(!deck.every(card => playerCards.find(playerCards => JSON.stringify(playerCards) === JSON.stringify(card)))){
            return false;
        }
        if(deck.length < 3) {
            return false;
        }

        const isSameRank = deck.every((card, index) => {
            if(index !== 0) {
                if(card.rank !== deck[index - 1].rank || !deck[index - 1].isJoker) {
                    return false;
                }
            }
            return true;
        });

        let isConsecutive = false;
        const isSameSuit = deck.every((card, index) => {
            if(index !== 0) {
                if(card.suit !== deck[index - 1].suit || !deck[index - 1].isJoker) {
                    return false;
                }
            }
            return true;
        });
        if(isSameSuit){
            isConsecutive = deck.every((card, index) => {
                if(index !== 0) {
                    if(card.rank !== deck[index - 1].rank + 1 || !deck[index - 1].isJoker) {
                        return false;
                    }
                }
                return true;
            });
        }

        return isConsecutive || isSameRank;


    }

    public validateDrop(droppedCards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean, pack: number }>, droppedCard: { name: string, rank: number, suit: string, isJoker?: boolean, pack: number }): boolean {
        if(droppedCards.length === 0) {
            return true;
        }
        if(droppedCard.isJoker) {
            return true;
        }
        const isSameRank = droppedCards.every(card => card.rank === droppedCard.rank);
        const isSameSuit = droppedCards.every(card => card.suit === droppedCard.suit);



        return isSameRank || isSameSuit;
    }

    public getUnoStatus(playedCard: { name: string, rank: number, suit: string, isJoker?: boolean, pack: number }): string {
        try {
            return UnoRank[playedCard.rank as 18|16|15|24|20]
        } catch {
            return "";
        }
    }
}