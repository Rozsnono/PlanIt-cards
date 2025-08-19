import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import { SchnappsDealer, UnoDealer } from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { Cards } from "../cards/cards";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import GameHistoryService from "../services/history.services";
import { GameChecker } from "../services/game.service";


export default class SchnappsController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    private gameHistoryService = new GameHistoryService();
    private gameService = new GameChecker();


    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId/schnapps", hasAuth([Auth["START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });
        // API route to draw a card
        this.router.put("/select/:lobbyId/schnapps", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.selectTrump(req, res).catch(next);
        });
        // API route to get the next turn
        this.router.put("/next/:lobbyId/schnapps", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.nextTurn(req, res).catch(next);
        });
        // API route to drop a card
        this.router.put("/drop/:lobbyId/schnapps", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
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
        const cards = new Cards().schnapps;
        // create a new card dealer
        const dealer = new SchnappsDealer(cards);
        // set the game state
        body["shuffledCards"] = dealer.shuffleDeck();
        // deal the cards
        const players = lobby?.users.concat(lobby?.bots.map((bot: any) => { return bot._id }) as any);
        body["playerCards"] = dealer.dealCards(players, 6, false);
        Object.values(body.playerCards).forEach((cards: any) => {
            const c = cards.sort((a: any, b: any) => {
                if (a.suit === b.suit) {
                    return a.rank - b.rank;
                }
                return a.suit.localeCompare(b.suit);
            });

            c.forEach((card: any, index: number) => {
                if (
                    index < c.length - 1 &&
                    card.rank === 3 &&
                    c[index + 1].rank === 4 &&
                    card.suit === c[index + 1].suit
                ) {
                    card.isJoker = true;
                    c[index + 1].isJoker = true;
                }
            });
        });

        body["currentPlayer"] = { playerId: Object.keys(body.playerCards)[0], time: new Date().getTime() };
        body["drawedCard"] = { lastDrawedBy: null };
        body['secretSettings'] = { timeLimit: body.timeLimit || 60, gameType: "SCHNAPPS", robotDifficulty: lobby.settings?.robotsDifficulty || "EASY" };
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

        const { winner, cards } = new SchnappsDealer(game.shuffledCards).validateNextTurn(game.droppedCards as any, game.lastAction.trump.suit);
        game.playedCards.push({ playedBy: winner, cards: cards });

        if (game.droppedCards.find((c) => c.card.suit === game.lastAction.trump.suit && c.card.rank === game.lastAction.trump.card.rank)) {
            game.lastAction.isUno = true;
            game.lastAction.trumpWith = game.droppedCards.find((c) => c.card.suit === game.lastAction.trump.suit && c.card.rank === game.lastAction.trump.card.rank)?.droppedBy || "";
        }

        game.currentPlayer.playerId = this.nextPlayer(Object.keys(game.playerCards), game.currentPlayer.playerId);

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Next turn!" });
    }

    private selectTrump = async (req: Request, res: Response) => {
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

        const { suit, cardName, call } = req.body.selectedTrump;
        if (!suit || !cardName || !call || game.secretSettings.currentTurn > 1) {
            res.status(400).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        game.lastAction.trump = { suit, card: cardName };
        game.lastAction.playerId = playerId;
        game.lastAction.actions = ({ 'CALL': 1, 'BETTLI': 6, 'SCHNAPPS': 7, 'GANGLI': 8 } as any)[call.toUpperCase()] || 0;
        game.lastAction.isUno = false;

        game.currentPlayer = { playerId: this.nextPlayer(Object.keys(game.playerCards), playerId), time: new Date().getTime() };

        if (game.currentPlayer.playerId.toString() == Object.keys(game.playerCards)[0]) {
            game.secretSettings.currentTurn += 1;
        }

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Trump selected!", game });
        return;
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => JSON.stringify(card) === JSON.stringify(body.droppedCard))) {
            res.status(400).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }

        const dealer = new SchnappsDealer(game.shuffledCards);

        if (!dealer.validatePlaying(body.droppedCard, game.droppedCards.map((d: any) => d.card), game.playerCards[playerId], game.lastAction.trump.suit, game.lastAction.actions, game.secretSettings.currentTurn)) {
            res.status(400).send({ error: ERROR.INVALID_CARD_SELECTED });
            return;
        }

        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => JSON.stringify(card) !== JSON.stringify(body.droppedCard));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.droppedCards.push({ droppedBy: playerId, card: body.droppedCard });

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        this.gameService.nextTurnSchnapps(game._id.toString(), game.currentPlayer.playerId);
        res.send({ message: "Card dropped!", game });

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