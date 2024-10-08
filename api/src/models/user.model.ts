
import Joi from "joi";
import { Schema, model } from "mongoose";
import { Auth } from "../enums/auth.enum";

export const userSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        auth: {
            type: Array<string>(),
            default: [
                Auth["PLAYER.UPDATE.YOURSELF"],
                Auth["PLAYER.DELETE.YOURSELF"],
                Auth["PLAYER.GET.INFO"],
                
                Auth["RUMMY.PLAY"],
                Auth["UNO.PLAY"],
                Auth["CREATE.LOBBY"],
                Auth["JOIN.LOBBY"],
                Auth["DELETE.LOBBY"],
                Auth["START.GAME"],
                Auth["END.GAME"],
                Auth["WATCH.GAME"],
                Auth["CHAT"],
                Auth["KICK.LOBBY"],
            ],
            readonly: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        rank: {
            type: Number,
            readonly: true,
            default: 0
        },
        numberOfGames: {
            type: Object,
            readonly: true,
            default: {}
        },
        createdAt: {
            type: Date,
            default: Date.now,
            readonly: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            readonly: true
        }
    },
    { versionKey: false },
);

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        username: Joi.string().required()
    });
    return schema.validate(message);
};

const userModel = model("user", userSchema, "User");


export default {userModel, validate};