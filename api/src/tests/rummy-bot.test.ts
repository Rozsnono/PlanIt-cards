
import { describe, it, expect } from '@jest/globals';
import { RummyBot } from '../services/bot.services';

describe('RummyBot Tests', () => {
    it('Should NOT have a sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [],
            [],
            [],
            []
        ).hasSequenceGetter).toEqual([])
    });

    it('Should have a sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ],
            [],
            [],
            [],
        ).hasSequenceGetter).toEqual([
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ]
        ]);
    });

    it('Should have a sequence rare', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 1, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
            ],
            [],
            [],
            [],
        ).hasSequenceGetter).toEqual([
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
            ]
        ]);
    });

    it('Should have two sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
                { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
                { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
                { "name": "JD", "rank": 11, "suit": "D", "pack": 2, "value": 10 },
            ],
            [],
            [],
            [],

        ).hasSequenceGetter).toEqual([
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ],
            [
                { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
                { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
                { "name": "JD", "rank": 11, "suit": "D", "pack": 2, "value": 10 }
            ]
        ]);
    });

    it('Should have two sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 1, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 1, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 1, "value": 7 },
            ],
            [],
            [],
            [],

        ).hasSequenceGetter).toEqual([
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ]
        ]);
    });

    it('Should have a set', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                { "name": "5H", "rank": 5, "suit": "H", "pack": 2, "value": 5 },
            ],
            [],
            [],
            [],
        ).hasSetGetter).toEqual([
            [
                { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
            ]
        ]);
    });

    it('Should have two set', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "6S", "rank": 6, "suit": "S", "pack": 2, "value": 6 },
                { "name": "6H", "rank": 6, "suit": "H", "pack": 2, "value": 6 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
            ],
            [],
            [],
            [],
        ).hasSetGetter).toEqual([
            [
                { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
            ],
            [
                { "name": "6S", "rank": 6, "suit": "S", "pack": 2, "value": 6 },
                { "name": "6H", "rank": 6, "suit": "H", "pack": 2, "value": 6 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
            ]
        ]);
    });

    // it('Should have two meld and drop a card', () => {
    //     expect(new RummyBot(
    //         'RummyBot',
    //         'easy',
    //         [
    //             { "name": "2S", "rank": 2, "suit": "S", "pack": 2, "value": 2 },
    //             { "name": "2H", "rank": 2, "suit": "H", "pack": 2, "value": 2 },
    //             { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },

    //             { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
    //             { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
    //             { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
    //             { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
    //             { "name": "8D", "rank": 8, "suit": "D", "pack": 2, "value": 8 },
    //             { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
    //             { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
    //         ],
    //         [],
    //         [],
    //         [
    //             { "name": "10S", "rank": 10, "suit": "S", "pack": 2, "value": 10 },
    //         ],
    //     ).play()).toEqual({
    //         droppedCards: [
    //             {
    //                 droppedBy: 'RummyBot',
    //                 card: { "name": "10S", "rank": 10, "suit": "S", "pack": 2, "value": 10 }
    //             }
    //         ],
    //         playerCards: [],
    //         playedCards: [
    //             {
    //                 playedBy: 'RummyBot',
    //                 cards: [
    //                     { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
    //                     { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
    //                     { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
    //                     { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
    //                     { "name": "8D", "rank": 8, "suit": "D", "pack": 2, "value": 8 },
    //                     { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
    //                     { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
    //                 ]
    //             },
    //             {
    //                 playedBy: 'RummyBot',
    //                 cards: [
    //                     { "name": "2S", "rank": 2, "suit": "S", "pack": 2, "value": 2 },
    //                     { "name": "2H", "rank": 2, "suit": "H", "pack": 2, "value": 2 },
    //                     { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },
    //                 ]
    //             }
    //         ]
    //     });
    // });

    // it('Should have two meld and get back and drop a card', () => {
    //     expect(new RummyBot(
    //         'RummyBot',
    //         'easy',
    //         [
    //             { "name": "2S", "rank": 2, "suit": "S", "pack": 2, "value": 2 },
    //             { "name": "2H", "rank": 2, "suit": "H", "pack": 2, "value": 2 },
    //             { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },

    //             { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
    //             { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
    //             { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
    //             { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
    //             { "name": "8D", "rank": 8, "suit": "D", "pack": 2, "value": 8 },
    //             { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
    //             { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
    //         ],
    //         [],
    //         [],
    //         [
    //             { "name": "JD", "rank": 11, "suit": "D", "pack": 2, "value": 10 },
    //         ],
    //     ).play()).toEqual({
    //         droppedCards: [
    //             {
    //                 droppedBy: 'RummyBot',
    //                 card: { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 }
    //             }
    //         ],
    //         playerCards: [],
    //         playedCards: [
    //             {
    //                 playedBy: 'RummyBot',
    //                 cards: [
    //                     { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
    //                     { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
    //                     { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
    //                     { "name": "8D", "rank": 8, "suit": "D", "pack": 2, "value": 8 },
    //                     { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
    //                     { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
    //                     { "name": "JD", "rank": 11, "suit": "D", "pack": 2, "value": 10 },
    //                 ]
    //             },
    //             {
    //                 playedBy: 'RummyBot',
    //                 cards: [
    //                     { "name": "2S", "rank": 2, "suit": "S", "pack": 2, "value": 2 },
    //                     { "name": "2H", "rank": 2, "suit": "H", "pack": 2, "value": 2 },
    //                     { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },
    //                 ]
    //             }
    //         ]
    //     });
    // });

    // it('Should NOT have any meld and drop a card', () => {
    //     expect(new RummyBot(
    //         'RummyBot',
    //         'easy',
    //         [
    //             { "name": "2S", "rank": 2, "suit": "S", "pack": 2, "value": 2 },
    //             { "name": "2H", "rank": 2, "suit": "H", "pack": 2, "value": 2 },
    //             { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },

    //             { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
    //             { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
    //             { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
    //             { "name": "8D", "rank": 8, "suit": "D", "pack": 2, "value": 8 },
    //             { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
    //         ],
    //         [],
    //         [],
    //         [
    //             { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
    //         ],
    //     ).play()).toEqual({
    //         droppedCards: [
    //             {
    //                 droppedBy: 'RummyBot',
    //                 card: { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
    //             }
    //         ],
    //         playerCards: [
    //             { "name": "2S", "rank": 2, "suit": "S", "pack": 2, "value": 2 },
    //             { "name": "2H", "rank": 2, "suit": "H", "pack": 2, "value": 2 },
    //             { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },
    //             { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
    //             { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
    //             { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
    //             { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
    //             { "name": "8D", "rank": 8, "suit": "D", "pack": 2, "value": 8 },

    //         ],
    //         playedCards: []
    //     });
    // });

    it('Should NOT put any card in the deck, easy', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                { "name": "5C", "rank": 5, "suit": "C", "pack": 2, "value": 5 },
                { "name": "6C", "rank": 6, "suit": "C", "pack": 2, "value": 6 },
                { "name": "7C", "rank": 7, "suit": "C", "pack": 2, "value": 7 },
            ],
            [],
            [
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                        { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                        { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    ]
                },
            ],
            [],
        ).hasForPuttableCardsGetter).toEqual([
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                    { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                    { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                ]
            }
        ]);
    })

    it('Should NOT put any card in the deck, easy', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
            ],
            [],
            [
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                        { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                        { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    ]
                },
            ],
            [],
        ).hasForPuttableCardsGetter).toEqual([
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                    { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                    { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                ]
            }
        ]);
    })

    it('Should put a card in the deck, easy', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                { "name": "5C", "rank": 5, "suit": "C", "pack": 2, "value": 5 },
            ],
            [],
            [
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                        { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                        { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    ]
                },
            ],
            [],
        ).hasForPuttableCardsGetter).toEqual([
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                    { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                    { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                ]
            }
        ]);
    })

    it('Should put a card in the deck, easy', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                { "name": "3C", "rank": 3, "suit": "C", "pack": 2, "value": 3 },
            ],
            [],
            [
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                        { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                        { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    ]
                },
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                        { "name": "3S", "rank": 3, "suit": "S", "pack": 2, "value": 3 },
                        { "name": "3H", "rank": 3, "suit": "H", "pack": 2, "value": 3 },
                    ]
                }
            ],
            [],
        ).hasForPuttableCardsGetter).toEqual([
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                    { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                    { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                ]
            },
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                    { "name": "3S", "rank": 3, "suit": "S", "pack": 2, "value": 3 },
                    { "name": "3H", "rank": 3, "suit": "H", "pack": 2, "value": 3 },
                ]
            }
        ]);
    })

    it('Should put a card in the deck, medium', () => {
        expect(new RummyBot(
            'RummyBot',
            'medium',
            [
                { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                { "name": "3C", "rank": 3, "suit": "C", "pack": 2, "value": 3 },
            ],
            [],
            [
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                        { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                        { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    ]
                },
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                        { "name": "3S", "rank": 3, "suit": "S", "pack": 2, "value": 3 },
                        { "name": "3H", "rank": 3, "suit": "H", "pack": 2, "value": 3 },
                    ]
                }
            ],
            [],
        ).hasForPuttableCardsGetter).toEqual([
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                    { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                    { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                ]
            },
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                    { "name": "3S", "rank": 3, "suit": "S", "pack": 2, "value": 3 },
                    { "name": "3H", "rank": 3, "suit": "H", "pack": 2, "value": 3 },
                ]
            }
        ]);
    })

    it('Should put two card in the deck, hard', () => {
        expect(new RummyBot(
            'RummyBot',
            'hard',
            [
                { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                { "name": "3C", "rank": 3, "suit": "C", "pack": 2, "value": 3 },
                { "name": "5C", "rank": 5, "suit": "C", "pack": 2, "value": 5 },
            ],
            [],
            [
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                        { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                        { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    ]
                },
                {
                    playedBy: 'RummyBot', cards: [
                        { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                        { "name": "3S", "rank": 3, "suit": "S", "pack": 2, "value": 3 },
                        { "name": "3H", "rank": 3, "suit": "H", "pack": 2, "value": 3 },
                    ]
                }
            ],
            [],
        ).hasForPuttableCardsGetter).toEqual([
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                    { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                    { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                    { "name": "4C", "rank": 4, "suit": "C", "pack": 2, "value": 4 },
                ]
            },
            {
                playedBy: 'RummyBot', cards: [
                    { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                    { "name": "3S", "rank": 3, "suit": "S", "pack": 2, "value": 3 },
                    { "name": "3H", "rank": 3, "suit": "H", "pack": 2, "value": 3 },
                    { "name": "3C", "rank": 3, "suit": "C", "pack": 2, "value": 3 },
                ]
            }
        ]);
    })

    it('Should drop a card, easy', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
            ],
            [],
            [],
            [],
        ).droppingCardGetter).toEqual({ "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 });
    });

    it('Should drop a card, medium', () => {
        expect(new RummyBot(
            'RummyBot',
            'medium',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "BJ", "rank": 50, "suit": "B", "pack": 2, "value": 50, isJoker: true },
            ],
            [],
            [],
            [],
        ).droppingCardGetter).toEqual({ "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 });
        expect(new RummyBot(
            'RummyBot',
            'medium',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "BJ", "rank": 50, "suit": "B", "pack": 2, "value": 50, isJoker: true },
            ],
            [],
            [],
            [],
        ).droppingCardGetter).toEqual({ "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 });
        expect(new RummyBot(
            'RummyBot',
            'medium',
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "BJ", "rank": 50, "suit": "B", "pack": 2, "value": 50, isJoker: true },
            ],
            [],
            [],
            [],
        ).droppingCardGetter).toEqual({ "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 });

    });
})