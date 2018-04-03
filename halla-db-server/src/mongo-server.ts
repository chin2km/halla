
import Mongoose =  require("mongoose");
import * as R from "ramda";
import * as rabbitJS from "rabbit.js";
import { RepSocket } from "rabbit.js";
import User from "./models/User";
import Room from "./models/Room";
import Message from "./models/Message";
import {
    LOGIN_CHANNEL,
    SIGNUP_CHANNEL,
    CREATE_ROOM_CHANNEL,
    FETCH_ROOMS_CHANNEL,
    FETCH_PEOPLE_CHANNEL,
    DIRECT_CHAT_CHANNEL,
    JOIN_ROOM_CHANNEL,
    ROOM_USERS_CHANNEL,
    REMOVE_USER_CHANNEL,
    SEND_MESSAGE_TO_ROOM_CHANNEL,
    SEND_DIRECT_MESSAGE_CHANNEL
} from "../../halla-shared/src/Channels";

export class MongoServer {
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    public static readonly MONGODB_DB: string = "mongodb://localhost/halla_db";
    private rabbitMQContext: rabbitJS.Context;

    private hallaDB: Mongoose.Connection;

    constructor () {
        this.createServer();
    }

    private createServer = (): void  => {
        // MongoDB Connection
        Mongoose.connect(MongoServer.MONGODB_DB);
        this.hallaDB =  Mongoose.connection;
        this.hallaDB.on("error", () => {console.log( "FAILED to connect to mongoose"); });
        this.hallaDB.once("open", console.log);

        // rabbitJS Connection
        this.rabbitMQContext = rabbitJS.createContext(MongoServer.rabbitMQ_SERVER);
        this.rabbitMQContext.on("ready", this.listenClients);
    }

    private listenReplyToChannel = (CHANNEL: string, callback: Function) => {
        const REPLY_SOCKET: RepSocket = this.rabbitMQContext.socket("REPLY");
        REPLY_SOCKET.setEncoding("utf8");

        REPLY_SOCKET.connect(CHANNEL, () => {
            REPLY_SOCKET.on("data", (data: string) => {
                const dataReceived = JSON.parse(data);
                console.log("DATA RECIEVED on", CHANNEL, " -> ", dataReceived);
                callback(dataReceived, REPLY_SOCKET);
            });
        });
    }


    private listenClients = (): void => {
        this.listenReplyToChannel(LOGIN_CHANNEL, (dataReceived: any, socket: any) => {
            User.authenticate(dataReceived, (err, data) => {
                if (data !== null) {
                    socket.write(JSON.stringify(data));
                } else {
                    socket.write(`FAIL`);
                }
            });
        });

        this.listenReplyToChannel(SIGNUP_CHANNEL, (dataReceived: any, socket: any) => {
            User.create(dataReceived, (err, data) => {
                if (err) {
                    return socket.write(`FAIL`);
                }

                const newUser = R.omit(["password"], JSON.parse(JSON.stringify(data)));
                socket.write(JSON.stringify(newUser));
            });
        });


        this.listenReplyToChannel(CREATE_ROOM_CHANNEL, (dataReceived: any, socket: any) => {
            Room.create(dataReceived, (err, data) => {
                if (err) {
                    socket.write(`FAIL`);
                } else {
                    Room.find(undefined, (err, data) => {
                        if (err) {
                            socket.write(`FAIL`);
                        }
                        socket.write(JSON.stringify(data));
                    });
                }
            });
        });

        this.listenReplyToChannel(FETCH_ROOMS_CHANNEL, (dataReceived: any, socket: any) => {
            Room.find(undefined, (err, data) => {
                if (err) {
                    socket.write("FAIL");
                }
                socket.write(JSON.stringify(data));
            });
        });

        this.listenReplyToChannel(FETCH_PEOPLE_CHANNEL, (dataReceived: any, socket: any) => {
            User.find(undefined, (err, data) => {
                if (err) {
                    socket.write("FAIL");
                }
                socket.write(JSON.stringify(data));
            });
        });

        this.listenReplyToChannel(DIRECT_CHAT_CHANNEL, (dataReceived: any, socket: any) => {
            Message.find(dataReceived, (err, messages: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }

                socket.write(JSON.stringify(messages));
            });
        });

        this.listenReplyToChannel(JOIN_ROOM_CHANNEL, (dataReceived: any, socket: any) => {
            Room.findById(dataReceived.id, (err, room: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                if (room) {
                    Room.addUser(room, dataReceived.userId, dataReceived.socketId, (err, newRoom) => {
                        if (err) {
                            return socket.write(`FAIL`);
                        }

                        socket.write(JSON.stringify(newRoom));
                    });
                }
            });
        });

        this.listenReplyToChannel(ROOM_USERS_CHANNEL, (dataReceived: any, socket: any) => {
            Room.getUsers(dataReceived.roomId, dataReceived.userId, (err: any, users: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(users));
            });
        });

        this.listenReplyToChannel(REMOVE_USER_CHANNEL, (dataReceived: any, socket: any) => {
            Room.removeUser(dataReceived.socketId, dataReceived.userId, (err: any, rooms: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(rooms));
            });
        });

        this.listenReplyToChannel(SEND_MESSAGE_TO_ROOM_CHANNEL, (dataReceived: any, socket: any) => {
            Room.addMessage(dataReceived.roomId, dataReceived.message, (err: any, room: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(room));
            });
        });

        this.listenReplyToChannel(SEND_DIRECT_MESSAGE_CHANNEL, (dataReceived: any, socket: any) => {
            Message.create(dataReceived, (err: any, message: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(message));
            });
        });
    }

    public getServer (): any {
        return this.hallaDB;
    }
}