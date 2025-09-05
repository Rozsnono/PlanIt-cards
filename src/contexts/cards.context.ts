
export default class CardsUrls {

    public getFullCardUrl(cardName: string) {
        try {
            const type = cardName[0].toUpperCase();
            const card = cardName.split('_')[1];
            switch (type) {
                case "R": return `assets/cards/rummy/${this.getRummyCardUrl(card)}`;
                case "U": return `assets/cards/uno/${this.getUnoCardUrl(card)}`;
                case "S": return `assets/cards/schnapps/${this.getSchnappsCardUrl(card)}`;
            }
        } catch {
            return `assets/cards/uno/back.png`;
        }
    }


    public getCardUrl(card: string) {
        if (['R', 'Y', 'G', 'B', 'W'].includes(card[0]) && !['J'].includes(card[1])) {
            return this.getUnoCardUrl(card);
        }
        try {
            return `${card.toUpperCase()}.png`;
        } catch {
            return `back.png`;
        }
    }

    public getRummyCardUrl(card: string) {
        try {
            return `${card.toUpperCase()}.png`;
        } catch {
            return `back.png`;
        }
    }

    public getUnoCardUrl(card: string) {
        try {
            const { s, v } = { s: card[0].toUpperCase(), v: card.slice(1).toUpperCase() };
            switch (s) {
                case 'R':
                    return `Red_${v}.png`;
                case 'G':
                    return `Green_${v}.png`;
                case 'B':
                    return `Blue_${v}.png`;
                case 'Y':
                    return `Yellow_${v}.png`;
                default:
                    return `${s}${v}.png`;
            }
        } catch {
            return `Deck.png`;
        }
    }

    public getSchnappsCardUrl(card: string) {

        const suits = {
            'A': 'acorn',
            'B': 'bell',
            'H': 'heart',
            'L': 'leaf',
        }
        const values = {
            'A': 'ace',
            'U': 'unter',
            'O': 'ober',
            'K': 'king',
            'T': 'ten',
            '9': 'nine',
        }

        try {
            const { v, s } = { v: card[0].toUpperCase(), s: card.slice(1).toUpperCase() };
            return `${(suits as any)[s]}-${(values as any)[v]}.png`;
        } catch {
            return `assets/cards/schnapps/back.png`;
        }
    }
}