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
const rabbitMQ = __importStar(require("amqplib"));
class MongoServer {
    constructor() {
        this.recieveMessageFromSocketServer = () => {
            const channelPromise = this.rabbitMQConnection.createChannel();
            channelPromise.then((channel) => {
                const q = "LOGIN_QUEUE";
                const ok = channel.assertQueue(q, { durable: true });
                ok.then(function () { channel.prefetch(1); });
                ok.then(function () {
                    channel.consume(q, doWork, { noAck: false });
                    console.log(" [*] Waiting for messages. To exit press CTRL+C");
                });
                function doWork(msg) {
                    const body = msg.content.toString();
                    const secs = body.split(".").length - 1;
                    setTimeout(function () {
                        console.log(" [x] Received '%s'", body);
                        channel.ack(msg);
                    }, secs * 1000);
                }
            });
            channelPromise.catch(console.warn);
        };
        this.config();
        this.createServer();
    }
    config() {
    }
    createServer() {
        Mongoose.connect(MongoServer.MONGODB_DB);
        this.hallaDB = Mongoose.connection;
        this.hallaDB.on("error", () => { console.log("FAILED to connect to mongoose"); });
        this.hallaDB.once("open", () => {
            // Connected to MongoDB
        });
        // RabbitMq Connection
        rabbitMQ.connect(MongoServer.RABBITMQ_SERVER)
            .then((mqConnection) => {
            process.once("SIGINT", function () { mqConnection.close(); });
            this.rabbitMQConnection = mqConnection;
            this.listenClients();
        }).catch(console.warn);
    }
    listenClients() {
        this.recieveMessageFromSocketServer();
    }
    getServer() {
        return this.hallaDB;
    }
}
MongoServer.RABBITMQ_SERVER = "amqp://localhost";
MongoServer.MONGODB_DB = "mongodb://localhost/halla_db";
exports.MongoServer = MongoServer;
//# sourceMappingURL=mongo-server-AMQPlib.1.js.map