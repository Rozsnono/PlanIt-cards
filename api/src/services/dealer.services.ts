import mongoose from "mongoose";

export default class CardDealer {

    private cards;

    private deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }>;
    
    constructor(
        cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }>
    ) {
        this.cards = cards;
        this.deck = cards;
    }

    public shuffleDeck(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> = this.cards): Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> {
        let currentIndex = deck.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        this.deck = deck;
        return deck;
    }

    public dealCards(players: mongoose.Types.ObjectId[]): { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> } {
        const playerCards: { [id: string]: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> } = {};
        const numberOfPlayers = players.length;
        for (let i = 0; i < numberOfPlayers; i++) {
            playerCards[players[i].toString()] = [];
        }
        let playerIndex = 0;
        while (playerIndex < numberOfPlayers) {
            playerCards[players[playerIndex].toString()] = this.getCards(playerIndex === 0 ? 11 : 10);
            playerIndex++;
            if (playerIndex === numberOfPlayers) {
                playerIndex = 0;
            }
        }
        return playerCards;
    }

    private getCards(numberOfCards: number = 10){
        const cards: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> = [];
        for (let i = 0; i < numberOfCards; i++) {
            cards.push(this.deck.pop()!);
        }
        return cards;
    }
}