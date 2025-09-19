
import { describe, it, expect } from '@jest/globals';
import { UnoBot } from '../services/bot.services';

describe('UnoBot Tests', () => {
    it('Should play a card', () => {
        expect(new UnoBot(
            'UnoBot',
            'easy',
            [{ name: `U_R2`, rank: 2, suit: "R", pack: 1, value: 2 }], //Player cards
            [{ droppedBy: "", card: { name: `U_R3`, rank: 3, suit: "R", pack: 1, value: 3 } }], //Dropped cards
            [], //Played cards
            [], //Melded cards
            { lastDrawedBy: '' }
        ).play()).toEqual({
            droppedCards: [
                { droppedBy: "", card: { name: `U_R3`, rank: 3, suit: "R", pack: 1, value: 3 } },
                { droppedBy: "UnoBot", card: { name: `U_R2`, rank: 2, suit: "R", pack: 1, value: 2 } }
            ],
            playerCards: [],
            drawedCard: { lastDrawedBy: '' }
        })
    });

    it('Should draw a card', () => {
        expect(new UnoBot(
            'UnoBot',
            'easy',
            [{ name: `U_G2`, rank: 2, suit: "G", pack: 1, value: 2 }], //Player cards
            [{ droppedBy: "", card: { name: `U_R3`, rank: 3, suit: "R", pack: 1, value: 3 } }], //Dropped cards
            [], //Played cards
            [{ name: `U_R2`, rank: 2, suit: "R", pack: 1, value: 2 }], //Melded cards
            { lastDrawedBy: '' }
        ).play()).toEqual({
            droppedCards: [
                { droppedBy: "", card: { name: `U_R3`, rank: 3, suit: "R", pack: 1, value: 3 } },
            ],
            playerCards: [
                { name: `U_G2`, rank: 2, suit: "G", pack: 1, value: 2 },
                { name: `U_R2`, rank: 2, suit: "R", pack: 1, value: 2 }
            ],
            drawedCard: { lastDrawedBy: 'UnoBot' }
        })
    });
})