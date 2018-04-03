import * as R from "ramda";
import { SET_ROOMS, SET_PEOPLE, CREATE_ROOM_FAIL, CREATE_ROOM_SUCCESSFUL } from "../../../halla-shared/src/Actions";
import { FETCH_ROOMS_CHANNEL, FETCH_PEOPLE_CHANNEL, CREATE_ROOM_CHANNEL } from "../../../halla-shared/src/Channels";

export class RoomsNamespace {
    private socket: SocketIO.Socket;
    private requestToChannel: Function;

    constructor (socket: SocketIO.Socket, requestToChannel: Function) {
        this.socket = socket;
        this.requestToChannel = requestToChannel;

        this.setupHandlers();
    }

    setupHandlers = () => {
        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);
    }

    handleFetchRooms = (message: any) => {
        this.requestToChannel(FETCH_ROOMS_CHANNEL, message, (response: string) => {
            this.socket.emit(SET_ROOMS, JSON.parse(response));
        });
    }

    handleFetchPeople = (message: any) => {
        this.requestToChannel(FETCH_PEOPLE_CHANNEL, message, (response: string) => {
            this.socket.emit(SET_PEOPLE, JSON.parse(response));
        });
    }

    handleCreateRoom = (message: any) => {
        this.requestToChannel(CREATE_ROOM_CHANNEL, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(CREATE_ROOM_FAIL, response);
            } else {
                this.socket.emit(CREATE_ROOM_SUCCESSFUL, message);
                this.socket.broadcast.emit(CREATE_ROOM_SUCCESSFUL, message);
            }
        });
    }

    public handlers: any = {
        FETCH_ROOMS: this.handleFetchRooms,
        CREATE_ROOM: this.handleCreateRoom,
        FETCH_PEOPLE: this.handleFetchPeople,
    };
}