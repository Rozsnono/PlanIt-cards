
export default class CardsUrls {
    public getCardUrl(card: string) {
        return `${card.toUpperCase()}.png`;
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