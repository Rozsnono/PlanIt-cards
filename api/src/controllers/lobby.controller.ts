import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import lobbyModel from "../models/lobby.model";
import gameModel from "../models/game.model";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import Bot from "../services/bot.services";


export default class LobbyController implements Controller {
    public router = Router();
    public lobby = lobbyModel.lobbyModel;
    public validate = lobbyModel.validate;
    public game = gameModel.gameModel;

    constructor() {

        this.router.post("/create", hasAuth([Auth["CREATE.LOBBY"]]), (req, res, next) => {
            this.createLobby(req, res).catch(next);
        });

        this.router.get("/get", hasAuth([Auth["JOIN.LOBBY"], Auth["WATCH.GAME"]]), (req, res, next) => {
            this.getLobby(req, res).catch(next);
        });

        this.router.get("/get/:id", hasAuth([Auth["JOIN.LOBBY"], Auth["WATCH.GAME"]]), (req, res, next) => {
            this.getLobbyById(req, res).catch(next);
        });

        this.router.put("/join/:id", hasAuth([Auth["JOIN.LOBBY"]]), (req, res, next) => {
            this.joinLobby(req, res).catch(next);
        });

        this.router.put("/leave/:id", hasAuth([Auth["JOIN.LOBBY"]]), (req, res, next) => {
            this.leaveLobby(req, res).catch(next);
        });

        this.router.put("/delete", hasAuth([Auth["DELETE.LOBBY"]]), (req, res, next) => {
            this.deleteLobby(req, res).catch(next);
        });

        this.router.put("/update", hasAuth([Auth["CREATE.LOBBY"]]), (req, res, next) => {
            this.updateLobby(req, res).catch(next);
        });

        this.router.put("/watch", hasAuth([Auth["WATCH.GAME"]]), (req, res, next) => {
            this.watchLobby(req, res).catch(next);
        });

        this.router.put("/chat/:id", hasAuth([Auth["CHAT"]]), (req, res, next) => {
            this.chatLobby(req, res).catch(next);
        });

        this.router.put("/mute/:id", hasAuth([Auth["CREATE.LOBBY"]]), (req, res, next) => {
            this.muteUser(req, res).catch(next);
        });

    }

    private createLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const userid = await getIDfromToken(req);
        const { error } = this.validate(body);
        await this.leftLobby(req);
        if (error) {
            res.status(400).send({ message: error.details[0].message });
            return;
        }
        body["_id"] = new mongoose.Types.ObjectId();
        body["users"] = [new mongoose.Types.ObjectId(userid)];
        body["createdBy"] = new mongoose.Types.ObjectId(userid);
        body["bots"] = (body.settings.fillWithRobots ? Array.from({ length: body.settings.numberOfRobots }, (_, i) => { return { name: new Bot().getRobotName(body.settings.robotsDifficulty, i), _id: 'bot' + i } }) : []);
        const newLobby = new this.lobby(body);
        await newLobby.save();
        res.send({ _id: newLobby._id });
    };

    private getLobby = async (req: Request, res: Response) => {
        const query = req.query;
        const filter: any = {};
        const paging: { page: number, limit: number } = { page: 1, limit: 16 };
        if (query.cardType) {
            filter["settings.cardType"] = query.cardType;
        }
        if (query.unranked === "true") {
            filter["settings.unranked"] = true;
        }
        if (query.noPrivateLobby === "true") {
            filter["settings.privateLobby"] = false;
        }
        if (query.noBots === "true") {
            filter["settings.fillWithRobots"] = false;
        }
        if (query.robotsDifficulty) {
            filter["settings.robotsDifficulty"] = parseInt(query.robotsDifficulty.toString());
        }
        if (query.numberOfPlayers) {
            filter["settings.numberOfPlayers"] = parseInt(query.numberOfPlayers.toString());
        }
        if (query.page) {
            paging.page = parseInt(query.page.toString());
        }
        if (query.limit) {
            paging.limit = parseInt(query.limit.toString());
        }
        const lobbies = await this.lobby.find(filter).limit(paging.limit).skip((paging.page-1) * paging.limit).populate("users", "customId username rank");
        const lobbyCount = await this.lobby.countDocuments();
        res.send({ total: parseInt(((lobbyCount / paging.limit) + 1).toFixed(0)), data: lobbies });
    };

    private chatLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = req.params.id;
        const userid = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby && lobby.users.find((p) => p.toString() === userid)) {
            lobby.chat.push(body);
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };

    private muteUser = async (req: Request, res: Response) => {
        const body = req.body;
        const id = req.params.id;
        const userid = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby && lobby.createdBy!.toString() === userid) {
            lobby.mutedPlayers.push(body.player_id);
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };

    private getLobbyById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const lobby = await this.lobby.findOne({ _id: id }).populate("users");
        if (lobby) {
            res.send(lobby);
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };

    private joinLobby = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            if (body.password && lobby.settings?.lobbyCode !== body.password) {
                res.status(400).send({ error: ERROR.INVALID_PASSWORD });
                return;
            }
            if (lobby.users.length >= lobby.settings!.numberOfPlayers!) {
                res.status(400).send({ error: ERROR.LOBBY_FULL });
                return;
            }
            const userid = await getIDfromToken(req);
            if (lobby.users.find((p) => p.toString() === userid.toString())) {
                res.status(400).send({ error: ERROR.ALREADY_IN_LOBBY });
                return;
            }
            await this.leftLobby(req);
            lobby.users.push(new mongoose.Types.ObjectId(userid));
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            const newLobby = await this.lobby.findOne({ _id: id }).populate("users", "customId username rank");
            res.send({ lobby: newLobby });
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };

    private leaveLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            const userid = await getIDfromToken(req);
            lobby.users = lobby.users.filter((p) => p !== userid);
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
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
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };

    private updateLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findById(id);
        if (lobby) {
            await this.lobby.replaceOne({ _id: id }, { ...lobby, settings: body }, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };

    private watchLobby = async (req: Request, res: Response) => {
        const body = req.body;
        const id = body._id;
        const lobby = await this.lobby.findOne({ _id: id });
        if (lobby) {
            const pid = await getIDfromToken(req);
            lobby.mutedPlayers.push(new mongoose.Types.ObjectId(pid));
            await this.lobby.replaceOne({ _id: id }, lobby, { runValidators: true });
            res.send({ message: "OK" });
        } else {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
        }
    };



    private leftLobby = async (req: Request) => {
        const userid = await getIDfromToken(req);
        const lobby = await this.lobby.find({ users: userid });
        if (lobby) {

            lobby.forEach(async (l) => {
                const tmpLobby = l;
                tmpLobby.users = tmpLobby.users.filter((p) => p.toString() !== userid.toString());
                if (tmpLobby.users.length === 0) {
                    await this.lobby.deleteOne({ _id: tmpLobby._id });
                    await this.game.deleteOne({ _id: tmpLobby.game_id });
                    return;
                }
                tmpLobby.createdBy = tmpLobby.createdBy?.toString() === userid ? tmpLobby.users[0] : tmpLobby.createdBy;
                await this.lobby.updateOne({ _id: l._id }, tmpLobby, { runValidators: true });
            });

            return true;
        } else {

            return false;
        }
    };
}
