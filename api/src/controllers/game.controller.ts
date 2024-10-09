import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import CardDealer from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { rummy, uno } from "../cards/cards";
import mongoose from "mongoose";


export default class GameController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;

    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId", hasAuth([Auth["START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });

        // API route to end a game
        this.router.post("/end/:lobbyId", hasAuth([Auth["END.GAME"]]), (req, res, next) => {
            this.endGame(req, res).catch(next);
        });

        this.router.put("/draw/:lobbyId", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.drawCard(req, res).catch(next);
        });

        // API route to get a game
        this.router.get("/get/:id", hasAuth([Auth["WATCH.GAME"]]), (req, res, next) => {
            this.getGame(req, res).catch(next);
        });

        // API route to get the next turn
        this.router.put("/next/:lobbyId", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.nextTurn(req, res).catch(next);
        });

        // API route to get the next turn in an UNO game
        this.router.put("/next/uno/:lobbyId", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.unoNextTurn(req, res).catch(next);
        });

    }

    private startGame = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;

        const lobby = await this.lobby.findOne({ _id: lobbyId });
        // check if the lobby exists
        if (!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        // check if the lobby has a game
        if (lobby.game_id) {
            res.status(400).send({ message: "Game already started!" });
            return;
        }
        // check if user in lobby
        const playerId = await getIDfromToken(req);
        if (!lobby.players.find((player) => player.toString() == playerId)) {
            res.status(403).send({ message: "Not in the lobby!" });
            return;
        }

        // check card type of the lobby
        let cards;
        if (lobby.settings!.cardType == "RUMMY") {
            cards = rummy;
        } else {
            cards = uno;
        }
        // create a new card dealer
        const cardDealer = new CardDealer(cards);
        // set the game state
        body["shuffledCards"] = cardDealer.shuffleDeck();
        // deal the cards
        body["playerCards"] = cardDealer.dealCards(lobby?.players);
        body["currentPlayer"] = lobby?.players[0];
        body["_id"] = new mongoose.Types.ObjectId();
        const newGame = new this.game(body);
        await newGame.save();
        lobby.game_id = newGame._id;
        await lobby.save();
        res.send({ message: "Game started!" });
    };

    private nextTurn = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        // check if the player is the current player
        if (playerId.toString() !== game.currentPlayer.toString()) {
            res.status(403).send({ message: "Not your turn!" });
            return;
        }

        if (!body.droppedCard) {
            res.status(400).send({ message: "No card dropped!" });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => JSON.stringify(card) === JSON.stringify(body.droppedCard))) {
            res.status(400).send({ message: "Card not in hand!" });
            return;
        }

        const cardDealer = new CardDealer(game.shuffledCards);


        // get the next player
        const currentPlayerIndex = lobby.players.indexOf(game.currentPlayer);
        const nextPlayerIndex = currentPlayerIndex === lobby.players.length - 1 ? 0 : currentPlayerIndex + 1;

        game.currentPlayer = lobby.players[nextPlayerIndex];

        if (body.playedCards) {

            //Check if the player has played a valid card
            if (!cardDealer.validatePlay(body.playedCards, game.playerCards[playerId])) {
                res.status(400).send({ message: "Invalid play!" });
                return;
            }

            // update the game state
            game.playedCards.push(body.playedCards);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            game.playerCards[game.currentPlayer.toString()] = game.playerCards[game.currentPlayer.toString()].filter((card: any) => !body.playedCards.includes(card));
        }

        game.droppedCards.push(body.droppedCard);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[game.currentPlayer.toString()] = game.playerCards[game.currentPlayer.toString()].filter((card: any) => body.droppedCard != card);

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Next turn!" });
    };

    private drawCard = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        if (!lobby.players.find((player) => player.toString() == playerId)) {
            res.status(403).send({ message: "Not in the lobby!" });
            return;
        }
        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        // check if the player is the current player
        if (playerId.toString() !== game.currentPlayer.toString()) {
            res.status(403).send({ message: "Not your turn!" });
            return;
        }
        const cardDealer = new CardDealer(game.shuffledCards);
        game.playerCards[playerId] = game.playerCards[playerId].concat(cardDealer.drawCard(1));
        game.shuffledCards = cardDealer.deck;

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        res.send({ message: "Card drawn!" });
    };

    private unoNextTurn = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;
        const gameId = body.gameId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        if (!lobby.players.find((player) => player.toString() == playerId)) {
            res.status(403).send({ message: "Not in the lobby!" });
            return;
        }
        if (!lobby.game_id || lobby.game_id!.toString() !== gameId.toString()) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        if (lobby.settings!.cardType !== "UNO") {
            res.status(400).send({ message: "Not an UNO game!" });
            return;
        }

        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            res.status(404).send({ message: "Game not found!" });
            return;
        }
        if (playerId.toString() !== game.currentPlayer.toString()) {
            res.status(403).send({ message: "Not your turn!" });
            return;
        }

        const cardDealer = new CardDealer(game.shuffledCards);

        //Check if the player has played a valid card
        if (!cardDealer.validateDrop(game.droppedCards, body.droppedCard)) {
            res.status(400).send({ message: "Invalid play!" });
            return;
        }


        // get the next player
        const nextPlayerIndex = this.nextPlayer(lobby.players.indexOf(game.currentPlayer), lobby.players.length - 1);

        game.currentPlayer = lobby.players[nextPlayerIndex];

        // check card status
        switch (cardDealer.getUnoStatus(body.droppedCard)) {
            case "Double":
                game.playerCards[lobby.players[nextPlayerIndex].toString()] = game.playerCards[lobby.players[nextPlayerIndex].toString()].concat(cardDealer.drawCard(2));
                game.shuffledCards = cardDealer.deck;
                break;

            case "Skip":
                const newNextPlayerIndex = this.nextPlayer(nextPlayerIndex, lobby.players.length - 1);
                game.currentPlayer = lobby.players[newNextPlayerIndex];
                break;

            case "Reverse":
                lobby.players.reverse();
                const newReversePlayerIndex = this.nextPlayer(this.nextPlayer(nextPlayerIndex, lobby.players.length - 1), lobby.players.length - 1);
                game.currentPlayer = lobby.players[newReversePlayerIndex];
                break;

            case "Wild":
                break;

            case "Wild Draw Four":
                game.playerCards[lobby.players[nextPlayerIndex].toString()] = game.playerCards[lobby.players[nextPlayerIndex].toString()].concat(cardDealer.drawCard(4));
                game.shuffledCards = cardDealer.deck;
                break;
        }




        // update the game state
        game.droppedCards.push(body.droppedCard);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => body.droppedCard != card);

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Next turn!" });
    };

    private endGame = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ message: "Lobby not found!" });
            return;
        }
        if (!lobby.players.find((player) => player.toString() == playerId)) {
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

