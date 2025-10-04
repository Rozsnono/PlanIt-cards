
import { Schema, model } from "mongoose";
import { uptime } from "process";

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
        gameActions: {
            type: Object,
            default: {},
            readonly: true
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
        createdAt: {
            type: Date,
            default: Date.now,
            readonly: true
        },
        updatedAt: {
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