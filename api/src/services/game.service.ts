import { Icard, Igame, Ilobby } from "../interfaces/interface";
import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { RummyDealer, SchnappsDealer, UnoDealer } from "./dealer.services";
import userModel from "../models/player.model";
import { achievements } from "../cards/achievements";
import { UnoBot, RummyBot, SchnappsBot } from "./bot.services";
import mongoose from "mongoose";
import { LogService } from "./log.service";
import GameHistoryService from "./history.services";

export class GameChecker {

    protected lobby = lobbyModel.lobbyModel;
    protected game = gameModel.gameModel;
    protected player = userModel.userModel;
    protected gameHistoryService = new GameHistoryService();

    public intervals: any = {};
    protected time = 180;
    protected gameId = "";
    public lastTimes: any = {};

    protected wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    constructor() {
    }


    protected nextPlayer(users: string[], current: string, bots?: string[]): string {
        if (bots && bots?.includes(current)) {
            return bots.indexOf(current) === bots.length - 1 ? users[0] : bots[bots.indexOf(current) + 1];
        }
        if (bots?.length && users.indexOf(current) === users.length - 1) {
            return bots ? bots[0] : users[0];
        }
        return users[users.indexOf(current) + 1 === users.length ? 0 : users.indexOf(current) + 1];
    }
    protected lastPlayer(users: string[], current: string, bots?: string[]): string {
        if (bots && bots?.includes(current)) {
            return bots.indexOf(current) === 0 ? users[users.length - 1] : bots[bots.indexOf(current) - 1];
        }
        if (bots?.length && users.indexOf(current) === 0) {
            return bots ? bots[bots.length - 1] : users[users.length - 1];
        }
        return users[users.indexOf(current) - 1 === 0 ? users.length - 1 : users.indexOf(current) - 1];
    }
    protected getNextPlayer(players: string[], currentPlayer: string) {
        return players[(players.indexOf(currentPlayer) + 1) % players.length];
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
        game.lastAction = { playerId: '', actions: 0, isUno: false, trump: {}, trumpWith: "", points: {} };
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

export class UnoService extends GameChecker {
    constructor() {
        super();
    }


    public async nextTurn(gameId: string, playerId: string) {
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

            game.lastAction = { playerId: playerId, actions: 0, isUno: false, trump: {}, trumpWith: "", points: {} };
        } else if (game.lastAction && game.lastAction.actions == 25) {
            // Reverse
            game.playerCards = Object.fromEntries(
                Object.entries(game.playerCards).reverse()
            );
            game.lastAction = { playerId: playerId, actions: 0, isUno: false, trump: {}, trumpWith: "", points: {} };
        } else if (!game.lastAction.isUno && game.playerCards[playerId].length === 1) {
            game.playerCards[game.currentPlayer.playerId.toString()] = game.playerCards[game.currentPlayer.playerId.toString()].concat(dealer.drawCard(2));
            game.shuffledCards = dealer.deck;
        }

        nextPlayer = this.nextPlayer(Object.keys(game.playerCards), game.currentPlayer.playerId.toString());

        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };
        game.droppedCards[game.droppedCards.length - 1].droppedBy = '';

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        if (!playerId.includes('bot') && !Object.values(game.playerCards).find((p: any) => p.length === 0)) {
            await this.gameHistoryService.savingHistory(playerId, gameId);
        }
        return true;
    }

    public async forcedNextTurn(gameId: string, playerId: string) {

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

        return await this.nextTurn(gameId, playerId);

    }

    public async robotPlaying(game: Igame, lobby: Ilobby, currentPlayer: string) {
        const nextPlayer = currentPlayer;
        if (game.lastAction && game.lastAction.playerId !== currentPlayer) {
            if (game.lastAction.actions <= 25) {
                const bot = new UnoBot(nextPlayer, game.secretSettings.robotDifficulty.toLocaleLowerCase(), game.playerCards[nextPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard);
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
        this.nextTurn(game._id.toString(), nextPlayer);
    }
}

export class RummyService extends GameChecker {
    constructor() {
        super();
    }

    public async forcedNextTurn(LobbygameId: string) {
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
        game.secretSettings.gameTurn++;
        if (game.secretSettings.gameTurn > game.secretSettings.maxGameTurns) {
            return false;
        }

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });
        return true;
        // this.gameHistoryService.saveHistory(playerId, gameId);

    }

    public robotPlaying = async (game: any, lobby: Ilobby, currentPlayer: string) => {
        const bot = new RummyBot(currentPlayer, game.secretSettings.robotDifficulty, game.playerCards[currentPlayer], game.droppedCards, game.playedCards, game.shuffledCards);
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
}

export class SchnappsService extends GameChecker {
    constructor() {
        super();
    }

    public async nextTurn(gameId: string, playerId: string) {
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            console.error("Game not found");
            return false;
        }
        if (game.currentPlayer.playerId.toString() !== playerId.toString()) {
            console.error("Not the current player");
            return false;
        }

        const dealer = new SchnappsDealer(game.shuffledCards);

        if (!game.lastAction.trumpWith) {
            game.lastAction.trumpWith = Object.keys(game.playerCards).find((p: string) => {
                return game.playerCards[p].find((c: any) => c.name === game.lastAction.trump.card);
            }) || '';
        }


        game.lastAction.isUno = !game.lastAction.isUno ? (game.droppedCards.find((c) => c.card.name === game.lastAction.trump.card) ? true : false) : true;

        if (Object.keys(game.playerCards).reverse().indexOf(game.currentPlayer.playerId.toString()) === 0 && game.secretSettings.currentTurn == 1) {
            game.secretSettings.currentTurn = game.secretSettings.currentTurn + 1 || 2;
            game.currentPlayer = { playerId: game.lastAction.playerId!, time: new Date().getTime() };
        } else if (game.droppedCards.length === 4 && game.playedCards.length === 6) {
            //TODO The game is over
        } else if (game.droppedCards.length === 4) {
            const { winner, cards } = dealer.validateNextTurn(game.droppedCards, game.lastAction.trump.suit);
            game.playedCards = [...game.playedCards, { playedBy: winner, cards: cards }];
            game.droppedCards = [];

            game.currentPlayer = { playerId: 'null', time: new Date().getTime() };
            await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

            await this.wait(3000);
            if ((Object.values(game.playerCards as any) as any)[0].length === 0 && game.droppedCards.length === 0) {
                game.secretSettings.isGameOver = true;
            } else {
                game.currentPlayer = { playerId: winner, time: new Date().getTime() };
            }
        } else {
            game.currentPlayer = { playerId: this.nextPlayer(Object.keys(game.playerCards), game.currentPlayer.playerId), time: new Date().getTime() };
        }

        game.drawedCard.lastDrawedBy = '';

        game.lastAction.points = Object.fromEntries(Object.keys(game.playerCards).map((p) => {
            return [p, this.calculateSchnappsPoints(p, game.playedCards)];
        }));

        if (game.playedCards.length > 0) {
            switch (game.lastAction.actions) {
                case 6:
                    if (game.playedCards.find((p: any) => p.playedBy === game.lastAction.playerId)) {
                        game.secretSettings.isGameOver = true;
                    }
                    break;
                case 7:
                    if (game.playedCards.find((p: any) => p.playedBy !== game.lastAction.playerId && p.playedBy !== game.lastAction.trumpWith)) {
                        game.secretSettings.isGameOver = true;
                    } else if (game.lastAction.points[game.lastAction.playerId!] + game.lastAction.points[game.lastAction.trumpWith!] >= 66) {
                        game.secretSettings.isGameOver = true;
                    }
                    break;
                case 8:
                    if (game.playedCards.find((p: any) => p.playedBy !== game.lastAction.playerId && p.playedBy === game.lastAction.trumpWith)) {
                        game.secretSettings.isGameOver = true;
                    }
                    break;
                default:
                    const p = game.playedCards.map((p: any) => { return { playedBy: p.playedBy, sum: p.cards.reduce((a: any, b: any) => a + b.value, 0) } }).sort((a: any, b: any) => a.sum - b.sum);
                    if (p[0].sum >= 66) {
                        game.secretSettings.isGameOver = true;
                    }
                    if (game.lastAction.isUno && p.filter((pt: any) => pt.playedBy === game.lastAction.playerId || game.lastAction.trumpWith).reduce((a: any, b: any) => a + b.sum, 0) >= 66) {
                        game.secretSettings.isGameOver = true;
                    }
                    if (game.lastAction.isUno && p.filter((pt: any) => pt.playedBy !== game.lastAction.playerId && game.lastAction.trumpWith).reduce((a: any, b: any) => a + b.sum, 0) >= 66) {
                        game.secretSettings.isGameOver = true;
                    }
                    break;
            }
        }

        await this.game.updateOne({ _id: gameId }, game, { runValidators: true });

        if (!playerId.includes('bot') && !Object.values(game.playerCards).find((p: any) => p.length === 0)) {
            await this.gameHistoryService.savingHistory(playerId, gameId)
        }

        return true;

    }

    public async forcedNextTurn(gameId: string, playerId: string) {
        const game = await this.game.findOne({ _id: gameId });
        if (!game) {
            console.error("Game not found");
            return false;
        }
        if (game.currentPlayer.playerId.toString() !== playerId.toString()) {
            console.error("Not the current player");
            return false;
        }

        const nextPlayer = playerId;
        const bot = new SchnappsBot(nextPlayer, game.secretSettings.robotDifficulty.toLocaleLowerCase(), game.playerCards[nextPlayer], game.droppedCards as any, game.playedCards, game.shuffledCards, game.drawedCard as any, game as any);
        const { droppedCards, playerCards } = bot.play();

        game.playerCards[nextPlayer] = playerCards;
        game.droppedCards = droppedCards;

        game.currentPlayer = { playerId: this.nextPlayer(Object.keys(game.playerCards), game.currentPlayer.playerId), time: new Date().getTime() };


        await this.game.updateOne({ _id: game._id }, game);

        return true;
    }

    private calculateSchnappsPoints(playerId: string, playedCards: { playedBy: string, cards: Icard[] }[]) {
        return playedCards.filter((p) => p.playedBy === playerId).map((p) => p.cards).reduce((sum: any, obj: any) => { return sum + obj.reduce((a: any, b: any) => a + b.value, 0) }, 0) || 0;
    }

    public async robotSelecting(game: Igame, lobby: Ilobby, currentPlayer: string) {
        const nextPlayer = currentPlayer;
        const bot = new SchnappsBot(nextPlayer, 'easy', game.playerCards[nextPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard, game);
        const { actions, isUno, playerId, trump } = bot.select();
        if (!game.lastAction.actions) {
            game.lastAction = { playerId, actions, isUno, trump, trumpWith: '' };
        } else if ((Math.random() < 0.3 && game.lastAction.actions < actions)) {
            game.lastAction = { ...game.lastAction, playerId, trump, trumpWith: '' };
        }


        const waitingTime = bot.thinkingTime;
        await this.wait(waitingTime - 3000);

        await this.game.updateOne({ _id: game._id }, game);
        this.nextTurn(game._id.toString(), nextPlayer);
    }

    public async robotPlaying(game: Igame, lobby: Ilobby, currentPlayer: string, overrideThinkingTime?: number) {
        const nextPlayer = currentPlayer;
        const bot = new SchnappsBot(nextPlayer, game.secretSettings.robotDifficulty.toLocaleLowerCase(), game.playerCards[nextPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard, game);
        const { droppedCards, playerCards } = bot.play();

        game.playerCards[nextPlayer] = playerCards;
        game.droppedCards = droppedCards;

        if (!overrideThinkingTime) {
            const waitingTime = bot.thinkingTime;
            await this.wait(waitingTime - 3000);
        } else {
        }

        await this.game.updateOne({ _id: game._id }, game);
        return await this.nextTurn(game._id.toString(), nextPlayer);
    }

    public getPositionsSchnapps(playedCards: { playedBy: string, cards: any[] }[], pairs: { pairOne: string[], pairTwo: string[] }) {
        let { pairOnePoints, pairTwoPoints, lastPlayed } = { pairOnePoints: 0, pairTwoPoints: 0, lastPlayed: "" };


        if (playedCards.filter((c) => pairs.pairOne.includes(c.playedBy)).length > 0) {
            pairOnePoints = playedCards.filter((c) => pairs.pairOne.includes(c.playedBy)).map((c) => c.cards).reduce((sum: any, obj: any) => { return sum + obj.reduce((a: any, b: any) => a + b.value, 0) }, 0) || 0;
        }
        if (playedCards.filter((c) => pairs.pairTwo.includes(c.playedBy)).length > 0) {
            pairTwoPoints = playedCards.filter((c) => pairs.pairTwo.includes(c.playedBy)).map((c) => c.cards).reduce((sum: any, obj: any) => { return sum + obj.reduce((a: any, b: any) => a + b.value, 0) }, 0) || 0;
        }
        lastPlayed = playedCards[playedCards.length - 1]!.playedBy;

        if (pairOnePoints > pairTwoPoints) {
            return pairs.pairOne.concat(pairs.pairTwo).map((p) => {
                return { player: p, pos: pairs.pairOne.includes(p) ? 1 : 4 };
            })
        } else if (pairTwoPoints > pairOnePoints) {
            return pairs.pairOne.concat(pairs.pairTwo).map((p) => {
                return { player: p, pos: pairs.pairTwo.includes(p) ? 1 : 4 };
            })
        } else {
            return pairs.pairOne.concat(pairs.pairTwo).map((p) => {
                return { player: p, pos: (pairs.pairOne.includes(lastPlayed) && pairs.pairOne.includes(p) ? 1 : (pairs.pairTwo.includes(lastPlayed) && pairs.pairTwo.includes(p) ? 1 : 4)) };
            })
        }
    }

}

export class SolitaireService extends GameChecker {
    constructor() {
        super();
    }
}