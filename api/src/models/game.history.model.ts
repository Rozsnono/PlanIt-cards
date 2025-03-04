
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
        lobbyId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        turns: {
            type: Object,
            default: {},
            readonly: true
        },
        players: {
            type: Array,
            default: [],
            readonly: true
        },
        position: {
            type: Number,
        },
        date: {
            type: Date,
            default: Date.now,
            readonly: true
        }
    },  
    { versionKey: false },
);

const gameHistoryModel = model("gameHistory", gameHistorySchema, "GameHistory");


export default { gameHistoryModel };