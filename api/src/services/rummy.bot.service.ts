import { Icard } from "../interfaces/interface";
import { RummyDealer } from "./dealer.services";

export class RummyBot {
    static Difficulty = {
        EASY: 'easy',
    };

    difficulty: string;
    name = 'RummyBot';
    validator: RummyDealer;
    playerCards: Icard[] = [];
    droppedCards: any = [];
    playedCards: { playedBy: string, cards: Icard[] }[] = [];

    constructor(name: string, difficulty: string, playerCards: Icard[], droppedCards: Icard[], playedCards: any, cards: Icard[]) {
        this.name = name;
        this.difficulty = difficulty;
        this.validator = new RummyDealer(cards as any);
        this.playerCards = playerCards;
        this.droppedCards = droppedCards;
        this.playedCards = playedCards;
    }

    public play(): any {
        console.log(this.playerCards.length)
        this.playerCards.push(this.validator.drawCard(1)[0] as any);

        const melds = this.searchForMelds();

        if (melds.length > 0) {
            this.playedCards.concat(melds);
            this.playerCards = this.playerCards.filter(card => !melds.map((meld: any) => meld.cards).flat().includes(card));
            this.searchForPuttableCards();
        }
        console.log(this.playerCards)
        if (this.playerCards.length > 0) {
            this.droppedCards.push({ droppedBy: this.name, card: this.playerCards.pop()! });
        } else {
            throw new Error('No cards to drop');
        }

        return { droppedCards: this.droppedCards, playedCards: this.playedCards, playerCards: this.playerCards };
    }

    private searchForMelds(): any {
        const melds = [];
        
        const sequence = this.hasSequence();
        const set = this.hasSet();
        let values = 0;
        sequence.forEach(card => values += card.value);
        set.forEach(card => values += card.value);
        if (values < 51) {
            melds.push({ playedBy: this.name, cards: sequence });
            melds.push({ playedBy: this.name, cards: set });
        }

        return melds;
    }

    private hasSequence(): Icard[] | [] {
        const groupBySuit = this.playerCards.reduce((acc: any, card: Icard) => {
            if (!acc[card.suit]) {
                acc[card.suit] = [];
            }
            acc[card.suit].push(card);
            return acc;
        }, {});
        const sequence: Icard[] = [];
        const hasJoker = this.playerCards.filter(card => card.isJoker);
        Object.values(groupBySuit).forEach((cards: any) => {
            const sortedCards = cards.sort((a: any, b: any) => a.rank - b.rank);
            for (let i = 0; i < sortedCards.length - 1; i++) {
                if (sortedCards[i].rank + 1 === sortedCards[i + 1].rank) {
                    sequence.push(sortedCards[i]);
                }
                else if (hasJoker.length > 0) {
                    sequence.push(hasJoker.pop()!);
                }
            }
        });

        if (sequence.length < 3) {
            return [];
        }

        return sequence;
    }

    private hasSet(): Icard[] {
        const sortedCards = this.playerCards.sort((a, b) => { const suit = a.suit.localeCompare(b.suit); return suit === 0 ? a.rank - b.rank : suit; });
        const hasJoker = sortedCards.filter(card => card.isJoker);
        const set: Icard[] = [];
        for (let i = 0; i < sortedCards.length - 1; i++) {
            if (sortedCards[i].rank === sortedCards[i + 1].rank) {
                set.push(sortedCards[i]);
            }
            else if (hasJoker.length > 0) {
                set.push(hasJoker.pop()!);
            }
        }

        if (set.length < 3) {
            return [];
        }

        return set;
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
