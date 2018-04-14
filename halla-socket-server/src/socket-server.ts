import socketIo = require("socket.io");
import * as rabbitJS from "rabbit.js";
import { DefaultNamespace } from "./NameSpaces/DefaultNamespace";
import { RoomsNamespace } from "./NameSpaces/RoomsNamespace";
import { ChatroomNamespace } from "./NameSpaces/ChatroomNamespace";
import { DEFAULT_NSC, ROOMS_NSC, CHATROOM_NSC } from "../halla-shared/src/Namespaces/index";

export class SocketServer {
    public static readonly PORT: number = 5027;
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    private socketIO: SocketIO.Server;
    private rabbitMQConnection: rabbitJS.Context;
    private port: string | number;
    private usersOnline: any = {};

    constructor () {
        this.config();
        this.createServer();
    }

    private config (): void {
        this.port = process.env.PORT || SocketServer.PORT;
    }

    private createServer (): void {
        // Socket Connection
        this.socketIO = socketIo(this.port, {transports: ["websocket"]});

        // rabbitJS Connection
        this.rabbitMQConnection = rabbitJS.createContext(SocketServer.rabbitMQ_SERVER);
        this.rabbitMQConnection.on("ready", () => {
            this.listenClients();
        });
    }

    requestToChannel = (CHANNEL: string, message: any, callback: Function) => {
        const REQ_SOCKET: rabbitJS.ReqSocket = this.rabbitMQConnection.socket("REQ", {expiration: 10000});
        REQ_SOCKET.setEncoding("utf8");

        REQ_SOCKET.connect(CHANNEL, () => {

            console.log("SENDING MESSAGE to ", CHANNEL, message);
            REQ_SOCKET.write(JSON.stringify(message));

            REQ_SOCKET.on("data", (message: string) => {
                console.log("DATA RECIEVED on ", CHANNEL, message);
                callback(message);
                setTimeout(() => {
                    REQ_SOCKET.close();
                }, 10000);
            });

        });
    }

    private listenClients (): void {
        // Default namespace
        this.socketIO.of(DEFAULT_NSC).on("connect", (socket: SocketIO.Socket) => {
            console.log(`Client CONNECTED: Client socket id: ${socket.id}`);
            new DefaultNamespace(socket, this.requestToChannel, this.socketIO);

            socket.on("disconnect", () => {
                console.log(`Client DISCONNECTED`);
            });
        });

        // Rooms namespace
        this.socketIO.of(ROOMS_NSC).on("connect", (socket: SocketIO.Socket) => {
            new RoomsNamespace(socket, this.requestToChannel);
        });

        // Chatroom namespace
        this.socketIO.of(CHATROOM_NSC).on("connect", (socket: SocketIO.Socket) => {
            this.usersOnline[socket.handshake.query.userId] = socket.id;
            new ChatroomNamespace(socket, this.requestToChannel, this.usersOnline);

            socket.on("disconnect", () => {
                delete this.usersOnline[socket.handshake.query.userId];
            });
        });
    }

    public getServer (): SocketIO.Server {
        return this.socketIO;
    }
}