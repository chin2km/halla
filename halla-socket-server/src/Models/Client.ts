import { SocketServer } from "../socket-server";
import * as R from "ramda";
import * as rabbitJS from "rabbit.js";
import { PushSocket, ReqSocket, RepSocket } from "rabbit.js";

export class Client {
    private socket: SocketIO.Socket;
    private rabbitMQContext: rabbitJS.Context;

    private channels = {
        SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
        LOGIN_CHANNEL: "LOGIN_CHANNEL",
    };

    constructor(socket: SocketIO.Socket, rabbitMQContext: rabbitJS.Context) {
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;

        this.setupHandlers();
    }

    setupHandlers = () => {
        this.socket.emit("connected", this.socket.id);

        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);
    }

    handleLogin = (message: any) => {
        console.log("SUBMIT_LOGIN", message);

        this.requestToChannel(this.channels.LOGIN_CHANNEL, message, (response: string) => {
            this.socket.emit("LOGIN_SUCCESS", message);
        });
    }

    handleSignUp = (message: any) => {
        console.log("SUBMIT_SIGNUP", message);

        this.requestToChannel(this.channels.SIGNUP_CHANNEL, message, (response: string) => {
            this.socket.emit("SIGNUP_SUCCESS", response);
        });
    }

    handleLogout = (message: any) => {
        console.log("LOGOUT", message);
    }

    requestToChannel = (CHANNEL: string, message: any, callback: Function) => {
        const REQ_SOCKET: ReqSocket = this.rabbitMQContext.socket("REQUEST");

        REQ_SOCKET.connect(CHANNEL, () => {

            REQ_SOCKET.write(JSON.stringify(message), "utf8");
            REQ_SOCKET.on("data", (message: string) => {
                callback(message);
            });

        });
    }

    public handlers: any = {
        SUBMIT_LOGIN: this.handleLogin,
        SUBMIT_SIGNUP: this.handleSignUp,
        LOGOUT: this.handleLogout
    };
}