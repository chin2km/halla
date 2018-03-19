import socketIo = require("socket.io");
import * as rabbitJS from "rabbit.js";
import { DefaultNamespace } from "./NameSpaces/DefaultNamespace";
import * as R from "ramda";
import { PushSocket } from "rabbit.js";
import { RoomsNamespace } from "./NameSpaces/RoomsNamespace";
import { ChatroomNamespace } from "./NameSpaces/ChatroomNamespace";

export class SocketServer {
    public static readonly PORT: number = 5027;
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    private socketIO: SocketIO.Server;
    private rabbitMQConnection: rabbitJS.Context;
    private port: string | number;
    private ALL_CLIENTS: DefaultNamespace[] = [];

    constructor() {
        this.config();
        this.createServer();
    }

    private config(): void {
        this.port = process.env.PORT || SocketServer.PORT;
    }

    private createServer(): void {
        // Socket Connection
        this.socketIO = socketIo();
        this.socketIO.listen(this.port);

        // rabbitJS Connection
        this.rabbitMQConnection = rabbitJS.createContext(SocketServer.rabbitMQ_SERVER);
        this.rabbitMQConnection.on("ready", () => {
            this.listenClients();
        });
    }

    private listenClients(): void {
        // Default namespace
        this.socketIO.of("/").on("connect", (socket: SocketIO.Socket) => {
            const CLIENT = new DefaultNamespace(socket, this.rabbitMQConnection);

            this.ALL_CLIENTS.push(CLIENT);
            console.log(`Client CONNECTED: Total Clients: ${this.ALL_CLIENTS.length}: Client socket id: ${socket.id}`);

            socket.on("disconnect", () => {
                const client = R.find(R.propEq("socket", socket))(this.ALL_CLIENTS);
                this.ALL_CLIENTS = R.reject(R.equals(client))(this.ALL_CLIENTS);
                console.log(`Client DISCONNECTED: Total Clients: ${this.ALL_CLIENTS.length}`);
            });
        });

        // Rooms namespace
        this.socketIO.of("/rooms").on("connect", (socket: SocketIO.Socket) => {
            new RoomsNamespace(socket, this.rabbitMQConnection);
        });

        // Chatroom namespace
        this.socketIO.of("/chatroom").on("connect", (socket: SocketIO.Socket) => {
            new ChatroomNamespace(socket, this.rabbitMQConnection);
        });
    }

    public getServer(): SocketIO.Server {
        return this.socketIO;
    }
}