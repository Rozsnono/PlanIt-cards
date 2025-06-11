
import { Schema, model } from "mongoose";

const gameHistorySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        gameId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "game" 
        },
        lobbyId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "lobby"
        },
        turns: {
            type: Object,
            default: {},
            readonly: true
        },
        users: [{
            type: Object,
            default: [],
            readonly: true,
        }],
        position: {
            type: Array,
            default: null, 
            nullable: true
        },
        rank: {
            type: Array,
            default: null,
            nullable: true
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