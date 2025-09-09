import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/player.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import lobbyModel from "../models/lobby.model";
import achievementsModel from "../models/achievements.model";
import { GameChecker, SchnappsService } from "./game.service";
import { checkAchievements } from "./achievements.service";
import { LogService } from "./log.service";


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
        const lobby = await this.lobby.findOne({ game_id }).populate("users", "customId username settings").lean();
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };

        if (player.gameHistory.length >= 20) {
            try {
                const oldestHistory = await this.gameHistory.aggregate(
                    [{ $match: { gameId: { $in: player.gameHistory } } }, { $sort: { date: 1 } }, { $limit: 1 }]
                );
                await this.gameHistory.deleteOne({ _id: oldestHistory[0]._id });
                player.gameHistory = player.gameHistory.filter((history) => history.toString() !== oldestHistory[0].gameId.toString());
                await player.save();
            } catch {
                //TODO        
            }
        }
        const hasHistory = player.gameHistory.find((history) => history.toString() === game_id.toString());
        if (!hasHistory) {
            player.gameHistory.push(new mongoose.Types.ObjectId(game_id));
            await player.save();

            const users = (lobby.users as any[]).concat(lobby.bots as any);

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
                users: users,
                date: new Date(),
                _id: new mongoose.Types.ObjectId(),
                position: lobby.users.concat(lobby.bots as any).map((user: any) => { return { player: user.customId, position: 0 } }),
                rank: lobby.users.concat(lobby.bots as any).map((user: any) => { return { player: user.customId, rank: 0 } }),
            };




            return { message: "History saved!" };
            await this.gameHistory.create(gameHistory);
        }

        const gameHistory = await this.gameHistory.findOne({ gameId: game_id }).populate("users", "customId username settings");

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
        // await this.gameHistory.updateOne({ gameId: game_id }, gameHistory, { runValidators: true });
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
            await this.gameHistory.updateOne({ _id: history._id }, history, { runValidators: true });
        });
        return { message: "Position saved!" };
    }

    public async savingHistory(player_id: string, game_id: string) {
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const player = await this.user.findOne({ _id: player_id });
        if (!player) return { error: ERROR.USER_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id: new mongoose.Types.ObjectId(game_id) }).populate("users", "customId username settings rank firstName lastName").lean();
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };

        if (player.gameHistory.length >= 6) {
            try {
                const oldestHistory = await this.gameHistory.aggregate(
                    [{ $match: { gameId: { $in: player.gameHistory } } }, { $sort: { date: 1 } }, { $limit: 1 }]
                );
                await this.gameHistory.deleteOne({ _id: oldestHistory[0]._id });
                player.gameHistory = player.gameHistory.filter((history) => history.toString() !== oldestHistory[0].gameId.toString());
                await player.save();
            } catch {
                //TODO
            }
        }

        const history = await this.gameHistory.findOne({ gameId: game_id });
        if (!history) {
            player.gameHistory.push(new mongoose.Types.ObjectId(game_id));
            await player.save();

            const users = (lobby.users as any[]).concat(lobby.bots as any);
            const newHistory = {
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
                users: users,
                date: new Date(),
                createdAt: new Date(game.createdAt),
                _id: new mongoose.Types.ObjectId(),
                position: lobby.users.concat(lobby.bots as any).map((user: any) => { return { player: user._id, pos: 0 } }),
                rank: lobby.users.concat(lobby.bots as any).map((user: any) => { return { player: user._id, rank: 0 } }),
            }
            await this.gameHistory.create(newHistory);
            return { message: "History created!", code: 200 };
        }
        else {
            history.turns = {
                ...history.turns,
                [Object.keys(history.turns).length + 1]: {
                    playerCards: game.playerCards,
                    playedCards: game.playedCards,
                    droppedCards: game.droppedCards
                }
            };

            await this.gameHistory.updateOne({ gameId: game_id }, history, { runValidators: true });
            return { message: "History updated!", code: 201 };
        }
    }

    public async getStatsForHistory(game_id: string, maxPoints: number) {
        const histories = await this.gameHistory.find({ gameId: game_id }).populate("users", "customId username settings firstName lastName");
        if (!histories) return { error: ERROR.GAME_HISTORY_NOT_FOUND };
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id });
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };

        const gc = new GameChecker();
        const positions = gc.getPositions(game.playerCards);
        const rank = gc.calculatePoints(positions, maxPoints);
        await Promise.all(histories.map(async (history: any) => {
            const data = history.toObject();
            data.position = positions;
            data.rank = rank;
            data.turns = {
                ...data.turns,
                [Object.keys(data.turns).length + 1]: {
                    playerCards: game.playerCards,
                    playedCards: game.playedCards,
                    droppedCards: game.droppedCards
                }
            }
            data.endedAt = new Date();
            const res = await this.gameHistory.updateOne({ _id: new mongoose.Types.ObjectId(history._id) }, data, { runValidators: true });
            if (res.modifiedCount > 0) {
                new LogService().consoleLog(`Game history updated for game ${game_id}`, "History");
            }
        }));

        positions.forEach(async (position: any) => {
            if (position.player.includes("bot")) return; // Skip bots
            const player = await this.user.findById(position.player);
            if (player) {
                const achs = await checkAchievements(game_id, player._id.toString());
                if (achs.length > 0) {
                    achs.forEach(async (ach) => {
                        if (player.achievements.includes(ach)) return;
                        player.achievements.push(ach);
                    })
                }
                if (!lobby.settings?.unranked) {
                    player.rank += rank.find((r: any) => r.player === position.player)?.rank || 0;
                }
                player.gamesStats.numberOfGames += 1;
                if (position.pos === 1) {
                    player.gamesStats.totalWins += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins + 1 || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses || 0,
                    };
                } else {
                    player.gamesStats.totalLosses += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses + 1 || 0,
                    };
                }
                player.gamesStats.winRate = Math.round((player.gamesStats.totalWins / player.gamesStats.numberOfGames) * 100);
                player.gamesStats.totalPlayTime = (new Date().getTime() - new Date(player.createdAt).getTime()) / 1000; // Total playtime in seconds
                player.gamesStats.highestRank = Math.max(player.gamesStats.highestRank || 0, player.rank);
                await this.user.updateOne({ _id: player._id }, player, { runValidators: true });
            }
        })
        await game.deleteOne({ _id: game_id });
        if (lobby) {
            lobby.game_id = null;
            await lobby.save();
        }

        return { message: "Stats updated!", code: 200 };

    }

    public async reCalibrateStatsForHistory(game_id: string, maxPoints: number, game: any) {
        const histories = await this.gameHistory.find({ gameId: game_id }).populate("users", "customId username settings firstName lastName");
        if (!histories) return { error: ERROR.GAME_HISTORY_NOT_FOUND };

        const gc = new GameChecker();
        const positions = gc.getPositions(game.playerCards);
        // const rank = gc.calculatePoints(positions, maxPoints);
        await Promise.all(histories.map(async (history: any) => {
            const data = history.toObject();
            data.position = positions;
            // data.rank = rank;
            data.turns = {
                ...data.turns,
                [Object.keys(data.turns).length + 1]: {
                    playerCards: game.playerCards,
                    playedCards: game.playedCards,
                    droppedCards: game.droppedCards
                }
            }
            data.endedAt = new Date();
            const res = await this.gameHistory.updateOne({ _id: new mongoose.Types.ObjectId(history._id) }, data, { runValidators: true });
            if (res.modifiedCount > 0) {
                new LogService().consoleLog(`Game history updated for game ${game_id}`, "History");
            }
        }));

        positions.forEach(async (position: any) => {
            if (position.player.includes("bot")) return; // Skip bots
            const player = await this.user.findById(position.player);
            if (player) {
                const achs = await checkAchievements(game_id, player._id.toString());
                if (achs.length > 0) {
                    achs.forEach(async (ach) => {
                        if (player.achievements.includes(ach)) return;
                        player.achievements.push(ach);
                    })
                }
                player.gamesStats.numberOfGames += 1;
                if (position.pos === 1) {
                    player.gamesStats.totalWins += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins + 1 || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses || 0,
                    };
                } else {
                    player.gamesStats.totalLosses += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses + 1 || 0,
                    };
                }
                player.gamesStats.winRate = Math.round((player.gamesStats.totalWins / player.gamesStats.numberOfGames) * 100);
                player.gamesStats.totalPlayTime = (new Date().getTime() - new Date(player.createdAt).getTime()) / 1000; // Total playtime in seconds
                player.gamesStats.highestRank = Math.max(player.gamesStats.highestRank || 0, player.rank);
                await this.user.updateOne({ _id: player._id }, player, { runValidators: true });
            }
        })

        return { message: "Stats updated!", code: 200 };

    }

}

export class GameHistorySolitaire extends GameHistoryService {
    public saveHistory = async (player_id: string, game_id: string, isNew?: boolean) => {

        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const player = await this.user.findOne({ _id: player_id });
        if (!player) return { error: ERROR.USER_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id }).populate("users", "_id customId username settings firstName lastName rank");
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
                        droppedCards: game.droppedCards,
                        shuffledCards: game.shuffledCards,
                    }
                },
                users: (lobby.users as any[]).concat(lobby.bots as any),
                date: new Date(),
                type: lobby.settings?.cardType,
                position: lobby.users.map((user: any, index: number) => { return { player: user._id, pos: 0 } }),
                rank: lobby.users.map((user: any, index: number) => { return { player: user._id, rank: 0 } }),
            }
            await this.gameHistory.updateOne({ _id: TMPgameHistory!._id }, newGameHistory, { runValidators: true });
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
                            droppedCards: game.droppedCards,
                            shuffledCards: game.shuffledCards
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
                    droppedCards: game.droppedCards,
                    shuffledCards: game.shuffledCards
                }
            };

            await this.gameHistory.updateOne({ gameId: game_id }, gameHistory, { runValidators: true });
            return { message: "History saved!" };
        }

        return { error: ERROR.GAME_HISTORY_NOT_FOUND };
    };

    public async getStatsForHistory(game_id: string, maxPoints: number) {
        const histories = await this.gameHistory.find({ gameId: game_id }).populate("users", "customId username settings firstName lastName").lean();
        if (!histories) return { error: ERROR.GAME_HISTORY_NOT_FOUND };
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id });
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };

        const positions = [{ player: lobby.users[0]._id, pos: 1 }];
        const rank = [{ player: lobby.users[0]._id, rank: maxPoints }];

        histories.forEach(async (history: any) => {
            history.position = positions;
            history.rank = rank;
            history.endedAt = new Date();

            await this.gameHistory.updateOne({ _id: history._id }, history, { runValidators: true });
        });

        positions.forEach(async (position: any) => {
            const player = await this.user.findById(position.player);
            if (player) {
                if (!lobby.settings?.unranked) {
                    player.rank += rank.find((r: any) => r.player === position.player)?.rank || 0;
                }
                player.gamesStats.numberOfGames += 1;
                if (position.pos === 1) {
                    player.gamesStats.totalWins += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins + 1 || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses || 0,
                    };
                } else {
                    player.gamesStats.totalLosses += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses + 1 || 0,
                    };
                }
                player.gamesStats.winRate = Math.round((player.gamesStats.totalWins / player.gamesStats.numberOfGames) * 100);
                player.gamesStats.totalPlayTime = (new Date().getTime() - new Date(player.createdAt).getTime()) / 1000; // Total playtime in seconds
                player.gamesStats.highestRank = Math.max(player.gamesStats.highestRank || 0, player.rank);
                await this.user.updateOne({ _id: player._id }, player, { runValidators: true });
            }
        })
        await game.deleteOne({ _id: game_id });
        await lobby.deleteOne({ _id: lobby._id });

        return { message: "Stats updated!", code: 200 };

    }
}

export class GameHistorySchnapps extends GameHistoryService {
    public async getStatsForHistory(game_id: string, maxPoints: number) {
        const histories = await this.gameHistory.find({ gameId: game_id }).populate("users", "customId username settings firstName lastName");
        if (!histories) return { error: ERROR.GAME_HISTORY_NOT_FOUND };
        const game = await this.game.findOne({ _id: game_id });
        if (!game) return { error: ERROR.GAME_NOT_FOUND };
        const lobby = await this.lobby.findOne({ game_id });
        if (!lobby) return { error: ERROR.LOBBY_NOT_FOUND };

        const gc = new SchnappsService();
        const pairs = { pairOne: [game.lastAction.playerId!, game.lastAction.trumpWith!]!.filter((p, i) => [game.lastAction.playerId!, game.lastAction.trumpWith!].indexOf(p) === i), pairTwo: Object.keys(game.playerCards).filter((p) => p !== game.lastAction.playerId && p !== game.lastAction.trumpWith) };
        const positions = gc.getPositionsSchnapps(game.playedCards, pairs);
        const rank = gc.calculatePoints(positions, maxPoints);
        await Promise.all(histories.map(async (history: any) => {
            const data = history.toObject();
            data.position = positions;
            data.rank = rank;
            data.turns = {
                ...data.turns,
                [Object.keys(data.turns).length + 1]: {
                    playerCards: game.playerCards,
                    playedCards: game.playedCards,
                    droppedCards: game.droppedCards
                }
            }
            data.endedAt = new Date();
            const res = await this.gameHistory.updateOne({ _id: new mongoose.Types.ObjectId(history._id) }, data, { runValidators: true });
            if (res.modifiedCount > 0) {
                new LogService().consoleLog(`Game history updated for game ${game_id}`, "History");
            }
        }));

        positions.forEach(async (position: any) => {
            if (position.player.includes("bot")) return; // Skip bots
            const player = await this.user.findById(position.player);
            if (player) {
                const achs = await checkAchievements(game_id, player._id.toString());
                if (achs.length > 0) {
                    achs.forEach(async (ach) => {
                        if (player.achievements.includes(ach)) return;
                        player.achievements.push(ach);
                    })
                }
                if (!lobby.settings?.unranked) {
                    player.rank += rank.find((r: any) => r.player === position.player)?.rank || 0;
                }
                player.gamesStats.numberOfGames += 1;
                if (position.pos === 1) {
                    player.gamesStats.totalWins += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins + 1 || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses || 0,
                    };
                } else {
                    player.gamesStats.totalLosses += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses + 1 || 0,
                    };
                }
                player.gamesStats.winRate = Math.round((player.gamesStats.totalWins / player.gamesStats.numberOfGames) * 100);
                player.gamesStats.totalPlayTime = (new Date().getTime() - new Date(player.createdAt).getTime()) / 1000; // Total playtime in seconds
                player.gamesStats.highestRank = Math.max(player.gamesStats.highestRank || 0, player.rank);
                await this.user.updateOne({ _id: player._id }, player, { runValidators: true });
            }
        })
        await game.deleteOne({ _id: game_id });
        if (lobby) {
            lobby.game_id = null;
            await lobby.save();
        }

        return { message: "Stats updated!", code: 200 };

    }

    public async reCalibrateStatsForHistory(game_id: string, maxPoints: number, game: any) {
        const histories = await this.gameHistory.find({ gameId: game_id }).populate("users", "customId username settings firstName lastName");
        if (!histories) return { error: ERROR.GAME_HISTORY_NOT_FOUND };
        const gc = new GameChecker();
        const positions = gc.getPositions(game.playerCards);
        // const rank = gc.calculatePoints(positions, maxPoints);
        await Promise.all(histories.map(async (history: any) => {
            const data = history.toObject();
            data.position = positions;
            // data.rank = rank;
            data.turns = {
                ...data.turns,
                [Object.keys(data.turns).length + 1]: {
                    playerCards: game.playerCards,
                    playedCards: game.playedCards,
                    droppedCards: game.droppedCards
                }
            }
            data.endedAt = new Date();
            const res = await this.gameHistory.updateOne({ _id: new mongoose.Types.ObjectId(history._id) }, data, { runValidators: true });
            if (res.modifiedCount > 0) {
                new LogService().consoleLog(`Game history updated for game ${game_id}`, "History");
            }
        }));

        positions.forEach(async (position: any) => {
            if (position.player.includes("bot")) return; // Skip bots
            const player = await this.user.findById(position.player);
            if (player) {
                const achs = await checkAchievements(game_id, player._id.toString());
                if (achs.length > 0) {
                    achs.forEach(async (ach) => {
                        if (player.achievements.includes(ach)) return;
                        player.achievements.push(ach);
                    })
                }
                player.gamesStats.numberOfGames += 1;
                if (position.pos === 1) {
                    player.gamesStats.totalWins += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins + 1 || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses || 0,
                    };
                } else {
                    player.gamesStats.totalLosses += 1;
                    player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`] = {
                        wins: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.wins || 0,
                        losses: player.gamesStats.gamesPerDate[`${game.createdAt.getMonth() + 1}-${game.createdAt.getDate()}`]?.losses + 1 || 0,
                    };
                }
                player.gamesStats.winRate = Math.round((player.gamesStats.totalWins / player.gamesStats.numberOfGames) * 100);
                player.gamesStats.totalPlayTime = (new Date().getTime() - new Date(player.createdAt).getTime()) / 1000; // Total playtime in seconds
                player.gamesStats.highestRank = Math.max(player.gamesStats.highestRank || 0, player.rank);
                await this.user.updateOne({ _id: player._id }, player, { runValidators: true });
            }
        })
        return { message: "Stats updated!", code: 200 };

    }
}