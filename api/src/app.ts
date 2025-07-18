import express from "express";
import mongoose from "mongoose";
import IController from "./interfaces/controller_interface";
import cors from "cors";
import http from 'http';
import dotenv from 'dotenv';
import AuthController from "./controllers/auth.controller";
import SocketIO from "./controllers/socketIO.controller";
import userModel from "./models/player.model";
import lobbyModel from "./models/lobby.model";
import gameModel from "./models/game.model";
import gameHistoryModel from "./models/game.history.model";
import { LogService } from "./services/log.service";
import { achievements } from "./cards/achievements";
import achievementsModel from "./models/achievements.model";

const { MONGO_URL = 'mongodb+srv://admin:admin@planitcards.rmxdeyd.mongodb.net/planitdb?retryWrites=true&w=majority&appName=PlanitCards' } = process.env;



export default class App {
    public app: express.Application;


    constructor(controllers: IController[]) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
        dotenv.config();

        const server = http.createServer(this.app);

        this.connectToTheDatabase().then(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const port: number | any = process.env.PORT || 8000;
            server.listen(port, "0.0.0.0", function () {
                new LogService().consoleLog('Server is running on port ' + port, 'AppService');
            });
            const s = new SocketIO();
            s.monitorCollectionChanges();
            this.setAchievements();
        });

        controllers.forEach(controller => {
            this.app.use("/api", controller.router);
        });

        this.app.use("/auth", new AuthController().router);

    }

    private async connectToTheDatabase() {
        mongoose.set("strictQuery", true);
        try {
            new LogService().consoleLog("Connecting to the database...", 'AppService');
            await mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 5000 });
            new LogService().consoleLog("Connected to the database successfully.", 'AppService');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: unknown | undefined | any) {
            new LogService().consoleLog("Failed to connect to the database.", 'AppService');
            console.log({ message: error.message });
        }

        userModel.userModel.init();
        lobbyModel.lobbyModel.init();
        gameModel.gameModel.init();
        gameHistoryModel.gameHistoryModel.init();
        achievementsModel.achievementsModel.init();
        
    }

    private async setAchievements() {
        const existingAchievements = await achievementsModel.achievementsModel.find();
        if (existingAchievements.length === 0) {
            await achievementsModel.achievementsModel.insertMany(achievements);
            new LogService().consoleLog("Achievements initialized successfully.", 'AppService');   
        } else {
            new LogService().consoleLog("Achievements already exist, skipping initialization.", 'AppService');
        }
    }
}
