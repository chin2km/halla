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
        };
        this.setupHandlers = () => {
            this.socket.emit("connect", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleJoinRoom = (message) => {
            console.log("JOIN_ROOM", message);
            // this.requestToChannel(this.channels.JOIN_ROOM, message, (response: string) => {
            //     // if ( response === "FAIL") {
            //     //     console.log("FAIL");
            //     //     this.socket.emit("CREATE_ROOM_FAIL", response);
            //     // } else {
            //     //     console.log("CREATE_ROOM_SUCCESSFUL");
            //     //     this.socket.emit("CREATE_ROOM_SUCCESSFUL", message);
            //     //     this.socket.broadcast.emit("CREATE_ROOM_SUCCESSFUL", message);
            //     // }
            // });
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