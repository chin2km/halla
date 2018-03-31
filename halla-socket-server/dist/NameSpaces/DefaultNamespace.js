"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const R = __importStar(require("ramda"));
class DefaultNamespace {
    constructor(socket, requestToChannel, IO) {
        this.channels = {
            SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
            LOGIN_CHANNEL: "LOGIN_CHANNEL",
        };
        this.eventz = {
            LOGIN_FAIL: "LOGIN_FAIL",
            LOGIN_SUCCESS: "LOGIN_SUCCESS",
            SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
            SIGNUP_FAIL: "SIGNUP_FAIL",
            NEW_USER: "NEW_USER"
        };
        this.setupHandlers = () => {
            this.socket.emit("connect", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleLogin = (message) => {
            this.requestToChannel(this.channels.LOGIN_CHANNEL, message, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(this.eventz.LOGIN_FAIL, response);
                }
                else {
                    this.socket.emit(this.eventz.LOGIN_SUCCESS, JSON.parse(response));
                }
            });
        };
        this.handleSignUp = (message) => {
            this.requestToChannel(this.channels.SIGNUP_CHANNEL, message, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(this.eventz.SIGNUP_FAIL, response);
                }
                else {
                    this.socket.emit(this.eventz.SIGNUP_SUCCESS, response);
                    this.IO.of("/chatroom").emit(this.eventz.NEW_USER, JSON.parse(response));
                }
            });
        };
        this.handlers = {
            SUBMIT_LOGIN: this.handleLogin,
            SUBMIT_SIGNUP: this.handleSignUp,
        };
        this.socket = socket;
        this.requestToChannel = requestToChannel;
        this.IO = IO;
        this.setupHandlers();
    }
}
exports.DefaultNamespace = DefaultNamespace;
//# sourceMappingURL=DefaultNamespace.js.map