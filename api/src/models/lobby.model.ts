
import { Schema, model } from "mongoose";
import Joi from "joi";

const lobbySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        }],
        bots: [{
            type: {
                _id: {
                    type: String,
                },
                name: {
                    type: String,
                },
            },
            default: []
        }],
        mutedPlayers: [{
            type: Schema.Types.ObjectId,
            ref: "user",
            default: []
        }],
        settings: {
            type: {
                numberOfPlayers: {
                    type: Number,
                    required: true,

                },
                privateLobby: {
                    type: Boolean,
                },
                lobbyCode: {
                    type: String,
                    default: null,
                },
                unranked: {
                    type: Boolean,
                },
                fillWithRobots: {
                    type: Boolean,
                },
                numberOfRobots: {
                    type: Number,
                    default: 0,
                },
                robotsDifficulty: {
                    type: String,
                    default: 'EASY',
                },
                cardType: {
                    type: String,
                    required: true,
                }
            },
        },
        chat: {
            type: Array,
            default: [],
        },
        game_id: {
            type: Schema.Types.Mixed,
            nullable: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            readonly: true,
        }
    },
    { versionKey: false },
);

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        users: Joi.array(),
        mutedPlayers: Joi.array(),
        settings: Joi.object().keys({
            numberOfPlayers: Joi.number().required(),
            privateLobby: Joi.boolean().optional(),
            lobbyCode: Joi.string().allow(null).optional(),
            unranked: Joi.boolean().optional(),
            fillWithRobots: Joi.boolean().optional(),
            numberOfRobots: Joi.number().optional(),
            robotsDifficulty: Joi.string().optional(),
            cardType: Joi.string().required(),
        }),
        chat: Joi.array().optional(),
        game_id: Joi.string(),
    });
    return schema.validate(message);
};

const lobbyModel = model("lobby", lobbySchema, "Lobby");


export default { lobbyModel, validate };