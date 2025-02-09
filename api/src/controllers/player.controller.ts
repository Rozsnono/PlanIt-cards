import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import userModel from "../models/user.model";


export default class PlayerController implements Controller {
    public router = Router();
    public user = userModel.userModel

    constructor() {

        this.router.get("/player/:id", hasAuth([Auth["PLAYER.GET.INFO"]]), (req, res, next) => {
            this.getPlayerById(req, res).catch(next);
        });

        this.router.get("/player/:id/home", hasAuth([Auth["PLAYER.GET.INFO"]]), (req, res, next) => {
            this.getPlayerHome(req, res).catch(next);
        });
    }

    private getPlayerById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const player = await this.user.findOne({ customId: id });

        if (!player) {
            res.status(404).send({ message: "Player not found!" });
            return;
        }

        res.send({
            customId: player.customId,
            firstName: player.firstName,
            lastName: player.lastName,
            email: player.email,
            auth: player.auth,
            username: player.username,
            rank: player.rank,
            gameHistory: player.gameHistory,
            friends: player.friends,
            numberOfGames: player.numberOfGames,
        });
    };

    private getPlayerHome = async (req: Request, res: Response) => {
        const id = req.params.id;
        const players = await this.user.findOne({ customId: id });

        if(!players){
            res.status(404).send({message: "Player not found!"});
            return;
        }

        res.send({
            firstName: players.firstName,
            lastName: players.lastName,
            username: players.username,
            rank: players.rank,
            friends: players.friends,
            numberOfGames: players.numberOfGames,
        });

    };
}
