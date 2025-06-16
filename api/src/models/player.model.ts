
import Joi from "joi";
import { Schema, model } from "mongoose";
import { Auth } from "../enums/auth.enum";

export const userSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        customId: {
            type: String, 
            readonly: true,
            unique: true,
            nullable: true,
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
        achievements: {
            type: Array<string>(),
            readonly: true,
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now,
            readonly: true
        },
        friends: {
            type: Array<Schema.Types.ObjectId>(),
            default: [],
            ref: "user",
        },
        peddingFriends: {
            type: Array<Schema.Types.ObjectId>(),
            default: [],
        },
        gameHistory:{
            type: Array<Schema.Types.ObjectId>(),
            default: [],
        },
        settings: {
            type: Object,
            default: {
                backgroundColor: "#000000",
                textColor: "#FFFFFF",
                hasPicture: false,
                selectedPicture: "default.png",
                hidden: false,
                canInvite: true,
            }
        },
        registraionCode: {
            type: String,
            default: null,
            nullable: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            readonly: true
        }
    },
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const validate = (message: object): Joi.ValidationResult => {
    const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().email(),
        password:  Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
        username: Joi.string().required()
    });
    return schema.validate(message);
};

const userModel = model("user", userSchema, "User");


export default {userModel, validate};