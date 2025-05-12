import { Icard } from "../interfaces/interface";
import { RummyDealer } from "./dealer.services";

const ThinkTimeByDifficulty = {
    'easy': { min: 5, max: 10 },
    'medium': { min: 10, max: 30 },
    'hard': { min: 15, max: 60 }
}

export class RummyBot {
    static Difficulty = {
        EASY: 'easy',
    };

    difficulty: "easy" | "medium" | "hard" = "easy";
    name = 'RummyBot';
    validator: RummyDealer;
    playerCards: Icard[] = [];
    droppedCards: any = [];
    playedCards: { playedBy: string, cards: Icard[] }[] = [];

    constructor(name: string, difficulty: string, playerCards: Icard[], droppedCards: Icard[], playedCards: any, cards: Icard[]) {
        this.name = name;
        this.difficulty = difficulty as any;
        this.validator = new RummyDealer(cards as any);
        this.playerCards = playerCards;
        this.droppedCards = droppedCards;
        this.playedCards = playedCards;
    }

    public get thinkingTime(): number {
        return Math.floor(Math.random() * (ThinkTimeByDifficulty[this.difficulty].max - ThinkTimeByDifficulty[this.difficulty].min + 1) + ThinkTimeByDifficulty[this.difficulty].min) * 1000;
    }

    public play(): any {
        this.playerCards.push(this.validator.drawCard(1)[0] as any);

        const melds = this.searchForMelds();

        if (melds.length > 0) {
            melds.forEach((meld: any) => {
                this.playedCards.push(meld);
            });
            this.playerCards = this.playerCards.filter(card => !melds.map((meld: any) => meld.cards).flat().includes(card));
            // this.searchForPuttableCards();
        }
        if (this.playerCards.length > 0) {
            this.droppedCards.push({ droppedBy: this.name, card: this.playerCards.pop()! });
        } else {
            throw new Error('No cards to drop');
        }

        return { droppedCards: this.droppedCards, playedCards: this.playedCards, playerCards: this.playerCards };
    }

    private searchForMelds(): any {
        const melds = [];
        const { sequence, set }: any = {sequence: [], set: []};
        // const sequence = this.hasSequence();
        // const set = this.hasSet();
        let values = 0;
        sequence.forEach((card: Icard[]) => card.forEach(c => values += c.value));
        set.forEach((card: any) => values += card.value);
        if (values >= 51) {
            if(sequence.length > 0){
                melds.push({ playedBy: this.name, cards: sequence });
            }
            if(set.length > 0){
                melds.push({ playedBy: this.name, cards: set });
            }
        }

        return melds;
    }

    private hasSequence(): Icard[][] | [] {

        const suits = ["S", "H", "D", "C"];

        this.playerCards.sort((a, b) => {
            if (suits.indexOf(a.suit) !== suits.indexOf(b.suit)) {
                return suits.indexOf(a.suit) - suits.indexOf(b.suit);
            }
            return a.rank - b.rank;
        });
        const tmpSequence: Icard[] = [];
        const sequence: Icard[][] = [];
        const hasJoker = this.playerCards.filter(card => card.isJoker);
        for (let i = 0; i < this.playerCards.length - 1; i++) {
            const card = this.playerCards[i];
            const nextCard = this.playerCards[i + 1];
            const prevCard = this.playerCards[i - 1] || { rank: 0 };

            if(card.rank - 1 !== prevCard.rank){
                tmpSequence.length = 0;
            }

            if (card.rank + 1 === nextCard.rank) {
                tmpSequence.push(card);
            } else if (card.rank - 1 === prevCard.rank) {
                tmpSequence.push(card);
            }
            else if (hasJoker.length > 0) {
                tmpSequence.push(hasJoker.pop()!);
            }
            if(tmpSequence.length > 2){
                sequence.push(tmpSequence);
                tmpSequence.length = 0;
            }
        }

        return sequence;
    }

    private hasSet(): Icard[] {

        const suits = ["S", "H", "D", "C"];

        this.playerCards.sort((a, b) => {
            if (a.rank !== b.rank) {
                return a.rank - b.rank;
            }
            return suits.indexOf(a.suit) - suits.indexOf(b.suit);
        });

        const hasJoker = this.playerCards.filter(card => card.isJoker);
        const tmpSet: Icard[] = [];
        const set: Icard[][] = [];
        for (let i = 0; i < this.playerCards.length - 1; i++) {
            const card = this.playerCards[i];
            const nextCard = this.playerCards[i + 1];
            const prevCard = this.playerCards[i - 1] || { rank: 0 };
            if (card.rank === nextCard.rank && card.suit !== nextCard.suit) {
                if(set.length == 0){
                    tmpSet.push(card);
                }else if(set.length > 0 && tmpSet[0].rank == card.rank){
                    tmpSet.push(card);
                }
            } else if (card.rank === prevCard.rank && card.suit !== prevCard.suit && (set.length > 0 && tmpSet[0].rank == card.rank)) {
                tmpSet.push(card);
            }
            else if (hasJoker.length > 0) {
                tmpSet.push(hasJoker.pop()!);
            }
        }

        if (set.length < 3) {
            return [];
        }

        return tmpSet;
    }

    private searchForPuttableCards(): any {
        if (this.playedCards.length === 0) {
            return this.playerCards;
        }


        let index = 0;
        do {
            if (this.playerCards.length === 1) break;
            const card = this.playerCards[index];

            for (const playedCard of this.playedCards) {
                if (this.validator.validatePlay(playedCard.cards.concat(card), this.playerCards, true)) {
                    this.playedCards = this.playedCards.map((meld: any) => {
                        return !meld._id ?
                            { playedBy: playedCard.playedBy, cards: playedCard.cards.concat(card) } :
                            meld
                    });
                    this.playerCards.splice(index, 1);
                    index = -1;
                    break;
                }
            }


            index++;

        } while (index < this.playerCards.length);

    }
}
