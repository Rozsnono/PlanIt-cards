import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth, getCustomIdFromToken } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import userModel from "../models/player.model";
import { ERROR } from "../enums/error.enum";
import { achievements } from "../cards/achievements";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
import { UserSettings } from "../cards/user";


export default class PlayerController implements Controller {
    public router = Router();
    public user = userModel.userModel

    constructor() {

        this.router.get("/player/:id", hasAuth([Auth["PLAYER.GET.INFO"], Auth.ADMIN]), (req, res, next) => {
            this.getPlayerById(req, res).catch(next);
        });

        this.router.get("/player/:id/home", hasAuth([Auth["PLAYER.GET.INFO"]]), (req, res, next) => {
            this.getPlayerHome(req, res).catch(next);
        });

        this.router.get("/players", hasAuth([Auth["PLAYER.GET.INFO"], Auth.ADMIN]), (req, res, next) => {
            this.getPlayers(req, res).catch(next);
        })

        this.router.delete("/players/:id", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.deletePlayer(req, res).catch(next);
        })

        this.router.put("/players/:id", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.putPlayer(req, res).catch(next);
        });

        this.router.post("/players", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.createPlayer(req, res).catch(next);
        });

        this.router.post("/players/friend", hasAuth([Auth["PLAYER.GET.INFO"]]), (req, res, next) => {
            this.createFriendRequest(req, res).catch(next);
        })

        this.router.post("/players/friend/accept", hasAuth([Auth["PLAYER.GET.INFO"]]), (req, res, next) => {
            this.acceptFriendRequest(req, res).catch(next);
        });

        this.router.post("/players/game/invite", hasAuth([Auth["PLAYER.GET.INFO"]]), (req, res, next) => {
            this.createGameInvite(req, res).catch(next);
        });
    }

    private createFriendRequest = async (req: Request, res: Response) => {
        const body = req.body;
        const id = await getIDfromToken(req);

        if (!body.customId) {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        const player = await this.user.findOne({ _id: id });

        if (!player) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        const friend = await this.user.findOne({ customId: body.customId });

        if (!friend) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        if (player.friends.includes(new mongoose.Types.ObjectId(friend._id))) {
            res.status(409).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }
        friend.peddingFriends.push(new mongoose.Types.ObjectId(player._id));
        await friend.save();
        res.send({ message: "Friend request sent successfully!" });
    }

    private createGameInvite = async (req: Request, res: Response) => {
        const body = req.body;
        const customId = await getCustomIdFromToken(req);

        if (!body.customId) {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        const player = await this.user.findOne({ customId: body.customId });

        if (!player) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        if (player.gameInvites.filter((invite: any) => invite.invitedBy === customId).length > 3) {
            res.status(409).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        player.gameInvites.push(
            {
                invitedBy: customId,
                gameType: body.gameType,
                gameId: body.gameId,
                code: body.code,
                createdAt: new Date(),
            }
        );
        await player.save();

        res.send({ message: "Game invite sent successfully!" });
    }

    private acceptFriendRequest = async (req: Request, res: Response) => {
        const body = req.body;
        const id = await getIDfromToken(req);

        if (!body.customId) {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        const player = await this.user.findOne({ _id: id });

        if (!player) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        const friend = await this.user.findOne({ customId: body.customId });

        if (!friend) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        if (player.friends.includes(new mongoose.Types.ObjectId(friend._id))) {
            res.status(409).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        player.friends.push(new mongoose.Types.ObjectId(friend._id));
        friend.friends.push(new mongoose.Types.ObjectId(player._id));
        player.peddingFriends = player.peddingFriends.filter((f) => f.toString() !== friend._id.toString());
        await player.save();
        await friend.save();

        res.send({ message: "Friend request accepted successfully!" });
    }

    private createPlayer = async (req: Request, res: Response) => {
        const body = req.body;

        if (!body.username || !body.firstName || !body.lastName || !body.email) {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        const existingUser = await this.user.findOne({ username: body.username });

        if (existingUser) {
            res.status(409).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        const hex = Array.from((body.firstName + body.lastName)).map((char: any) => char.charCodeAt(0).toString(16)).join('').slice(0, 10);
        body["customId"] = hex + new mongoose.Types.ObjectId().toString().slice(0, 6);
        const userS = new UserSettings();
        body["settings"] = {
            backgroundColor: userS.getColorByInitials(body.firstName + body.lastName).background,
            textColor: userS.getColorByInitials(body.firstName + body.lastName).text,
        }
        body["password"] = await bcrypt.hash(body["password"], 10);

        const newPlayer = new this.user({
            _id: new mongoose.Types.ObjectId(),
            customId: body.customId,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            username: body.username,
            settings: body.settings,
            password: body.password,
        });

        await newPlayer.save();

        res.status(201).send({ message: "Player created successfully!" });
    }


    private getPlayers = async (req: Request, res: Response) => {

        const query = req.query;
        const paging: { page: number, limit: number } = { page: 1, limit: 14 };
        const _id = await getIDfromToken(req);
        console.log(_id);

        if (query.page) {
            paging.page = parseInt(query.page.toString()) || 1;
        }
        if (query.limit) {
            paging.limit = parseInt(query.limit.toString()) || 14;
        }

        const players = await this.user.find({ $and: [{ _id: { $ne: _id } }, { ...query }] }).skip((paging.page - 1) * paging.limit).limit(paging.limit).sort({ created_at: -1 });

        if (!players || players.length === 0) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        const playerData = players.map(player => ({
            customId: player.customId,
            firstName: player.firstName,
            lastName: player.lastName,
            email: player.email,
            auth: player.auth,
            username: player.username,
            rank: player.rank,
            settings: player.settings,
        }));

        res.send({
            total: Math.round(await this.user.countDocuments(query) / paging.limit) || 0,
            data: playerData
        });
    }

    private putPlayer = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;

        const player = await this.user.findOne({ customId: id });

        if (!player) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        await this.user.updateOne({ customId: id }, body, { runValidators: true });

        res.send({ message: "Player updated successfully!" });
    }

    private deletePlayer = async (req: Request, res: Response) => {
        const id = req.params.id;

        const player = await this.user.findOne({ customId: id });

        if (!player) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        await this.user.deleteOne({ customId: id });

        res.send({ message: "Player deleted successfully!" });
    };


    private getPlayerById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const player = await this.user.findOne({ customId: id }).populate("friends", "customId firstName lastName username rank settings");

        if (!player) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        const achs = achievements.filter((ach) => player.achievements.includes(ach._id));

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
            gamesStats: player.gamesStats,
            achievements: achs,
            settings: player.settings,
            gameInvites: player.gameInvites,
        });
    };

    private getPlayerHome = async (req: Request, res: Response) => {
        const id = req.params.id;
        const players = await this.user.findOne({ customId: id });

        if (!players) {
            res.status(404).send({ error: ERROR.USER_NOT_FOUND });
            return;
        }

        res.send({
            firstName: players.firstName,
            lastName: players.lastName,
            username: players.username,
            rank: players.rank,
            friends: players.friends,
            gamesStats: players.gamesStats.gamesStats,
        });

    };
}
