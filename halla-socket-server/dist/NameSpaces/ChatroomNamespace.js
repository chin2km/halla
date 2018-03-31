"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const R = __importStar(require("ramda"));
class ChatroomNamespace {
    constructor(socket, requestToChannel, usersOnline) {
        this.channels = {
            JOIN_ROOM: "JOIN_ROOM",
            FETCH_ROOM_USERS: "FETCH_ROOM_USERS",
            REMOVE_USER_FROM_ROOM: "REMOVE_USER_FROM_ROOM",
            SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
            SEND_DIRECT_MESSAGE: "SEND_DIRECT_MESSAGE",
            DIRECT_CHAT: "DIRECT_CHAT"
        };
        this.eventz = {
            DISCONNECT: "disconnect",
            REMOVE_USER: "REMOVE_USER",
            JOIN_ROOM_SUCCESS: "JOIN_ROOM_SUCCESS",
            JOIN_ROOM_FAIL: "JOIN_ROOM_FAIL",
            SET_ROOM_USERS: "SET_ROOM_USERS",
            DIRECT_CHAT_SUCCESS: "DIRECT_CHAT_SUCCESS",
            DIRECT_CHAT_FAIL: "DIRECT_CHAT_FAIL",
            NEW_DIRECT_MESSAGE: "NEW_DIRECT_MESSAGE",
            NEW_MESSAGE: "NEW_MESSAGE"
        };
        this.setupHandlers = () => {
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
            this.onDisconnect();
        };
        this.onDisconnect = () => {
            this.socket.on(this.eventz.DISCONNECT, () => {
                const userId = this.socket.handshake.query.userId;
                const data = {
                    userId,
                    socketId: this.socket.id
                };
                this.requestToChannel(this.channels.REMOVE_USER_FROM_ROOM, data, (rooms) => {
                    const roomsArr = JSON.parse(rooms);
                    R.forEach((room) => {
                        this.socket.broadcast.to(room._id).emit(this.eventz.REMOVE_USER, {
                            userId,
                            roomId: room._id
                        });
                    }, roomsArr);
                });
            });
        };
        this.handleJoinRoom = (message) => {
            const constructedMessage = Object.assign({}, message, { socketId: this.socket.id });
            this.requestToChannel(this.channels.JOIN_ROOM, constructedMessage, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(this.eventz.JOIN_ROOM_FAIL);
                }
                else {
                    const room = JSON.parse(response);
                    this.socket.join(room._id);
                    this.socket.emit(this.eventz.JOIN_ROOM_SUCCESS, room);
                    const data = {
                        roomId: room._id,
                        userId: message.userId
                    };
                    this.requestToChannel(this.channels.FETCH_ROOM_USERS, data, (users) => {
                        const data = {
                            roomId: room._id,
                            users: JSON.parse(users)
                        };
                        this.socket.emit(this.eventz.SET_ROOM_USERS, data);
                        this.socket.broadcast.to(room._id).emit(this.eventz.SET_ROOM_USERS, data);
                    });
                }
            });
        };
        this.handleDirectChat = (message) => {
            this.requestToChannel(this.channels.DIRECT_CHAT, message, (chats) => {
                if (chats === "FAIL") {
                    this.socket.emit(this.eventz.DIRECT_CHAT_FAIL);
                }
                else {
                    const chatss = JSON.parse(chats);
                    this.socket.emit(this.eventz.DIRECT_CHAT_SUCCESS, chatss);
                }
            });
        };
        this.handleSendDirectMessage = (message) => {
            this.requestToChannel(this.channels.SEND_DIRECT_MESSAGE, message, (response) => {
                const responseObj = JSON.parse(response);
                if (response !== "FAIL") {
                    this.socket.emit(this.eventz.NEW_DIRECT_MESSAGE, responseObj);
                    if (R.has(message.recipient, this.usersOnline)) {
                        this.socket.broadcast.to(R.prop(message.recipient, this.usersOnline)).emit(this.eventz.NEW_DIRECT_MESSAGE, responseObj);
                    }
                }
            });
        };
        this.handleSendMessageToRoom = (message) => {
            this.requestToChannel(this.channels.SEND_MESSAGE_TO_ROOM, message, (response) => {
                if (response !== "FAIL") {
                    this.socket.emit(this.eventz.NEW_MESSAGE, message);
                    this.socket.broadcast.to(message.roomId).emit(this.eventz.NEW_MESSAGE, message);
                }
            });
        };
        this.handlers = {
            JOIN_ROOM: this.handleJoinRoom,
            SEND_MESSAGE_TO_ROOM: this.handleSendMessageToRoom,
            SEND_DIRECT_MESSAGE: this.handleSendDirectMessage,
            DIRECT_CHAT: this.handleDirectChat
        };
        this.socket = socket;
        this.requestToChannel = requestToChannel;
        this.usersOnline = usersOnline;
        this.setupHandlers();
    }
}
exports.ChatroomNamespace = ChatroomNamespace;
//# sourceMappingURL=ChatroomNamespace.js.map