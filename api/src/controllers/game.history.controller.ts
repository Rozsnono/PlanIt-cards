import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/player.model";
import gameModel from "../models/game.model";
import GameHistoryService from "../services/history.services";


export default class GameHistoryController implements Controller {
    public router = Router();
    public gameHistory = gameHistoryModel.gameHistoryModel;
    public user = userModel.userModel;
    public game = gameModel.gameModel;

    constructor() {

        this.router.get("/game_history/:id/:game_id", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.getHistory(req, res).catch(next);
        });

        this.router.get("/game_history/:id", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.getHistoryByUser(req, res).catch(next);
        });

        this.router.delete("/game_history", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.removeAllHistory(req, res).catch(next);
        });

        this.router.get("/recalibrate/:id/:game_id", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.recalibrateHistory(req, res).catch(next);
        });

    }

    private recalibrateHistory = async (req: Request, res: Response) => {
        const game_id = req.params.game_id;
        const id = req.params.id;

        const gameHistory = await this.gameHistory.findOne({ $and: [{ gameId: game_id }, { _id: id }] }).lean();
        if (!gameHistory) {
            res.status(404).send({ error: "Game history not found!" });
            return;
        }

        let maxPoints = 0;
        switch (gameHistory.type) {
            case "UNO":
                // lobby.users.length * 20 + lobby.bots.length * 10 + 10
                maxPoints = Object.keys(gameHistory.turns[1]).filter((key) => !key.includes("bot")).length * 20 + Object.keys(gameHistory.turns[1]).filter((key) => key.includes("bot")).length * 10 + 10;
                break;
            case "RUMMY":
                maxPoints = Object.keys(gameHistory.turns[1]).filter((key) => !key.includes("bot")).length * 20 + Object.keys(gameHistory.turns[1]).filter((key) => key.includes("bot")).length * 10 + 10;
                break;
            default:
                maxPoints = 10;
                return;
        }
        const lastTurn = gameHistory.turns[Object.keys(gameHistory.turns).length - 1];
        if (!lastTurn) {
            res.status(404).send({ error: "Last turn not found!" });
            return;
        }
        
        await new GameHistoryService().reCalibrateStatsForHistory(game_id, maxPoints, {...lastTurn, createdAt: gameHistory.createdAt });

        res.send({ message: "Game history recalibrated successfully!" });
    };

    private getHistory = async (req: Request, res: Response) => {
        const player_id = req.params.id;
        const game_id = req.params.game_id;

        const player = await this.user.findOne({ customId: player_id });

        if (!player) {
            res.status(404).send({ error: "Player not found!" });
            return;
        }

        const gameHistory = await this.gameHistory.findOne({ gameId: game_id });

        if (!gameHistory) {
            res.status(404).send({ error: "Game history not found!" });
            return;
        }

        res.send(gameHistory);
    };

    private getHistoryByUser = async (req: Request, res: Response) => {
        const player_id = req.params.id;

        const player = await this.user.findOne({ customId: player_id });

        if (!player) {
            res.status(404).send({ error: "Player not found!" });
            return;
        }

        const gameHistory = await this.gameHistory.find({ gameId: { $in: player.gameHistory } }).sort({ date: -1 });
        if (!gameHistory) {
            res.status(404).send({ error: "Game history not found!" });
            return;
        }
        res.send(gameHistory);
    }

    private getPosition(allCards: any, id: string) {
        const positions = Object.values(allCards).map((cards: any) => { return cards.reduce((sum: any, obj: any) => { return sum + obj.value }, 0) });
        const sorted = positions.sort((a: any, b: any) => b + a);
        return sorted.indexOf(allCards[id].reduce((sum: any, obj: any) => { return sum + obj.value }, 0)) + 1;
    }

    private removeAllHistory = async (req: Request, res: Response) => {
        const players = await this.user.updateMany({}, { $set: { gameHistory: [] } });
        const games = await this.gameHistory.deleteMany({});
        if (players && games) {
            res.send({ message: "All game history removed successfully!" });
        }
        else {
            res.status(500).send({ error: "An error occurred while removing game history." });
        }
    }
}
