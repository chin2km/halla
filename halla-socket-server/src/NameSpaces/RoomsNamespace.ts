import * as R from "ramda";

export class RoomsNamespace {
    private socket: SocketIO.Socket;
    private requestToChannel: Function;

    private channels = {
        CREATE_ROOM: "CREATE_ROOM",
        FETCH_ROOMS: "FETCH_ROOMS",

        FETCH_PEOPLE: "FETCH_PEOPLE"
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
        console.log("FETCH_ROOMS", message);

        this.requestToChannel(this.channels.FETCH_ROOMS, message, (response: string) => {
            this.socket.emit("SET_ROOMS", JSON.parse(response));
        });
    }

    handleFetchPeople = (message: any) => {
        console.log("FETCH_PEOPLE", message);

        this.requestToChannel(this.channels.FETCH_PEOPLE, message, (response: string) => {
            this.socket.emit("SET_PEOPLE", JSON.parse(response));
        });
    }

    handleCreateRoom = (message: any) => {
        console.log("CREATE_ROOM", message);

        this.requestToChannel(this.channels.CREATE_ROOM, message, (response: string) => {
            if ( response === "FAIL") {
                console.log("FAIL");
                this.socket.emit("CREATE_ROOM_FAIL", response);
            } else {
                console.log("CREATE_ROOM_SUCCESSFUL");
                this.socket.emit("CREATE_ROOM_SUCCESSFUL", message);
                this.socket.broadcast.emit("CREATE_ROOM_SUCCESSFUL", message);
            }
        });
    }

    public handlers: any = {
        FETCH_ROOMS: this.handleFetchRooms,
        CREATE_ROOM: this.handleCreateRoom,
        FETCH_PEOPLE: this.handleFetchPeople,
    };
}