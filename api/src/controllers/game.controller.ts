import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import CardDealer from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { Cards, uno } from "../cards/cards";
import mongoose from "mongoose";


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
        this.router.get("/get/:id", hasAuth([Auth["WATCH.GAME"]]), (req, res, next) => {
            this.getGame(req, res).catch(next);
        });

    }

    // private unoNextTurn = async (req: Request, res: Response) => {
    //     const body = req.body;
    //     const lobbyId = req.params.lobbyId;
    //     const gameId = body.gameId;
    //     const playerId = await getIDfromToken(req);
    //     const lobby = await this.lobby.findOne({ _id: lobbyId });
    //     if (!lobby) {
    //         res.status(404).send({ message: "Lobby not found!" });
    //         return;
    //     }
    //     if (!lobby.users.find((player) => player.toString() == playerId)) {
    //         res.status(403).send({ message: "Not in the lobby!" });
    //         return;
    //     }
    //     if (!lobby.game_id || lobby.game_id!.toString() !== gameId.toString()) {
    //         res.status(404).send({ message: "Game not found!" });
    //         return;
    //     }
    //     if (lobby.settings!.cardType !== "UNO") {
    //         res.status(400).send({ message: "Not an UNO game!" });
    //         return;
    //     }

    //     const game = await this.game.findOne({ _id: gameId });
    //     if (!game) {
    //         res.status(404).send({ message: "Game not found!" });
    //         return;
    //     }
    //     if (playerId.toString() !== game.currentPlayer.toString()) {
    //         res.status(403).send({ message: "Not your turn!" });
    //         return;
    //     }

    //     const cardDealer = new CardDealer(game.shuffledCards);

    //     //Check if the player has played a valid card
    //     if (!cardDealer.validateDrop(game.droppedCards, body.droppedCard)) {
    //         res.status(400).send({ message: "Invalid play!" });
    //         return;
    //     }


    //     // get the next player
    //     const nextPlayerIndex = this.nextPlayer(lobby.users.indexOf(game.currentPlayer), lobby.users.length - 1);

    //     game.currentPlayer = lobby.users[nextPlayerIndex];

    //     // check card status
    //     switch (cardDealer.getUnoStatus(body.droppedCard)) {
    //         case "Double":
    //             game.playerCards[lobby.users[nextPlayerIndex].toString()] = game.playerCards[lobby.users[nextPlayerIndex].toString()].concat(cardDealer.drawCard(2));
    //             game.shuffledCards = cardDealer.deck;
    //             break;

    //         case "Skip":
    //             const newNextPlayerIndex = this.nextPlayer(nextPlayerIndex, lobby.users.length - 1);
    //             game.currentPlayer = lobby.users[newNextPlayerIndex];
    //             break;

    //         case "Reverse":
    //             lobby.users.reverse();
    //             const newReversePlayerIndex = this.nextPlayer(this.nextPlayer(nextPlayerIndex, lobby.users.length - 1), lobby.users.length - 1);
    //             game.currentPlayer = lobby.users[newReversePlayerIndex];
    //             break;

    //         case "Wild":
    //             break;

    //         case "Wild Draw Four":
    //             game.playerCards[lobby.users[nextPlayerIndex].toString()] = game.playerCards[lobby.users[nextPlayerIndex].toString()].concat(cardDealer.drawCard(4));
    //             game.shuffledCards = cardDealer.deck;
    //             break;
    //     }




    //     // update the game state
    //     game.droppedCards.push(body.droppedCard);
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => body.droppedCard != card);

    //     await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

    //     res.send({ message: "Next turn!" });
    // };

    private endGame = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ message: "Not in the lobby!" });
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
        const game = await this.game.findOne({ _id: id });
        if (!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        res.send(game);
    };



    private nextPlayer(current: number, max: number): number {
        return current === max ? 0 : current + 1;
    }

}