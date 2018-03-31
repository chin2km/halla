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
    constructor(socket, requestToChannel) {
        this.channels = {
            CREATE_ROOM: "CREATE_ROOM",
            FETCH_ROOMS: "FETCH_ROOMS",
            FETCH_PEOPLE: "FETCH_PEOPLE"
        };
        this.setupHandlers = () => {
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
        this.handleFetchPeople = (message) => {
            console.log("FETCH_PEOPLE", message);
            this.requestToChannel(this.channels.FETCH_PEOPLE, message, (response) => {
                this.socket.emit("SET_PEOPLE", JSON.parse(response));
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
        this.handlers = {
            FETCH_ROOMS: this.handleFetchRooms,
            CREATE_ROOM: this.handleCreateRoom,
            FETCH_PEOPLE: this.handleFetchPeople,
        };
        this.socket = socket;
        this.requestToChannel = requestToChannel;
        this.setupHandlers();
    }
}
exports.RoomsNamespace = RoomsNamespace;
//# sourceMappingURL=RoomsNamespace.js.map