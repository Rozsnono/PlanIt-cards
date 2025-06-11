import mongoose from "mongoose";
import { Icard } from "../interfaces/interface";
import { RummyDealer } from "./dealer.services";

const ThinkTimeByDifficulty = {
    'easy': { min: 5, max: 10 },
    'medium': { min: 10, max: 30 },
    'hard': { min: 15, max: 60 }
}

export class RummyBot {

    difficulty: "easy" | "medium" | "hard" = "easy";
    name = 'RummyBot';
    validator: RummyDealer;
    playerCards: Icard[] = [];
    prePlayerCards: Icard[] = [];
    droppedCards: any = [];
    playedCards: { playedBy: string, cards: Icard[] }[] = [];

    constructor(name: string, difficulty: string, playerCards: Icard[], droppedCards: Icard[], playedCards: any, cards: Icard[]) {
        this.name = name;
        this.difficulty = difficulty as any;
        this.validator = new RummyDealer(cards as any);
        this.playerCards = playerCards;
        this.prePlayerCards = playerCards;
        this.droppedCards = droppedCards;
        this.playedCards = playedCards;
    }

    get hasSequenceGetter() {
        return this.hasSequence();
    }

    get hasSetGetter() {
        return this.hasSet();
    }

    get hasForPuttableCardsGetter() {
        return this.searchForPuttableCards();
    }

    get droppingCardGetter() {
        return this.dropCard();
    }

    public get thinkingTime(): number {
        return Math.floor(Math.random() * (ThinkTimeByDifficulty[this.difficulty].max - ThinkTimeByDifficulty[this.difficulty].min + 1) + ThinkTimeByDifficulty[this.difficulty].min) * 1000;
    }

    public play(): { droppedCards: any, playedCards: any, playerCards: Icard[] } {
        this.playerCards.push(this.validator.drawCard(1)[0] as any);

        const melds = this.searchForMelds();

        if (melds.length > 0) {
            melds.forEach((meld: Icard[]) => {
                this.playedCards.push({ playedBy: this.name, cards: meld });
            })
        }
        if(this.playedCards.find((meld: any) => meld.playedBy === this.name)){
            const puttingPlayedCards = this.searchForPuttableCards();
            this.playedCards = puttingPlayedCards;
        }

        if (this.playerCards.length > 0) {
            const dropCard = this.dropCard();
            this.droppedCards.push({ droppebBy: "68359c77bb13b4cb0d42d95f", card: dropCard, _id: new mongoose.Types.ObjectId() });
            this.playerCards = this.playerCards.filter((card: Icard) => JSON.stringify(card) != JSON.stringify(dropCard));
        } else {
            throw new Error('No cards to drop');
        }

        return { droppedCards: this.droppedCards, playedCards: this.playedCards, playerCards: this.playerCards };
    }

    private searchForMelds(): any[] {
        let melds: any = [];
        let index = 0;
        do {
            this.playerCards = this.prePlayerCards;
            let sequence: Icard[][], set: Icard[][];
            if (index == 0) {
                sequence = this.hasSequence();
                this.playerCards = this.playerCards.filter(card => !sequence.map((seq: Icard[]) => seq).flat().find((c: Icard) => c.name === card.name && c.pack === card.pack));

                set = this.hasSet();
                this.playerCards = this.playerCards.filter(card => !set.map((set: Icard[]) => set).flat().find((c: Icard) => c.name === card.name && c.pack === card.pack));
            } else {
                set = this.hasSet();
                this.playerCards = this.playerCards.filter(card => !set.map((set: Icard[]) => set).flat().find((c: Icard) => c.name === card.name && c.pack === card.pack));

                sequence = this.hasSequence();
                this.playerCards = this.playerCards.filter(card => !sequence.map((seq: Icard[]) => seq).flat().find((c: Icard) => c.name === card.name && c.pack === card.pack));
            }

            let values = 0;
            melds = melds.concat(sequence).concat(set);
            if (this.playerCards.length == 0) {
                const deleting = melds.find((meld: Icard[]) => meld.length > 3);
                if (deleting) {
                    melds[melds.indexOf(deleting)] = deleting.filter((card: Icard) => card.name !== deleting[0].name);
                    this.playerCards.push(deleting[0]);
                } else {
                    const newDeleting = melds[0];
                    melds.slice(0, 1);
                    this.playerCards.concat(newDeleting);
                }
            }
            melds.forEach((meld: Icard[]) => meld.forEach((card: Icard) => values += card.value));
            if (values >= 51) {
                return melds;
            } else {
                this.playerCards = this.prePlayerCards;
                melds.length = 0;
            }
            index++;
        } while (melds.length === 0 && index == 0);
        return melds;
    }

    private hasSequence(): Icard[][] | [] {

        const suits = ["S", "H", "D", "C"];

        const cards = this.playerCards;

        cards.sort((a, b) => {
            if (suits.indexOf(a.suit) !== suits.indexOf(b.suit)) {
                return suits.indexOf(a.suit) - suits.indexOf(b.suit);
            }
            return a.rank - b.rank;
        });
        let tmpSequence: Icard[] = [];
        const sequence: Icard[][] = [];
        const hasJoker = cards.filter(card => card.isJoker);
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const nextCard = cards[i + 1] || { rank: 100 };
            const prevCard = cards[i - 1] || { rank: 0 };

            if (card.rank === prevCard.rank) {
                continue;
            }
            if (card.rank - 1 !== prevCard.rank) {
                if (tmpSequence.length > 2) { sequence.push(tmpSequence); }
                tmpSequence = [];
            }
            if (card.rank + 1 === nextCard.rank || card.rank - 1 === prevCard.rank) {
                tmpSequence.push(card);
            }
            else if (hasJoker.length > 0) {
                tmpSequence.push(hasJoker.pop()!);
            }
        }
        if (tmpSequence.length > 2) {
            sequence.push(tmpSequence);
        }
        return sequence;
    }

    private hasSet(): Icard[][] {

        const suits = ["S", "H", "D", "C"];

        const cards = this.playerCards;

        cards.sort((a, b) => {
            if (a.rank !== b.rank) {
                return a.rank - b.rank;
            }
            return suits.indexOf(a.suit) - suits.indexOf(b.suit);
        });
        const hasJoker = cards.filter(card => card.isJoker);
        let tmpSet: Icard[] = [];
        const set: Icard[][] = [];

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const nextCard = cards[i + 1] || { rank: 100 };
            const prevCard = cards[i - 1] || { rank: 0 };

            if (card.suit === prevCard.suit) {
                continue;
            }
            if (card.rank !== prevCard.rank) {
                if (tmpSet.length > 2) { set.push(tmpSet); }
                tmpSet = [];
            }

            if (card.rank === nextCard.rank || card.rank === prevCard.rank) {
                tmpSet.push(card);
            }
            else if (hasJoker.length > 0) {
                tmpSet.push(hasJoker.pop()!);
            }
        }
        if (tmpSet.length > 2) {
            set.push(tmpSet);
        }

        return set;
    }

    private searchForPuttableCards(): any {
        if (this.playedCards.length === 0 || (this.difficulty === 'easy' && this.playerCards.length > 3)) {
            return this.playedCards;
        }

        const puttableCards: any = [];

        for (const card of this.playerCards) {
            for (const playedCard of this.playedCards) {
                if (this.validator.validatePlay(playedCard.cards.concat(card), this.playerCards, true) === 'Valid') {

                    if (this.playerCards.length - puttableCards.length === 1) {
                        this.playerCards = this.playerCards.filter((c: Icard) => puttableCards.indexOf(c) === -1);
                        return this.playedCards;
                    }

                    this.playedCards = this.playedCards.map((meld: any) => {
                        return this.playedCards.indexOf(meld) === this.playedCards.indexOf(playedCard) ?
                            { playedBy: playedCard.playedBy, cards: playedCard.cards.concat(card) } :
                            meld
                    });
                    puttableCards.push(card);
                    if (this.difficulty === 'easy' || this.difficulty === 'medium') {
                        this.playerCards = this.playerCards.filter((c: Icard) => puttableCards.indexOf(c) === -1);
                        return this.playedCards;
                    }
                }
            }

        }
        this.playerCards = this.playerCards.filter((c: Icard) => puttableCards.indexOf(c) === -1);

        return this.playedCards;

    }

    private dropCard(): Icard {

        switch (this.difficulty) {
            case 'easy':
                return this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
            case 'medium':
                const card = this.playerCards.filter((card: Icard) => !card.isJoker)[Math.floor(Math.random() * this.playerCards.filter((card: Icard) => !card.isJoker).length)];
                return card ? card : this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
            case 'hard':
                return this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
            default:
                throw new Error('Invalid difficulty');
        }
    }
}
