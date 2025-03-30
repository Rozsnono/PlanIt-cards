import { Ilobby } from "../interfaces/interface";
import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { RummyDealer, UnoDealer } from "./dealer.services";
import { RummyBot } from "./rummy.bot.service";
import userModel from "../models/user.model";
import { achievements } from "../cards/achievements";
import { UnoBot } from "./uno.bot.service";

export class GameChecker {

    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;
    private player = userModel.userModel;
    gameHistoryService: any;

    public intervals: any = {};
    private time = 180;
    private gameId = "";
    public lastTimes: any = {};

    private wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    constructor() {
    }

    public startInterval(gameId: string) {
        if (this.intervals[gameId]) { return; }
        if (this.lastTimes[gameId] === 0) { return; }
        this.intervals[gameId] = setInterval(() => {
            if (this.lastTimes[gameId] === undefined) { }
            if (this.lastTimes[gameId] === 0) { return; }
            if (new Date().getTime() - this.lastTimes[gameId] >= this.time * 1000) {
                this.stopInterval(gameId);
                this.forceNextTurn(gameId);
            }
        }, 10000);
    }

    public stopInterval(gameId: string) {
        clearInterval(this.intervals[gameId]);
    }

    public async forceNextTurn(LobbygameId: string) {
        const lobby = await this.lobby.findOne({ game_id: LobbygameId });
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
            await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
            console.error("Invalid to next");
            return;
        }

        const nextPlayer = this.nextPlayer(lobby.users.map(id => { return id.toString() }), game.currentPlayer.playerId.toString(), lobby.bots && lobby.bots.map((bot: any) => { return bot._id }));

        game.currentPlayer = { playerId: nextPlayer, time: new Date().getTime() };

        await this.game.replaceOne({ _id: gameId }, game, { runValidators: true });
        // this.gameHistoryService.saveHistory(playerId, gameId);
        console.log("Forced turn")

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
        console.log("Bot playing!")
        const bot = new RummyBot(currentPlayer, 'easy', game.playerCards[currentPlayer], game.droppedCards, game.playedCards, game.shuffledCards);
        const { droppedCards, playedCards, playerCards } = bot.play();
        game.playerCards[currentPlayer] = playerCards;
        console.log("Bot played cards: ", playedCards);
        game.playedCards = playedCards;
        game.droppedCards = droppedCards;
        game.drawedCard.lastDrawedBy = currentPlayer;
        const waitingTime = bot.thinkingTime;
        console.log("Waiting for " + waitingTime + "ms");
        await this.wait(waitingTime);
        const players = lobby.users.map(u => u._id).concat(lobby.bots.map(bot => bot._id)).map(id => id.toString());
        currentPlayer = this.getNextPlayer(players, currentPlayer);
        game.currentPlayer = { playerId: currentPlayer, time: new Date().getTime() };
        console.log("Bot played!")
        await this.game.replaceOne({ _id: game._id }, game, { runValidators: true });
    }

    public playWithBotsUno = async (game: any, lobby: Ilobby, currentPlayer: string) => {
        console.log("Bot playing!")
        const bot = new UnoBot(currentPlayer, 'easy', game.playerCards[currentPlayer], game.droppedCards, game.playedCards, game.shuffledCards, game.drawedCard);
        const { droppedCards, playerCards, drawedCard } = bot.play();
        game.playerCards[currentPlayer] = playerCards;
        game.droppedCards = droppedCards;
        game.drawedCard = drawedCard;
        const waitingTime = bot.thinkingTime;
        console.log("Waiting for " + waitingTime + "ms");
        await this.wait(waitingTime);
        const players = lobby.users.map(u => u._id).concat(lobby.bots.map(bot => bot._id)).map(id => id.toString());

        switch (game.droppedCards[game.droppedCards.length - 1].card.rank) {
            case 15:
                //Reverse
                lobby.users = lobby.users.reverse();
                lobby.bots = lobby.bots.reverse();
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                break;
            case 16:
                //Skip
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                break;
            case 18:
                //Draw 2
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                game.playerCards[currentPlayer] = game.playerCards[currentPlayer].concat(new UnoDealer(game.shuffledCards).drawCard(2));
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                break;
            case 20:
                //Wild Draw 4
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                game.playerCards[currentPlayer] = game.playerCards[currentPlayer].concat(new UnoDealer(game.shuffledCards).drawCard(4));
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                break;
            case 21:
                //Wild Draw 4
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                game.playerCards[currentPlayer] = game.playerCards[currentPlayer].concat(new UnoDealer(game.shuffledCards).drawCard(4));
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                break;
            default:
                currentPlayer = this.getNextPlayer(players, currentPlayer);
                break;
        }

        game.currentPlayer = { playerId: currentPlayer, time: new Date().getTime() };
        await this.lobby.replaceOne({ _id: lobby._id }, lobby, { runValidators: true });
        await this.game.replaceOne({ _id: game._id }, game, { runValidators: true });
        console.log("Bot played!")
    }

    public setRankByPosition = async (globby: Ilobby) => {
        const game = await this.game.findOne({ _id: globby.game_id });
        if (!game) return;
        const positions = Object.values(game.playerCards).map((cards: any) => { return cards.reduce((sum: any, obj: any) => { return sum + obj.value }, 0) });
        for (const id of globby.users) {
            const player = await this.player.findOne({ _id: id });
            if (!player) return;
            const body: any = player;
            const position = Object.keys(game.playerCards).length - positions.indexOf(Math.max(...positions));
            body.rank += this.calculatePoints(position, Object.keys(game.playerCards).length, 20);
            if (body.numberOfGames === undefined) body.numberOfGames = {};
            if (typeof body.numberOfGames[new Date().toISOString()] === 'undefined') {
                body.numberOfGames = { ...body.numberOfGames, [new Date().toISOString()]: { wins: 0, losses: 0 } };
            }
            if (position === 1) {
                body.numberOfGames[new Date().toISOString()].wins++;
            } else {
                body.numberOfGames[new Date().toISOString()].losses++;
            }
            body.achievements = await this.checkAnchievements(player, game);
            const res = await this.player.replaceOne({ _id: body._id }, body, { runValidators: true });
            console.log(res.modifiedCount);
        }
    }

    public setRankByPositionUno = async (globby: Ilobby) => {
        const game = await this.game.findOne({ _id: globby.game_id });
        if (!game) return;
        const positions = Object.values(game.playerCards).map((cards: any) => { return cards.reduce((sum: any, obj: any) => { return sum + obj.value }, 0) });
        for (const id of globby.users) {
            const player = await this.player.findOne({ _id: id });
            if (!player) return;
            const body: any = player;
            const position = Object.keys(game.playerCards).length - positions.indexOf(Math.max(...positions));
            body.rank += this.calculatePoints(position, Object.keys(game.playerCards).length, 20);
            if (body.numberOfGames === undefined) body.numberOfGames = {};
            if (typeof body.numberOfGames[new Date().toISOString()] === 'undefined') {
                body.numberOfGames = { ...body.numberOfGames, [new Date().toISOString()]: { wins: 0, losses: 0 } };
            }
            if (position === 1) {
                body.numberOfGames[new Date().toISOString()].wins++;
            } else {
                body.numberOfGames[new Date().toISOString()].losses++;
            }
            const res = await this.player.replaceOne({ _id: body._id }, body, { runValidators: true });
            console.log(res.modifiedCount);
        }
    }

    public setRankInSolitaire = async (globby: Ilobby) => {
        const game = await this.game.findOne({ _id: globby.game_id });
        if (!game) return;
        const id = globby.users[0];
        const player = await this.player.findOne({ _id: id });
        if (!player) return;
        const body: any = player;
        const position = 1;
        body.rank += this.calculatePoints(position, Object.keys(game.playerCards).length, 10);
        if (body.numberOfGames === undefined) body.numberOfGames = {};
        if (typeof body.numberOfGames[new Date().toISOString()] === 'undefined') {
            body.numberOfGames = { ...body.numberOfGames, [new Date().toISOString()]: { wins: 0, losses: 0 } };
        }
        if (position === 1) {
            body.numberOfGames[new Date().toISOString()].wins++;
        } else {
            body.numberOfGames[new Date().toISOString()].losses++;
        }
        const res = await this.player.replaceOne({ _id: body._id }, body, { runValidators: true });
        console.log(res.modifiedCount);
    }

    private async checkAnchievements(player: any, game: any) {
        const playerAchievements = player.achievements || [];
        for (const achievement of achievements) {
            const playerCards = game.playedCards.filter((cards: any) => cards.cards.find((card: any) => card.playedBy === player._id));
            if (achievement.check(playerCards, Math.floor(game.droppedCards.length / Object.keys(game.playerCards).length)) && !playerAchievements.includes(achievement._id)) {
                playerAchievements.push(achievement._id);
            }
        }
        return playerAchievements;
    }


    private calculatePoints(rank: number, totalPlayers: number, maxPoints: number) {
        if (rank < 1 || rank > totalPlayers) {
            return 0;
        }
        const step = maxPoints / (totalPlayers - 1);
        return Math.max(0, Math.round(maxPoints - (rank - 1) * step));
    }
}   