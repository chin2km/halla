import { SocketServer } from "../socket-server";
import * as R from "ramda";
import * as rabbitJS from "rabbit.js";
import { PushSocket, ReqSocket, RepSocket } from "rabbit.js";

export class ChatroomNamespace {
    private socket: SocketIO.Socket;
    private rabbitMQContext: rabbitJS.Context;

    private channels = {
        JOIN_ROOM: "JOIN_ROOM",
    };

    constructor(socket: SocketIO.Socket, rabbitMQContext: rabbitJS.Context) {
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;

        this.setupHandlers();
    }

    setupHandlers = () => {
        this.socket.emit("connect", this.socket.id);

        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);
    }

    handleJoinRoom = (message: any) => {
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
    }

    requestToChannel = (CHANNEL: string, message: any, callback: Function) => {
        const REQ_SOCKET: ReqSocket = this.rabbitMQContext.socket("REQ", {expiration: 10000});
        REQ_SOCKET.setEncoding("utf8");

        REQ_SOCKET.connect(CHANNEL, () => {

            REQ_SOCKET.write(JSON.stringify(message));
            REQ_SOCKET.on("data", (message: any) => {
                console.log("DATA RECIVED:", typeof message, message);
                console.log();
                callback(message);
                setTimeout(() => {
                    REQ_SOCKET.close();
                }, 10000);
            });

        });
    }

    public handlers: any = {
        JOIN_ROOM: this.handleJoinRoom,
    };
}