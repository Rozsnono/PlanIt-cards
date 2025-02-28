import { Ilobby } from "../interfaces/interface";
import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { RummyDealer } from "./dealer.services";
import { RummyBot } from "./rummy.bot.service";

export class GameChecker {

    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;
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
        this.intervals[gameId] = setInterval(() => {
            if (this.lastTimes[gameId] === undefined) { }
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
        game.playedCards = playedCards;
        game.droppedCards = droppedCards;
        game.drawedCard.lastDrawedBy = currentPlayer;
        await this.wait(Math.random() * 6000);
        const players = lobby.users.map(u => u._id).concat(lobby.bots.map(bot => bot._id)).map(id => id.toString());
        currentPlayer = this.getNextPlayer(players, currentPlayer);
        game.currentPlayer = { playerId: currentPlayer, time: new Date().getTime() };
        console.log("Bot played!")
        await this.game.replaceOne({ _id: game._id }, game, { runValidators: true });
    }

}   