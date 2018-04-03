import * as R from "ramda";
import { LOGIN_CHANNEL, SIGNUP_CHANNEL } from "../../../halla-shared/src/Channels";
import { LOGIN_FAIL, LOGIN_SUCCESS, SIGNUP_FAIL, SIGNUP_SUCCESS, NEW_USER } from "../../../halla-shared/src/Actions";
import { CHATROOM_NSC } from "../../../halla-shared/src/Namespaces/index";

export class DefaultNamespace {
    private socket: SocketIO.Socket;
    private IO: SocketIO.Server;
    private requestToChannel: Function;

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
        this.requestToChannel(LOGIN_CHANNEL, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(LOGIN_FAIL, response);
            } else {
                this.socket.emit(LOGIN_SUCCESS, JSON.parse(response));
            }
        });
    }

    handleSignUp = (message: any) => {
        this.requestToChannel(SIGNUP_CHANNEL, message, (response: string) => {
            if ( response === "FAIL") {
                this.socket.emit(SIGNUP_FAIL, response);
            } else {
                this.socket.emit(SIGNUP_SUCCESS, response);
                this.IO.of(CHATROOM_NSC).emit(NEW_USER, JSON.parse(response));
            }
        });
    };



    public handlers: any = {
        SUBMIT_LOGIN: this.handleLogin,
        SUBMIT_SIGNUP: this.handleSignUp,
    };
}