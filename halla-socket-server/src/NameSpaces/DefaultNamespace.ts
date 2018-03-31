import * as R from "ramda";

export class DefaultNamespace {
    private socket: SocketIO.Socket;
    private requestToChannel: Function;

    private channels = {
        SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
        LOGIN_CHANNEL: "LOGIN_CHANNEL",
    };

    constructor (socket: SocketIO.Socket, requestToChannel: Function) {
        this.socket = socket;
        this.requestToChannel = requestToChannel;

        this.setupHandlers();
    }

    setupHandlers = () => {
        this.socket.emit("connect", this.socket.id);

        R.forEachObjIndexed((handle, eventName) => {
            this.socket.on(eventName, handle);
        })(this.handlers);
    }

    handleLogin = (message: any) => {
        console.log("SUBMIT_LOGIN", message);

        this.requestToChannel(this.channels.LOGIN_CHANNEL, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit("LOGIN_FAIL", response);
            } else {
                this.socket.emit("LOGIN_SUCCESS", JSON.parse(response));
            }
        });
    }

    handleSignUp = (message: any) => {
        console.log("SUBMIT_SIGNUP", message);

        this.requestToChannel(this.channels.SIGNUP_CHANNEL, message, (response: string) => {
            if (response === "SUCCESS") {
                this.socket.emit("SIGNUP_SUCCESS", message);
            }

            if ( response === "FAIL") {
                this.socket.emit("SIGNUP_FAIL", response);
            }
        });
    };



    public handlers: any = {
        SUBMIT_LOGIN: this.handleLogin,
        SUBMIT_SIGNUP: this.handleSignUp,
    };
}