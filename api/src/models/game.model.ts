
import { Schema, model } from "mongoose";
import Joi from "joi";

const gameSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        currentPlayer: {
            type: { playerId: { type: String, required: true }, time: { type: Number, required: true } },
            default: null,
        },
        secretSettings: {
            type: {
                timeLimit: { type: Number, required: true, default: 180 },
                gameType: { type: String, required: true, default: "RUMMY" },
            },
            default: {
                timeLimit: 180,
                gameType: "RUMMY"
            }
        },
        playerCards: {
            type: Object,
            readonly: true
        },
        playedCards: {
            type: [
                {
                    playedBy: { type: String, required: true },
                    cards: { type: Array, required: true },
                }
            ],
            default: [],
            readonly: true
        },
        droppedCards: {
            type: [
                {
                    droppedBy: { type: String },
                    card: { type: Object },
                }
            ],
            default: [],
            readonly: true
        },
        shuffledCards: {
            type: Array,
            default: [],
            readonly: true
        },
        drawedCard: {
            type: { lastDrawedBy: { type: String } },
            default: { lastDrawedBy: null },
            nullable: true
        },
        lastAction: {
            type: {
                playerId: { type: String },
                actions: { type: Number },
                isUno: { type: Boolean, default: false }
            },
            default: null,
            nullable: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
    { versionKey: false },
);

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        shuffledCards: Joi.array().required(),
        currentPlayer: Joi.string(),
        playerCards: Joi.object(),
        playedCards: Joi.array().optional(),
        droppedCards: Joi.array().optional()
    });
    return schema.validate(message);
};

const gameModel = model("game", gameSchema, "Game");


export default { gameModel, validate };