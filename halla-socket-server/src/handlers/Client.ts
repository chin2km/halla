import { SocketServer } from "../socket-server";
import * as R from "ramda";

export class Client {
    private app: SocketServer;
    private socket: SocketIO.Socket;

    constructor(app: SocketServer, socket: SocketIO.Socket) {
        this.app = app;
        this.socket = socket;

        this.setupHandlers();
    }

    setupHandlers = () => {
        R.forEachObjIndexed((handles) => {
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(handles);
        })(this.handlers);

        this.socket.emit("connected", this.socket.id);
    }

    handleLogin = (message: any) => {
        console.log("SUBMIT_LOGIN", message);
        this.socket.emit("LOGIN_FAIL", message);
    }

    handleLogout = (message: any) => {
        console.log("LOGOUT event", message);
    }

    public handlers = {
        SUBMIT_LOGIN: this.handleLogin,
        LOGOUT: this.handleLogout
    };
}