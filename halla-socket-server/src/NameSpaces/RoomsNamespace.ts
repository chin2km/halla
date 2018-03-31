import * as R from "ramda";

export class RoomsNamespace {
    private socket: SocketIO.Socket;
    private requestToChannel: Function;

    private channels = {
        CREATE_ROOM: "CREATE_ROOM",
        FETCH_ROOMS: "FETCH_ROOMS",

        FETCH_PEOPLE: "FETCH_PEOPLE"
    };

    private eventz = {
        SET_ROOMS: "SET_ROOMS",
        SET_PEOPLE: "SET_PEOPLE",

        CREATE_ROOM_FAIL: "CREATE_ROOM_FAIL",
        CREATE_ROOM_SUCCESSFUL: "CREATE_ROOM_SUCCESSFUL"
    };

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
        this.requestToChannel(this.channels.FETCH_ROOMS, message, (response: string) => {
            this.socket.emit(this.eventz.SET_ROOMS, JSON.parse(response));
        });
    }

    handleFetchPeople = (message: any) => {
        this.requestToChannel(this.channels.FETCH_PEOPLE, message, (response: string) => {
            this.socket.emit(this.eventz.SET_PEOPLE, JSON.parse(response));
        });
    }

    handleCreateRoom = (message: any) => {
        this.requestToChannel(this.channels.CREATE_ROOM, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(this.eventz.CREATE_ROOM_FAIL, response);
            } else {
                this.socket.emit(this.eventz.CREATE_ROOM_SUCCESSFUL, message);
                this.socket.broadcast.emit(this.eventz.CREATE_ROOM_SUCCESSFUL, message);
            }
        });
    }

    public handlers: any = {
        FETCH_ROOMS: this.handleFetchRooms,
        CREATE_ROOM: this.handleCreateRoom,
        FETCH_PEOPLE: this.handleFetchPeople,
    };
}