
import { describe, it, expect } from '@jest/globals';
import { RummyDealer } from '../services/dealer.services';

describe('Rummy Validator Tests', () => {
    it('Should be valid play', () => {
        expect(
            new RummyDealer([]).validatePlay([
                { "name": "4S", "rank": 4, "suit": "S", "pack": 2, "value": 4 },
                { "name": "4H", "rank": 4, "suit": "H", "pack": 2, "value": 4 },
                { "name": "BJ", "rank": 50, "suit": "J", "pack": 2, "value": 50, isJoker: true },
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
            ], [], true)

        ).toEqual('Valid');
    })

    it('Should not be valid play', () => {
        expect(
            new RummyDealer([]).validatePlay([
                { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },
                { "name": "BJ", "rank": 50, "suit": "J", "pack": 2, "value": 50, isJoker: true },
                { "name": "KD", "rank": 13, "suit": "D", "pack": 2, "value": 10 },
                { "name": "AD", "rank": 14, "suit": "D", "pack": 2, "value": 10 },
            ], [], true)

        ).toEqual('0o1406');
    })

    it('Should be a valid sorting', () => {
        expect(
            new RummyDealer([]).rankingMelds([
                { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },
                { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "AD", "rank": 14, "suit": "D", "pack": 2, "value": 10 },
            ])

        ).toEqual(
            {
                completedDeck: [
                    { "name": "AD", "rank": 1, "suit": "D", "pack": 2, "value": 1 },
                    { "name": "2D", "rank": 2, "suit": "D", "pack": 2, "value": 2 },
                    { "name": "3D", "rank": 3, "suit": "D", "pack": 2, "value": 3 },
                    { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                ]
            }
        );
    })
})