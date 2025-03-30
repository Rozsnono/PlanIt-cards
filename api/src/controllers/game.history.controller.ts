import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/user.model";
import gameModel from "../models/game.model";


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

    }

    private getHistory = async (req: Request, res: Response) => {
        const player_id = req.params.id;
        const game_id = req.params.game_id;

        const game = await this.game.findOne({ _id: game_id });

        if (!game) {
            res.status(404).send({ error: "Game not found!" });
            return;
        }

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

        const gameHistory = await this.gameHistory.find({ gameId: { $in: player.gameHistory } });
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
}
