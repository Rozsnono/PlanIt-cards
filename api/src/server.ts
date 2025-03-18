import App from "./app";
import GameController from "./controllers/game.controller";
import LobbyController from "./controllers/lobby.controller";
import PlayerController from "./controllers/player.controller";
import RummyController from "./controllers/rummy.controller";
import GameHistoryController from "./controllers/game.history.controller";
import UnoController from "./controllers/uno.controller";


new App([new GameController(), new LobbyController(), new PlayerController(), new RummyController(), new GameHistoryController(), new UnoController()]);  
