import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import lobbyModel from "../models/lobby.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";


export default class LobbyController implements Controller {
    public router = Router();
    public lobby = lobbyModel.lobbyModel;
    public validate = lobbyModel.validate;
    public game = gameModel.gameModel;

    constructor() {

        this.router.post("/create", hasAuth([Auth["RUMMY.CREATE.LOBBY"]]), (req, res, next) => {
            this.createLobby(req, res).catch(next);
        });

        this.router.get("/get", hasAuth([Auth["RUMMY.JOIN.LOBBY"], Auth["RUMMY.WATCH.GAME"]]), (req, res, next) => {
            this.getLobby(req, res).catch(next);
        });

        this.router.get("/get/:id", hasAuth([Auth["RUMMY.JOIN.LOBBY"], Auth["RUMMY.WATCH.GAME"]]), (req, res, next) => {
            this.getLobbyById(req, res).catch(next);
        });

        this.router.put("/join", hasAuth([Auth["RUMMY.JOIN.LOBBY"]]), (req, res, next) => {
            this.joinLobby(req, res).catch(next);
        });

        this.router.put("/leave", hasAuth([Auth["RUMMY.JOIN.LOBBY"]]), (req, res, next) => {
            this.leaveLobby(req, res).catch(next);
        });

        this.router.put("/delete", hasAuth([Auth["RUMMY.DELETE.LOBBY"]]), (req, res, next) => {
            this.deleteLobby(req, res).catch(next);
        });

        this.router.put("/update", hasAuth([Auth["RUMMY.CREATE.LOBBY"]]), (req, res, next) => {
            this.updateLobby(req, res).catch(next);
        });

        this.router.put("/watch", hasAuth([Auth["RUMMY.WATCH.GAME"]]), (req, res, next) => {
            this.watchLobby(req, res).catch(next);
        });


    }

    private createLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const { error } = this.validate(body);
        if (error) {
            res.status(400).send({ message: error.details[0].message });
            return;
        }
        const newLobby = new this.lobby(body);
        await newLobby.save();
        res.send({ message: "OK" });
    };

    private getLobby = async (req: Request, res: Response) => {
        const lobbies = await this.lobby.find();
        res.send(lobbies);
    };

    private getLobbyById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const lobby = await this.lobby.findOne({ _id: id }).populate("players");
        if (lobby) {
            res.send(lobby);
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };

    private joinLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            const userid = await getIDfromToken(req);
            lobby.players.push(new mongoose.Types.ObjectId(userid));
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };

    private leaveLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            const userid = await getIDfromToken(req);
            lobby.players = lobby.players.filter((p) => p !== userid);
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };

    private deleteLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            await this.lobby.deleteOne({ _id: id });
            await this.game.deleteOne({ _id: lobby.game_id });
            res.send({ message: "OK" });
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };

    private updateLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            await this.lobby.replaceOne({ _id: id }, body, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };

    private watchLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            lobby.mutedPlayers.push(getIDfromToken(req));
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };
}
