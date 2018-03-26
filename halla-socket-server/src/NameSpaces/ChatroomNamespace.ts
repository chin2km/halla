import { SocketServer } from "../socket-server";
import * as R from "ramda";
import * as rabbitJS from "rabbit.js";
import { PushSocket, ReqSocket, RepSocket } from "rabbit.js";

export class ChatroomNamespace {
    private userId: string;
    private socket: SocketIO.Socket;
    private rabbitMQContext: rabbitJS.Context;

    private channels = {
        JOIN_ROOM: "JOIN_ROOM",
        FETCH_ROOM_USERS: "FETCH_ROOM_USERS",
        REMOVE_USER_FROM_ROOM: "REMOVE_USER_FROM_ROOM",
    };

    constructor(socket: SocketIO.Socket, rabbitMQContext: rabbitJS.Context) {
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;

        this.setupHandlers();
    }

    setupHandlers = () => {
        this.socket.emit("connect", this.socket.id);

        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);

        this.onDisconnect();
    }

    onDisconnect = () => {
        this.socket.on("disconnect", () => {
            const data = {
                userId: this.userId,
                socketId: this.socket.id
            };
            this.requestToChannel(this.channels.REMOVE_USER_FROM_ROOM, data, (rooms: any) => {
                const roomsArr = JSON.parse(rooms);
                R.forEach((room: any) => {
                    console.log("broadcasting to", room._id, "for", this.userId);
                    this.socket.broadcast.to(room._id).emit("REMOVE_USER", {
                        userId: this.userId,
                        roomId: room._id
                    });
                }, roomsArr);
            });
        });
    }

    handleJoinRoom = (message: any) => {

        const constructedMessage = {...message, socketId: this.socket.id};
        console.log("JOIN_ROOM", constructedMessage);

        this.requestToChannel(this.channels.JOIN_ROOM, constructedMessage, (response: string) => {
            if ( response === "FAIL") {
                console.log("FAIL");
                this.socket.emit("JOIN_ROOM_FAIL");
            } else {
                const room = JSON.parse(response);
                console.log("JOIN_ROOM_SUCCESS", room);
                this.userId = constructedMessage.userId;
                this.socket.join(room._id);
                this.socket.emit("JOIN_ROOM_SUCCESS", room);

                const data = {
                    roomId: room._id,
                    userId: message.userId
                };

                this.requestToChannel(this.channels.FETCH_ROOM_USERS, data, (users: string) => {
                    const data = {
                        roomId: room._id,
                        users: JSON.parse(users)
                    };
                    this.socket.emit("SET_ROOM_USERS", data);
                    this.socket.broadcast.to(room._id).emit("SET_ROOM_USERS", data);
                });
            }
        });
    }

    requestToChannel = (CHANNEL: string, message: any, callback: Function) => {
        const REQ_SOCKET: ReqSocket = this.rabbitMQContext.socket("REQ", {expiration: 10000});
        REQ_SOCKET.setEncoding("utf8");

        REQ_SOCKET.connect(CHANNEL, () => {

            REQ_SOCKET.write(JSON.stringify(message));
            REQ_SOCKET.on("data", (message: any) => {
                console.log("DATA RECIVED:", typeof message, message);
                console.log();
                callback(message);
                setTimeout(() => {
                    REQ_SOCKET.close();
                }, 10000);
            });
        });
    }

    public handlers: any = {
        JOIN_ROOM: this.handleJoinRoom,
    };
}