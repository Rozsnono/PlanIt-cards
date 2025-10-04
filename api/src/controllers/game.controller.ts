import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { ERROR } from "../enums/error.enum";
import { Cards } from "../cards/cards";


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

        // API route to get the value of a card
        this.router.get("/card/value/:name/rummy", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.getCardValue(req, res).catch(next);
        });
        
        // API route to get the value of a card
        this.router.get("/card/value/:name/uno", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.getCardValueUno(req, res).catch(next);
        });

        // API route to modify a game
        this.router.put("/modify/:id", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.modifyGame(req, res).catch(next);
        });

        // API route to delete game
        this.router.delete("/delete/game/:id", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.deleteGame(req, res).catch(next);
        });

        this.router.put("/next/game/:id", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.nextAdminGame(req, res).catch(next);
        });

        this.router.get("/games/all", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.getAllGames(req, res).catch(next);
        });

    }

    private getAllGames = async (req: Request, res: Response) => {
        const games = await this.game.find({});
        res.send(games);
    };

    private nextAdminGame = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;
        const game = await this.game.findOne({ _id: id });
        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        game.currentPlayer = {
            playerId: body.playerId,
            time: new Date().getTime()
        }
        await this.game.updateOne({
            _id: id
        }, game, { runValidators: true });
        res.send({ message: "Next player set!" });
    };

    private deleteGame = async (req: Request, res: Response) => {
        const id = req.params.id;
        const lobbies = await this.lobby.findOne({ _id: id });
        if (!lobbies) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        const playerId = await getIDfromToken(req);
        if (!lobbies.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }
        if (lobbies.createdBy!.toString() !== playerId) {
            res.status(403).send({ error: ERROR.NOT_LOBBY_OWNER });
            return;
        }
        delete lobbies.game_id;
        await this.lobby.updateOne({ _id: id }, lobbies, { runValidators: false });
        await this.game.deleteOne({ _id: lobbies.game_id });
        res.send({ message: "Game deleted!" });
    }

    private modifyGame = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;
        const game = await this.game.findOne({ _id: id });
        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        await this.game.updateOne({ _id: id }, body, { runValidators: true });
        res.send({ message: "Game modified!" });
    }

    private getCardValue = async (req: Request, res: Response) => {
        const name = req.params.name;

        const card = new Cards().getCardValueByName(name);
        if (!card) {
            res.status(404).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }
        res.send({ value: card });
    };

    private getCardValueUno = async (req: Request, res: Response) => {
        const name = req.params.name;

        const card = new Cards().getCardValueByNameUno(name);
        if (!card) {
            res.status(404).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }
        res.send({ value: card });
    };

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
        const lobby = await this.lobby.findOne({ _id: lobby_id }).populate("users", "firstName lastName rank customId _id settings");
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