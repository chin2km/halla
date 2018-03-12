
import Mongoose =  require("mongoose");
import * as rabbitJS from "rabbit.js";
import * as R from "ramda";
import { WorkerSocket } from "rabbit.js";
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

    private createServer(): void {
        Mongoose.connect(MongoServer.MONGODB_DB);
        this.hallaDB =  Mongoose.connection;
        this.hallaDB.on("error", () => {console.log( "FAILED to connect to mongoose"); });
        this.hallaDB.once("open", () => {
            // Connected to MongoDB
        });

        // rabbitJS Connection
        this.rabbitMQContext = rabbitJS.createContext(MongoServer.rabbitMQ_SERVER);
        this.rabbitMQContext.on("ready", () => {
            this.listenClients();
        });
    }

    private recieveMessageFromSocketServer(): void {
        const WORKER_SOCKET: WorkerSocket = this.rabbitMQContext.socket("WORKER", {routing: "topic"});
        WORKER_SOCKET.setEncoding("utf8");

        WORKER_SOCKET.on("data", (data) => {
            WORKER_SOCKET.ack();
            console.log(data);
        });

        WORKER_SOCKET.connect("TEST_EXCHANGE");
    }

    private listenClients(): void {
        this.recieveMessageFromSocketServer();
    }

    public getServer(): any {
        return this.hallaDB;
    }
}