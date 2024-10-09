import WebSocket, { WebSocketServer } from 'ws';
import lobbyModel from '../models/lobby.model';
import gameModel from '../models/game.model';

export default class SocketIO {
    private wss = new WebSocketServer({ port: 8080 });
    private lobby = lobbyModel.lobbyModel;
    private game = gameModel.gameModel;

    constructor() {

        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Client connected');

            // Handle WebSocket message received from client
            ws.on('message', async (id: string) => {
                const identifier = JSON.parse(id);
                console.log(`Received message => ${identifier}`);
                const inLobby = await this.lobby.findOne({ players: identifier._id });
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
                }
            });

            // Handle WebSocket close event
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }
    public async monitorCollectionChanges() {

        const watching = this.game.watch();

        watching.on('change', (change) => {
            console.log('Change detected:', change);

            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(change));
                }
            });
        });
    }

}