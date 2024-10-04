import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import CardDealer from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";


export default class LobbyController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    public cardDealer = new CardDealer();

    constructor() {

        this.router.post("/start/:lobbyId", hasAuth([Auth["RUMMY.START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });

        this.router.post("/end", hasAuth([Auth["RUMMY.END.GAME"]]), (req, res, next) => {
            this.endGame(req, res).catch(next);
        });

        this.router.get("/get/:id", hasAuth([Auth["RUMMY.WATCH.GAME"]]), (req, res, next) => {
            this.getGame(req, res).catch(next);
        });

        this.router.put("/next", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.nextTurn(req, res).catch(next);
        });

    }

    private startGame = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;
        const { error } = this.validate(body);
        if (error) {
            res.status(400).send({ message: error.details[0].message });
            return;
        }

        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if(!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }

        body["deck"] = this.cardDealer.shuffleDeck();
        body["playerCards"] = this.cardDealer.dealCards(lobby?.players);
        const newGame = new this.game(body);
        await newGame.save();
        res.send({ message: "Game started!" });
    };

}
