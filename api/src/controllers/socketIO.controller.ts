import WebSocket, { WebSocketServer } from 'ws';
import lobbyModel from '../models/lobby.model';
import gameModel from '../models/game.model';
import mongoose from 'mongoose';

export default class SocketIO {
    private wss = new WebSocketServer({ port: 8080 });
    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;

    constructor() {

        this.wss.on('connection', (ws: WebSocket) => {

            // Handle WebSocket message received from client
            ws.on('message', async (id: string) => {
                const identifier = JSON.parse(id);
                const inLobby = await this.lobby.findOne({ $and: [{ _id: new mongoose.Types.ObjectId(identifier._id) }, { users: new mongoose.Types.ObjectId(identifier.player_id) }] }).populate("users", 'firstName lastName email username customId').exec();
                if (inLobby) {
                    const inGame = await this.game.findOne({ _id: inLobby.game_id });
                    if (inGame) {
                        ws.send(JSON.stringify({
                            lobby: inLobby,
                            game: inGame,
                        }));
                    } else {
                        ws.send(JSON.stringify(inLobby));
                    }
                } else {
                    ws.send(JSON.stringify({ message: "You are not in a lobby" }));

                }
            });

            // Handle WebSocket close event
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }


    public async monitorCollectionChanges() {

        const options = { fullDocument: 'updateLookup' }

        const watching = this.game.watch([], options);

        watching.on('change', (change) => {

            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(change));
                }
            });
        });

        const chatWatching = this.lobby.watch([], options);

        chatWatching.on('change', async (change) => {

            try {
                const lobby = await this.lobby.findOne({ _id: change.fullDocument._id }).populate("users", 'firstName lastName email username customId').exec();

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