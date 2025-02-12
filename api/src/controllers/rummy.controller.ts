import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import { RummyDealer } from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { Cards } from "../cards/cards";
import mongoose from "mongoose";


export default class RummyController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;

    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId/rummy", hasAuth([Auth["START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });
        // API route to draw a card
        this.router.put("/draw/:lobbyId/rummy", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.drawCard(req, res).catch(next);
        });
        // API route to get the next turn
        this.router.put("/next/:lobbyId/rummy", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.nextTurn(req, res).catch(next);
        });
        // API route to drop a card
        this.router.put("/drop/:lobbyId/rummy", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.dropCard(req, res).catch(next);
        });
        // API route to play a card
        this.router.put("/play/:lobbyId/rummy", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.playCard(req, res).catch(next);
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
        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ message: "Not in the lobby!" });
            return;
        }

        // check card type of the lobby
        const cards = new Cards().rummy;
        // create a new card dealer
        const dealer = new RummyDealer(cards);
        // set the game state
        body["shuffledCards"] = dealer.shuffleDeck();
        // deal the cards
        body["playerCards"] = dealer.dealCards(lobby?.users, 14);
        body["currentPlayer"] = lobby?.users[0];
        body["_id"] = new mongoose.Types.ObjectId();
        const newGame = new this.game(body);
        await newGame.save();
        lobby.game_id = newGame._id;
        await lobby.save();
        res.send({ message: "Game started!", game_id: newGame._id });
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

        const dealer = new RummyDealer(game.shuffledCards);


        // get the next player
        const currentPlayerIndex = lobby.users.indexOf(game.currentPlayer);
        const nextPlayerIndex = this.nextPlayer(currentPlayerIndex, lobby.users.length - 1);

        game.currentPlayer = lobby.users[nextPlayerIndex];

        if (body.playedCards) {

            //Check if the player has played a valid card
            if (!dealer.validatePlay(body.playedCards, game.playerCards[playerId])) {
                res.status(400).send({ message: "Invalid play!" });
                return;
            }

            // update the game state
            game.playedCards.concat(body.playedCards);
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
        if (!lobby.users.find((player) => player.toString() == playerId)) {
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
        const dealer = new RummyDealer(game.shuffledCards);
        game.playerCards[playerId] = game.playerCards[playerId].concat(dealer.drawCard(1));
        game.shuffledCards = dealer.deck;

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        res.send({ message: "Card drawn!" });
    };

    private nextPlayer(current: number, max: number): number {
        return current === max ? 0 : current + 1;
    }

    private dropCard = async (req: Request, res: Response) => {
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

        const body = req.body;
        if (!body.droppedCard) {
            res.status(400).send({ message: "No card dropped!" });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => JSON.stringify(card) === JSON.stringify(body.droppedCard))) {
            res.status(400).send({ message: "Card not in hand!" });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => JSON.stringify(card) !== JSON.stringify(body.droppedCard));
        game.droppedCards.push(body.droppedCard);

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Card dropped!" });
    }

    private playCard = async (req: Request, res: Response) => {
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

        const body = req.body;
        if (!body.playedCards) {
            res.status(400).send({ message: "No card played!" });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => body.playedCards.find((c: any) => JSON.stringify(c) === JSON.stringify(card)))) {
            res.status(400).send({ message: "Card not in hand!" });
            return;
        }

        const dealer = new RummyDealer(game.shuffledCards);

        //Check if the player has played a valid card
        if (!dealer.validatePlay(body.playedCards, game.playerCards[playerId])) {
            res.status(400).send({ message: "Invalid play!" });
            return;
        }

        // update the game state
        game.playedCards.push(body.playedCards);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => !body.playedCards.find((c: any) => JSON.stringify(c) === JSON.stringify(card)));
        
        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Card played!" });
    }

}