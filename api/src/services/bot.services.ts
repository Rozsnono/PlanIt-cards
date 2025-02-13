import { Icard } from "../interfaces/interface";

interface GameState {
    hand: Icard[];
    discardPile: Icard[];
    melds: {playedBy: string, cards: Icard[]}[];
}

export default class Bot {
    private difficulty: "easy" | "medium" | "hard" = "easy";
    protected botName: string = "Bot";

    constructor(difficulty: "easy" | "medium" | "hard", botName: string = "Bot") {
        this.difficulty = difficulty;
        this.botName = botName;
    }
}

export class RummyBot extends Bot {
    constructor(difficulty: "easy" | "medium" | "hard", botName: string) {
        super(difficulty, botName);
    }

    public playTurn(gameState: GameState): { discard: Icard; melds: {playedBy: string, cards: Icard[]}[], hand: Icard[] } {
        const melds = this.findMelds(gameState.hand);
        const discard = this.getBestDiscard(gameState, melds);
        const hand = this.getHandCards(gameState.hand, melds, discard);
        return { discard, melds, hand };
    }

    findMelds(hand: Icard[]): { playedBy: string, cards: Icard[] }[] {
        const sets: Icard[][] = [];
        const runs: Icard[][] = [];
    
        const sortedHand = hand.sort((a, b) => a.rank - b.rank);
        const groupedByValue: { [key: string]: Icard[] } = {};
    
        sortedHand.forEach(card => {
            if (!groupedByValue[card.rank]) groupedByValue[card.rank] = [];
            groupedByValue[card.rank].push(card);
        });
    
        for (const key in groupedByValue) {
            if (groupedByValue[key].length >= 3) {
                sets.push(groupedByValue[key]);
            }
        }
    
        const groupedBySuit: { [key: string]: Icard[] } = {};
        hand.forEach(card => {
            if (!groupedBySuit[card.suit]) groupedBySuit[card.suit] = [];
            groupedBySuit[card.suit].push(card);
        });
    
        for (const suit in groupedBySuit) {
            const sortedSuit = groupedBySuit[suit].sort((a, b) => a.rank - b.rank);
            let run: Icard[] = [];
            for (let i = 0; i < sortedSuit.length; i++) {
                if (run.length === 0 || sortedSuit[i].rank === run[run.length - 1].rank + 1) {
                    run.push(sortedSuit[i]);
                } else {
                    if (run.length >= 3) runs.push([...run]);
                    run = [sortedSuit[i]];
                }
            }
            if (run.length >= 3) runs.push([...run]);
        }
    
        return [
            ...sets.map(set => ({ playedBy: this.botName, cards: set })),
            ...runs.map(run => ({ playedBy: this.botName, cards: run }))
        ];
    }

    getHandCards(hand: Icard[], melds: { playedBy: string, cards: Icard[] }[], discard: Icard): Icard[] {
        const usedCards = new Set(melds.flat().map(card => JSON.stringify(card)));
        return hand.filter(card => !usedCards.has(JSON.stringify(card)) && JSON.stringify(card) !== JSON.stringify(discard));
    }
    

    getBestDiscard(gameState: GameState, melds: {playedBy: string, cards: Icard[]}[]): Icard {
        const usedCards = new Set(melds.flat().map(card => JSON.stringify(card)));
        const ungroupedCards = gameState.hand.filter(card => !usedCards.has(JSON.stringify(card)));
        return ungroupedCards.length ? ungroupedCards[0] : gameState.hand[0];
    }
}

export class EasyRummyBot extends RummyBot {
    constructor(botName: string) {
        super("easy", botName);
    }

    public override getBestDiscard(gameState: GameState, melds: {playedBy: string, cards: Icard[]}[]): Icard {
        return gameState.hand.find(card => !melds.flat().find(meldCard => JSON.stringify(meldCard) === JSON.stringify(card)))!;
    }
}