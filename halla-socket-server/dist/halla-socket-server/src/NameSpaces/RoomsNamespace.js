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
const Actions_1 = require("../../../halla-shared/src/Actions");
const Channels_1 = require("../../../halla-shared/src/Channels");
class RoomsNamespace {
    constructor(socket, requestToChannel) {
        this.setupHandlers = () => {
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleFetchRooms = (message) => {
            this.requestToChannel(Channels_1.FETCH_ROOMS_CHANNEL, message, (response) => {
                this.socket.emit(Actions_1.SET_ROOMS, JSON.parse(response));
            });
        };
        this.handleFetchPeople = (message) => {
            this.requestToChannel(Channels_1.FETCH_PEOPLE_CHANNEL, message, (response) => {
                this.socket.emit(Actions_1.SET_PEOPLE, JSON.parse(response));
            });
        };
        this.handleCreateRoom = (message) => {
            this.requestToChannel(Channels_1.CREATE_ROOM_CHANNEL, message, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(Actions_1.CREATE_ROOM_FAIL, response);
                }
                else {
                    this.socket.emit(Actions_1.CREATE_ROOM_SUCCESSFUL, message);
                    this.socket.broadcast.emit(Actions_1.CREATE_ROOM_SUCCESSFUL, message);
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