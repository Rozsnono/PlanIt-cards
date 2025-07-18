import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import { ERROR } from "../enums/error.enum";
import achievementsModel from "../models/achievements.model";


export default class AchivementController implements Controller {
    public router = Router();
    public achievement = achievementsModel.achievementsModel;

    constructor() {

        this.router.post("/post/achievement", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.postAchievement(req, res).catch(next);
        });

        this.router.put("/put/achievement", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.putAchievement(req, res).catch(next);
        });

        this.router.delete("/delete/achievement", hasAuth([Auth["ADMIN"]]), (req, res, next) => {
            this.deleteAchievement(req, res).catch(next);
        });


    }

    public postAchievement = async (req: Request, res: Response) => {
        const body = req.body;
        const ach = new this.achievement(body);
        await ach.save();
        res.send({ message: "Achievement created!" });
    }

    private putAchievement = async (req: Request, res: Response) => {
        const body = req.body;
        const ach = await this.achievement.findOne({ _id: body._id });
        if (!ach) {
            res.status(404).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }
        await this.achievement.updateOne({ _id: body._id }, body, { runValidators: true });
        res.send({ message: "Achievement updated!" });
    }

    private deleteAchievement = async (req: Request, res: Response) => {
        const body = req.body;
        const ach = await this.achievement.findOne({ _id: body._id });
        if (!ach) {
            res.status(404).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }
        await this.achievement.deleteOne({ _id: body._id });
        res.send({ message: "Achievement deleted!" });
    }
}