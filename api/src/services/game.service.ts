import gameModel from "../models/game.model";
import lobbyModel from "../models/lobby.model";
import { EasyRummyBot } from "./bot.services";
import { RummyDealer } from "./dealer.services";

export class GameChecker {

    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;
    gameHistoryService: any;

    public intervals: any = {};
    private time = 20;
    private gameId = "";
    public lastTimes: any = {};


    constructor(gameId: string) {
        this.gameId = gameId;
    }

    public startInterval() {
        if(this.intervals[this.gameId]) {return;}
        this.intervals[this.gameId] = setInterval(() => {
            if(this.lastTimes[this.gameId] === undefined) {}
            console.log(this.lastTimes, new Date().getTime() - this.lastTimes[this.gameId])
            if(new Date().getTime() - this.lastTimes[this.gameId] >= this.time * 1000) {
                this.stopInterval();
                this.forceNextTurn();
            }
        }, 10000);
    }

    public stopInterval() {
        clearInterval(this.intervals[this.gameId]);
    }

    public async forceNextTurn() {
        const lobby = await this.lobby.findOne({ game_id: this.gameId });
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

        if (game.droppedCards.length === 0 || game.droppedCards[game.droppedCards.length - 1].droppedBy !== playerId.toString()) {
            game.droppedCards.push({ droppedBy: playerId, card: game.playerCards[playerId].pop() });
        }

        const dealer = new RummyDealer(game.shuffledCards);
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

}   