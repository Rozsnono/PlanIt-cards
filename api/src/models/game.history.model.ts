
import { Schema, model } from "mongoose";

const gameHistorySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        gameId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        turns: {
            type: Object,
            default: {},
            readonly: true
        }
    },
    { versionKey: false },
);

const gameHistoryModel = model("gameHistory", gameHistorySchema, "GameHistory");


export default { gameHistoryModel };

// interface iGameHistory {
//     _id: string;
//     turns: {
//         [turn: string]: {
//             playerCards: [],
//             playedCards: [],
//             droppedCards: [],
//         }
//     }
// }