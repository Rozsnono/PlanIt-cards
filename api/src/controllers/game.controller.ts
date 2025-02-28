import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { ERROR } from "../enums/error.enum";


export default class GameController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;

    constructor() {

        // API route to end a game
        this.router.post("/end/:lobbyId", hasAuth([Auth["END.GAME"]]), (req, res, next) => {
            this.endGame(req, res).catch(next);
        });

        // API route to get a game
        this.router.get("/game/get/:lobby_id/:id", hasAuth([Auth["WATCH.GAME"]]), (req, res, next) => {
            this.getGame(req, res).catch(next);
        });

    }

    private endGame = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }
        await this.game.deleteOne({ _id: lobby.game_id });
        const tmpLobby = lobby.toObject();
        tmpLobby.game_id = undefined;
        await this.lobby.updateOne({ _id: lobbyId }, tmpLobby, { runValidators: false });
        res.send({ message: "Game ended!" });
    };

    private getGame = async (req: Request, res: Response) => {
        const id = req.params.id;
        const lobby_id = req.params.lobby_id;
        const lobby = await this.lobby.findOne({ _id: lobby_id }).populate("users", "firstName lastName rank customId _id");
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        const game = await this.game.findOne({ _id: id });
        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        res.send({ lobby, game });
    };

}