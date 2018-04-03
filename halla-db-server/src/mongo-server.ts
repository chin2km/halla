
import Mongoose =  require("mongoose");
import * as rabbitJS from "rabbit.js";
import { RepSocket } from "rabbit.js";
import * as R from "ramda";

import User from "./models/User";
import Room from "./models/Room";
import Message from "./models/Message";

export class MongoServer {
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    public static readonly MONGODB_DB: string = "mongodb://localhost/halla_db";
    private rabbitMQContext: rabbitJS.Context;

    private hallaDB: Mongoose.Connection;

    constructor () {
        this.createServer();
    }

    private channels = {
        SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
        LOGIN_CHANNEL: "LOGIN_CHANNEL",

        CREATE_ROOM: "CREATE_ROOM",
        FETCH_ROOMS: "FETCH_ROOMS",

        FETCH_PEOPLE: "FETCH_PEOPLE",

        DIRECT_CHAT: "DIRECT_CHAT",

        JOIN_ROOM: "JOIN_ROOM",
        FETCH_ROOM_USERS: "FETCH_ROOM_USERS",
        REMOVE_USER_FROM_ROOM: "REMOVE_USER_FROM_ROOM",

        SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
        SEND_DIRECT_MESSAGE: "SEND_DIRECT_MESSAGE"
    };

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
        this.listenReplyToChannel(this.channels.LOGIN_CHANNEL, (dataReceived: any, socket: any) => {
            User.authenticate(dataReceived, (err, data) => {
                if (data !== null) {
                    socket.write(JSON.stringify(data));
                } else {
                    socket.write(`FAIL`);
                }
            });
        });

        this.listenReplyToChannel(this.channels.SIGNUP_CHANNEL, (dataReceived: any, socket: any) => {
            User.create(dataReceived, (err, data) => {
                if (err) {
                    return socket.write(`FAIL`);
                }

                const newUser = R.omit(["password"], JSON.parse(JSON.stringify(data)));
                socket.write(JSON.stringify(newUser));
            });
        });


        this.listenReplyToChannel(this.channels.CREATE_ROOM, (dataReceived: any, socket: any) => {
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

        this.listenReplyToChannel(this.channels.FETCH_ROOMS, (dataReceived: any, socket: any) => {
            Room.find(undefined, (err, data) => {
                if (err) {
                    socket.write("FAIL");
                }
                socket.write(JSON.stringify(data));
            });
        });

        this.listenReplyToChannel(this.channels.FETCH_PEOPLE, (dataReceived: any, socket: any) => {
            User.find(undefined, (err, data) => {
                if (err) {
                    socket.write("FAIL");
                }
                socket.write(JSON.stringify(data));
            });
        });

        this.listenReplyToChannel(this.channels.DIRECT_CHAT, (dataReceived: any, socket: any) => {
            Message.find(dataReceived, (err, messages: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }

                socket.write(JSON.stringify(messages));
            });
        });

        this.listenReplyToChannel(this.channels.JOIN_ROOM, (dataReceived: any, socket: any) => {
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

        this.listenReplyToChannel(this.channels.FETCH_ROOM_USERS, (dataReceived: any, socket: any) => {
            Room.getUsers(dataReceived.roomId, dataReceived.userId, (err: any, users: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(users));
            });
        });

        this.listenReplyToChannel(this.channels.REMOVE_USER_FROM_ROOM, (dataReceived: any, socket: any) => {
            Room.removeUser(dataReceived.socketId, dataReceived.userId, (err: any, rooms: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(rooms));
            });
        });

        this.listenReplyToChannel(this.channels.SEND_MESSAGE_TO_ROOM, (dataReceived: any, socket: any) => {
            Room.addMessage(dataReceived.roomId, dataReceived.message, (err: any, room: any) => {
                if (err) {
                    return socket.write(`FAIL`);
                }
                return socket.write(JSON.stringify(room));
            });
        });

        this.listenReplyToChannel(this.channels.SEND_DIRECT_MESSAGE, (dataReceived: any, socket: any) => {
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