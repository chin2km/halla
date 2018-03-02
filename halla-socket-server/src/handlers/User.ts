import { SocketServer } from "../socket-server";
export class User {
    private app: SocketServer;
    private socket: SocketIO.Socket;

    constructor(app: SocketServer, socket: SocketIO.Socket) {
        this.app = app;
        this.socket = socket;
    }

    handleLogin = (event: any) => {
        console.log("SUBMIT_LOGIN", event);
        this.socket.emit("LOGIN_SUCCESS", event);
    }

    handleLogout = (event: any) => {
        console.log("LOGOUT event", event);
    }

    public handlers = {
        SUBMIT_LOGIN: this.handleLogin,
        LOGOUT: this.handleLogout
    };
}