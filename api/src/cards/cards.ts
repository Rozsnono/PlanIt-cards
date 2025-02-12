export const uno = [
    {
        name: "0R",
        rank: 0,
        suit: "R"
    },
    {
        name: "1R",
        rank: 1,
        suit: "R"
    },
    {
        name: "2R",
        rank: 2,
        suit: "R"
    },
    {
        name: "3R",
        rank: 3,
        suit: "R"
    },
    {
        name: "4R",
        rank: 4,
        suit: "R"
    },
    {
        name: "5R",
        rank: 5,
        suit: "R"
    },
    {
        name: "6R",
        rank: 6,
        suit: "R"
    },
    {
        name: "7R",
        rank: 7,
        suit: "R"
    },
    {
        name: "8R",
        rank: 8,
        suit: "R"
    },
    {
        name: "9R",
        rank: 9,
        suit: "R"
    },
    {
        name: "D2R",
        rank: 18,
        suit: "R"
    },
    {
        name: "SR",
        rank: 16,
        suit: "R"
    },
    {
        name: "RR",
        rank: 15,
        suit: "R"
    },
    {
        name: "0G",
        rank: 0,
        suit: "G"
    },
    {
        name: "1G",
        rank: 1,
        suit: "G"
    },
    {
        name: "2G",
        rank: 2,
        suit: "G"
    },
    {
        name: "3G",
        rank: 3,
        suit: "G"
    },
    {
        name: "4G",
        rank: 4,
        suit: "G"
    },
    {
        name: "5G",
        rank: 5,
        suit: "G"
    },
    {
        name: "6G",
        rank: 6,
        suit: "G"
    },
    {
        name: "7G",
        rank: 7,
        suit: "G"
    },
    {
        name: "8G",
        rank: 8,
        suit: "G"
    },
    {
        name: "9G",
        rank: 9,
        suit: "G"
    },
    {
        name: "D2G",
        rank: 18,
        suit: "G"
    },
    {
        name: "SG",
        rank: 16,
        suit: "G"
    },
    {
        name: "RG",
        rank: 15,
        suit: "G"
    },
    {
        name: "0B",
        rank: 0,
        suit: "B"
    },
    {
        name: "1B",
        rank: 1,
        suit: "B"
    },
    {
        name: "2B",
        rank: 2,
        suit: "B"
    },
    {
        name: "3B",
        rank: 3,
        suit: "B"
    },
    {
        name: "4B",
        rank: 4,
        suit: "B"
    },
    {
        name: "5B",
        rank: 5,
        suit: "B"
    },
    {
        name: "6B",
        rank: 6,
        suit: "B"
    },
    {
        name: "7B",
        rank: 7,
        suit: "B"
    },
    {
        name: "8B",
        rank: 8,
        suit: "B"
    },
    {
        name: "9B",
        rank: 9,
        suit: "B"
    },
    {
        name: "D2B",
        rank: 18,
        suit: "B"
    },
    {
        name: "SB",
        rank: 16,
        suit: "B"
    },
    {
        name: "RB",
        rank: 15,
        suit: "B"
    },
    {
        name: "0Y",
        rank: 0,
        suit: "Y"
    },
    {
        name: "1Y",
        rank: 1,
        suit: "Y"
    },
    {
        name: "2Y",
        rank: 2,
        suit: "Y"
    },
    {
        name: "3Y",
        rank: 3,
        suit: "Y"
    },
    {
        name: "4Y",
        rank: 4,
        suit: "Y"
    },
    {
        name: "5Y",
        rank: 5,
        suit: "Y"
    },
    {
        name: "6Y",
        rank: 6,
        suit: "Y"
    },
    {
        name: "7Y",
        rank: 7,
        suit: "Y"
    },
    {
        name: "8Y",
        rank: 8,
        suit: "Y"
    },
    {
        name: "9Y",
        rank: 9,
        suit: "Y"
    },
    {
        name: "D2Y",
        rank: 18,
        suit: "Y"
    },
    {
        name: "SY",
        rank: 16,
        suit: "Y"
    },
    {
        name: "RY",
        rank: 15,
        suit: "Y"
    },
    {
        name: "W4",
        rank: 20,
        suit: "",
        isJoker: true
    },
    {
        name: "W4",
        rank: 20,
        suit: "",
        isJoker: true
    },
    {
        name: "W4",
        rank: 20,
        suit: "",
        isJoker: true
    },
    {
        name: "W4",
        rank: 20,
        suit: "",
        isJoker: true
    },
    {
        name: "W",
        rank: 24,
        suit: "",
        isJoker: true
    },
    {
        name: "W",
        rank: 24,
        suit: "",
        isJoker: true
    },
    {
        name: "W",
        rank: 24,
        suit: "",
        isJoker: true
    },
    {
        name: "W",
        rank: 24,
        suit: "",
        isJoker: true
    }
];

export const schnapsen = [];

export class Cards {
    constructor() { }

    public get rummy() {
        return this.getRummyCards();
    }


    private getRummyCards() {
        const rummy = [];
        const suits = ["S", "H", "D", "C"];
        const ranks = [
            { name: "2", rank: 2, value: 2 },
            { name: "3", rank: 3, value: 3 },
            { name: "4", rank: 4, value: 4 },
            { name: "5", rank: 5, value: 5 },
            { name: "6", rank: 6, value: 6 },
            { name: "7", rank: 7, value: 7 },
            { name: "8", rank: 8, value: 8 },
            { name: "9", rank: 9, value: 9 },
            { name: "10", rank: 10, value: 10 },
            { name: "J", rank: 11, value: 10 },
            { name: "Q", rank: 12, value: 10 },
            { name: "K", rank: 13, value: 10 },
            { name: "A", rank: 14, value: 10 }
        ];

        // Generating both packs
        for (let pack = 1; pack <= 2; pack++) {
            for (const suit of suits) {
                for (const { name, rank, value } of ranks) {
                    rummy.push({ name: `${name}${suit}`, rank, suit, pack: pack, value });
                }
            }
            // Adding jokers
            rummy.push({ name: "BJ", rank: 50, suit: "J", isJoker: true, pack: pack, value: 10 });
            rummy.push({ name: "RJ", rank: 50, suit: "J", isJoker: true, pack: pack, value: 10 });
        }

        return rummy;
    }

}