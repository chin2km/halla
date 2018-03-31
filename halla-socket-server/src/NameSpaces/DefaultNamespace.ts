import * as R from "ramda";

export class DefaultNamespace {
    private socket: SocketIO.Socket;
    private IO: SocketIO.Server;
    private requestToChannel: Function;

    private channels = {
        SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
        LOGIN_CHANNEL: "LOGIN_CHANNEL",
    };

    private eventz = {
        LOGIN_FAIL: "LOGIN_FAIL",
        LOGIN_SUCCESS: "LOGIN_SUCCESS",
        SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
        SIGNUP_FAIL: "SIGNUP_FAIL",
        NEW_USER: "NEW_USER"
    };

    constructor (socket: SocketIO.Socket, requestToChannel: Function, IO: SocketIO.Server) {
        this.socket = socket;
        this.requestToChannel = requestToChannel;
        this.IO = IO;

        this.setupHandlers();
    }

    setupHandlers = () => {
        this.socket.emit("connect", this.socket.id);

        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);
    }

    handleLogin = (message: any) => {
        this.requestToChannel(this.channels.LOGIN_CHANNEL, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(this.eventz.LOGIN_FAIL, response);
            } else {
                this.socket.emit(this.eventz.LOGIN_SUCCESS, JSON.parse(response));
            }
        });
    }

    handleSignUp = (message: any) => {
        this.requestToChannel(this.channels.SIGNUP_CHANNEL, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(this.eventz.SIGNUP_FAIL, response);
            } else {
                this.socket.emit(this.eventz.SIGNUP_SUCCESS, response);
                this.IO.of("/chatroom").emit(this.eventz.NEW_USER, JSON.parse(response));
            }
        });
    };



    public handlers: any = {
        SUBMIT_LOGIN: this.handleLogin,
        SUBMIT_SIGNUP: this.handleSignUp,
    };
}