import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import CardDealer from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { rummy } from "../cards/cards";


export default class GameController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    public cardDealer = new CardDealer(rummy);

    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId", hasAuth([Auth["RUMMY.START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });

        // API route to end a game
        this.router.post("/end/:lobbyId", hasAuth([Auth["RUMMY.END.GAME"]]), (req, res, next) => {
            this.endGame(req, res).catch(next);
        });

        // API route to get a game
        this.router.get("/get/:id", hasAuth([Auth["RUMMY.WATCH.GAME"]]), (req, res, next) => {
            this.getGame(req, res).catch(next);
        });

        // API route to get the next turn
        this.router.put("/next/:lobbyId", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
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
        // check if the lobby exists
        if(!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        // set the game state
        body["deck"] = this.cardDealer.shuffleDeck();
        // deal the cards
        body["playerCards"] = this.cardDealer.dealCards(lobby?.players);
        body["currentPlayer"] = lobby?.players[0];
        const newGame = new this.game(body);
        await newGame.save();
        res.send({ message: "Game started!" });
    };

    private nextTurn = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;
        const gameId = body.gameId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if(!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        const game = await this.game.findOne({ _id: gameId });
        if(!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        // check if the player is the current player
        if(playerId !== game.currentPlayer) {
            res.status(403).send({ message: "Not your turn!" });
            return;
        }

        // get the next player
        const currentPlayerIndex = lobby.players.indexOf(game.currentPlayer);
        const nextPlayerIndex = currentPlayerIndex === lobby.players.length - 1 ? 0 : currentPlayerIndex + 1;
        
        game.currentPlayer = lobby.players[nextPlayerIndex];

        //Check if the player has played a valid card
        if(!this.cardDealer.validatePlay(body.playedCards)) {
            res.status(400).send({ message: "Invalid play!" });
            return;
        }

        // update the game state
        game.playedCards.push(body.playedCards);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[game.currentPlayer.toString()] = game.playerCards[game.currentPlayer.toString()].filter((card: any) => !body.playedCards.includes(card));
        game.droppedCards.push(body.droppedCard);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[game.currentPlayer.toString()] = game.playerCards[game.currentPlayer.toString()].filter((card: any) => body.droppedCard != card);

        await game.save();
        res.send({ message: "Next turn!" });
    };

    private endGame = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if(!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        this.game.deleteOne({ _id: lobby.game_id });
        delete lobby["game_id"];
        await lobby.save();
        res.send({ message: "Game ended!" });
    };

    private getGame = async (req: Request, res: Response) => {
        const id = req.params.id;
        const game = await this.game.findOne({ _id: id });
        if(!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        res.send(game);
    };



}
