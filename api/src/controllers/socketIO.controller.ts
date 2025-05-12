import WebSocket, { WebSocketServer } from 'ws';
import lobbyModel from '../models/lobby.model';
import gameModel from '../models/game.model';
import mongoose from 'mongoose';
import { ERROR } from '../enums/error.enum';
import { GameChecker } from '../services/game.service';
import GameHistoryService from '../services/history.services';
import { Ilobby } from '../interfaces/interface';

export default class SocketIO {
    private wss = new WebSocketServer({ port: 8080 });
    private wssTables = new WebSocketServer({ port: 8081 });
    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;

    constructor() {

        this.wssConnectionStart();
        this.wssTableConntectionStart();

    }

    private async wssConnectionStart() {
        this.wss.on('connection', (ws: WebSocket) => {

            // Handle WebSocket message received from client
            ws.on('message', async (id: string) => {
                const identifier = JSON.parse(id);
                const inLobby = await this.lobby.findOne({ $and: [{ _id: new mongoose.Types.ObjectId(identifier._id) }, { users: new mongoose.Types.ObjectId(identifier.player_id) }] }).populate("users", 'firstName lastName email username customId rank settings').exec();
                if (inLobby) {
                    const inGame = await this.game.findOne({ _id: inLobby.game_id });
                    if (inGame) {
                        const obj: any = inGame.toObject();
                        const playerCard = obj.playerCards[identifier.player_id];
                        if(inLobby.settings?.cardType === "SOLITAIRE" && !obj.playedCards.find((c: any) => c.cards.length > 0) && obj.droppedCards.length === 0 ) {
                            ws.send(JSON.stringify({ game_over: true }));
                        }
                        if (Object.values(obj.playerCards).find((array: any) => array.length === 0)) {
                            ws.send(JSON.stringify({ game_over: true }));
                        }
                        ws.send(JSON.stringify({
                            lobby: inLobby,
                            game: { ...obj, playerCards: inLobby.settings!.cardType === 'SOLITAIRE' ? obj.playerCards : Object.keys(obj.playerCards).map((key) => { return { [key]: obj.playerCards[key].length } }) },
                            playerCard: playerCard
                        }));
                    } else {
                        ws.send(JSON.stringify(inLobby));
                    }
                } else {
                    ws.send(JSON.stringify({ status: ERROR.NOT_IN_LOBBY }));

                }
            });

            // Handle WebSocket close event
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    private async wssTableConntectionStart() {
        this.wssTables.on('connection', async (ws: WebSocket) => {

            ws.send(JSON.stringify(await this.getLobbies));


            // Handle WebSocket message received from client
            ws.on('message', async (query: string) => {
                ws.send(JSON.stringify(await this.getLobbies(JSON.parse(query))));
            });

            // Handle WebSocket close event
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    private async getLobbies(query: any | null) {
        const filter: any = {};
        const userid = query.userId;
        
        const paging: { page: number, limit: number } = { page: 1, limit: 14 };
        if (query.cardType) {
            filter["settings.cardType"] = query.cardType;
        }
        if (query.unranked === "true") {
            filter["settings.unranked"] = true;
        }
        if (query.noPrivateLobby === "true") {
            filter["settings.privateLobby"] = false;
        }
        if (query.noBots === "true") {
            filter["settings.fillWithRobots"] = false;
        }
        if (query.robotsDifficulty) {
            filter["settings.robotsDifficulty"] = parseInt(query.robotsDifficulty.toString());
        }
        if (query.numberOfPlayers) {
            filter["settings.numberOfPlayers"] = parseInt(query.numberOfPlayers.toString());
        }
        if (query.page) {
            paging.page = parseInt(query.page.toString()) || 1;
        }
        if (query.limit) {
            paging.limit = parseInt(query.limit.toString()) || 14;
        }
        console.log({ $and: [{...filter}, { $or: [{ $and: [{ 'settings.cardType': 'SOLITAIRE' }, { createdBy: userid }] }, { 'settings.cardType': { $ne: 'SOLITAIRE' } }] }] })
        const lobbies = await this.lobby.find({ $and: [{...filter}, { $or: [{ $and: [{ 'settings.cardType': 'SOLITAIRE' }, { createdBy: userid }] }, { 'settings.cardType': { $ne: 'SOLITAIRE' } }] }] }).limit(paging.limit * paging.page).populate("users", "customId username rank settings");
        
        const lobbyCount = await this.lobby.countDocuments();
        return { total: parseInt(((lobbyCount / paging.limit)).toFixed(0)), data: lobbies }
    }

    private gameChecker = new GameChecker();
    private gameHistory = new GameHistoryService();

    public async monitorCollectionChanges() {

        const options = { fullDocument: 'updateLookup' }

        const watching = this.game.watch([], options);

        watching.on('change', async (change) => {
            try {
                this.gameChecker.startInterval(change.fullDocument._id);
                this.gameChecker.lastTimes[change.fullDocument._id] = change.fullDocument.currentPlayer.time;
                if (Object.values(change.fullDocument.playerCards).find((array: any) => array.length === 0)) {
                    const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id });
                    if (lobby) {
                        switch (lobby.settings?.cardType) {
                            case "UNO":
                                this.gameChecker.stopInterval(change.fullDocument._id);
                                this.gameChecker.setRankByPositionUno(lobby! as any); 
                                this.gameHistory.savePosition(lobby!._id.toString(), change.fullDocument._id, 20);
                                break;
                            case "RUMMY":
                                this.gameChecker.stopInterval(change.fullDocument._id);
                                this.gameChecker.setRankByPosition(lobby! as any);
                                this.gameHistory.savePosition(lobby!._id.toString(), change.fullDocument._id, 20);
                                break;
                            case "SOLITAIRE":
                                this.gameChecker.stopInterval(change.fullDocument._id);
                                this.gameChecker.setRankInSolitaire(lobby! as any);
                                this.gameHistory.savePosition(lobby!._id.toString(), change.fullDocument._id, 10);
                                break;
                            default:
                                this.gameChecker.stopInterval(change.fullDocument._id);
                                break;
                        }

                    }
                }
            } catch { }

            this.wss.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log(change.fullDocument.currentPlayer);
                    try {
                        if (Object.values(change.fullDocument.playerCards).find((array: any) => array.length === 0)) {
                            client.send(JSON.stringify({ game_over: true }));
                        } else if (change.fullDocument.currentPlayer && change.fullDocument.currentPlayer.playerId.includes('bot')) {
                            const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id });
                            const currentPlayer = change.fullDocument.currentPlayer.playerId;
                            if (lobby?.settings?.cardType === "UNO") new GameChecker().playWithBotsUno(change.fullDocument, lobby as any, currentPlayer);
                            else if (lobby?.settings?.cardType === "RUMMY") new GameChecker().playWithBots(change.fullDocument, lobby as any, currentPlayer);
                            client.send(JSON.stringify({ refresh: true }));
                        } else {
                            client.send(JSON.stringify({ refresh: true }));
                        }
                    } catch {
                        client.send(JSON.stringify({ refresh: true }));
                    }


                }
            });
        });

        const chatWatching = this.lobby.watch([], options);

        chatWatching.on('change', async (change) => {

            try {
                const lobby = await this.lobby.findOne({ _id: change.fullDocument._id }).populate("users", 'firstName lastName email username customId rank settings').exec();

                this.wss.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify(lobby));
                    }
                });
            } catch {
                this.wss.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send("DELETED");
                    }
                });
            }
        });

        const lobbyWatching = this.lobby.watch([], options);

        lobbyWatching.on('change', async () => {
            this.wssTables.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ refresh: true }));
                }
            });
        });

        watching.on('error', (error) => {
            console.error('Error in game Change Stream:', error);
        });

        chatWatching.on('error', (error) => {
            console.error('Error in lobby Change Stream:', error);
        });


    }

}