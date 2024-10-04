export default class CardDealer {

    private cards = [
        {
            name: "2S",
            rank: 2,
            suit: "S"
        },
        {
            name: "3S",
            rank: 3,
            suit: "S"
        },
        {
            name: "4S",
            rank: 4,
            suit: "S"
        },
        {
            name: "5S",
            rank: 5,
            suit: "S"
        },
        {
            name: "6S",
            rank: 6,
            suit: "S"
        },
        {
            name: "7S",
            rank: 7,
            suit: "S"
        },
        {
            name: "8S",
            rank: 8,
            suit: "S"
        },
        {
            name: "9S",
            rank: 9,
            suit: "S"
        },
        {
            name: "10S",
            rank: 10,
            suit: "S"
        },
        {
            name: "JS",
            rank: 11,
            suit: "S"
        },
        {
            name: "QS",
            rank: 12,
            suit: "S"
        },
        {
            name: "KS",
            rank: 13,
            suit: "S"
        },
        {
            name: "AS",
            rank: 14,
            suit: "S"
        },
        {
            name: "2H",
            rank: 2,
            suit: "H"
        },
        {
            name: "3H",
            rank: 3,
            suit: "H"
        },
        {
            name: "4H",
            rank: 4,
            suit: "H"
        },
        {
            name: "5H",
            rank: 5,
            suit: "H"
        },
        {
            name: "6H",
            rank: 6,
            suit: "H"
        },
        {
            name: "7H",
            rank: 7,
            suit: "H"
        },
        {
            name: "8H",
            rank: 8,
            suit: "H"
        },
        {
            name: "9H",
            rank: 9,
            suit: "H"
        },
        {
            name: "10H",
            rank: 10,
            suit: "H"
        },
        {
            name: "JH",
            rank: 11,
            suit: "H"
        },
        {
            name: "QH",
            rank: 12,
            suit: "H"
        },
        {
            name: "KH",
            rank: 13,
            suit: "H"
        },
        {
            name: "AH",
            rank: 14,
            suit: "H"
        },
        {
            name: "2D",
            rank: 2,
            suit: "D"
        },
        {
            name: "3D",
            rank: 3,
            suit: "D"
        },
        {
            name: "4D",
            rank: 4,
            suit: "D"
        },
        {
            name: "5D",
            rank: 5,
            suit: "D"
        },
        {
            name: "6D",
            rank: 6,
            suit: "D"
        },
        {
            name: "7D",
            rank: 7,
            suit: "D"
        },
        {
            name: "8D",
            rank: 8,
            suit: "D"
        },
        {
            name: "9D",
            rank: 9,
            suit: "D"
        },
        {
            name: "10D",
            rank: 10,
            suit: "D"
        },
        {
            name: "JD",
            rank: 11,
            suit: "D"
        },
        {
            name: "QD",
            rank: 12,
            suit: "D"
        },
        {
            name: "KD",
            rank: 13,
            suit: "D"
        },
        {
            name: "AD",
            rank: 14,
            suit: "D"
        },
        {
            name: "2C",
            rank: 2,
            suit: "C"
        },
        {
            name: "3C",
            rank: 3,
            suit: "C"
        },
        {
            name: "4C",
            rank: 4,
            suit: "C"
        },
        {
            name: "5C",
            rank: 5,
            suit: "C"
        },
        {
            name: "6C",
            rank: 6,
            suit: "C"
        },
        {
            name: "7C",
            rank: 7,
            suit: "C"
        },
        {
            name: "8C",
            rank: 8,
            suit: "C"
        },
        {
            name: "9C",
            rank: 9,
            suit: "C"
        },
        {
            name: "10C",
            rank: 10,
            suit: "C"
        },
        {
            name: "JC",
            rank: 11,
            suit: "C"
        },
        {
            name: "QC",
            rank: 12,
            suit: "C"
        },
        {
            name: "KC",
            rank: 13,
            suit: "C"
        },
        {
            name: "AC",
            rank: 14,
            suit: "C"
        },
        {
            name: "BJ",
            rank: 50,
            suit: "J",
            isJoker: true
        },
        {
            name: "RJ",
            rank: 50,
            suit: "J",
            isJoker: true
        },
        {
            name: "BJ",
            rank: 50,
            suit: "J",
            isJoker: true
        },
        {
            name: "RJ",
            rank: 50,
            suit: "J",
            isJoker: true
        }
    ]

    constructor() {
    }

    public shuffleDeck(deck: Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> = this.cards): Array<{ name: string, rank: number, suit: string, isJoker?: boolean }> {
        let currentIndex = deck.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        console.log(deck);
        return deck;
    }
}