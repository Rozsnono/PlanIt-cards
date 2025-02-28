import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/user.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";


export default class GameHistoryService {
    public gameHistory = gameHistoryModel.gameHistoryModel;
    public user = userModel.userModel;
    public game = gameModel.gameModel;

    constructor() {}


    public saveHistory = async (player_id: string, game_id: string) => {

        const game = await this.game.findOne({ _id: game_id });
        if(!game) return { error: ERROR.GAME_NOT_FOUND };
        const player = await this.user.findOne({ _id: player_id });
        if(!player) return { error: ERROR.USER_NOT_FOUND };

        const hasHistory = player.gameHistory.find((history) => history.toString() === game_id.toString());
        if (!hasHistory) {
            player.gameHistory.push(new mongoose.Types.ObjectId(game_id));
            player.numberOfGames++;
            await player.save();

            const gameHistory = {
                gameId: game_id,
                turns: {
                    1: {
                        playerCards: game.playerCards[player_id],
                        playedCards: game.playedCards,
                        droppedCards: game.droppedCards
                    }
                },
                _id: new mongoose.Types.ObjectId()
            };

            await this.gameHistory.create(gameHistory);
            return { message: "History saved!" };
        }

        const gameHistory = await this.gameHistory.findOne({ gameId: game_id });

        if (!gameHistory) {
            return { error: ERROR.GAME_HISTORY_NOT_FOUND };
        }

        gameHistory.turns = {...gameHistory.turns, 
            [Object.keys(gameHistory.turns).length + 1]: {
                playerCards: game.playerCards[player_id],
                playedCards: game.playedCards,
                droppedCards: game.droppedCards
            }
        };
        
        await this.gameHistory.replaceOne({ gameId: game_id }, gameHistory, { runValidators: true });
        return { message: "History saved!" };
    };
}
