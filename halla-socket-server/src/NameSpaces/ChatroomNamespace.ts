import * as R from "ramda";
import { REMOVE_USER_CHANNEL } from "../../halla-shared/src/Channels";
import {
    JOIN_ROOM_CHANNEL,
    ROOM_USERS_CHANNEL,
    DIRECT_CHAT_CHANNEL,
    SEND_DIRECT_MESSAGE_CHANNEL,
    SEND_MESSAGE_TO_ROOM_CHANNEL
} from "../../halla-shared/src/Channels";
import {
    DISCONNECT,
    REMOVE_USER,
    JOIN_ROOM_FAIL,
    JOIN_ROOM_SUCCESS,
    SET_ROOM_USERS,
    DIRECT_CHAT_FAIL,
    DIRECT_CHAT_SUCCESS,
    NEW_DIRECT_MESSAGE,
    NEW_MESSAGE
} from "../../halla-shared/src/Actions";

export class ChatroomNamespace {
    private socket: SocketIO.Socket;
    private requestToChannel: Function;
    private usersOnline: any;

    constructor (socket: SocketIO.Socket, requestToChannel: Function, usersOnline: any) {
        this.socket = socket;
        this.requestToChannel = requestToChannel;
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
        this.socket.on(DISCONNECT, () => {

            const userId = this.socket.handshake.query.userId;
            const data = {
                userId,
                socketId: this.socket.id
            };
            this.requestToChannel(REMOVE_USER_CHANNEL, data, (rooms: any) => {
                const roomsArr = JSON.parse(rooms);
                R.forEach((room: any) => {
                    this.socket.broadcast.to(room._id).emit(REMOVE_USER, {
                        userId,
                        roomId: room._id
                    });
                }, roomsArr);
            });
        });
    }

    handleJoinRoom = (message: any) => {

        const constructedMessage = {...message, socketId: this.socket.id};

        this.requestToChannel(JOIN_ROOM_CHANNEL, constructedMessage, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(JOIN_ROOM_FAIL);
            } else {
                const room = JSON.parse(response);
                this.socket.join(room._id);
                this.socket.emit(JOIN_ROOM_SUCCESS, room);

                const data = {
                    roomId: room._id,
                    userId: message.userId
                };

                this.requestToChannel(ROOM_USERS_CHANNEL, data, (users: string) => {
                    const data = {
                        roomId: room._id,
                        users: JSON.parse(users)
                    };
                    this.socket.emit(SET_ROOM_USERS, data);
                    this.socket.broadcast.to(room._id).emit(SET_ROOM_USERS, data);
                });
            }
        });
    }

    handleDirectChat = (message: any) => {

        this.requestToChannel(DIRECT_CHAT_CHANNEL, message, (chats: string) => {
            if ( chats === "FAIL") {
                this.socket.emit(DIRECT_CHAT_FAIL);
            } else {
                const chatss = JSON.parse(chats);
                this.socket.emit(DIRECT_CHAT_SUCCESS, chatss);
            }
        });
    }

    handleSendDirectMessage = (message: any) => {
        this.requestToChannel(SEND_DIRECT_MESSAGE_CHANNEL, message, (response: any) => {
            const responseObj = JSON.parse(response);
            if (response !== "FAIL") {
                this.socket.emit(NEW_DIRECT_MESSAGE, responseObj);

                if (R.has(message.recipient, this.usersOnline)) {
                    this.socket.broadcast.to(R.prop(message.recipient, this.usersOnline)).emit(NEW_DIRECT_MESSAGE, responseObj);
                }
            }
        });
    }

    handleSendMessageToRoom = (message: any) => {
        this.requestToChannel(SEND_MESSAGE_TO_ROOM_CHANNEL, message, (response: any) => {
            if (response !== "FAIL") {
                this.socket.emit(NEW_MESSAGE, message);
                this.socket.broadcast.to(message.roomId).emit(NEW_MESSAGE, message);
            }
        });
    }

    public handlers: any = {
        JOIN_ROOM: this.handleJoinRoom,
        SEND_MESSAGE_TO_ROOM: this.handleSendMessageToRoom,
        SEND_DIRECT_MESSAGE: this.handleSendDirectMessage,
        DIRECT_CHAT: this.handleDirectChat
    };
}