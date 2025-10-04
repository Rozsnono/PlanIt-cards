
import mongoose from "mongoose";
import { Icard, Igame } from "../interfaces/interface";
import { RummyDealer, SchnappsDealer } from "./dealer.services";
import { UnoDealer } from "./dealer.services";

const ThinkTimeByDifficulty = {
    'easy': { min: 5, max: 10 },
    'medium': { min: 10, max: 30 },
    'hard': { min: 15, max: 60 },
    'EASY': { min: 5, max: 10 },
    'MEDIUM': { min: 10, max: 30 },
    'HARD': { min: 15, max: 60 }
}
export default class Bot {
    private rummyBotNames = {
        'EASY': {
            first: ["Cardy", "Dealy", "Robo", "Acey", "Meldy", "Drawy", "Decko", "Handy", "Ginny"],
        },
        'MEDIUM': {
            first: ["Shuffo", "Genie", "Husty", "Dexy", "Dyno", "Pal", "Jokey", "Melds", "Playo"],
        },
        'HARD': {
            first: ["Crafty", "Master", "Daemon", "Juggly", "Ranger", "Tactic", "Tricky", "Acey", "Whizy"],
        }
    };




    constructor() {

    }

    getRobotName(difficulty: 'EASY' | 'MEDIUM' | 'HARD', number: number) {
        const name = this.rummyBotNames[difficulty].first[number];
        return `${name}`;
    }

    getRobotDifficultyFromName(name: string) {
        for (let i = 0; i < 3; i++) {
            if (this.rummyBotNames[Object.keys(this.rummyBotNames)[i] as 'EASY' | 'MEDIUM' | 'HARD'].first.includes(name)) {
                return Object.keys(this.rummyBotNames)[i];
            }
        }

        return Object.keys(this.rummyBotNames)[0];

    }

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
        if (this.playedCards.find((meld: any) => meld.playedBy === this.name)) {
            const puttingPlayedCards = this.searchForPuttableCards();
            this.playedCards = puttingPlayedCards;
        }

        if (this.playerCards.length > 0) {
            const dropCard = this.dropCard();
            this.droppedCards.push({ droppedBy: "bot", card: dropCard, _id: new mongoose.Types.ObjectId() });
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

        switch (this.difficulty.toLowerCase()) {
            case 'easy':
                return this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
            case 'medium':
                const card = this.playerCards.filter((card: Icard) => !card.isJoker)[Math.floor(Math.random() * this.playerCards.filter((card: Icard) => !card.isJoker).length)];
                return card ? card : this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
            case 'hard':
                const cardHard = this.playerCards.filter((card: Icard) => !card.isJoker)[Math.floor(Math.random() * this.playerCards.filter((card: Icard) => !card.isJoker).length)];
                return cardHard ? cardHard : this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
            default:
                throw new Error('Invalid difficulty: ' + this.difficulty.toLowerCase());
        }
    }
}

export class UnoBot {
    static Difficulty = {
        EASY: 'easy',
    };

    difficulty: "easy" | "medium" | "hard" = "easy";
    name = 'UnoBot';
    validator: UnoDealer;
    playerCards: Icard[] = [];
    droppedCards: any = [];
    playedCards: { playedBy: string, cards: Icard[] }[] = [];
    drawedCard: { lastDrawedBy: string };

    constructor(name: string, difficulty: string, playerCards: Icard[] | any, droppedCards: { droppedBy: string, card: Icard }[], playedCards: any, cards: Icard[], drawedCard: { lastDrawedBy: string }) {
        this.name = name;
        this.difficulty = difficulty as any;
        this.validator = new UnoDealer(cards as any);
        this.playerCards = playerCards;
        this.droppedCards = droppedCards;
        this.playedCards = playedCards;
        this.drawedCard = drawedCard;
    }

    public get thinkingTime(): number {
        return Math.floor(Math.random() * (ThinkTimeByDifficulty[this.difficulty].max - ThinkTimeByDifficulty[this.difficulty].min + 1) + ThinkTimeByDifficulty[this.difficulty].min) * 1000;
    }

    public play(): any {

        const melds = this.dropableCards;

        const selectedCard = melds.length > 0 ? melds[Math.random() * melds.length | 0] : null;

        if (!selectedCard) {
            this.playerCards.push(this.validator.drawCard(1)[0] as any);
            this.drawedCard.lastDrawedBy = this.name;
            return { droppedCards: this.droppedCards, playerCards: this.playerCards, drawedCard: this.drawedCard };
        }

        if (selectedCard.isJoker) {
            selectedCard.suit = ['R', 'G', 'B', 'Y'][Math.random() * 4 | 0];
            selectedCard.name = selectedCard.name.replace('U_', 'U_' + selectedCard.suit);
        }

        this.droppedCards.push({ droppedBy: this.name, card: selectedCard });
        this.playerCards = this.playerCards.filter(card => card !== selectedCard);

        return { droppedCards: this.droppedCards, playerCards: this.playerCards, drawedCard: this.drawedCard };
    }

    private get dropableCards() {
        return this.playerCards.filter(card => this.validator.validateDrop(this.droppedCards.map((d: any) => d.card), card));
    }
}

export class SchnappsBot {
    static Difficulty = {
        EASY: 'easy',
    };

    difficulty: "easy" | "medium" | "hard" = "easy";
    name = 'SchnappsBot';
    validator: SchnappsDealer;
    playerCards: Icard[] = [];
    droppedCards: any = [];
    playedCards: { playedBy: string, cards: Icard[] }[] = [];
    drawedCard: { lastDrawedBy: string };
    game: Igame | null = null;

    constructor(name: string, difficulty: string, playerCards: Icard[], droppedCards: { droppedBy: string, card: Icard }[], playedCards: any, cards: Icard[], drawedCard: { lastDrawedBy: string }, game: Igame | null) {
        this.name = name;
        this.difficulty = difficulty as any;
        this.validator = new SchnappsDealer(cards as any);
        this.playerCards = playerCards;
        this.droppedCards = droppedCards;
        this.playedCards = playedCards;
        this.drawedCard = drawedCard;
        this.game = game;
    }

    public get thinkingTime(): number {
        return Math.floor(Math.random() * (ThinkTimeByDifficulty[this.difficulty].max - ThinkTimeByDifficulty[this.difficulty].min + 1) + ThinkTimeByDifficulty[this.difficulty].min) * 1000;
    }

    public play(): any {
        let selectedCard: Icard | null = null;
        switch (this.difficulty) {
            case 'easy':
                selectedCard = this.SelectingCardEasy();
                break;
            case 'medium':
                selectedCard = this.SelectingCardMedium();
                break;
            case 'hard':
                selectedCard = this.SelectingCardHard();
                break;
        }


        this.droppedCards.push({ droppedBy: this.name, card: selectedCard });
        this.playerCards = this.playerCards.filter(c => c !== selectedCard);

        return { droppedCards: this.droppedCards, playerCards: this.playerCards };
    }

    private SelectingCardEasy(): Icard | null {
        let selectedCard: Icard | null = null;
        if (this.droppedCards.length === 0) {
            selectedCard = this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
        } else {
            const firstDroppedCardSuit = this.droppedCards[0].card.suit;
            const lastDroppedCard = this.droppedCards.filter((card: Icard) => card.suit === this.droppedCards[0].suit && (this.droppedCards[0].suit == this.game?.lastAction.trump?.suit ? true : card.suit !== this.game?.lastAction.trump?.suit)).sort((a: any, b: any) => b.card.rank - a.card.rank)[0].card || this.droppedCards[0].card;
            const hasTrumpCard = this.droppedCards.filter((card: Icard) => card.suit === this.game!.lastAction.trump!.suit && this.game?.lastAction.trump?.suit !== this.droppedCards[0].card.suit).sort((a: any, b: any) => b.card.rank - a.card.rank)[0] || null;

            if (hasTrumpCard) {
                if (this.checkPlayerCards(firstDroppedCardSuit).length > 0) {
                    selectedCard = this.checkPlayerCards(firstDroppedCardSuit)[Math.floor(Math.random() * this.checkPlayerCards(firstDroppedCardSuit).length)];
                } else if (this.checkPlayerCards(lastDroppedCard.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(lastDroppedCard.suit)[Math.floor(Math.random() * this.checkPlayerCards(lastDroppedCard.suit).length)];
                } else if (this.checkPlayerCards(this.game!.lastAction.trump!.suit, hasTrumpCard.card.rank).length > 0) {
                    selectedCard = this.checkPlayerCards(this.game!.lastAction.trump!.suit, hasTrumpCard.card.rank)[Math.floor(Math.random() * this.checkPlayerCards(this.game!.lastAction.trump!.suit, hasTrumpCard.rank).length)];
                } else if (this.checkPlayerCards(this.game!.lastAction.trump!.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(this.game!.lastAction.trump!.suit)[Math.floor(Math.random() * this.checkPlayerCards(this.game!.lastAction.trump!.suit).length)];
                } else {
                    selectedCard = this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
                }
            } else {
                if (this.checkPlayerCards(lastDroppedCard.suit, lastDroppedCard.rank).length > 0) {
                    selectedCard = this.checkPlayerCards(lastDroppedCard.suit, lastDroppedCard.rank)[Math.floor(Math.random() * this.checkPlayerCards(lastDroppedCard.suit, lastDroppedCard.rank).length)];
                } else if (this.checkPlayerCards(lastDroppedCard.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(lastDroppedCard.suit)[Math.floor(Math.random() * this.checkPlayerCards(lastDroppedCard.suit).length)];
                } else if (this.checkPlayerCards(this.game!.lastAction.trump!.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(this.game!.lastAction.trump!.suit)[Math.floor(Math.random() * this.checkPlayerCards(this.game!.lastAction.trump!.suit).length)];
                } else {
                    selectedCard = this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
                }
            }

        }


        return selectedCard;
    }

    private SelectingCardMedium(): Icard | null {
        let selectedCard: Icard | null = null;

        if (this.droppedCards.length === 0) {
            selectedCard = this.playerCards.sort((a, b) => b.rank - a.rank)[0];
        } else {
            const firstDroppedCardSuit = this.droppedCards[0].card.suit;
            const lastDroppedCard = this.droppedCards.filter((card: Icard) => card.suit === this.droppedCards[0].suit && (this.droppedCards[0].suit == this.game?.lastAction.trump?.suit ? true : card.suit !== this.game?.lastAction.trump?.suit)).sort((a: any, b: any) => b.card.rank - a.card.rank)[0].card || this.droppedCards[0].card;
            const hasTrumpCard = this.droppedCards.filter((card: Icard) => card.suit === this.game!.lastAction.trump!.suit && this.game?.lastAction.trump?.suit !== this.droppedCards[0].card.suit).sort((a: any, b: any) => b.card.rank - a.card.rank)[0] || null;

            if (hasTrumpCard) {
                if (this.checkPlayerCards(firstDroppedCardSuit).length > 0) {
                    selectedCard = this.checkPlayerCards(firstDroppedCardSuit)[Math.floor(Math.random() * this.checkPlayerCards(firstDroppedCardSuit).length)];
                } else if (this.checkPlayerCards(lastDroppedCard.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(lastDroppedCard.suit)[Math.floor(Math.random() * this.checkPlayerCards(lastDroppedCard.suit).length)];
                } else if (this.checkPlayerCards(this.game!.lastAction.trump!.suit, hasTrumpCard.card.rank).length > 0) {
                    selectedCard = this.checkPlayerCards(this.game!.lastAction.trump!.suit, hasTrumpCard.card.rank)[Math.floor(Math.random() * this.checkPlayerCards(this.game!.lastAction.trump!.suit, hasTrumpCard.rank).length)];
                } else if (this.checkPlayerCards(this.game!.lastAction.trump!.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(this.game!.lastAction.trump!.suit)[Math.floor(Math.random() * this.checkPlayerCards(this.game!.lastAction.trump!.suit).length)];
                } else {
                    selectedCard = this.playerCards.sort((a, b) => b.rank - a.rank)[0];
                }
            } else {
                if (this.checkPlayerCards(lastDroppedCard.suit, lastDroppedCard.rank).length > 0) {
                    selectedCard = this.checkPlayerCards(lastDroppedCard.suit, lastDroppedCard.rank)[Math.floor(Math.random() * this.checkPlayerCards(lastDroppedCard.suit, lastDroppedCard.rank).length)];
                } else if (this.checkPlayerCards(lastDroppedCard.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(lastDroppedCard.suit)[Math.floor(Math.random() * this.checkPlayerCards(lastDroppedCard.suit).length)];
                } else if (this.checkPlayerCards(this.game!.lastAction.trump!.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(this.game!.lastAction.trump!.suit)[Math.floor(Math.random() * this.checkPlayerCards(this.game!.lastAction.trump!.suit).length)];
                } else {
                    selectedCard = this.playerCards.sort((a, b) => b.rank - a.rank)[0];
                }
            }

        }


        return selectedCard;
    }

    private SelectingCardHard(): Icard | null {
        let selectedCard: Icard | null = null;

        if (this.droppedCards.length === 0) {
            selectedCard = this.playerCards[Math.floor(Math.random() * this.playerCards.length)];
        } else {
            const pairWith = this.game?.lastAction.trumpWith;
            const trump = { suit: this.game!.lastAction.trump!.suit, card: this.game!.lastAction.trump!.card };
            const lastWinning = this.droppedCards.filter((card: Icard) => card.suit === this.droppedCards[0].suit && (this.droppedCards[0].suit == this.game?.lastAction.trump?.suit ? true : card.suit !== this.game?.lastAction.trump?.suit)).sort((a: any, b: any) => b.card.rank - a.card.rank)[0] || this.droppedCards[0];
            const isBeatenByTrump = this.droppedCards.filter((card: Icard) => card.suit === trump.suit && this.game?.lastAction.trump?.suit !== this.droppedCards[0].card.suit);
            const lastTrump = this.droppedCards.filter((card: Icard) => card.suit === this.game!.lastAction.trump!.suit && this.game?.lastAction.trump?.suit !== this.droppedCards[0].card.suit).sort((a: any, b: any) => b.card.rank - a.card.rank)[0] || lastWinning;

            if (isBeatenByTrump) {
                if (this.checkPlayerCards(lastWinning.card.suit).length > 0) {
                    if (pairWith && lastTrump.droppedBy == pairWith) {
                        selectedCard = this.checkPlayerCards(lastWinning.card.suit).sort((a, b) => b.rank - a.rank)[0];
                    } else {
                        selectedCard = this.checkPlayerCards(lastWinning.card.suit).sort((a, b) => a.rank - b.rank)[0];
                    }
                } else if (this.checkPlayerCards(lastTrump.card.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(lastTrump.card.suit).sort((a, b) => b.rank - a.rank)[0];
                } else {
                    if (pairWith && lastTrump.droppedBy == pairWith) {
                        selectedCard = this.playerCards.sort((a, b) => b.rank - a.rank)[0];
                    } else {
                        selectedCard = this.playerCards.sort((a, b) => a.rank - b.rank)[0];
                    }
                }
            } else {
                if (this.checkPlayerCards(lastWinning.card.suit).length > 0) {
                    if (this.checkPlayerCards(lastWinning.card.suit).filter(card => card.rank > lastWinning.card.rank).length > 0) {
                        selectedCard = this.checkPlayerCards(lastWinning.card.suit).filter(card => card.rank > lastWinning.card.rank).sort((a, b) => b.rank - a.rank)[0];
                    } else {
                        if (pairWith && lastWinning.droppedBy == pairWith) {
                            selectedCard = this.checkPlayerCards(lastWinning.card.suit).sort((a, b) => b.rank - a.rank)[0];
                        } else {
                            selectedCard = this.checkPlayerCards(lastWinning.card.suit).sort((a, b) => a.rank - b.rank)[0];
                        }
                    }
                } else if (this.checkPlayerCards(trump.suit).length > 0) {
                    selectedCard = this.checkPlayerCards(trump.suit).sort((a, b) => b.rank - a.rank)[0];
                } else {
                    if (pairWith && lastWinning.droppedBy == pairWith) {
                        selectedCard = this.playerCards.sort((a, b) => b.rank - a.rank).filter(card => card.rank < 11)[0] || this.playerCards.sort((a, b) => b.rank - a.rank)[0];
                    } else {
                        selectedCard = this.playerCards.sort((a, b) => a.rank - b.rank)[0];
                    }
                }
            }
        }


        return selectedCard;
    }

    private checkPlayerCards(suit: string, aboveRank?: number): Icard[] {
        return this.playerCards.filter((card: Icard) => card.suit === suit && (aboveRank ? card.rank > aboveRank : true));
    }

    public select(): any {
        let trump;
        switch (this.difficulty) {
            case 'easy':
                trump = this.selectedTrumpEasy;
                return { actions: 1, isUno: false, playerId: this.name, trump, trumpWith: null };
            case 'medium':
                trump = this.selectedTrumpMedium;
                return { actions: 1, isUno: false, playerId: this.name, trump, trumpWith: null };
            case 'hard':
                trump = this.selectedTrumpHard;
                return { actions: 1, isUno: false, playerId: this.name, trump, trumpWith: null };
        }
    }

    private get selectedTrumpEasy() {
        const suits = ['A', 'B', 'H', 'L'];
        const cards = ['A', 'T', '9', 'K', 'O', 'U'];
        const selectedSuit = suits[Math.floor(Math.random() * suits.length)];
        return { suit: selectedSuit, card: `S_${cards[Math.floor(Math.random() * cards.length)]}${selectedSuit}` };
    }

    private get selectedTrumpMedium() {
        const suits = [this.playerCards.map(card => card.suit).filter((suit, index, self) => self.indexOf(suit) === index)];
        const cards = ['A', 'T', '9', 'K', 'O', 'U'].filter(card => this.playerCards.some(c => c.name !== card[2]));
        const selectedSuit = suits[Math.floor(Math.random() * suits.length)];
        return { suit: selectedSuit, card: `S_${cards[Math.floor(Math.random() * cards.length)] || 'A'}${selectedSuit}` };
    }

    private get selectedTrumpHard() {
        const suits = [this.playerCards.map(card => card.suit).filter((suit, index, self) => self.indexOf(suit) === index)];
        const cards = ['A', 'T', '9', 'K', 'O', 'U'].filter(card => this.playerCards.some(c => c.name !== card[2]));
        const selectedSuit = suits.sort((a, b) => a.length - b.length)[0] || 'H';
        return { suit: selectedSuit, card: `S_${cards[0]}${selectedSuit}` };
    }

}