
import mongoose, { Schema, model } from "mongoose";

export const achievementsSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        functionId: {
            type: String,
            required: true
        }
    },
    { versionKey: false, id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);


const achievementsModel = model("achivement", achievementsSchema, "Achivement");


export default { achievementsModel };