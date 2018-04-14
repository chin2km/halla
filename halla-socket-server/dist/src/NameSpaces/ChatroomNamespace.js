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
const Channels_1 = require("../../halla-shared/src/Channels");
const Channels_2 = require("../../halla-shared/src/Channels");
const Actions_1 = require("../../halla-shared/src/Actions");
class ChatroomNamespace {
    constructor(socket, requestToChannel, usersOnline) {
        this.setupHandlers = () => {
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
            this.onDisconnect();
        };
        this.onDisconnect = () => {
            this.socket.on(Actions_1.DISCONNECT, () => {
                const userId = this.socket.handshake.query.userId;
                const data = {
                    userId,
                    socketId: this.socket.id
                };
                this.requestToChannel(Channels_1.REMOVE_USER_CHANNEL, data, (rooms) => {
                    const roomsArr = JSON.parse(rooms);
                    R.forEach((room) => {
                        this.socket.broadcast.to(room._id).emit(Actions_1.REMOVE_USER, {
                            userId,
                            roomId: room._id
                        });
                    }, roomsArr);
                });
            });
        };
        this.handleJoinRoom = (message) => {
            const constructedMessage = Object.assign({}, message, { socketId: this.socket.id });
            this.requestToChannel(Channels_2.JOIN_ROOM_CHANNEL, constructedMessage, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(Actions_1.JOIN_ROOM_FAIL);
                }
                else {
                    const room = JSON.parse(response);
                    this.socket.join(room._id);
                    this.socket.emit(Actions_1.JOIN_ROOM_SUCCESS, room);
                    const data = {
                        roomId: room._id,
                        userId: message.userId
                    };
                    this.requestToChannel(Channels_2.ROOM_USERS_CHANNEL, data, (users) => {
                        const data = {
                            roomId: room._id,
                            users: JSON.parse(users)
                        };
                        this.socket.emit(Actions_1.SET_ROOM_USERS, data);
                        this.socket.broadcast.to(room._id).emit(Actions_1.SET_ROOM_USERS, data);
                    });
                }
            });
        };
        this.handleDirectChat = (message) => {
            this.requestToChannel(Channels_2.DIRECT_CHAT_CHANNEL, message, (chats) => {
                if (chats === "FAIL") {
                    this.socket.emit(Actions_1.DIRECT_CHAT_FAIL);
                }
                else {
                    const chatss = JSON.parse(chats);
                    this.socket.emit(Actions_1.DIRECT_CHAT_SUCCESS, chatss);
                }
            });
        };
        this.handleSendDirectMessage = (message) => {
            this.requestToChannel(Channels_2.SEND_DIRECT_MESSAGE_CHANNEL, message, (response) => {
                const responseObj = JSON.parse(response);
                if (response !== "FAIL") {
                    this.socket.emit(Actions_1.NEW_DIRECT_MESSAGE, responseObj);
                    if (R.has(message.recipient, this.usersOnline)) {
                        this.socket.broadcast.to(R.prop(message.recipient, this.usersOnline)).emit(Actions_1.NEW_DIRECT_MESSAGE, responseObj);
                    }
                }
            });
        };
        this.handleSendMessageToRoom = (message) => {
            this.requestToChannel(Channels_2.SEND_MESSAGE_TO_ROOM_CHANNEL, message, (response) => {
                if (response !== "FAIL") {
                    this.socket.emit(Actions_1.NEW_MESSAGE, message);
                    this.socket.broadcast.to(message.roomId).emit(Actions_1.NEW_MESSAGE, message);
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