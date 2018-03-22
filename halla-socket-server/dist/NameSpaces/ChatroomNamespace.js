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
            FETCH_ROOM_USERS: "FETCH_ROOM_USERS"
        };
        this.setupHandlers = () => {
            this.socket.emit("connect", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
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
                    this.socket.join(room._id);
                    this.socket.emit("JOIN_ROOM_SUCCESS", room);
                    const data = {
                        roomId: message.id,
                        userId: message.userId
                    };
                    this.requestToChannel(this.channels.FETCH_ROOM_USERS, data, (users) => {
                        console.log(users);
                        this.socket.emit("SET_ROOM_USERS", JSON.parse(users));
                    });
                }
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
        };
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;
        this.setupHandlers();
    }
}
exports.ChatroomNamespace = ChatroomNamespace;
//# sourceMappingURL=ChatroomNamespace.js.map