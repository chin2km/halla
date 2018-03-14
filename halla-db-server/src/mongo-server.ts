
import Mongoose =  require("mongoose");
import * as rabbitJS from "rabbit.js";
import * as R from "ramda";
import { WorkerSocket, RepSocket } from "rabbit.js";
import { Socket } from "net";

export class MongoServer {
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    public static readonly MONGODB_DB: string = "mongodb://localhost/halla_db";
    private rabbitMQContext: rabbitJS.Context;
    private port: string | number;

    private hallaDB: Mongoose.Connection;

    constructor() {
        this.createServer();
    }

    private createServer = (): void  => {
        // MongoDB Connection
        Mongoose.connect(MongoServer.MONGODB_DB);
        this.hallaDB =  Mongoose.connection;
        this.hallaDB.on("error", () => {console.log( "FAILED to connect to mongoose"); });
        this.hallaDB.once("open", console.log);

        // rabbitJS Connection
        this.rabbitMQContext = rabbitJS.createContext(MongoServer.rabbitMQ_SERVER);
        this.rabbitMQContext.on("ready", this.listenClients);
    }

    private recieveMessageFromSocketServer = (): void => {
        const REPLY_SOCKET: RepSocket = this.rabbitMQContext.socket("REPLY");
        REPLY_SOCKET.on("data", (data: string) => {
            const signUpData = JSON.parse(data);
            console.log(signUpData);


            REPLY_SOCKET.write("OK");
        });
        REPLY_SOCKET.connect("SIGNUP_CHANNEL");
    }

    private listenClients = (): void => {
        this.recieveMessageFromSocketServer();
    }

    public getServer(): any {
        return this.hallaDB;
    }
}