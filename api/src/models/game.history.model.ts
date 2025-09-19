
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
        gameSettings: {
            type: Object,
            default: {},
            readonly: true
        },
        rank: {
            type: Array,
            default: null,
            nullable: true
        },
        type: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            readonly: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            readonly: true
        },
        endedAt: {
            type: Date,
            default: null,
            nullable: true,
            readonly: true
        }
    },
    { versionKey: false },
);

const gameHistoryModel = model("gameHistory", gameHistorySchema, "GameHistory");


export default { gameHistoryModel };