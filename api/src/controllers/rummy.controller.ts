import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import { RummyDealer } from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { Cards } from "../cards/cards";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import GameHistoryService from "../services/history.services";
import { RummyService } from "../services/game.service";


export default class RummyController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    private rummyService = new RummyService();
    private gameHistoryService = new GameHistoryService();


    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId/rummy", hasAuth([Auth["START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });
        // API route to draw a card
        this.router.put("/draw/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.drawCard(req, res).catch(next);
        });
        // API route to draw a card from dropped cards
        this.router.put("/draw/dropped/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.drawCardFromDropped(req, res).catch(next);
        });
        // API route to draw a card from trump card
        this.router.put("/draw/trump/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.drawCardFromTrump(req, res).catch(next);
        });
        // API route to get the next turn
        this.router.put("/next/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.nextTurn(req, res).catch(next);
        });
        // API route to drop a card
        this.router.put("/drop/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.dropCard(req, res).catch(next);
        });
        // API route to play a card
        this.router.put("/play/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.playCard(req, res).catch(next);
        });
        // API route to put a card
        this.router.put("/put/:lobbyId/rummy", hasAuth([Auth["GAME.PLAY"]]), (req, res, next) => {
            this.putCard(req, res).catch(next);
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
        const cards = new Cards().rummy;
        // create a new card dealer
        const dealer = new RummyDealer(cards);
        // set the game state
        body["shuffledCards"] = dealer.shuffleDeck();
        // deal the cards
        body["playerCards"] = dealer.dealCards(lobby?.users.sort(() => Math.random() - 0.5).concat(lobby?.bots.map((bot: any) => { return bot._id }) as any), 14, true);
        body["currentPlayer"] = { playerId: Object.keys(body['playerCards'])[0], time: new Date().getTime() };
        body["drawedCard"] = { lastDrawedBy: Object.keys(body['playerCards'])[0] };
        body['secretSettings'] = { timeLimit: body.timeLimit || 180, gameType: "RUMMY", robotDifficulty: lobby.settings?.robotsDifficulty || "EASY" };
        body['lastAction'] = { trump: dealer.chooseTrumpCard() };
        body["shuffleDeck"] = dealer.deck;
        body["_id"] = new mongoose.Types.ObjectId();
        const newGame = new this.game(body);
        await newGame.save();
        lobby.game_id = newGame._id;
        await lobby.save();
        await this.gameHistoryService.postHistory(lobby.game_id);
        res.send({ message: "Game started!", game_id: newGame._id });
    };

    private nextTurn = async (req: Request, res: Response) => {

        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);

        const result = await this.rummyService.nextTurn(lobbyId, playerId);

        if (result.error) {
            res.status(403).send({ error: result.error });
        } else {
            res.send({ message: "Next turn!" });
        }
    };

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
        const dealer = new RummyDealer(game.shuffledCards);
        game.playerCards[playerId] = game.playerCards[playerId].concat(dealer.drawCard(1));
        game.shuffledCards = dealer.deck;
        game.drawedCard.lastDrawedBy = playerId;
        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        res.send({ message: "Card drawn!" });
    };

    private drawCardFromDropped = async (req: Request, res: Response) => {
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

        if (playerId.toString() !== game.currentPlayer.playerId.toString()) {
            res.status(403).send({ error: ERROR.NOT_YOUR_TURN });
            return;
        }

        if (game.drawedCard.lastDrawedBy === playerId) {
            res.status(403).send({ error: ERROR.ALREADY_DRAWN });
            return;
        }

        if (game.droppedCards.length === 0) {
            res.status(403).send({ error: ERROR.NO_CARDS_DROPPED });
            return;
        }

        if (game.droppedCards[game.droppedCards.length - 1].droppedBy === playerId) {
            res.status(403).send({ error: ERROR.AN_ERROR_OCCURRED });
            return;
        }

        game.playerCards[playerId] = game.playerCards[playerId].concat(game.droppedCards[game.droppedCards.length - 1].card);
        game.droppedCards.splice(game.droppedCards.length - 1, 1);
        try {
            game.droppedCards[game.droppedCards.length - 1].droppedBy = "";
        } catch { }
        game.drawedCard.lastDrawedBy = playerId;
        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        res.send({ message: "Card drawn!" });

    }

    private drawCardFromTrump = async (req: Request, res: Response) => {
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

        if (playerId.toString() !== game.currentPlayer.playerId.toString()) {
            res.status(403).send({ error: ERROR.NOT_YOUR_TURN });
            return;
        }

        if (game.drawedCard.lastDrawedBy === playerId) {
            res.status(403).send({ error: ERROR.ALREADY_DRAWN });
            return;
        }

        game.playerCards[playerId] = game.playerCards[playerId].concat(game.lastAction.trump.card);
        game.lastAction.trump = null;
        game.drawedCard.lastDrawedBy = playerId;
        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        res.send({ message: "Card drawn!" });

    }

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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => JSON.stringify(card) !== JSON.stringify(body.droppedCard));
        game.droppedCards.push({ droppedBy: playerId, card: body.droppedCard });

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Card dropped!" });
    }

    private playCard = async (req: Request, res: Response) => {
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
        if (!body.playedCards) {
            res.status(400).send({ error: ERROR.NO_CARD_PLAYED });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => body.playedCards.find((c: any) => JSON.stringify(c) === JSON.stringify(card)))) {
            res.status(400).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }

        const dealer = new RummyDealer(game.shuffledCards);

        //Check if the player has played a valid card
        const validation = dealer.validatePlay(body.playedCards, game.playerCards[playerId]);
        if (validation !== "Valid") {
            res.status(400).send({ error: validation });
            return;
        }

        // update the game state
        game.playedCards.push({ playedBy: playerId, cards: dealer.rankingMelds(body.playedCards).completedDeck });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => !body.playedCards.find((c: any) => JSON.stringify(c) === JSON.stringify(card)));

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Card played!" });
    }

    private putCard = async (req: Request, res: Response) => {
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

        if (game.playedCards.filter((meld: any) => meld.playedBy === playerId).length === 0) {
            res.status(403).send({ error: ERROR.INVALID_SEQUENCE });
            return;
        }

        let value = 0;
        game.playedCards.forEach((meld: any) => {
            if (meld.playedBy === playerId) {
                meld.cards.forEach((card: any) => {
                    value += card.value;
                });
            }
        });
        if (value < 51) {
            res.status(403).send({ error: ERROR.MIN_51_VALUE });
            return;
        }

        const body = req.body;
        if (!body.placeCard) {
            res.status(400).send({ error: ERROR.NO_CARD_PLAYED });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!game.playerCards[playerId].find((card: any) => JSON.stringify(body.placeCard) === JSON.stringify(card))) {
            res.status(400).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }

        const dealer = new RummyDealer(game.shuffledCards);

        const playedCards = body.playedCards.cards;
        playedCards.push(body.placeCard);

        //Check if the player has played a valid card
        const validation = dealer.validatePlay(playedCards, game.playerCards[playerId], true);
        if (validation !== "Valid") {
            res.status(400).send({ error: validation });
            return;
        }

        const melds = dealer.rankingMelds(playedCards);
        let joker;
        if (melds.completedDeck[melds.completedDeck.length - 1].isJoker && !body.placeCard.isJoker) {
            joker = melds.completedDeck.pop();
            joker!.rank = 50;
            game.playerCards[playerId] = game.playerCards[playerId].concat(joker);
        }

        // update the game state
        game.playedCards = game.playedCards.map((meld: any) => {
            return meld._id.toString() === body.playedCards._id.toString() ?
                { playedBy: meld.playedBy, cards: melds.completedDeck } :
                meld
        }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => JSON.stringify(body.placeCard) !== JSON.stringify(card));

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Card placed!" });
    }
}