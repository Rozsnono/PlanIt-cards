import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import userModel from "../models/user.model"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";

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
                const token = jwt.sign({ _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName, auth: user.auth, numberOfGames: user.numberOfGames, rank: user.rank, email: user.email }, ACCESS_TOKEN_SECRET);
                res.send({ token: token });
            } else {
                res.status(401).send({ message: "Wrong username or password!" });
            }
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };

    private register = async (req: Request, res: Response) => {
        const body = req.body;
        const { error } = this.validate(body);
        if (error) {
            res.status(400).send({ message: error.details[0].message });
            return;
        }
        const user = await this.user.findOne({ $or: [{ username: body.username }, { email: body.email }] });
        if (user) {
            res.status(400).send({ message: "This user already exists!" });
            return;
        }

        body["password"] = await bcrypt.hash(body["password"], 10);

        const newUser = new this.user(body);
        await newUser.save();
        res.send({ message: "OK" });
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
                res.status(401).send({ message: "Wrong username or password!" });
            }
        } else {
            res.status(404).send({ message: "Try again!" });
        }
    };



}
