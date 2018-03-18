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
class RoomsNamespace {
    constructor(socket, rabbitMQContext) {
        this.channels = {
            CREATE_ROOM: "CREATE_ROOM",
            FETCH_ROOMS: "FETCH_ROOMS",
        };
        this.setupHandlers = () => {
            this.socket.emit("connect", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleFetchRooms = (message) => {
            console.log("FETCH_ROOMS", message);
            this.requestToChannel(this.channels.FETCH_ROOMS, message, (response) => {
                this.socket.emit("SET_ROOMS", JSON.parse(response));
            });
        };
        this.handleCreateRoom = (message) => {
            console.log("CREATE_ROOM", message);
            this.requestToChannel(this.channels.CREATE_ROOM, message, (response) => {
                if (response === "FAIL") {
                    console.log("FAIL");
                    this.socket.emit("CREATE_ROOM_FAIL", response);
                }
                else {
                    console.log("CREATE_ROOM_SUCCESSFUL");
                    this.socket.emit("CREATE_ROOM_SUCCESSFUL", message);
                    this.socket.broadcast.emit("CREATE_ROOM_SUCCESSFUL", message);
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
            FETCH_ROOMS: this.handleFetchRooms,
            CREATE_ROOM: this.handleCreateRoom,
        };
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;
        this.setupHandlers();
    }
}
exports.RoomsNamespace = RoomsNamespace;
//# sourceMappingURL=RoomsNamespace.js.map