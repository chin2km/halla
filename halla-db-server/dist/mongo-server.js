"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const rabbitJS = __importStar(require("rabbit.js"));
class MongoServer {
    constructor() {
        this.createServer();
    }
    createServer() {
        Mongoose.connect(MongoServer.MONGODB_DB);
        this.hallaDB = Mongoose.connection;
        this.hallaDB.on("error", () => { console.log("FAILED to connect to mongoose"); });
        this.hallaDB.once("open", () => {
            // Connected to MongoDB
        });
        // rabbitJS Connection
        this.rabbitMQContext = rabbitJS.createContext(MongoServer.rabbitMQ_SERVER);
        this.rabbitMQContext.on("ready", () => {
            this.listenClients();
        });
    }
    recieveMessageFromSocketServer() {
        const WORKER_SOCKET = this.rabbitMQContext.socket("WORKER", { routing: "topic" });
        WORKER_SOCKET.setEncoding("utf8");
        WORKER_SOCKET.on("data", (data) => {
            WORKER_SOCKET.ack();
            console.log(data);
        });
        WORKER_SOCKET.connect("TEST_EXCHANGE");
    }
    listenClients() {
        this.recieveMessageFromSocketServer();
    }
    getServer() {
        return this.hallaDB;
    }
}
MongoServer.rabbitMQ_SERVER = "amqp://localhost";
MongoServer.MONGODB_DB = "mongodb://localhost/halla_db";
exports.MongoServer = MongoServer;
//# sourceMappingURL=mongo-server.js.map