import express from "express";
import mongoose from "mongoose";
import IController from "./interfaces/controller_interface";
import cors from "cors";
import http from 'http';
import dotenv from 'dotenv';
import AuthController from "./controllers/auth.controller";
import SocketIO from "./controllers/socketIO.controller";

const { MONGO_URL = "mongodb://localhost:27017/planit-cards" } = process.env;



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
                console.log('Server is running on port ' + port);
            });
            new SocketIO();
        });

        controllers.forEach(controller => {
            this.app.use("/api", controller.router);
        });

        this.app.use("/auth", new AuthController().router);

    }

    private async connectToTheDatabase() {
        mongoose.set("strictQuery", true);
        try {
            console.log("Connecting to the database...")
            await mongoose.connect(MONGO_URL, { connectTimeoutMS: 10000 });
            console.log("Connected to the database");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: unknown | undefined | any) {
            console.log({ message: error.message });
        }

    }
}
