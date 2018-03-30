"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const socketIo = require("socket.io");
const rabbitJS = __importStar(require("rabbit.js"));
const DefaultNamespace_1 = require("./NameSpaces/DefaultNamespace");
const RoomsNamespace_1 = require("./NameSpaces/RoomsNamespace");
const ChatroomNamespace_1 = require("./NameSpaces/ChatroomNamespace");
class SocketServer {
    constructor() {
        this.usersOnline = {};
        this.config();
        this.createServer();
    }
    config() {
        this.port = process.env.PORT || SocketServer.PORT;
    }
    createServer() {
        // Socket Connection
        this.socketIO = socketIo();
        this.socketIO.listen(this.port);
        // rabbitJS Connection
        this.rabbitMQConnection = rabbitJS.createContext(SocketServer.rabbitMQ_SERVER);
        this.rabbitMQConnection.on("ready", () => {
            this.listenClients();
        });
    }
    listenClients() {
        // Default namespace
        this.socketIO.of("/").on("connect", (socket) => {
            const CLIENT = new DefaultNamespace_1.DefaultNamespace(socket, this.rabbitMQConnection);
            console.log(`Client CONNECTED: Client socket id: ${socket.id}`);
            socket.on("disconnect", () => {
                console.log(`Client DISCONNECTED`);
            });
        });
        // Rooms namespace
        this.socketIO.of("/rooms").on("connect", (socket) => {
            new RoomsNamespace_1.RoomsNamespace(socket, this.rabbitMQConnection);
        });
        // Chatroom namespace
        this.socketIO.of("/chatroom").on("connect", (socket) => {
            this.usersOnline[socket.handshake.query.userId] = socket.id;
            new ChatroomNamespace_1.ChatroomNamespace(socket, this.rabbitMQConnection, this.usersOnline);
            socket.on("disconnect", () => {
                delete this.usersOnline[socket.handshake.query.userId];
            });
        });
    }
    getServer() {
        return this.socketIO;
    }
}
SocketServer.PORT = 5027;
SocketServer.rabbitMQ_SERVER = "amqp://localhost";
exports.SocketServer = SocketServer;
//# sourceMappingURL=socket-server.js.map