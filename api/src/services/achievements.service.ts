import achievementsModel from "../models/achievements.model";
import gameHistoryModel from "../models/game.history.model";
import gameModel from "../models/game.model";

export class AchievementsService {
    protected _id: string;
    public imageUrl: string;
    public name: string;
    public description: string;
    public function: (gameId: string, playerId: string) => Promise<boolean>;

    constructor(achievement: any) {
        this._id = achievement._id;
        this.imageUrl = achievement.imageUrl;
        this.name = achievement.name;
        this.description = achievement.description;
        this.function = (achievementFunctions as any)[achievement.functionId];
    }


}

export async function checkAchievements(gameId: string, playerId: string) {
    if (playerId.includes('bot')) return [];
    const achievements = await achievementsModel.achievementsModel.find({ "check": { $exists: true } });
    const achievedList = [];

    for (const achievement of achievements) {
        try {
            const ach = new AchievementsService(achievement);
            const isAchieved = await ach.function(gameId, playerId);
            console.log(`Achievement ${ach.name} for player ${playerId} in game ${gameId} is ${isAchieved ? 'achieved' : 'not achieved'}`);
            if (isAchieved) {
                achievedList.push(achievement._id);
            }
        } catch { }
    }
    return achievedList;
}

const achievementFunctions = {
    'MG': async function (gameId: string, playerId: string) {
        const game = await gameModel.gameModel.findOne({ _id: gameId });
        if (!game) return false;
        let isMaster = true;
        game.playedCards.forEach((cards) => {
            if (cards.playedBy !== playerId) return;
            const values = cards.cards.map((card) => card.value);
            const uniqueValues = [...new Set(values)];
            if (uniqueValues.length !== 1) {
                isMaster = false;
            }
        });
        return isMaster;
    },
    'SR': async function (gameId: string, playerId: string) {
        const game = await gameHistoryModel.gameHistoryModel.findOne({ gameId: gameId });
        if (!game) return false;
        return Object.keys(game.turns).length <= 3 && game.position.find((p) => p.player === playerId).pos == 1;
    },
    'MS': async function (gameId: string, playerId: string) {
        const game = await gameModel.gameModel.findOne({ _id: gameId });
        if (!game) return false;
        let isMaster = true;
        game.playedCards.forEach((cards) => {
            if (cards.playedBy !== playerId) return;
            const values = cards.cards.map((card) => card.value);
            const uniqueValues = [...new Set(values)];
            if (uniqueValues.length < 2) {
                isMaster = false;
                return;
            }
        });
        return isMaster;
    },
    'FS': async function (gameId: string, playerId: string) {
        const game = await gameHistoryModel.gameHistoryModel.findOne({ gameId: gameId });
        if (!game) return false;
        const firstTurn = game.turns[2].playedCards;
        if (!firstTurn) return false;
        const firstTurnPlayer = firstTurn.find((turn: any) => turn.playedBy === playerId);
        if (!firstTurnPlayer) return false;
        return true;
    },
    'WJ': async function (gameId: string, playerId: string) {
        const game = await gameHistoryModel.gameHistoryModel.findOne({ gameId: gameId });
        if (!game) return false;
        const lastTurnPlayedCards = game.turns[game.turns.length - 1].playedCards;
        lastTurnPlayedCards.forEach((cards: any) => {
            if (cards.playedBy !== playerId) {
            } else {
                const values = cards.cards.filter((card: any) => card.rank === 50);
                if (values.length > 0) {
                    return false;
                }
            }
        });
        return true;
    }

}