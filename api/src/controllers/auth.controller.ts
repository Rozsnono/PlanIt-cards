import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import userModel from "../models/user.model"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import { UserSettings } from "../cards/user";

const { ACCESS_TOKEN_SECRET = "secret" } = process.env;

export default class AuthController implements Controller {
    public router = Router();
    public user = userModel.userModel;
    public validate = userModel.validate;

    constructor() {
        this.router.post("/login", (req, res, next) => {
            this.login(req, res).catch(next);
        });

        this.router.post("/register", (req, res, next) => {
            this.register(req, res).catch(next);
        });

        this.router.put("/password", hasAuth([Auth["PLAYER.UPDATE.YOURSELF"]]), (req, res, next) => {
            this.password(req, res).catch(next);
        });
    }

    private login = async (req: Request, res: Response) => {
        const body = req.body;

        const user = await this.user.findOne({ username: body.username });
        if (user) {
            const result = await bcrypt.compare(body.password, user.password);
            if (result && !user.isDeleted) {
                const token = jwt.sign({ _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName, auth: user.auth, numberOfGames: user.numberOfGames, rank: user.rank, email: user.email, customId: user.customId, peddingFriends: user.peddingFriends.length, settings: user.settings }, ACCESS_TOKEN_SECRET);
                res.send({ token: token });
            } else {
                res.status(401).send({ error: ERROR.INVALID_USER });
            }
        } else {
            res.status(404).send({ error: "Try again!" });
        }
    };

    private register = async (req: Request, res: Response) => {
        const body = req.body;
        const { error } = this.validate(body);
        if (error) {
            res.status(400).send({ error: error.details[0].message });
            return;
        }
        const user = await this.user.findOne({ $or: [{ username: body.username }, { email: body.email }] });
        if (user) {
            res.status(400).send({ error: ERROR.ALERADY_REGISTERED });
            return;
        }
        body["_id"] = new mongoose.Types.ObjectId();
        body["password"] = await bcrypt.hash(body["password"], 10);
        const hex = Array.from((body.firstName + body.lastName)).map((char: any) => char.charCodeAt(0).toString(16)).join('');
        body["customId"] = hex + new mongoose.Types.ObjectId().toString().slice(0,6);
        const userS = new UserSettings();
        body["settings"] = {
            backgroundColor: userS.getColorByInitials(body.firstName + body.lastName).background,
            textColor: userS.getColorByInitials(body.firstName + body.lastName).text,
        }

        const newUser = new this.user(body);
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id, username: newUser.username, firstName: newUser.firstName, lastName: newUser.lastName, auth: newUser.auth, numberOfGames: newUser.numberOfGames, rank: newUser.rank, email: newUser.email, customId: newUser.customId, settings: newUser.settings }, ACCESS_TOKEN_SECRET);
        res.send({ message: "OK", token: token });
    };

    private password = async (req: Request, res: Response) => {
        const body = req.body;
        const id = await getIDfromToken(req);
        const user = await this.user.findOne({ _id: id });
        if (user) {
            const result = await bcrypt.compare(body.oldpassword, user.password);
            if (result && !user.isDeleted) {
                user.password = await bcrypt.hash(body.newpassword, 10);
                await this.user.replaceOne({ _id: id }, user, { runValidators: true });
                res.send({ message: "OK" });
            } else {
                res.status(401).send({ error: ERROR.INVALID_USER });
            }
        } else {
            res.status(404).send({ error: "Try again!" });
        }
    };



}
