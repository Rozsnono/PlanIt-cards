import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/user.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import lobbyModel from "../models/lobby.model";


export default class GameHistoryService {
    public gameHistory = gameHistoryModel.gameHistoryModel;
    public user = userModel.userModel;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;

    constructor() { }


    public saveHistory = async (player_id: string, game_id: string) => {

        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const player = await this.user.findOne({ _id: player_id });
        if (!player) return { error: ERROR.USER_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id }).populate("users", "customId username");
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };

        if (player.gameHistory.length >= 8) {
            try {
                const oldestHistory = await this.gameHistory.aggregate(
                    [{ $match: { gameId: { $in: player.gameHistory } } }, { $sort: { date: 1 } }, { $limit: 1 }]
                );
                await this.gameHistory.deleteOne({ _id: oldestHistory[0]._id });

            } catch {
                //TODO        
            }
        }
        const hasHistory = player.gameHistory.find((history) => history.toString() === game_id.toString());
        if (!hasHistory) {
            player.gameHistory.push(new mongoose.Types.ObjectId(game_id));
            player.numberOfGames++;
            await player.save();

            const gameHistory = {
                gameId: game_id,
                lobbyId: lobby._id,
                turns: {
                    1: {
                        playerCards: game.playerCards[player_id],
                        playedCards: game.playedCards,
                        droppedCards: game.droppedCards
                    }
                },
                type: lobby.settings?.cardType,
                players: (lobby.users as any[]).map(u => { return { _id: u.customId, name: `${u.firstName} ${u.lastName}` } }).concat(lobby.bots as any),
                date: new Date(),
                _id: new mongoose.Types.ObjectId()
            };

            await this.gameHistory.create(gameHistory);
            return { message: "History saved!" };
        }

        const gameHistory = await this.gameHistory.findOne({ gameId: game_id });

        if (!gameHistory) {
            return { error: ERROR.GAME_HISTORY_NOT_FOUND };
        }

        gameHistory.turns = {
            ...gameHistory.turns,
            [Object.keys(gameHistory.turns).length + 1]: {
                playerCards: game.playerCards[player_id],
                playedCards: game.playedCards,
                droppedCards: game.droppedCards
            }
        };

        await this.gameHistory.replaceOne({ gameId: game_id }, gameHistory, { runValidators: true });
        return { message: "History saved!" };
    };

    public savePosition = async (lobby_id: string, game_id: string) => {
        const lobby = await this.lobby.findOne({ _id: lobby_id });
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };

        const gameHistory = await this.gameHistory.find({ gameId: game_id });
        if (!gameHistory) return { error: ERROR.GAME_HISTORY_NOT_FOUND };

        const positions = Object.values(game.playerCards).map((cards: any) => { return cards.reduce((sum: any, obj: any) => { return sum + obj.value }, 0) });
        gameHistory.forEach(async (history) => {
            history.position = Object.keys(game.playerCards).length - positions.indexOf(Math.max(...positions));
            await this.gameHistory.replaceOne({ _id: history._id }, history, { runValidators: true });
        });
        return { message: "Position saved!" };
    }
}
