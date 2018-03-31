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
        this.requestToChannel = (CHANNEL, message, callback) => {
            const REQ_SOCKET = this.rabbitMQConnection.socket("REQ", { expiration: 10000 });
            REQ_SOCKET.setEncoding("utf8");
            REQ_SOCKET.connect(CHANNEL, () => {
                REQ_SOCKET.write(JSON.stringify(message));
                REQ_SOCKET.on("data", (message) => {
                    console.log(message);
                    callback(message);
                    setTimeout(() => {
                        REQ_SOCKET.close();
                    }, 10000);
                });
            });
        };
        this.config();
        this.createServer();
    }
    config() {
        this.port = process.env.PORT || SocketServer.PORT;
    }
    createServer() {
        this.socketIO = socketIo();
        this.socketIO.listen(this.port);
        this.rabbitMQConnection = rabbitJS.createContext(SocketServer.rabbitMQ_SERVER);
        this.rabbitMQConnection.on("ready", () => {
            this.listenClients();
        });
    }
    listenClients() {
        this.socketIO.of("/").on("connect", (socket) => {
            console.log(`Client CONNECTED: Client socket id: ${socket.id}`);
            new DefaultNamespace_1.DefaultNamespace(socket, this.requestToChannel);
            socket.on("disconnect", () => {
                console.log(`Client DISCONNECTED`);
            });
        });
        this.socketIO.of("/rooms").on("connect", (socket) => {
            new RoomsNamespace_1.RoomsNamespace(socket, this.requestToChannel);
        });
        this.socketIO.of("/chatroom").on("connect", (socket) => {
            this.usersOnline[socket.handshake.query.userId] = socket.id;
            new ChatroomNamespace_1.ChatroomNamespace(socket, this.requestToChannel, this.usersOnline);
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