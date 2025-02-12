import { Icard } from "../interfaces/interface";

interface GameState {
    hand: Icard[];
    discardPile: Icard[];
    melds: Icard[][];
}

export default class Bot {
    private difficulty: "easy" | "medium" | "hard" = "easy";

    constructor(difficulty: "easy" | "medium" | "hard") {
        this.difficulty = difficulty;
    }
}

export class RummyBot extends Bot {
    constructor(difficulty: "easy" | "medium" | "hard") {
        super(difficulty);
    }

    public playTurn(gameState: GameState): { discard: Icard; melds: Icard[][] } {
        const melds = this.findMelds(gameState.hand);
        const discard = this.getBestDiscard(gameState, melds);
        return { discard, melds };
    }

    findMelds(hand: Icard[]): Icard[][] {
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
            const sortedSuit = groupedBySuit[suit].sort((a, b) => a.suit.localeCompare(b.suit));
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

        return [...sets, ...runs];
    }

    getBestDiscard(gameState: GameState, melds: Icard[][]): Icard {
        const usedCards = new Set(melds.flat().map(card => JSON.stringify(card)));
        const ungroupedCards = gameState.hand.filter(card => !usedCards.has(JSON.stringify(card)));
        return ungroupedCards.length ? ungroupedCards[0] : gameState.hand[0];
    }
}

export class EasyRummyBot extends RummyBot {
    constructor() {
        super("easy");
    }

    public override playTurn(gameState: GameState): { discard: Icard; melds: Icard[][]; } {
        const melds = this.findMelds(gameState.hand);
        const discard = this.getBestDiscard(gameState, melds);
        return { discard, melds };
    }

    public override getBestDiscard(gameState: GameState, melds: Icard[][]): Icard {
        return gameState.hand.find(card => !melds.flat().find(meldCard => JSON.stringify(meldCard) === JSON.stringify(card)))!;
    }
}

export class MediumRummyBot extends RummyBot {
    constructor() {
        super("medium");
    }
}

export class HardRummyBot extends RummyBot {
    constructor() {
        super("hard");
    }
}