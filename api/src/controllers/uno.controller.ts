import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import { UnoDealer } from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { Cards } from "../cards/cards";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import GameHistoryService from "../services/history.services";
import { GameChecker } from "../services/game.service";


export default class UnoController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    private gameHistoryService = new GameHistoryService();
    private gameService = new GameChecker();


    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId/uno", hasAuth([Auth["START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });
        // API route to draw a card
        this.router.put("/draw/:lobbyId/uno", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.drawCard(req, res).catch(next);
        });
        // API route to get the next turn
        this.router.put("/next/:lobbyId/uno", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.nextTurn(req, res).catch(next);
        });
        // API route to drop a card
        this.router.put("/drop/:lobbyId/uno", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.dropCard(req, res).catch(next);
        });

    }

    private startGame = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;

        const lobby = await this.lobby.findOne({ _id: lobbyId });
        // check if the lobby exists
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        // check if the lobby has a game
        if (lobby.game_id) {
            res.status(400).send({ error: ERROR.GAME_ALREADY_STARTED });
            return;
        }
        // check if user in lobby
        const playerId = await getIDfromToken(req);
        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }

        // check card type of the lobby
        const cards = new Cards().uno;
        // create a new card dealer
        const dealer = new UnoDealer(cards);
        // set the game state
        body["shuffledCards"] = dealer.shuffleDeck();
        // deal the cards
        body["playerCards"] = dealer.dealCards(lobby?.users.concat(lobby?.bots.map((bot: any) => { return bot._id }) as any), 8, false);
        body["currentPlayer"] = { playerId: lobby?.users[0], time: new Date().getTime() };
        body["drawedCard"] = { lastDrawedBy: null };
        body['secretSettings'] = { timeLimit: body.timeLimit || 60, gameType: "UNO" };
        body["droppedCards"] = dealer.validStartCard().map((card: any) => {
            return { droppedBy: '', card: card };
        });
        body["lastAction"] = { playerId: "", actions: 0, isUno: false };
        body["_id"] = new mongoose.Types.ObjectId();
        const newGame = new this.game(body);
        await newGame.save();
        lobby.game_id = newGame._id;
        await lobby.save();
        await this.gameHistoryService.savingHistory(playerId, lobby.game_id)
        res.send({ message: "Game started!", game_id: newGame._id });
    };

    private nextTurn = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        const gameId = lobby.game_id;
        const playerId = await getIDfromToken(req);
        await this.gameService.nextTurnUno(gameId, playerId);
        res.send({ message: "Next turn!" });
    }

    private drawCard = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }
        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        // check if the player is the current player
        if (playerId.toString() !== game.currentPlayer.playerId.toString()) {
            res.status(403).send({ error: ERROR.NOT_YOUR_TURN });
            return;
        }
        if (game.drawedCard.lastDrawedBy === playerId) {
            res.status(403).send({ error: ERROR.ALREADY_DRAWN });
            return;
        }
        const dealer = new UnoDealer(game.shuffledCards);
        game.playerCards[playerId] = game.playerCards[playerId].concat(dealer.drawCard(1));
        if (game.shuffledCards.length === 0) {
            // reshuffle the dropped cards into the deck
            game.shuffledCards = dealer.reShuffleDeck(game.droppedCards.slice(game.droppedCards.length - 2).map((d: any) => d.card));
        }
        game.droppedCards[game.droppedCards.length - 1].droppedBy = playerId;
        game.shuffledCards = dealer.deck;
        game.drawedCard.lastDrawedBy = playerId;
        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        this.nextTurn(req, res);
    };

    private nextPlayer(users: string[], current: string): string {
        return users[users.indexOf(current) + 1 === users.length ? 0 : users.indexOf(current) + 1];
    }

    private dropCard = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });

        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }

        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }

        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });

        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }

        // check if the player is the current player
        if (playerId.toString() !== game.currentPlayer.playerId.toString()) {
            res.status(403).send({ error: ERROR.NOT_YOUR_TURN });
            return;
        }

        const body = req.body;
        if (!body.droppedCard) {
            res.status(400).send({ error: ERROR.NO_CARDS_DROPPED });
            return;
        }

        if (game.droppedCards.length > 0 && game.droppedCards[game.droppedCards.length - 1].droppedBy === playerId) {
            res.status(400).send({ error: ERROR.ALREADY_DROPPED });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => JSON.stringify(card) === JSON.stringify(body.droppedCard))) {
            res.status(400).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }

        const dealer = new UnoDealer(game.shuffledCards);

        if (!dealer.validateDrop(game.droppedCards.map((d: any) => d.card), body.droppedCard)) {
            res.status(400).send({ error: ERROR.INVALID_CARD_SELECTED });
            return;
        }

        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => JSON.stringify(card) !== JSON.stringify(body.droppedCard));
        if (body.color) {
            body.droppedCard.suit = body.color;
            body.droppedCard.name = body.color + body.droppedCard.name;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.droppedCards.push({ droppedBy: playerId, card: body.droppedCard });

        const lastDroppedCard = game.droppedCards[game.droppedCards.length - 1].card.rank;
        game.lastAction = { playerId: playerId, actions: lastDroppedCard > 24 && lastDroppedCard < 30 ? lastDroppedCard : 0, isUno: body.isUno || false };

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        this.nextTurn(req, res);
    }

    private checkGame = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });

        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }

        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }

        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });

        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }

        const lastAction = game.lastAction;
        if (!lastAction || lastAction.actions == 0 || (lastAction.playerId && lastAction.playerId.toString() === playerId.toString())) {
            res.send({ skip: false, action: "Your turn" });
        } else {
            switch (lastAction.actions) {
                case 15:
                    res.send({ skip: false, action: "Reversed" });
                    return;
                case 16:
                    res.send({ skip: true, action: "Skip" });
                    return;
                case 18:
                    res.send({ skip: true, action: "Draw 2" });
                    return;
                case 20:
                    res.send({ skip: true, action: "Draw 4" });
                    return;
                case 21:
                    res.send({ skip: true, action: "Draw 4" });
                    return;
                default:
                    res.send({ skip: false, action: "Not your turn" });
                    return;
            }
        }

        res.send(game);
    };
}