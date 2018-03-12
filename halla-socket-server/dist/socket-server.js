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
const Client_1 = require("./handlers/Client");
const R = __importStar(require("ramda"));
class SocketServer {
    constructor() {
        this.ALL_CLIENTS = [];
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
        this.rabbitMQContext = rabbitJS.createContext(SocketServer.rabbitMQ_SERVER);
        this.rabbitMQContext.on("ready", () => {
            this.listenClients();
        });
    }
    sendMessageToTaskQueue(message) {
        const PUSH_SOCKET = this.rabbitMQContext.socket("PUSH", {
            routing: "topic",
            persistent: true
        });
        PUSH_SOCKET.connect("TEST_EXCHANGE", () => {
            PUSH_SOCKET.write(message, "utf8");
            PUSH_SOCKET.close();
        });
    }
    listenClients() {
        //////////////////////////////////////////////////////////////
        let Number = 0;
        setInterval(() => {
            this.sendMessageToTaskQueue(`send# ${++Number}`);
        }, 1000);
        //////////////////////////////////////////////////////////////
        this.socketIO.on("connect", (socket) => {
            const CLIENT = new Client_1.Client(this, socket);
            this.ALL_CLIENTS.push(CLIENT);
            console.log(`Client CONNECTED: Total Clients: ${this.ALL_CLIENTS.length}: Client socket id: ${socket.id}`);
            socket.on("disconnect", () => {
                const client = R.find(R.propEq("socket", socket))(this.ALL_CLIENTS);
                this.ALL_CLIENTS = R.reject(R.equals(client))(this.ALL_CLIENTS);
                console.log(`Client DISCONNECTED: Total Clients: ${this.ALL_CLIENTS.length}`);
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