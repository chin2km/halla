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
        this.eventz = {
            SET_ROOMS: "SET_ROOMS",
            SET_PEOPLE: "SET_PEOPLE",
            CREATE_ROOM_FAIL: "CREATE_ROOM_FAIL",
            CREATE_ROOM_SUCCESSFUL: "CREATE_ROOM_SUCCESSFUL"
        };
        this.setupHandlers = () => {
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleFetchRooms = (message) => {
            this.requestToChannel(this.channels.FETCH_ROOMS, message, (response) => {
                this.socket.emit(this.eventz.SET_ROOMS, JSON.parse(response));
            });
        };
        this.handleFetchPeople = (message) => {
            this.requestToChannel(this.channels.FETCH_PEOPLE, message, (response) => {
                this.socket.emit(this.eventz.SET_PEOPLE, JSON.parse(response));
            });
        };
        this.handleCreateRoom = (message) => {
            this.requestToChannel(this.channels.CREATE_ROOM, message, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(this.eventz.CREATE_ROOM_FAIL, response);
                }
                else {
                    this.socket.emit(this.eventz.CREATE_ROOM_SUCCESSFUL, message);
                    this.socket.broadcast.emit(this.eventz.CREATE_ROOM_SUCCESSFUL, message);
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