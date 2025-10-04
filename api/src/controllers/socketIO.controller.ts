import WebSocket, { WebSocketServer } from 'ws';
import lobbyModel from '../models/lobby.model';
import gameModel from '../models/game.model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ERROR } from '../enums/error.enum';
import { GameService, RummyService, SchnappsService, SolitaireService, UnoService } from '../services/game.service';
import GameHistoryService, { GameHistorySchnapps, GameHistorySolitaire } from '../services/history.services';
import { Igame } from '../interfaces/interface';
import userModel from '../models/player.model';
import { LogService } from '../services/log.service';
import gameHistoryModel from '../models/game.history.model';

const { ACCESS_TOKEN_SECRET = "secret" } = process.env;


export default class SocketIO {
    private websockets: { [websocketName: string]: WebSocketServer } = {
        gameSocket: new WebSocketServer({ port: 8080 }),
        tableSocket: new WebSocketServer({ port: 8081 }),
        adminSocket: new WebSocketServer({ port: 8082 }),
        adminGameSocket: new WebSocketServer({ port: 8085 }),
        playerDataSocket: new WebSocketServer({ port: 8090 }),
    };
    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;
    private user = userModel.userModel;
    private gameHistoryModel = gameHistoryModel.gameHistoryModel;
    private logService = new LogService();

    private wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));


    constructor() {

        this.logService.consoleLog('SocketIO initialized', 'SocketIOService');

        this.logService.consoleLog('Starting WebSocket servers on ports 8080, 8081, 8082, 8085, 8090', 'SocketIOService');
        this.wssConnectionStart();
        this.wssTableConntectionStart();
        this.wssAdminConnectionStart();
        this.wssAdminGameConntectionStart();
        this.logService.consoleLog('WebSocket servers started successfully', 'SocketIOService');
        this.startInterval();
    }

    private async wssConnectionStart() {
        this.websockets.gameSocket.on('connection', (ws: WebSocket) => {

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
                                    lastAction: 1,
                                }
                            }
                        ]
                        );

                        if (inGame.length == 1) {
                            const inGameObj: any = inGame[0];
                            if (await this.checkIfGameIsOver(inGameObj, inLobby.settings!.cardType) || inGameObj.secretSettings?.isGameOver) {
                                const gameOverObj = {
                                    game_over: true,
                                    lobby: inLobby,
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

                    } else {
                        const inGame = await this.game.aggregate([
                            { $match: { _id: inLobby.game_id } },
                            {
                                $project: {
                                    _id: 1,
                                    playerCards: { $ifNull: [`$playerCards.${player_id}`, []] },
                                    currentPlayer: 1,
                                    secretSettings: 1,
                                    playedCards: 1,
                                    droppedCards: 1,
                                    drawedCard: 1,
                                    shuffledCards: 1,
                                    lastAction: 1,
                                    allCards: {
                                        $map: {
                                            input: { $objectToArray: "$playerCards" },
                                            as: "player",
                                            in: {
                                                k: "$$player.k",
                                                v: { $size: { $ifNull: ["$$player.v", []] } }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    allCards: { $arrayToObject: "$allCards" }
                                }
                            }
                        ]
                        );

                        if (inGame.length == 1) {
                            const inGameObj: any = inGame[0];
                            if (await this.checkIfGameIsOver(inGameObj, inLobby.settings!.cardType) || inGameObj.secretSettings?.isGameOver) {
                                const gameOverObj = {
                                    game_over: true,
                                    lobby: inLobby,
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
                return game.playedCards.every((played: any) => played.cards.length == 0) && game.shuffledCards.length === 0;
            default:
                return false;
        }
    }

    private async wssAdminConnectionStart() {
        this.websockets.adminSocket.on('connection', (ws: WebSocket) => {

            ws.on('connect', async () => {
                ws.send(JSON.stringify(await this.getAdminDatas()));
            });

            ws.on('message', async () => {
                ws.send(JSON.stringify(await this.getAdminDatas()));
            });
        });

        const watchingLobby = this.lobby.watch([], { fullDocument: 'updateLookup' });
        const watchingUser = this.user.watch([], { fullDocument: 'updateLookup' });

        watchingUser.on('change', async () => {
            this.websockets.adminSocket.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(await this.getAdminDatas()));
                }
            });
        });

        watchingLobby.on('change', async () => {
            this.websockets.adminSocket.clients.forEach(async (client) => {
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
        this.websockets.adminGameSocket.on('connection', (ws: WebSocket) => {

            ws.on('connect', async () => {
                ws.send('');
            });

            ws.on('message', async (data: string) => {
                const games = await this.game.findOne({ _id: JSON.parse(data).id });
                const lobby = await this.lobby.findOne({ gameId: JSON.parse(data).id }).populate("users", 'firstName lastName email username customId rank settings').exec();
                if (!games) {
                    ws.send(JSON.stringify({ error: 'Game not found' }));
                    return;
                }
                ws.send(JSON.stringify({ game: games, lobby }));
            });

        });

        const watchingGame = this.game.watch([], { fullDocument: 'updateLookup' });

        watchingGame.on('change', async (change) => {
            if (!change.fullDocument) return;
            const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id }).populate("users", 'firstName lastName email username customId rank settings').exec();
            this.websockets.adminGameSocket.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ game: change.fullDocument, lobby }));
                }
            });
        });
    }

    private async wssTableConntectionStart() {
        this.websockets.tableSocket.on('connection', async (ws: WebSocket) => {

            ws.send(JSON.stringify(await this.getLobbies));


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

    private gameChecker = new GameService();
    private services = {
        rummy: new RummyService(),
        uno: new UnoService(),
        schnapps: new SchnappsService(),
        solitaire: new SolitaireService()
    }
    private gameHistory = new GameHistoryService();
    private gameHistoryS = new GameHistorySolitaire();
    private gameHistorySchnapps = new GameHistorySchnapps();

    public async monitorCollectionChanges() {
        this.logService.consoleLog('Starting to monitor collection changes', 'SocketIOService');
        const options = { fullDocument: 'updateLookup' }

        const watching = this.game.watch([], options);

        watching.on('change', async (change) => {
            const game = change.fullDocument;
            if (!game) return;

            this.websockets.gameSocket.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    try {
                        client.send(JSON.stringify({ refresh: true }));
                    } catch (error) {
                        console.error('Error sending game update:', error);
                    }
                }
            });

        })

        const watchingGameCurrentPlayer = this.game.watch([
            {
                $match: {
                    $or: [
                        {
                            operationType: { $in: ['update', 'replace'] },
                            $or: [
                                { 'updateDescription.updatedFields.currentPlayer.playerId': { $exists: true } },
                                { 'updateDescription.updatedFields.currentPlayer.time': { $exists: true } },
                                { 'updateDescription.updatedFields.currentPlayer': { $exists: true } }
                            ]
                        },
                        { operationType: 'insert' }
                    ]
                }
            }
        ], { fullDocument: 'updateLookup' });
        watchingGameCurrentPlayer.on('change', async (change) => {
            const game = change.fullDocument;
            if (game && (await this.checkIfGameIsOver(game, game.secretSettings.gameType) || game.secretSettings?.isGameOver)) {
                const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id });
                if (lobby) {
                    switch (lobby.settings?.cardType) {
                        case "RUMMY":
                            this.gameHistory.makingStatsForHistory(change.fullDocument._id, lobby.users.length * 20 + lobby.bots.length * 10 + 10);
                            break;

                        case "UNO":
                            this.gameHistory.makingStatsForHistory(change.fullDocument._id, lobby.users.length * 20 + lobby.bots.length * 10 + 10);
                            break;

                        case "SOLITAIRE":
                            this.gameHistoryS.getStatsForHistory(change.fullDocument._id, 10);
                            break;

                        case "SCHNAPPS":
                            this.gameHistorySchnapps.makingStatsForHistory(change.fullDocument._id, lobby.users.length * 20 + lobby.bots.length * 10 + 10);
                            break;
                        default:
                            break;
                    }

                }
                this.websockets.gameSocket.clients.forEach(async (client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        try {
                            client.send(JSON.stringify({ game_over: true }));
                        } catch (error) {
                            console.error('Error sending game update:', error);
                        }
                    }
                });
            } else {
                if (change.fullDocument?.secretSettings?.gameType === 'SOLITAIRE') return;
                if (game.currentPlayer && game.currentPlayer.playerId.includes('bot')) {
                    const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id });
                    const currentPlayer = change.fullDocument.currentPlayer.playerId;
                    switch (lobby?.settings?.cardType) {
                        case "RUMMY":
                            this.services.rummy.robotPlaying(change.fullDocument, lobby as any, currentPlayer);
                            break;

                        case "UNO":
                            this.services.uno.robotPlaying(change.fullDocument, lobby as any, currentPlayer);
                            break;

                        case "SOLITAIRE":
                            break;

                        case "SCHNAPPS":
                            if (change.fullDocument.secretSettings?.currentTurn === 1) {
                                this.services.schnapps.robotSelecting(change.fullDocument, lobby as any, currentPlayer);
                            } else {
                                this.services.schnapps.robotPlaying(change.fullDocument, lobby as any, currentPlayer);
                            }
                            break;
                        default:
                            break;
                    }
                } else if (game && game.secretSettings?.gameType == 'UNO' && game.lastAction) {
                    const lastAction = game.lastAction;
                    if (lastAction.playerId != game.currentPlayer.playerId && lastAction.actions && lastAction.actions > 25) {
                        await this.wait(1000); // Wait for 1 second before sending the next turn
                        this.services.uno.nextTurn(game._id.toString(), game.currentPlayer.playerId.toString());
                    }
                } else if (game && game.secretSettings?.gameType == 'RUMMY') {
                    await new GameHistoryService().putHistory(game._id.toString(), game as any);
                }
            }
        });

        const chatWatching = this.lobby.watch([], options);

        chatWatching.on('change', async (change) => {

            try {
                const lobby = await this.lobby.findOne({ _id: change.fullDocument._id }).populate("users", 'firstName lastName email username customId rank settings').exec();
                this.websockets.gameSocket.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({ lobby: lobby }));
                    }
                });
            } catch {
                this.websockets.gameSocket.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send("DELETED");
                    }
                });
            }
        });

        const lobbyWatching = this.lobby.watch([], options);

        lobbyWatching.on('change', async () => {
            this.websockets.tableSocket.clients.forEach((client) => {
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


        this.logService.consoleLog('Monitoring player changes started', 'SocketIOService');
        const userWatching = this.user.watch([
            {
                $match: {
                    operationType: 'update',
                    $or: [
                        { 'updateDescription.updatedFields.pendingFriends': { $exists: true } },
                        { 'updateDescription.updatedFields.gameInvites': { $exists: true } },
                        { 'updateDescription.updatedFields.settings': { $exists: true } }
                    ]
                }
            }
        ], { fullDocument: 'updateLookup' });
        userWatching.on('change', async (change) => {
            const player = await this.user.findOne({ customId: change.fullDocument.customId }).populate("pendingFriends", "customId firstName lastName username rank settings").exec();
            const token = jwt.sign({
                _id: player!._id,
                username: player!.username,
                firstName: player!.firstName,
                lastName: player!.lastName,
                auth: player!.auth,
                gamesStats: player!.gamesStats,
                rank: player!.rank,
                email: player!.email,
                customId: player!.customId,
                pendingFriends: player!.pendingFriends.length,
                settings: player!.settings,
                gameInvites: player!.gameInvites
            }, ACCESS_TOKEN_SECRET);
            this.websockets.playerDataSocket.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ pendingFriends: player!.pendingFriends, token: token, customId: player!.customId, settings: player!.settings, gameInvites: player!.gameInvites }));
                }
            });
        });




    }

    private interval: any;
    public async startInterval() {
        this.interval = setInterval(async () => {
            const games = await this.game.find({ 'currentPlayer.time': { $exists: true } }).exec();
            const lobbies = await this.lobby.find({ game_id: { $in: games.map(game => game._id) } }).exec();
            if (games.length > 0) {
                games.forEach(async (game) => {
                    const time = new Date().getTime() - game.currentPlayer.time
                    const type = lobbies.find(lobby => lobby.game_id.toString() === game._id.toString())?.settings?.cardType || 'RUMMY';
                    switch (type) {
                        case 'RUMMY':
                            if (time > 1000 * ((game.secretSettings?.timeLimit) || 180)) {
                                this.logService.consoleLog(`Game ${game._id} is still active, forcing next turn. Time limit: ${game.secretSettings?.timeLimit || 180}. Time: ${time / 1000}`, 'SocketIOService');
                                const force = await this.services.rummy.forcedNextTurn(game._id.toString());
                                if (!force) {
                                    this.game.deleteOne({ _id: game._id }).then(() => {
                                        const lobby = lobbies.find(lobby => lobby.game_id.toString() === game._id.toString());
                                        if (lobby) {
                                            this.lobby.deleteOne({ _id: lobby._id }).then(() => {
                                                this.logService.consoleLog(`Lobby ${lobby._id} deleted due to inactivity`, 'SocketIOService');
                                            }).catch((err) => {
                                                this.logService.consoleLog(`Error deleting lobby ${lobby._id}: ${err}`, 'SocketIOService');
                                            });
                                        }
                                        this.logService.consoleLog(`Game ${game._id} deleted due to inactivity`, 'SocketIOService');
                                    }).catch((err) => {
                                        this.logService.consoleLog(`Error deleting game ${game._id}: ${err}`, 'SocketIOService');
                                    });
                                }
                            }
                            break;
                        case 'UNO':
                            if (time > 1000 * ((game.secretSettings?.timeLimit) || 180)) {
                                this.logService.consoleLog(`Game ${game._id} is still active, forcing next turn. Time limit: ${game.secretSettings?.timeLimit || 180}. Time: ${time / 1000}`, 'SocketIOService');
                                if (!game.currentPlayer.playerId.includes('bot') && game.playerCards[game.currentPlayer.playerId].length > 25) {
                                    this.logService.consoleLog(`Player ${game.currentPlayer.playerId} has too many cards, forcing next turn.`, 'SocketIOService');
                                    await new GameService().playerRemove(game._id.toString(), game.currentPlayer.playerId.toString());
                                    return;
                                }
                                const force = await this.services.uno.forcedNextTurn(game._id.toString(), game.currentPlayer.playerId.toString());
                                if (!force) {
                                    this.game.deleteOne({ _id: game._id }).then(() => {
                                        const lobby = lobbies.find(lobby => lobby.game_id.toString() === game._id.toString());
                                        if (lobby) {
                                            this.lobby.deleteOne({ _id: lobby._id }).then(() => {
                                                this.logService.consoleLog(`Lobby ${lobby._id} deleted due to inactivity`, 'SocketIOService');
                                            }).catch((err) => {
                                                this.logService.consoleLog(`Error deleting lobby ${lobby._id}: ${err}`, 'SocketIOService');
                                            });
                                        }
                                        this.logService.consoleLog(`Game ${game._id} deleted due to inactivity`, 'SocketIOService');
                                    }).catch((err) => {
                                        this.logService.consoleLog(`Error deleting game ${game._id}: ${err}`, 'SocketIOService');
                                    });
                                }
                            }
                            break;
                        case 'SOLITAIRE':
                            break;
                        case 'SCHNAPPS':
                            return;
                            if (time > 1000 * ((game.secretSettings?.timeLimit) || 60)) {
                                this.logService.consoleLog(`Game ${game._id} is still active, forcing next turn. Time limit: ${game.secretSettings?.timeLimit || 60}. Time: ${time / 1000}`, 'SocketIOService');
                                const force = await this.services.schnapps.forcedNextTurn(game._id.toString(), game.currentPlayer.playerId.toString());
                                if (!force) {
                                    this.game.deleteOne({ _id: game._id }).then(() => {
                                        const lobby = lobbies.find(lobby => lobby.game_id.toString() === game._id.toString());
                                        if (lobby) {
                                            this.lobby.deleteOne({ _id: lobby._id }).then(() => {
                                                this.logService.consoleLog(`Lobby ${lobby._id} deleted due to inactivity`, 'SocketIOService');
                                            }).catch((err) => {
                                                this.logService.consoleLog(`Error deleting lobby ${lobby._id}: ${err}`, 'SocketIOService');
                                            });
                                        }
                                        this.logService.consoleLog(`Game ${game._id} deleted due to inactivity`, 'SocketIOService');
                                    }).catch((err) => {
                                        this.logService.consoleLog(`Error deleting game ${game._id}: ${err}`, 'SocketIOService');
                                    });
                                }
                            }
                            break;
                    }
                })
            }
            if(lobbies.length > 0) {
                lobbies.forEach(async (lobby) => {
                    if (!lobby.game_id && lobby.createdAt.getTime() < Date.now() - 1000 * 60 * 60) {
                        this.logService.consoleLog(`Lobby ${lobby._id} deleted due to inactivity`, 'SocketIOService');
                        await this.lobby.deleteOne({ _id: lobby._id });
                    }
                });
            }
        }, 1000)
    }

    public async stopInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.logService.consoleLog('SocketIO interval stopped', 'SocketIOService');
        }
    }

    public async closeWebsockets() {
        for (const key in this.websockets) {
            if (this.websockets[key]) {
                this.websockets[key].close(() => {
                    this.logService.consoleLog(`WebSocket server on port ${this.websockets[key].options.port} closed`, 'SocketIOService');
                });
            }
        }
        await this.stopInterval();
    }
}