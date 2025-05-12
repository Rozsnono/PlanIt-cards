import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import { getIDfromToken, hasAuth } from "../middleware/middleware";
import { Auth } from "../enums/auth.enum";
import gameModel from "../models/game.model";
import { SolitaireDealer, UnoDealer } from "../services/dealer.services";
import lobbyModel from "../models/lobby.model";
import { Cards } from "../cards/cards";
import mongoose from "mongoose";
import { ERROR } from "../enums/error.enum";
import { Icard, Ilobby } from "../interfaces/interface";
import { GameChecker } from "../services/game.service";
import { GameHistorySolitaire } from "../services/history.services";
import gameHistoryModel from "../models/game.history.model";


export default class SolitaireController implements Controller {
    public router = Router();
    public validate = gameModel.validate;
    public game = gameModel.gameModel;
    public lobby = lobbyModel.lobbyModel;
    public gameHistory = gameHistoryModel.gameHistoryModel;
    private GameHistorySolitaire = new GameHistorySolitaire();



    constructor() {
        // API route to start a game
        this.router.post("/start/:lobbyId/solitaire", hasAuth([Auth["START.GAME"]]), (req, res, next) => {
            this.startGame(req, res).catch(next);
        });
        // API route to draw a card
        this.router.put("/draw/:lobbyId/solitaire", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.drawCard(req, res).catch(next);
        });
        this.router.put("/put/:lobbyId/solitaire", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.putCards(req, res).catch(next);
        });
        // API route to drop a card
        this.router.put("/play/:lobbyId/solitaire", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.playCard(req, res).catch(next);
        });

        this.router.post("/restart/:lobbyId/:gameId/solitaire", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.reStartGame(req, res).catch(next);
        });

        this.router.post("/prevSteps/:lobbyId/:gameId/solitaire", hasAuth([Auth["UNO.PLAY"]]), (req, res, next) => {
            this.prevSteps(req, res).catch(next);
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
        const cards = new Cards().solitaire;
        // create a new card dealer
        const dealer = new SolitaireDealer(cards);
        dealer.shuffleDeck()
        // set the game state
        // deal the cards
        body["playedCards"] = dealer.dealCard();
        body["shuffledCards"] = dealer.deck;
        body["playerCards"] = [];
        body["currentPlayer"] = { playerId: lobby?.users[0], time: 0 };
        body["_id"] = new mongoose.Types.ObjectId();
        const newGame = new this.game(body);
        await newGame.save();
        lobby.game_id = newGame._id;
        await lobby.save();
        await this.GameHistorySolitaire.saveHistory(playerId, lobby.game_id)

        res.send({ message: "Game started!", game_id: newGame._id });
    };

    private reStartGame = async (req: Request, res: Response) => {
        const body = req.body;
        const lobbyId = req.params.lobbyId;
        const gameId = req.params.gameId;

        const lobby = await this.lobby.findOne({ _id: lobbyId });
        const game = await this.game.findOne({ _id: gameId });
        // check if the lobby exists
        if (!lobby) {
            res.status(404).send({ error: ERROR.LOBBY_NOT_FOUND });
            return;
        }
        if (!game) {
            res.status(404).send({ error: ERROR.GAME_NOT_FOUND });
            return;
        }
        // check if user in lobby
        const playerId = await getIDfromToken(req);
        if (!lobby.users.find((player) => player.toString() == playerId)) {
            res.status(403).send({ error: ERROR.NOT_IN_LOBBY });
            return;
        }

        // check card type of the lobby
        const cards = new Cards().solitaire;
        // create a new card dealer
        const dealer = new SolitaireDealer(cards);
        dealer.shuffleDeck()
        // set the game state
        // deal the cards
        game["playedCards"] = dealer.dealCard();
        game["shuffledCards"] = dealer.deck;
        game["playerCards"] = [];
        game["droppedCards"] = [];
        game["currentPlayer"] = { playerId: lobby?.users[0].toString(), time: 0 };
        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        await this.GameHistorySolitaire.saveHistory(playerId, lobby.game_id, true);
        res.send({ message: "Game started!", game_id: game._id });
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
        if (game.shuffledCards.length === 0) {
            game.shuffledCards = game.droppedCards.map((d: any) => d.card).reverse();
            game.droppedCards = [];
        }
        const dealer = new SolitaireDealer(game.shuffledCards);
        const card = dealer.drawCard(1)[0];
        card.isJoker = true;
        game.droppedCards.push({ droppedBy: playerId, card: card });
        game.shuffledCards = dealer!.deck;
        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        await this.GameHistorySolitaire.saveHistory(playerId, lobby.game_id);
        res.send({ message: "Card drawn successfully!" });
    };

    private putCards = async (req: Request, res: Response) => {
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

        const dealer = new SolitaireDealer(game.shuffledCards);

        if (!dealer.validatePlace(body.placingCards, body.placedCards)) {
            res.status(400).send({ error: ERROR.INVALID_CARD_SELECTED });
            return;
        }

        const cards = game.playedCards.find((pack) => pack.cards.find((cards) => cards.name === body.placingCards[0].name));
        const toCards = body.placedCards.length === 0 ? game.playedCards.find((pack) => pack.cards.length === 0) : game.playedCards.find((pack) => pack.cards.find((cards) => cards.name === body.placedCards[0].name));
        if (cards) {
            if (toCards) {
                const index = game.playedCards.indexOf(cards!);
                cards.cards = cards?.cards.slice(0, cards?.cards.map((card: any) => card.name).indexOf(body.placingCards[0].name));
                game.playedCards[index] = cards!;
                if (game.playedCards[index].cards.length !== 0) {
                    game.playedCards[index].cards[game.playedCards[index].cards.length - 1].isJoker = true;
                }

                const toIndex = game.playedCards.indexOf(toCards!);
                toCards!.cards = toCards?.cards.concat(body.placingCards) || [];
                game.playedCards[toIndex] = toCards!;
            }
        } else {
            if (toCards) {
                game.droppedCards.splice(game.droppedCards.length - 1, 1);

                const toIndex = game.playedCards.indexOf(toCards!);
                toCards!.cards = toCards?.cards.concat(body.placingCards) || [];
                game.playedCards[toIndex] = toCards!;
            }
        }


        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        await this.GameHistorySolitaire.saveHistory(playerId, lobby.game_id);
        res.send({ message: "Card placed successfully!" });
    };

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
        if (!body.playedCards || !body.playingCard) {
            res.status(400).send({ error: ERROR.CARD_NOT_FOUND });
            return;
        }

        const dealer = new SolitaireDealer(game.shuffledCards);

        if (!dealer.validatePlay(body.playingCard, body.playedCards)) {
            res.status(400).send({ error: ERROR.INVALID_CARD_SELECTED });
            return;
        }

        const cards: any = {};
        if (!game.playerCards[body.playingCard.suit] || game.playerCards[body.playingCard.suit].length === 0) {
            cards[body.playingCard.suit] = [body.playingCard];
        } else {
            cards[body.playingCard.suit] = game.playerCards[body.playingCard.suit].concat(body.playingCard);
        }

        if (game.droppedCards.find((card) => card.card.name === body.playingCard.name)) {
            game.droppedCards = game.droppedCards.filter((card) => card.card.name !== body.playingCard.name);
        } else if (game.playedCards.find((pack) => pack.cards.find((card) => card.name === body.playingCard.name))) {
            game.playedCards = game.playedCards.map((pack) => {
                if (pack.cards.find((card) => card.name === body.playingCard.name)) {
                    pack.cards = pack.cards.filter((card) => card.name !== body.playingCard.name);
                    try {
                        pack.cards[pack.cards.length - 1].isJoker = true;
                    } catch { }
                }
                return pack;
            });
        }

        game.playerCards = { ...game.playerCards, ...cards };
        game.currentPlayer = { playerId: game.currentPlayer.playerId, time: 0 };


        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        await this.GameHistorySolitaire.saveHistory(playerId, lobby.game_id);

        if (!game.playedCards.map(c => c.cards).find(c => c.length != 0) && game.droppedCards.length === 0 && game.shuffledCards.length === 0) {
            await new GameChecker().setRankInSolitaire(lobby as any);
            await this.GameHistorySolitaire.savePosition(lobbyId, gameId, 10);
            res.send({ info: "Game Over!" });
            return;
        }
        res.send({ message: "Card played successfully!" });
    }

    private prevSteps = async (req: Request, res: Response) => {
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

        const gameHistory = await this.gameHistory.findOne({ gameId: gameId });
        if (!gameHistory) {
            res.status(404).send({ error: ERROR.GAME_HISTORY_NOT_FOUND });
            return;
        }

        const turns = Object.values(gameHistory.turns).length;
        const turn = gameHistory.turns[turns - 1];

        console.log(gameHistory, turns, gameHistory.turns[turns]);

        if (!turn) {
            res.status(404).send({ error: ERROR.GAME_HISTORY_NOT_FOUND });
            return;
        }

        game.playerCards = turn.playerCards;
        game.playedCards = turn.playedCards;
        game.droppedCards = turn.droppedCards;
        game.shuffledCards = turn.shuffledCards;

        game.currentPlayer = { playerId: game.currentPlayer.playerId, time: 0 };
        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });

        gameHistory.turns = Object.values(gameHistory.turns).filter((t, index: number) => index + 1 !== turns).map((turn: any, index: number) => { return { [index + 1]: turn } });
        await this.gameHistory.replaceOne({ gameId: gameId }, gameHistory, { runValidators: true });

        res.send({ message: "Card played successfully!" });
    }
}