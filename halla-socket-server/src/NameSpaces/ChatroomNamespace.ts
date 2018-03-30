import { SocketServer } from "../socket-server";
import * as R from "ramda";
import * as rabbitJS from "rabbit.js";
import { PushSocket, ReqSocket, RepSocket } from "rabbit.js";

export class ChatroomNamespace {
    private socket: SocketIO.Socket;
    private rabbitMQContext: rabbitJS.Context;
    private usersOnline: rabbitJS.Context;

    private channels = {
        JOIN_ROOM: "JOIN_ROOM",
        FETCH_ROOM_USERS: "FETCH_ROOM_USERS",
        REMOVE_USER_FROM_ROOM: "REMOVE_USER_FROM_ROOM",

        SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
        SEND_DIRECT_MESSAGE: "SEND_DIRECT_MESSAGE",

        DIRECT_CHAT: "DIRECT_CHAT"
    };

    constructor(socket: SocketIO.Socket, rabbitMQContext: rabbitJS.Context, usersOnline: any) {
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;
        this.usersOnline = usersOnline;

        this.setupHandlers();
    }

    setupHandlers = () => {
        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);

        this.onDisconnect();
    }

    onDisconnect = () => {
        this.socket.on("disconnect", () => {

            const userId = this.socket.handshake.query.userId;
            const data = {
                userId,
                socketId: this.socket.id
            };
            this.requestToChannel(this.channels.REMOVE_USER_FROM_ROOM, data, (rooms: any) => {
                const roomsArr = JSON.parse(rooms);
                R.forEach((room: any) => {
                    console.log("broadcasting to", room._id, "for", userId);
                    this.socket.broadcast.to(room._id).emit("REMOVE_USER", {
                        userId,
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

    handleDirectChat = (message: any) => {

        console.log("DIRECT_CHAT", message);

        this.requestToChannel(this.channels.DIRECT_CHAT, message, (chats: string) => {
            if ( chats === "FAIL") {
                console.log("FAIL");
                this.socket.emit("DIRECT_CHAT_FAIL");
            } else {
                const chatss = JSON.parse(chats);
                console.log("DIRECT_CHAT_SUCCESS", chatss);

                this.socket.emit("DIRECT_CHAT_SUCCESS", {
                    ...message,
                    messages: chatss
                });
            }
        });
    }

    handleSendDirectMessage = (message: any) => {
        this.requestToChannel(this.channels.SEND_DIRECT_MESSAGE, message, (response: any) => {
            if (response !== "FAIL") {
                this.socket.emit("NEW_DIRECT_MESSAGE", message);
            }
        });
    }

    handleSendMessageToRoom = (message: any) => {
        this.requestToChannel(this.channels.SEND_MESSAGE_TO_ROOM, message, (response: any) => {
            if (response !== "FAIL") {
                this.socket.emit("NEW_MESSAGE", message);
                this.socket.broadcast.to(message.roomId).emit("NEW_MESSAGE", message);
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
        SEND_MESSAGE_TO_ROOM: this.handleSendMessageToRoom,
        SEND_DIRECT_MESSAGE: this.handleSendDirectMessage,
        DIRECT_CHAT: this.handleDirectChat
    };
}