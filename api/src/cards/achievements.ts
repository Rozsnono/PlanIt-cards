import mongoose from "mongoose";
import gameHistoryModel from "../models/game.history.model";
import gameModel from "../models/game.model";

export const achievements = [
    {
        "_id": new mongoose.Types.ObjectId(),
        "imageUrl": "/assets/achievements/MG.png",
        "name": "Master of Groups",
        "description": "Win the game by only laying down sets (same value card of different suits).",
        'functionId': 'MG',
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "imageUrl": "/assets/achievements/SR.png",
        "name": "Speed Runner",
        "description": "Finish the game in three rounds or less!",
        'functionId': 'SR',
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "imageUrl": "/assets/achievements/SL.png",
        "name": "Master of Sequences",
        "description": "Win the game by only laying down sequences (same suit car of consecutive values).",
        'functionId': 'MS',
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "imageUrl": "/assets/achievements/FS.png",
        "name": "First Strike",
        "description": "Lay down a combination on the table in the very first round.",
        'functionId': 'FS',
    },
    {
        "_id": new mongoose.Types.ObjectId(),
        "imageUrl": "/assets/achievements/WJ.png",
        "name": "Without any Joker",
        "description": "Win a game without using any joker.",
        'functionId': 'WJ',
    }

];
