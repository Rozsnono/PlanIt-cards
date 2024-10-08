
import { Schema, model } from "mongoose";
import Joi from "joi";

const lobbySchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: "Player",
            required: true,
        }],
        mutedPlayers: {
            type: Array,
            default: [],
        },
        settings: {
            type: {
                numberOfPlayers: {
                    type: Number,
                    required: true,

                },
                robberRummy: {
                    type: Boolean,
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
            type: Schema.Types.ObjectId,
        },
    },
    { versionKey: false },
);

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        players: Joi.array(),
        mutedPlayers: Joi.array(),
        settings: Joi.object().keys({
            numberOfPlayers: Joi.number().required(),
            robberRummy: Joi.boolean().optional(),
            privateLobby: Joi.boolean().optional(),
            lobbyCode: Joi.string().optional(),
            unranked: Joi.boolean().optional(),
            fillWithRobots: Joi.boolean().optional(),
            numberOfRobots: Joi.number().optional(),
            cardType: Joi.string().required(),
        }),
        chat: Joi.array().optional(),
        game_id: Joi.string().optional(),
    });
    return schema.validate(message);
};

const lobbyModel = model("lobby", lobbySchema, "Lobby");


export default { lobbyModel, validate };