"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const rabbitJS = __importStar(require("rabbit.js"));
const User_1 = __importDefault(require("./models/User"));
const Room_1 = __importDefault(require("./models/Room"));
class MongoServer {
    constructor() {
        this.channels = {
            SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
            LOGIN_CHANNEL: "LOGIN_CHANNEL",
            CREATE_ROOM: "CREATE_ROOM",
            FETCH_ROOMS: "FETCH_ROOMS",
        };
        this.createServer = () => {
            // MongoDB Connection
            Mongoose.connect(MongoServer.MONGODB_DB);
            this.hallaDB = Mongoose.connection;
            this.hallaDB.on("error", () => { console.log("FAILED to connect to mongoose"); });
            this.hallaDB.once("open", console.log);
            // rabbitJS Connection
            this.rabbitMQContext = rabbitJS.createContext(MongoServer.rabbitMQ_SERVER);
            this.rabbitMQContext.on("ready", this.listenClients);
        };
        this.listenReplyToChannel = (CHANNEL, callback) => {
            const REPLY_SOCKET = this.rabbitMQContext.socket("REPLY");
            REPLY_SOCKET.setEncoding("utf8");
            REPLY_SOCKET.connect(CHANNEL, () => {
                REPLY_SOCKET.on("data", (data) => {
                    const dataReceived = JSON.parse(data);
                    console.log("DATA RECIEVED", dataReceived);
                    setTimeout(() => {
                        callback(dataReceived, REPLY_SOCKET);
                    }, 500);
                });
            });
        };
        this.listenClients = () => {
            this.listenReplyToChannel(this.channels.LOGIN_CHANNEL, (dataReceived, socket) => {
                User_1.default.findOne(dataReceived, (err, data) => {
                    if (data !== null) {
                        console.log("LOGIN_SUCCESS");
                        socket.write(JSON.stringify(data));
                    }
                    else {
                        console.log("LOGIN_FAIL");
                        socket.write(`FAIL`);
                    }
                });
            });
            this.listenReplyToChannel(this.channels.SIGNUP_CHANNEL, (dataReceived, socket) => {
                User_1.default.create(dataReceived, (err, data) => {
                    if (err) {
                        socket.write(`FAIL`);
                    }
                    else {
                        socket.write(`SUCCESS`);
                    }
                });
            });
            this.listenReplyToChannel(this.channels.CREATE_ROOM, (dataReceived, socket) => {
                Room_1.default.create(dataReceived, (err, data) => {
                    if (err) {
                        console.log("FAIL");
                        socket.write(`FAIL`);
                    }
                    else {
                        console.log("SUCCESS");
                        Room_1.default.find(undefined, (err, data) => {
                            if (err) {
                                console.log("FIND FAIL", err);
                            }
                            console.log("FIND SUCCESS", data);
                            socket.write(JSON.stringify(data));
                        });
                    }
                });
            });
            this.listenReplyToChannel(this.channels.FETCH_ROOMS, (dataReceived, socket) => {
                console.log("FETCH_ROOMS");
                Room_1.default.find(undefined, (err, data) => {
                    if (err) {
                        console.log("FIND FAIL", err);
                    }
                    console.log("FIND SUCCESS", data);
                    socket.write(JSON.stringify(data));
                });
            });
        };
        this.createServer();
    }
    getServer() {
        return this.hallaDB;
    }
}
MongoServer.rabbitMQ_SERVER = "amqp://localhost";
MongoServer.MONGODB_DB = "mongodb://localhost/halla_db";
exports.MongoServer = MongoServer;
//# sourceMappingURL=mongo-server.js.map