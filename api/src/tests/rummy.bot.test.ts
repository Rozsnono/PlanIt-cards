import { expect } from 'chai';
import { describe, it } from 'mocha';
import { RummyBot } from '../services/rummy.bot.service';

describe('RummyBot Tests', () => {
    it('Should not have a sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [],
            [],
            [],
            []
        ).hasSequenceGetter).to.equal([])
    });

    it('Should have a sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [],
            [],
            [],
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ]
        ).hasSequenceGetter).to.deep.equal([
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ]
        ]);
    });

    it('Should have a sequence', () => {
        expect(new RummyBot(
            'RummyBot',
            'easy',
            [],
            [],
            [],
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "5D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "6D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "7D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
                { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
                { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
                { "name": "JD", "rank": 11, "suit": "D", "pack": 2, "value": 10 },
            ]
        ).hasSequenceGetter).to.deep.equal([
            [
                { "name": "4D", "rank": 4, "suit": "D", "pack": 2, "value": 4 },
                { "name": "4D", "rank": 5, "suit": "D", "pack": 2, "value": 5 },
                { "name": "4D", "rank": 6, "suit": "D", "pack": 2, "value": 6 },
                { "name": "4D", "rank": 7, "suit": "D", "pack": 2, "value": 7 },
            ],
            [
                { "name": "9D", "rank": 9, "suit": "D", "pack": 2, "value": 9 },
                { "name": "10D", "rank": 10, "suit": "D", "pack": 2, "value": 10 },
                { "name": "JD", "rank": 11, "suit": "D", "pack": 2, "value": 10 }
            ]
        ]);
    });
})