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
const rabbitMQ = __importStar(require("amqplib"));
const User_1 = require("./handlers/User");
const R = __importStar(require("ramda"));
class SocketServer {
    constructor() {
        this.ALL_SOCKETS = [];
        this.config();
        this.createServer();
        this.listenClients();
    }
    config() {
        this.port = process.env.PORT || SocketServer.PORT;
    }
    createServer() {
        this.socketIO = socketIo();
        this.socketIO.listen(this.port);
        // RabbitMq Connection
        rabbitMQ.connect(SocketServer.RABBITMQ_SERVER)
            .then((mqConnection) => {
            this.rabbitMQConnection = mqConnection;
        }).catch(console.warn);
    }
    sendMessageToTaskQueue(message) {
        const channelPromise = this.rabbitMQConnection.createChannel();
        channelPromise.then((channel) => {
            const q = "LOGIN_QUEUE";
            const ok = channel.assertQueue(q, { durable: true });
            ok.then(function () {
                channel.sendToQueue(q, Buffer.from(message), { deliveryMode: true });
                console.log("Sent to queue:  '%s'", message);
                channel.close();
            });
        });
        channelPromise.catch(console.warn);
    }
    listenClients() {
        ////////////////////////////////////////////////////////////////
        // let Number = 0;
        // setInterval(() => {
        //     this.sendMessageToTaskQueue(`send# ${++Number} \n`);
        // }, 1000);
        ////////////////////////////////////////////////////////////////
        this.socketIO.on("connect", (socket) => {
            this.ALL_SOCKETS.push(socket);
            console.log(`Connected client on port ${this.port}: Total Clients: ${this.ALL_SOCKETS.length}: Client id: ${socket.id}`);
            socket.emit("connected", socket.id);
            setTimeout(() => {
                socket.emit("test", socket.id);
            }, 2000);
            const handlerCategories = {
                user: new User_1.User(this, socket).handlers
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
SocketServer.RABBITMQ_SERVER = "amqp://localhost";
exports.SocketServer = SocketServer;
//# sourceMappingURL=socket-server.js.map