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
        this.ALL_SOCKETS = [];
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
        PUSH_SOCKET.connect("ttt", () => {
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
            this.ALL_SOCKETS.push(socket);
            console.log(`Connected client on port ${this.port}: Total Clients: ${this.ALL_SOCKETS.length}: Client id: ${socket.id}`);
            socket.emit("connected", socket.id);
            const handlerCategories = {
                client: new Client_1.Client(this, socket).handlers
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
    getServer() {
        return this.socketIO;
    }
}
SocketServer.PORT = 5027;
SocketServer.rabbitMQ_SERVER = "amqp://localhost";
exports.SocketServer = SocketServer;
//# sourceMappingURL=socket-server.js.map