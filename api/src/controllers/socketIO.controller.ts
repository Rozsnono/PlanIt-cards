import WebSocket, { WebSocketServer } from 'ws';
import lobbyModel from '../models/lobby.model';
import gameModel from '../models/game.model';
import mongoose from 'mongoose';
import { ERROR } from '../enums/error.enum';
import { GameChecker } from '../services/game.service';
import GameHistoryService, { GameHistorySolitaire } from '../services/history.services';
import { Igame, Ilobby } from '../interfaces/interface';
import userModel from '../models/player.model';
import { LogService } from '../services/log.service';

export default class SocketIO {
    private wss = new WebSocketServer({ port: 8080 });
    private wssTables = new WebSocketServer({ port: 8081 });
    private wssAdmin = new WebSocketServer({ port: 8082 });
    private wssAdminGame = new WebSocketServer({ port: 8085 });
    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;
    private user = userModel.userModel;
    private logService = new LogService();

    constructor() {

        this.logService.consoleLog('SocketIO initialized', 'SocketIOService');

        this.logService.consoleLog('Starting WebSocket servers on ports 8080, 8081, 8082, and 8085', 'SocketIOService');
        this.wssConnectionStart();
        this.wssTableConntectionStart();
        this.wssAdminConnectionStart();
        this.wssAdminGameConntectionStart();
        this.logService.consoleLog('WebSocket servers started successfully', 'SocketIOService');
        this.startInterval();
    }

    private async wssConnectionStart() {
        this.wss.on('connection', (ws: WebSocket) => {

            // Handle WebSocket message received from client
            ws.on('message', async (id: string) => {
                const identifier = JSON.parse(id);
                const { _id, player_id } = JSON.parse(id) as { _id: string, player_id: string };
                const inLobby = await this.lobby.findOne({ _id: new mongoose.Types.ObjectId(_id), users: new mongoose.Types.ObjectId(player_id) }).populate("users", 'firstName lastName email username customId rank settings').exec();
                if (inLobby) {
                    if (!inLobby.game_id) {
                        const lobbyObj = {
                            lobby: inLobby,
                            game: null,
                            game_over: false
                        }
                        ws.send(JSON.stringify(lobbyObj));
                        return;
                    }
                    if (inLobby.settings?.cardType === 'SOLITAIRE') {
                        const inGame = await this.game.aggregate([
                            { $match: { _id: inLobby.game_id } },
                            {
                                $project: {
                                    _id: 1,
                                    playerCards: 1,
                                    currentPlayer: 1,
                                    secretSettings: 1,
                                    playedCards: 1,
                                    droppedCards: 1,
                                    drawedCard: 1,
                                    shuffledCards: 1,
                                }
                            }
                        ]);

                        if (inGame.length == 1) {
                            const inGameObj: any = inGame[0];
                            if (await this.checkIfGameIsOver(inGameObj, inLobby.settings!.cardType)) {
                                const gameOverObj = {
                                    game_over: true
                                }
                                ws.send(JSON.stringify(gameOverObj));
                                return;
                            } else {
                                const gameObj = {
                                    game_over: false,
                                    lobby: inLobby,
                                    game: inGameObj
                                }
                                ws.send(JSON.stringify(gameObj));
                            }
                        } else {
                            ws.send(JSON.stringify(inLobby));
                        }

                    } else {
                        const inGame = await this.game.aggregate([
                            { $match: { _id: inLobby.game_id } },
                            {
                                $project: {
                                    _id: 1,
                                    playerCards: `$playerCards.${player_id}`,
                                    currentPlayer: 1,
                                    secretSettings: 1,
                                    playedCards: 1,
                                    droppedCards: 1,
                                    drawedCard: 1,
                                    shuffledCards: 1,
                                }
                            }
                        ]);

                        if (inGame.length == 1) {
                            const inGameObj: any = inGame[0];
                            if (await this.checkIfGameIsOver(inGameObj, inLobby.settings!.cardType)) {
                                const gameOverObj = {
                                    game_over: true,
                                    game: inGameObj
                                }
                                ws.send(JSON.stringify(gameOverObj));
                                return;
                            } else {
                                const gameObj = {
                                    game_over: false,
                                    lobby: inLobby,
                                    game: inGameObj
                                }
                                ws.send(JSON.stringify(gameObj));
                            }
                        } else {
                            ws.send(JSON.stringify(inLobby));
                        }
                    }


                } else {
                    const lobby = await this.lobby.findOne({ _id: identifier._id }).populate("users", 'firstName lastName email username customId rank settings').exec();
                    if (lobby?.game_id) {
                        const game = await this.game.findOne({ _id: lobby.game_id });
                        const obj: any = game?.toObject();
                        delete obj.playerCards;
                        const res = {
                            lobby: lobby,
                            game: obj
                        }
                        ws.send(JSON.stringify(res));
                    } else {
                        ws.send(JSON.stringify({ status: ERROR.NOT_IN_LOBBY }));
                    }


                }
            });
        });
    }

    private async checkIfGameIsOver(game: Igame, type: string): Promise<boolean> {
        switch (type) {
            case 'RUMMY':
                return Object.values(game.playerCards).some((cards: any[]) => cards.length === 0);
            case 'UNO':
                return Object.values(game.playerCards).some((cards: any[]) => cards.length === 0);
            case 'SOLITAIRE':
                return game.playedCards.some((played: any) => played.cards.length > 0) && game.droppedCards.length === 0;
            default:
                return false;
        }
    }

    private async wssAdminConnectionStart() {
        this.wssAdmin.on('connection', (ws: WebSocket) => {

            // Send initial data to the connected client
            ws.on('connect', async () => {
                ws.send(JSON.stringify(await this.getAdminDatas()));
            });

            // Handle WebSocket message received from client
            ws.on('message', async () => {
                ws.send(JSON.stringify(await this.getAdminDatas()));
            });
        });

        const watchingLobby = this.lobby.watch([], { fullDocument: 'updateLookup' });
        const watchingUser = this.user.watch([], { fullDocument: 'updateLookup' });

        watchingUser.on('change', async () => {
            this.wssAdmin.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(await this.getAdminDatas()));
                }
            });
        });

        watchingLobby.on('change', async () => {
            this.wssAdmin.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(await this.getAdminDatas()));
                }
            });
        });
    }

    private async getAdminDatas(): Promise<{ lobby_number: number, game_number: number, users: { total: number, data: any, labels: any }, types: { data: any, labels: any } }> {
        const lobbies = await this.lobby.find({}).populate("users", 'firstName lastName email username customId rank settings').exec();
        const games = await this.game.find({}).exec();
        const users = await this.user.find({}).exec();

        const userCountsByMonth = users.reduce<Record<string, number>>((acc, user) => {
            const monthKey = user.createdAt.toISOString().slice(0, 7); // "YYYY-MM"

            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});


        const returnData = {
            lobby_number: lobbies.length,
            game_number: games.length,
            users: {
                total: users.length,
                data: Object.values(userCountsByMonth),
                labels: Object.keys(userCountsByMonth)
            },
            types: {
                labels: ['UNO', 'RUMMY', 'SOLITAIRE'],
                data: [
                    lobbies.filter((lobby: any) => lobby.settings?.cardType === 'UNO').length,
                    lobbies.filter((lobby: any) => lobby.settings?.cardType === 'RUMMY').length,
                    lobbies.filter((lobby: any) => lobby.settings?.cardType === 'SOLITAIRE').length
                ]
            }
        }
        return returnData;
    }

    private async wssAdminGameConntectionStart() {
        this.wssAdminGame.on('connection', (ws: WebSocket) => {

            // Send initial data to the connected client
            ws.on('connect', async () => {
                ws.send('');
            });

            // Handle WebSocket message received from client
            ws.on('message', async (data: string) => {
                const games = await this.game.findOne({ _id: JSON.parse(data).id });
                if (!games) {
                    ws.send(JSON.stringify({ error: 'Game not found' }));
                    return;
                }
                ws.send(JSON.stringify(games));
            });

        });

        const watchingGame = this.game.watch([], { fullDocument: 'updateLookup' });

        watchingGame.on('change', async (change) => {
            this.wssAdminGame.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(change.fullDocument));
                }
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
        const lobbies = await this.lobby.find({ $and: [{ ...filter }, { $or: [{ $and: [{ 'settings.cardType': 'SOLITAIRE' }, { createdBy: userid }] }, { 'settings.cardType': { $ne: 'SOLITAIRE' } }] }] }).limit(paging.limit * paging.page).populate("users", "customId username rank settings");

        const lobbyCount = await this.lobby.countDocuments();
        return { total: parseInt(((lobbyCount / paging.limit)).toFixed(0)), data: lobbies }
    }

    private gameChecker = new GameChecker();
    private gameHistory = new GameHistoryService();
    private gameHistoryS = new GameHistorySolitaire();

    public async monitorCollectionChanges() {

        const options = { fullDocument: 'updateLookup' }

        const watching = this.game.watch([], options);

        watching.on('change', async (change) => {
            try {
                if (Object.values(change.fullDocument.playerCards).find((array: any) => array.length === 0)) {
                    const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id });
                    if (lobby) {
                        switch (lobby.settings?.cardType) {
                            case "RUMMY":
                                this.gameChecker.setRankByPosition(lobby! as any);
                                this.gameHistory.getStatsForHistory(change.fullDocument._id, 40);
                                break;

                            case "UNO":
                                this.gameChecker.setRankByPositionUno(lobby! as any);
                                this.gameHistory.getStatsForHistory(change.fullDocument._id, 40);
                                break;

                            case "SOLITAIRE":
                                this.gameChecker.setRankInSolitaire(lobby! as any);
                                this.gameHistoryS.savePosition(lobby!._id.toString(), change.fullDocument._id, 10);
                                break;

                            default:
                                break;
                        }

                    }
                }
            } catch { }

            this.wss.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
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
                console.log('Lobby change detected:', lobby!.game_id);
                this.wss.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({ lobby: lobby }));
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

    private interval: any;
    public async startInterval() {
        this.interval = setInterval(async () => {
            const games = await this.game.find({ 'currentPlayer.time': { $exists: true } }).exec();
            const lobbies = await this.lobby.find({ game_id: { $in: games.map(game => game._id) } }).exec();
            if (games.length > 0) {
                games.forEach((game) => {
                    const time = new Date().getTime() - game.currentPlayer.time
                    const type = lobbies.find(lobby => lobby.game_id.toString() === game._id.toString())?.settings?.cardType || 'RUMMY';
                    switch (type) {
                        case 'RUMMY':
                            if (time > 1000 * ((game.secretSettings?.timeLimit) || 180)) {
                                //Time is up!
                                this.logService.consoleLog(`Game ${game._id} is still active, forcing next turn. Time limit: ${game.secretSettings?.timeLimit || 180}. Time: ${time / 1000}`, 'SocketIOService');
                                new GameChecker().forceNextTurn(game._id.toString());
                            }
                            break;
                        case 'UNO':
                        case 'SOLITAIRE':
                    }
                })
            }
        }, 1000)
    }
}