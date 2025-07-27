import { Icard } from "../interfaces/interface";
import { UnoDealer } from "./dealer.services";

const ThinkTimeByDifficulty = {
    'easy': { min: 5, max: 10 },
    'medium': { min: 10, max: 30 },
    'hard': { min: 15, max: 60 }
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

    constructor(name: string, difficulty: string, playerCards: Icard[], droppedCards: { droppedBy: string, card: Icard }[], playedCards: any, cards: Icard[], drawedCard: { lastDrawedBy: string }) {
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
            selectedCard.name = selectedCard.suit + selectedCard.name;
        }

        this.droppedCards.push({ droppedBy: this.name, card: selectedCard });
        this.playerCards = this.playerCards.filter(card => card !== selectedCard);

        return { droppedCards: this.droppedCards, playerCards: this.playerCards, drawedCard: this.drawedCard };
    }

    private get dropableCards() {
        return this.playerCards.filter(card => this.validator.validateDrop(this.droppedCards.map((d: any) => d.card), card));
    }
}
