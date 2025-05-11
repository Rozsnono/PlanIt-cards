import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/user.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import lobbyModel from "../models/lobby.model";
import { GameChecker } from "./game.service";


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
        const lobby = await this.lobby.findOne({ game_id }).populate("users", "customId username settings");
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
                players: (lobby.users as any[]).concat(lobby.bots as any),
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

    public savePosition = async (lobby_id: string, game_id: string, maxPoints: number) => {
        const lobby = await this.lobby.findOne({ _id: lobby_id });
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };

        const gameHistory = await this.gameHistory.find({ gameId: game_id });
        if (!gameHistory) return { error: ERROR.GAME_HISTORY_NOT_FOUND };

        const positions = new GameChecker().getPositions(game.playerCards);
        gameHistory.forEach(async (history) => {
            history.position = positions;
            if (!lobby.settings?.unranked) {
                history.rank = new GameChecker().calculatePoints(positions, maxPoints);
            }
            await this.gameHistory.replaceOne({ _id: history._id }, history, { runValidators: true });
        });
        return { message: "Position saved!" };
    }
}

export class GameHistorySolitaire extends GameHistoryService {
    public saveHistory = async (player_id: string, game_id: string, isNew?: boolean) => {

        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const player = await this.user.findOne({ _id: player_id });
        if (!player) return { error: ERROR.USER_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id }).populate("users", "_id customId username settings firstName lastName");
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };
        const gameH = await this.gameHistory.find({ playerId: player_id }).populate("lobbyId", "settings");
        const finded = gameH.find((history: any) => history.lobbyId == null || (history.lobbyId != null && history.lobbyId.settings?.cardType === 'SOLITAIRE'));
        const gameHistory = await this.gameHistory.findOne({ gameId: game_id });
        if (gameH && finded && (!gameHistory || isNew)) {
            const TMPgameHistory = finded;
            if (!TMPgameHistory) return { error: ERROR.GAME_HISTORY_NOT_FOUND };
            const newGameHistory = {
                gameId: game_id,
                lobbyId: lobby._id,
                turns: {
                    1: {
                        playerCards: game.playerCards,
                        playedCards: game.playedCards,
                        droppedCards: game.droppedCards
                    }
                },
                players: (lobby.users as any[]).concat(lobby.bots as any),
                date: new Date(),
                position: lobby.users.map((user: any, index: number) => {return { player: user.customId, position: 0 } }),
                rank: lobby.users.map((user: any, index: number) => {return { player: user.customId, rank: 0 } }),
            }
            await this.gameHistory.replaceOne({ _id: TMPgameHistory!._id }, newGameHistory, { runValidators: true });
            return { message: "History saved!" };
        } else {
            const hasHistory = player.gameHistory.find((history) => history.toString() === game_id.toString());
            if (!hasHistory) {
                player.gameHistory.push(new mongoose.Types.ObjectId(game_id));
                await player.save();

                const gameHistory = {
                    gameId: game_id,
                    lobbyId: lobby._id,
                    turns: {
                        1: {
                            playerCards: game.playerCards,
                            playedCards: game.playedCards,
                            droppedCards: game.droppedCards
                        }
                    },
                    type: lobby.settings?.cardType,
                    players: (lobby.users as any[]).concat(lobby.bots as any),
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
                    playerCards: game.playerCards,
                    playedCards: game.playedCards,
                    droppedCards: game.droppedCards
                }
            };

            await this.gameHistory.replaceOne({ gameId: game_id }, gameHistory, { runValidators: true });
            return { message: "History saved!" };
        }

        return { error: ERROR.GAME_HISTORY_NOT_FOUND };
    };

    public savePosition = async (lobby_id: string, game_id: string, maxPoints: number) => {
        const lobby = await this.lobby.findOne({ _id: lobby_id });
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };

        const gameHistory = await this.gameHistory.find({ gameId: game_id });
        if (!gameHistory) return { error: ERROR.GAME_HISTORY_NOT_FOUND };

        gameHistory.forEach(async (history) => {
            history.position = history.position.map((p: any) => {return { player: p.player, position: 1 } });
            history.rank = new GameChecker().calculatePoints(history.position, maxPoints);
            await this.gameHistory.replaceOne({ _id: history._id }, history, { runValidators: true });
        });
        return { message: "Position saved!" };
    }
}