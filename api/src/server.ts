import App from "./app";
import GameController from "./controllers/game.controller";
import LobbyController from "./controllers/lobby.controller";


new App([new GameController(), new LobbyController()]);  
