import { Igame, Ilobby } from "../interfaces/interface";
import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { RummyDealer, UnoDealer } from "./dealer.services";
import { RummyBot } from "./rummy.bot.service";
import userModel from "../models/player.model";
import { achievements } from "../cards/achievements";
import { UnoBot } from "./uno.bot.service";
import mongoose from "mongoose";
import { LogService } from "./log.service";
import GameHistoryService from "./history.services";

export class GameChecker {

    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;
    private player = userModel.userModel;
    private gameHistoryService = new GameHistoryService();

    public intervals: any = {};
    private time = 180;
    private gameId = "";
    public lastTimes: any = {};

    private wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    constructor() {
    }

    public async forceNextTurn(LobbygameId: string) {
        const lobby = await this.lobby.findOne({ game_id: new mongoose.Types.ObjectId(LobbygameId) });
        if (!lobby) {
            console.error("Lobby not found");
            return;
        }
        const gameId = lobby.game_id;
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            console.error("Game not found");
            return;
        }
        const playerId = game.currentPlayer.playerId;
        // check if the player is the current player
        if (playerId.toString() !== game.currentPlayer.playerId.toString()) {
            console.error("Not the current player");
            return;
        }
        const dealer = new RummyDealer(game.shuffledCards);
        if (game.drawedCard.lastDrawedBy !== playerId) {
            game.playerCards[playerId].push(dealer.drawCard(1));
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
            await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
            console.error("Invalid to next");
            return;
        }

        const nextPlayer = this.nextPlayer(lobby.users.map(id => { return id.toString() }), game.currentPlayer.playerId.toString(), lobby.bots && lobby.bots.map((bot: any) => { return bot._id }));

        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        return true;
        // this.gameHistoryService.saveHistory(playerId, gameId);

    }
    private nextPlayer(users: string[], current: string, bots?: string[]): string {
        if (bots && bots?.includes(current)) {
            return bots.indexOf(current) === bots.length - 1 ? users[0] : bots[bots.indexOf(current) + 1];
        }
        if (bots?.length && users.indexOf(current) === users.length - 1) {
            return bots ? bots[0] : users[0];
        }
        return users[users.indexOf(current) + 1 === users.length ? 0 : users.indexOf(current) + 1];
    }

    private getNextPlayer(players: string[], currentPlayer: string) {
        return players[(players.indexOf(currentPlayer) + 1) % players.length];
    }

    public playWithBots = async (game: any, lobby: Ilobby, currentPlayer: string) => {
        const bot = new RummyBot(currentPlayer, 'easy', game.playerCards[currentPlayer], game.droppedCards, game.playedCards, game.shuffledCards);
        const { droppedCards, playedCards, playerCards } = bot.play();
        game.playerCards[currentPlayer] = playerCards;
        game.playedCards = playedCards;
        game.droppedCards = droppedCards;
        game.drawedCard.lastDrawedBy = currentPlayer;
        const waitingTime = bot.thinkingTime;
        await this.wait(waitingTime);
        const players = lobby.users.map(u => u._id).concat(lobby.bots.map(bot => bot._id)).map(id => id.toString());
        currentPlayer = this.getNextPlayer(players, currentPlayer);
        game.currentPlayer = { playerId: currentPlayer, time: new Date().getTime() };
        new LogService().consoleLog(`Bot ${bot.name} played with ${bot.thinkingTime}ms thinking time`, 'RummyBotService');
        await this.game.updateOne({ _id: game._id }, game, { runValidators: true });
    }

    public playWithBotsUno = async (game: any, lobby: Ilobby, currentPlayer: string) => {
        let nextPlayer = currentPlayer;
        let bot;
        const dealer = new UnoDealer(game.shuffledCards);
        if (game.lastAction && game.lastAction.playerId !== currentPlayer) {
            switch (game.lastAction.action) {
                case 16:
                    //Skip
                    game.lastAction = { playerId: currentPlayer, actions: 0 };

                    break;
                case 18:
                    //Draw 2
                    game.playerCards[nextPlayer] = game.playerCards[nextPlayer].concat(dealer.drawCard(2));
                    game.shuffledCards = dealer.deck;
                    game.lastAction = { playerId: currentPlayer, actions: 0 };

                    break;
                case 20:
                    //Draw 4
                    game.playerCards[nextPlayer] = game.playerCards[nextPlayer].concat(dealer.drawCard(4));
                    game.shuffledCards = dealer.deck;
                    game.lastAction = { playerId: currentPlayer, actions: 0 };

                    break;
                case 21:
                    //Draw 4
                    game.playerCards[nextPlayer] = game.playerCards[nextPlayer].concat(dealer.drawCard(4));
                    game.shuffledCards = dealer.deck;
                    game.lastAction = { playerId: currentPlayer, actions: 0 };
                    break;
                default:
                    bot = new UnoBot(nextPlayer, 'easy', game.playerCards[nextPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard);
                    const { droppedCards, playerCards, drawedCard } = bot.play();
                    game.playerCards[nextPlayer] = playerCards;
                    game.droppedCards = droppedCards;
                    game.drawedCard = drawedCard;
                    game.shuffledCards.slice(game.shuffledCards.indexOf(drawedCard), 1);
                    const waitingTime = bot.thinkingTime;
                    await this.wait(waitingTime);
                    game.lastAction = { playerId: currentPlayer, actions: droppedCards[droppedCards.length - 1].card.rank > 14 ? droppedCards[droppedCards.length - 1].card.rank : 0 };
                    break;
            }
            await this.wait(1000);
        } else {
            bot = new UnoBot(nextPlayer, 'easy', game.playerCards[nextPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard);
            const { droppedCards, playerCards, drawedCard } = bot.play();
            game.playerCards[nextPlayer] = playerCards;
            game.droppedCards = droppedCards;
            game.drawedCard = drawedCard;
            game.shuffledCards.slice(game.shuffledCards.indexOf(drawedCard), 1);
            const waitingTime = bot.thinkingTime;
            await this.wait(waitingTime);
            game.lastAction = { playerId: currentPlayer, actions: droppedCards[droppedCards.length - 1].card.rank > 25 ? droppedCards[droppedCards.length - 1].card.rank : 0 };

        }
        nextPlayer = this.nextPlayer(Object.keys(game.playerCards), nextPlayer);
        if (game.shuffledCards.length <= 0) {
            // reshuffle the dropped cards into the deck
            game.shuffledCards = new UnoDealer(game.shuffledCards).reShuffleDeck(game.droppedCards.slice(game.droppedCards.length - 1).map((d: any) => d.card));
        }

        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };
        await this.lobby.updateOne({ _id: lobby._id }, lobby, { runValidators: true });
        await this.game.updateOne({ _id: game._id }, game, { runValidators: true });
    }

    public async robotPlayingUno(game: Igame, lobby: Ilobby, currentPlayer: string) {
        const nextPlayer = currentPlayer;
        if (game.lastAction && game.lastAction.playerId !== currentPlayer) {
            if (game.lastAction.actions <= 25) {
                const bot = new UnoBot(nextPlayer, 'easy', game.playerCards[nextPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard);
                const { droppedCards, playerCards, drawedCard } = bot.play();
                game.playerCards[nextPlayer] = playerCards;
                if (game.droppedCards[game.droppedCards.length - 1].droppedBy !== nextPlayer) {
                    game.lastAction = { playerId: currentPlayer, actions: 0, isUno: false };
                } else {
                    game.lastAction = {
                        playerId: currentPlayer,
                        actions: droppedCards[droppedCards.length - 1].card.rank > 24 && droppedCards[droppedCards.length - 1].card.rank < 30 ? droppedCards[droppedCards.length - 1].card.rank : 0,
                        isUno: Math.random() < 0.9 && playerCards.length === 1
                    };
                }
                game.droppedCards = droppedCards;
                game.drawedCard = drawedCard;
                game.shuffledCards.slice(game.shuffledCards.indexOf(drawedCard), 1);
                const waitingTime = bot.thinkingTime;
                await this.wait(waitingTime);


                await this.game.updateOne({ _id: game._id }, game);
            } else {
                await this.wait(1000);
            }
        } else {
            await this.wait(1000);
        }
        this.nextTurnUno(game._id.toString(), nextPlayer);
    }

    public async forceNextTurnUno(gameId: string, playerId: string) {

        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            return false;
        }

        const lobby = await this.lobby.find({ game_id: game._id });
        if (lobby.length == 0) {
            return false;
        }

        game.playerCards[playerId] = game.playerCards[playerId].concat(new UnoDealer(game.shuffledCards).drawCard(1));
        game.droppedCards[game.droppedCards.length - 1].droppedBy = playerId;
        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        return await this.nextTurnUno(gameId, playerId);

    }

    public calculatePoints(position: any, maxPoints: number) {
        const step = maxPoints / ((position.length - 1) == 0 ? 1 : position.length - 1);
        return position.map((p: any, i: number) => { return { player: p.player, rank: Math.max(0, Math.round(maxPoints - (p.pos - 1) * step)) - (maxPoints / 2) } });
    }

    public getPositions(playerCards: any) {
        const playerIds = Object.keys(playerCards);
        const cards = Object.values(playerCards) as any;


        const positions: { player: string, pos: number }[] =
            playerIds.map((playerId: string, i: number) => {
                return { player: playerId, pos: cards[i].reduce((sum: any, obj: any) => { return sum + obj.value || obj.rank }, 0) };
            });
        const sorted = positions.sort((a, b) => a.pos - b.pos).map((p, i) => {
            return { player: p.player, pos: i + 1 };
        });

        return sorted;
    }

    public async nextTurnUno(gameId: string, playerId: string) {
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            console.error("Game not found");
            return false;
        }
        if (game.currentPlayer.playerId.toString() !== playerId.toString()) {
            console.error("Not the current player");
            return false;
        }

        const dealer = new UnoDealer(game.shuffledCards);

        game.drawedCard.lastDrawedBy = "";
        let nextPlayer = "";


        if (game.lastAction && game.lastAction.playerId !== playerId) {

            switch (game.lastAction.actions) {
                case 26:
                    //Skip
                    break;
                case 27:
                    //Draw 2
                    game.playerCards[game.currentPlayer.playerId.toString()] = game.playerCards[game.currentPlayer.playerId.toString()].concat(dealer.drawCard(2));
                    game.shuffledCards = dealer.deck;
                    break;
                case 28:
                    //Draw 4
                    game.playerCards[game.currentPlayer.playerId.toString()] = game.playerCards[game.currentPlayer.playerId.toString()].concat(dealer.drawCard(4));
                    game.shuffledCards = dealer.deck;
                    break;
                default:
                    break;
            }

            game.lastAction = { playerId: playerId, actions: 0, isUno: false };
        } else if (game.lastAction && game.lastAction.actions == 25) {
            // Reverse
            game.playerCards = Object.fromEntries(
                Object.entries(game.playerCards).reverse()
            );
            game.lastAction = { playerId: playerId, actions: 0, isUno: false };
        }

        nextPlayer = this.nextPlayer(Object.keys(game.playerCards), game.currentPlayer.playerId.toString());

        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };
        game.droppedCards[game.droppedCards.length - 1].droppedBy = '';

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        if (!playerId.includes('bot')) {
            await this.gameHistoryService.saveHistory(playerId, gameId);
        }
        return true;
    }

    public async playerRemove(gameId: string, playerId: string) {
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            console.error("Game not found");
            return false;
        }
        if (game.currentPlayer.playerId.toString() !== playerId.toString()) {
            console.error("Not the current player");
            return false;
        }

        const lobby = await this.lobby.findOne({ game_id: game._id });
        if (!lobby) {
            console.error("Lobby not found");
            return false;
        }

        const playerCard = game.playerCards[playerId];
        if (!playerCard || playerCard.length === 0) {
            console.error("Player has no cards");
            return false;
        }

        if (playerCard.length <= 25) {
            console.error("Player has not enough cards");
            return false;
        }

        delete game.playerCards[playerId];
        const dealer = new UnoDealer(game.shuffledCards);
        game.shuffledCards = dealer.reShuffleCards(playerCard);
        game.drawedCard.lastDrawedBy = '';
        game.lastAction = { playerId: '', actions: 0, isUno: false };
        lobby.users = lobby.users.filter((user: any) => user.toString() !== playerId);

        if (lobby.users.length === 0 || (lobby.users.length === 1 && lobby.bots.length === 0)) {
            new LogService().consoleLog(`Game ${gameId} has no players left, deleting game and lobby.`, 'GameChecker');
            await this.lobby.deleteOne({ _id: lobby._id });
            await this.game.deleteOne({ _id: gameId });
            return true;
        } else {
            game.currentPlayer = { playerId: this.nextPlayer(Object.keys(game.playerCards), playerId), time: new Date().getTime() };
            await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
            await this.lobby.updateOne({ _id: lobby._id }, lobby, { runValidators: true });
            return true;
        }


    }
}  