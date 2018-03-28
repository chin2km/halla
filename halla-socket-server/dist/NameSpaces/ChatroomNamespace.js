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
    constructor(socket, rabbitMQContext) {
        this.channels = {
            JOIN_ROOM: "JOIN_ROOM",
            FETCH_ROOM_USERS: "FETCH_ROOM_USERS",
            REMOVE_USER_FROM_ROOM: "REMOVE_USER_FROM_ROOM",
            SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM"
        };
        this.setupHandlers = () => {
            this.socket.emit("connect", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
            this.onDisconnect();
        };
        this.onDisconnect = () => {
            this.socket.on("disconnect", () => {
                const data = {
                    userId: this.userId,
                    socketId: this.socket.id
                };
                this.requestToChannel(this.channels.REMOVE_USER_FROM_ROOM, data, (rooms) => {
                    const roomsArr = JSON.parse(rooms);
                    R.forEach((room) => {
                        console.log("broadcasting to", room._id, "for", this.userId);
                        this.socket.broadcast.to(room._id).emit("REMOVE_USER", {
                            userId: this.userId,
                            roomId: room._id
                        });
                    }, roomsArr);
                });
            });
        };
        this.handleJoinRoom = (message) => {
            const constructedMessage = Object.assign({}, message, { socketId: this.socket.id });
            console.log("JOIN_ROOM", constructedMessage);
            this.requestToChannel(this.channels.JOIN_ROOM, constructedMessage, (response) => {
                if (response === "FAIL") {
                    console.log("FAIL");
                    this.socket.emit("JOIN_ROOM_FAIL");
                }
                else {
                    const room = JSON.parse(response);
                    console.log("JOIN_ROOM_SUCCESS", room);
                    this.userId = constructedMessage.userId;
                    this.socket.join(room._id);
                    this.socket.emit("JOIN_ROOM_SUCCESS", room);
                    const data = {
                        roomId: room._id,
                        userId: message.userId
                    };
                    this.requestToChannel(this.channels.FETCH_ROOM_USERS, data, (users) => {
                        const data = {
                            roomId: room._id,
                            users: JSON.parse(users)
                        };
                        this.socket.emit("SET_ROOM_USERS", data);
                        this.socket.broadcast.to(room._id).emit("SET_ROOM_USERS", data);
                    });
                }
            });
        };
        this.handleSendMessageToRoom = (message) => {
            const constructedMessage = Object.assign({}, message, { socketId: this.socket.id });
            this.socket.emit("NEW_MESSAGE", {
                roomId: message.roomId,
                message: message.message
            });
            this.socket.broadcast.to(message.roomId).emit("NEW_MESSAGE", {
                roomId: message.roomId,
                message: message.message
            });
        };
        this.requestToChannel = (CHANNEL, message, callback) => {
            const REQ_SOCKET = this.rabbitMQContext.socket("REQ", { expiration: 10000 });
            REQ_SOCKET.setEncoding("utf8");
            REQ_SOCKET.connect(CHANNEL, () => {
                REQ_SOCKET.write(JSON.stringify(message));
                REQ_SOCKET.on("data", (message) => {
                    console.log("DATA RECIVED:", typeof message, message);
                    console.log();
                    callback(message);
                    setTimeout(() => {
                        REQ_SOCKET.close();
                    }, 10000);
                });
            });
        };
        this.handlers = {
            JOIN_ROOM: this.handleJoinRoom,
            SEND_MESSAGE_TO_ROOM: this.handleSendMessageToRoom,
        };
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;
        this.setupHandlers();
    }
}
exports.ChatroomNamespace = ChatroomNamespace;
//# sourceMappingURL=ChatroomNamespace.js.map