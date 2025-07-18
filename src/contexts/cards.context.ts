
export default class CardsUrls {
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
            return `${card}.png`;
        }
    }
}