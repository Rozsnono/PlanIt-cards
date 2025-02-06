import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameHistoryModel from "../models/game.history.model";
import userModel from "../models/user.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";


export default class GameHistoryController implements Controller {
    public router = Router();
    public gameHistory = gameHistoryModel.gameHistoryModel;
    public user = userModel.userModel;
    public game = gameModel.gameModel;

    constructor() {

        this.router.put("/game_history/:id/:game_id", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.saveHistory(req, res).catch(next);
        });

        this.router.get("/game_history/:id/:game_id", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.getHistory(req, res).catch(next);
        });

    }



    private getHistory = async (req: Request, res: Response) => {
        const player_id = req.params.id;
        const game_id = req.params.game_id;

        const game = await this.game.findOne({ _id: game_id });

        if (!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }

        const player = await this.user.findOne({ customId: player_id });

        if (!player) {
            res.status(404).send({ message: "Player not found!" });
            return;
        }

        const gameHistory = await this.gameHistory.findOne({ gameId: game_id });

        if (!gameHistory) {
            res.status(404).send({ message: "Game history not found!" });
            return;
        }

        res.send(gameHistory.turns);
    };


    private saveHistory = async (req: Request, res: Response) => {
        const player_id = req.params.id;
        const game_id = req.params.game_id;

        const game = await this.game.findOne({ _id: game_id });

        if (!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }

        const player = await this.user.findOne({ customId: player_id });

        if (!player) {
            res.status(404).send({ message: "Player not found!" });
            return;
        }

        const hasHistory = player.gameHistory.find((history) => history.toString() === game_id);
        if (!hasHistory) {
            player.gameHistory.push(new mongoose.Types.ObjectId(game_id));
            player.numberOfGames++;
            await player.save();
            res.send({ message: "Game history saved!" });
        }

        const gameHistory = await this.gameHistory.findOne({ gameId: game_id });

        if (!gameHistory) {
            res.status(404).send({ message: "Game history not found!" });
            return;
        }

        gameHistory.turns = {...gameHistory.turns, 
            [gameHistory.turns.length + 1]: {
                playerCards: game.playerCards[player_id].map((card: any) => {return card.name}),
                playedCards: game.playedCards,
                droppedCards: game.droppedCards
            }
        };
        
        await this.gameHistory.replaceOne({ gameId: game_id }, gameHistory, { runValidators: true });
        res.send({ message: "OK" });
    };
}
