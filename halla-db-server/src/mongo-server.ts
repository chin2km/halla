
import Mongoose =  require("mongoose");
import * as rabbitJS from "rabbit.js";
import * as R from "ramda";
import { WorkerSocket, RepSocket } from "rabbit.js";
import { Socket } from "net";

import User from "./models/User";
import Room from "./models/Room";

export class MongoServer {
    public static readonly rabbitMQ_SERVER: string = "amqp://localhost";
    public static readonly MONGODB_DB: string = "mongodb://localhost/halla_db";
    private rabbitMQContext: rabbitJS.Context;
    private port: string | number;

    private hallaDB: Mongoose.Connection;

    constructor() {
        this.createServer();
    }

    private channels = {
        SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
        LOGIN_CHANNEL: "LOGIN_CHANNEL",

        CREATE_ROOM: "CREATE_ROOM",
        FETCH_ROOMS: "FETCH_ROOMS",

        JOIN_ROOM: "JOIN_ROOM",
        FETCH_ROOM_USERS: "FETCH_ROOM_USERS",
        REMOVE_USER_FROM_ROOM: "REMOVE_USER_FROM_ROOM"
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
                console.log("DATA RECIEVED", dataReceived);
                setTimeout(() => {
                    callback(dataReceived, REPLY_SOCKET);
                }, 0);
            });
        });
    }


    private listenClients = (): void => {
        this.listenReplyToChannel(this.channels.LOGIN_CHANNEL, (dataReceived: any, socket: any) => {
            User.findOne(dataReceived, (err, data) => {
                if (data !== null) {
                    console.log("LOGIN_SUCCESS");
                    socket.write(JSON.stringify(data));
                } else {
                    console.log("LOGIN_FAIL");
                    socket.write(`FAIL`);
                }
            });
        });

        this.listenReplyToChannel(this.channels.SIGNUP_CHANNEL, (dataReceived: any, socket: any) => {
            User.create(dataReceived, (err, data) => {
                if (err) {
                    socket.write(`FAIL`);
                } else {
                    socket.write(`SUCCESS`);
                }
            });
        });


        this.listenReplyToChannel(this.channels.CREATE_ROOM, (dataReceived: any, socket: any) => {
            Room.create(dataReceived, (err, data) => {
                if (err) {
                    console.log("FAIL");
                    socket.write(`FAIL`);
                } else {
                    console.log("SUCCESS");
                    Room.find(undefined, (err, data) => {
                        if (err) {
                            console.log("FIND FAIL", err);
                        }
                        console.log("FIND SUCCESS", data);
                        socket.write(JSON.stringify(data));
                    });
                }
            });
        });

        this.listenReplyToChannel(this.channels.FETCH_ROOMS, (dataReceived: any, socket: any) => {
            console.log("FETCH_ROOMS");
            Room.find(undefined, (err, data) => {
                if (err) {
                    console.log("FIND FAIL", err);
                }
                console.log("FIND SUCCESS", data);
                socket.write(JSON.stringify(data));
            });
        });

        this.listenReplyToChannel(this.channels.JOIN_ROOM, (dataReceived: any, socket: any) => {
            console.log("JOIN_ROOM", dataReceived);

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
            console.log("FETCH_ROOM_USERS", dataReceived.roomId, dataReceived.userId);

            Room.getUsers(dataReceived.roomId, dataReceived.userId, (err: any, users: any) => {
                if (err) {
                    console.log("FETCH_ROOM_USERS_FAIL", err, users);
                    return socket.write(`FAIL`);
                }
                console.log("FETCH_ROOM_USERS_SUCCESS", users);
                return socket.write(JSON.stringify(users));
            });
        });

        this.listenReplyToChannel(this.channels.REMOVE_USER_FROM_ROOM, (dataReceived: any, socket: any) => {
            console.log("REMOVE_USER_FROM_ROOM", dataReceived.userId, dataReceived.socketId);

            Room.removeUser(dataReceived.socketId, dataReceived.userId, (err: any, rooms: any) => {
                if (err) {
                    console.log("REMOVE_USER_FROM_ROOM", err, rooms);
                    return socket.write(`FAIL`);
                }
                console.log("REMOVE_USER_FROM_ROOM_SUCCESS", rooms);
                return socket.write(JSON.stringify(rooms));
            });
        });
    }

    public getServer(): any {
        return this.hallaDB;
    }
}