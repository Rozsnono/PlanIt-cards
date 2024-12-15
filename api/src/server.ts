import App from "./app";
import GameController from "./controllers/game.controller";
import LobbyController from "./controllers/lobby.controller";
import PlayerController from "./controllers/player.controller";


new App([new GameController(), new LobbyController(), new PlayerController()]);  
