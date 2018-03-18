import socketIo = require("socket.io");
import * as rabbitJS from "rabbit.js";
import { Client } from "./Models/Client";
import * as R from "ramda";
import { PushSocket } from "rabbit.js";

export class SocketServer {
    public static readonly PORT: number = 5027;
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    private socketIO: SocketIO.Server;
    private rabbitMQConnection: rabbitJS.Context;
    private port: string | number;
    private ALL_CLIENTS: Client[] = [];

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
        this.socketIO.of("/").on("connect", (socket: SocketIO.Socket) => {
            const CLIENT = new Client(socket, this.rabbitMQConnection);

            this.ALL_CLIENTS.push(CLIENT);
            console.log(`Client CONNECTED: Total Clients: ${this.ALL_CLIENTS.length}: Client socket id: ${socket.id}`);

            socket.on("disconnect", () => {
                const client = R.find(R.propEq("socket", socket))(this.ALL_CLIENTS);
                this.ALL_CLIENTS = R.reject(R.equals(client))(this.ALL_CLIENTS);
                console.log(`Client DISCONNECTED: Total Clients: ${this.ALL_CLIENTS.length}`);
            });
        });

        // Rooms namespace
        this.socketIO.of("/rooms").on("connect", function(socket: SocketIO.Socket) {

            console.log("Socket connected to rooms nsc:", socket.id);

            socket.on("CREATE_ROOM", function(title) {
                console.log("create Room rquest received", title);

                // Room.findOne({"title": new RegExp("^" + title + "$", "i")}, function(err, room) {
                //     if (err) throw err;
                //     if (room) {
                //         socket.emit("updateRoomsList", { error: "Room title already exists." });
                //     } else {
                //         Room.create({
                //             title: title
                //         }, function(err, newRoom) {
                //             if (err) throw err;
                //             socket.emit("updateRoomsList", newRoom);
                //             socket.broadcast.emit("updateRoomsList", newRoom);
                //         });
                //     }
                // });
            });
        });

    }

    public getServer(): SocketIO.Server {
        return this.socketIO;
    }
}