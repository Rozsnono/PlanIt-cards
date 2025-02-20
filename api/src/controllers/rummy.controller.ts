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
import { EasyRummyBot } from "../services/bot.services";


export default class RummyController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    private gameHistoryService = new GameHistoryService();

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
        // API route to put a card
        this.router.put("/put/:lobbyId/rummy", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.putCard(req, res).catch(next);
        });
        this.router.put("/force-next/:lobbyId/rummy", hasAuth([Auth["RUMMY.PLAY"]]), (req, res, next) => {
            this.forcedNextTurn(req, res).catch(next);
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
        body["playerCards"] = dealer.dealCards(lobby?.users.concat(lobby?.bots as any), 14);
        body["currentPlayer"] = { playerId: lobby?.users[0], time: new Date().getTime() };
        body["_id"] = new mongoose.Types.ObjectId();
        const newGame = new this.game(body);
        await newGame.save();
        lobby.game_id = newGame._id;
        await lobby.save();
        res.send({ message: "Game started!", game_id: newGame._id });
    };

    private nextTurn = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const playerId = await getIDfromToken(req);
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
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

        if (game.droppedCards.length === 0 || game.droppedCards[game.droppedCards.length - 1].droppedBy !== playerId.toString()) {
            res.status(403).send({ error: ERROR.NO_CARDS_DROPPED });
            return;
        }
        const dealer = new RummyDealer(game.shuffledCards);
        if (!dealer.isValidToNext(game.playedCards, playerId)) {
            const { cardsToReturn, playedCardsToReturn } = dealer.cardsToReturn(game.playedCards, playerId);
            game.playerCards[playerId] = game.playerCards[playerId].concat(cardsToReturn);
            game.playerCards[playerId].push(game.droppedCards[game.droppedCards.length - 1]);
            game.playedCards = playedCardsToReturn;
            game.droppedCards.shift();
            await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
            res.status(403).send({ error: ERROR.MIN_51_VALUE });
            return;
        }

        let nextPlayer = this.nextPlayer(lobby.users.map(id => { return id.toString() }), game.currentPlayer.playerId.toString(), lobby.bots);
        while (nextPlayer.includes("bot")) {
            const easyBot = new EasyRummyBot(nextPlayer);
            game.playerCards[nextPlayer] = game.playerCards[nextPlayer].concat(dealer.drawCard(1));
            const { discard, melds, hand } = easyBot.playTurn({ hand: game.playerCards[nextPlayer], discardPile: game.droppedCards, melds: game.playedCards });
            if (dealer.isValidToNext(game.playedCards, nextPlayer)) {
                game.playerCards[nextPlayer] = hand;
                if (game.playedCards.length > 0) {
                    game.playedCards.concat(melds);
                } else {
                    game.playedCards = melds
                }
            }
            game.droppedCards.push(discard);
            nextPlayer = this.nextPlayer(lobby.users.map(id => { return id.toString() }), nextPlayer, lobby.bots);
            await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
            await new Promise(resolve => setTimeout(resolve, Math.random() * 3));
        }


        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };
        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        this.gameHistoryService.saveHistory(playerId, gameId);



        res.send({ message: "Next turn!" });
    };

    private forcedNextTurn = async (req: Request, res: Response) => {
        const lobbyId = req.params.lobbyId;
        const lobby = await this.lobby.findOne({ _id: lobbyId });
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        const playerId = game.currentPlayer.playerId;
        // check if the player is the current player
        if (playerId.toString() !== game.currentPlayer.playerId.toString()) {
            res.status(403).send({ error: ERROR.NOT_YOUR_TURN });
            return;
        }

        const dealer = new RummyDealer(game.shuffledCards);
        if (game.drawedCard.lastDrawedBy !== playerId) {
            game.playerCards[playerId].push(dealer.drawCard(1));
            game.drawedCard.lastDrawedBy = playerId;
        }

        if (game.droppedCards.length === 0 || game.droppedCards[game.droppedCards.length - 1].droppedBy !== playerId.toString()) {
            game.droppedCards.push({ droppedBy: playerId, card: game.playerCards[playerId].pop() });
        }

        if (!dealer.isValidToNext(game.playedCards, playerId)) {
            const { cardsToReturn, playedCardsToReturn } = dealer.cardsToReturn(game.playedCards, playerId);
            game.playerCards[playerId] = game.playerCards[playerId].concat(cardsToReturn);
            game.playerCards[playerId].push(game.droppedCards[game.droppedCards.length - 1]);
            game.playedCards = playedCardsToReturn;
            game.droppedCards.shift();
            await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
            res.status(403).send({ error: ERROR.MIN_51_VALUE });
            return;
        }

        let nextPlayer = this.nextPlayer(lobby.users.map(id => { return id.toString() }), game.currentPlayer.playerId.toString(), lobby.bots);
        while (nextPlayer.includes("bot")) {
            const easyBot = new EasyRummyBot(nextPlayer);
            game.playerCards[nextPlayer] = game.playerCards[nextPlayer].concat(dealer.drawCard(1));
            const { discard, melds, hand } = easyBot.playTurn({ hand: game.playerCards[nextPlayer], discardPile: game.droppedCards, melds: game.playedCards });
            if (dealer.isValidToNext(game.playedCards, nextPlayer)) {
                game.playerCards[nextPlayer] = hand;
                if (game.playedCards.length > 0) {
                    game.playedCards.concat(melds);
                } else {
                    game.playedCards = melds
                }
            }
            game.droppedCards.push(discard);
            nextPlayer = this.nextPlayer(lobby.users.map(id => { return id.toString() }), nextPlayer, lobby.bots);
            await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
            await new Promise(resolve => setTimeout(resolve, Math.random() * 3));
        }


        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        this.gameHistoryService.saveHistory(playerId, gameId);
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
        const dealer = new RummyDealer(game.shuffledCards);
        game.playerCards[playerId] = game.playerCards[playerId].concat(dealer.drawCard(1));
        game.shuffledCards = dealer.deck;
        game.drawedCard.lastDrawedBy = playerId;
        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        res.send({ message: "Card drawn!" });
    };

    private nextPlayer(users: string[], current: string, bots?: string[]): string {
        if (bots && bots?.includes(current)) {
            return bots.indexOf(current) === bots.length - 1 ? users[0] : bots[bots.indexOf(current) + 1];
        }
        if (bots?.length && users.indexOf(current) === users.length - 1) {
            return bots ? bots[0] : users[0];
        }
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

        if (game.droppedCards[game.droppedCards.length - 1].droppedBy === playerId) {
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

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

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
        const validation = dealer.validatePlay(body.playedCards, game.playerCards[playerId], game.playedCards, playerId);
        if (validation !== "Valid") {
            res.status(400).send({ error: validation });
            return;
        }

        // update the game state
        game.playedCards.push({ playedBy: playerId, cards: dealer.rankingMelds(body.playedCards).completedDeck });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => !body.playedCards.find((c: any) => JSON.stringify(c) === JSON.stringify(card)));

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

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
        const validation = dealer.validatePlay(playedCards, game.playerCards[playerId], game.playedCards, playerId, true);
        if (validation !== "Valid") {
            res.status(400).send({ error: validation });
            return;
        }

        const melds = dealer.rankingMelds(playedCards);
        let joker;
        if (melds.completedDeck[melds.completedDeck.length - 1].isJoker) {
            joker = melds.completedDeck.pop();
            joker!.rank = 50;
            game.playerCards[playerId] = game.playerCards[playerId].concat(joker);
        }

        // update the game state
        game.playedCards = game.playedCards.map((meld: any) => {
            return meld._id.toString() === body.playedCards._id.toString() ?
                { playedBy: playerId, cards: melds.completedDeck } :
                meld
        }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        game.playerCards[playerId] = game.playerCards[playerId].filter((card: any) => JSON.stringify(body.placeCard) !== JSON.stringify(card));

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

        res.send({ message: "Card placed!" });
    }
}