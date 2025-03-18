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
    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;

    constructor() {

        this.wss.on('connection', (ws: WebSocket) => {

            // Handle WebSocket message received from client
            ws.on('message', async (id: string) => {
                const identifier = JSON.parse(id);
                const inLobby = await this.lobby.findOne({ $and: [{ _id: new mongoose.Types.ObjectId(identifier._id) }, { users: new mongoose.Types.ObjectId(identifier.player_id) }] }).populate("users", 'firstName lastName email username customId rank').exec();
                if (inLobby) {
                    const inGame = await this.game.findOne({ _id: inLobby.game_id });
                    if (inGame) {
                        const obj: any = inGame.toObject();
                        const playerCard = obj.playerCards[identifier.player_id];
                        if (Object.values(obj.playerCards).find((array: any) => array.length === 0)) {
                            ws.send(JSON.stringify({ game_over: true }));
                        }
                        ws.send(JSON.stringify({
                            lobby: inLobby,
                            game: { ...obj, playerCards: Object.keys(obj.playerCards).map((key) => { return { [key]: obj.playerCards[key].length } }) },
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
                    if(lobby){
                        this.gameChecker.setRankByPosition(lobby! as any);
                        this.gameHistory.savePosition(lobby!._id.toString(), change.fullDocument._id);
                    }
                }
            } catch { }

            this.wss.clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log('Game Change Stream:');
                    if (Object.values(change.fullDocument.playerCards).find((array: any) => array.length === 0)) {
                        client.send(JSON.stringify({ game_over: true }));

                    } else if (change.fullDocument.currentPlayer && change.fullDocument.currentPlayer.playerId.includes('bot')) {
                        const lobby = await this.lobby.findOne({ game_id: change.fullDocument._id });
                        const currentPlayer = change.fullDocument.currentPlayer.playerId;
                        new GameChecker().playWithBots(change.fullDocument, lobby as any, currentPlayer);
                        client.send(JSON.stringify({ refresh: true }));
                    } else {
                        client.send(JSON.stringify({ refresh: true }));
                    }

                }
            });
        });

        const chatWatching = this.lobby.watch([], options);

        chatWatching.on('change', async (change) => {

            try {
                const lobby = await this.lobby.findOne({ _id: change.fullDocument._id }).populate("users", 'firstName lastName email username customId rank').exec();

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

        watching.on('error', (error) => {
            console.error('Error in game Change Stream:', error);
        });

        chatWatching.on('error', (error) => {
            console.error('Error in lobby Change Stream:', error);
        });


    }

}