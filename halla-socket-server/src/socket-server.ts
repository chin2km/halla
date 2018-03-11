import socketIo = require("socket.io");
import * as rabbitJS from "rabbit.js";
import { Client } from "./handlers/Client";
import * as R from "ramda";
import { PushSocket } from "rabbit.js";

export class SocketServer {
    public static readonly PORT: number = 5027;
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    private socketIO: SocketIO.Server;
    private rabbitMQContext: rabbitJS.Context;
    private port: string | number;
    private ALL_SOCKETS: SocketIO.Socket[] = [];

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
        this.rabbitMQContext = rabbitJS.createContext(SocketServer.rabbitMQ_SERVER);
        this.rabbitMQContext.on("ready", () => {
            this.listenClients();
        });
    }

    private sendMessageToTaskQueue(message: string): void {
        const PUSH_SOCKET: PushSocket = this.rabbitMQContext.socket("PUSH",
        {
            routing: "topic",
            persistent: true
        }
    );

        PUSH_SOCKET.connect("ttt", () => {
            PUSH_SOCKET.write(message, "utf8");
            PUSH_SOCKET.close();
        });
    }

    private listenClients(): void {

        //////////////////////////////////////////////////////////////
        let Number = 0;
        setInterval(() => {
            this.sendMessageToTaskQueue(`send# ${++Number}`);
        }, 1000);
        //////////////////////////////////////////////////////////////

        this.socketIO.on("connect", (socket: SocketIO.Socket) => {
            this.ALL_SOCKETS.push(socket);
            console.log(`Connected client on port ${this.port}: Total Clients: ${this.ALL_SOCKETS.length}: Client id: ${socket.id}`);

            socket.emit("connected", socket.id);

            const handlerCategories = {
                client: new Client(this, socket).handlers
            };

            R.forEachObjIndexed((handles) => {
                R.forEachObjIndexed((handle, eventName) => {
                    socket.on(eventName, handle);
                })(handles);
            })(handlerCategories);

            socket.on("disconnect", () => {
                this.ALL_SOCKETS = R.filter(R.complement(R.equals(socket)))(this.ALL_SOCKETS);
                console.log(`Client disconnected on port ${this.port}: Total Clients: ${this.ALL_SOCKETS.length}`);
            });
        });
    }

    public getServer(): SocketIO.Server {
        return this.socketIO;
    }
}