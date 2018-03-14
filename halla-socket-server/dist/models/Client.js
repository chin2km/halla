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
class Client {
    constructor(socket, rabbitMQContext) {
        this.channels = {
            SIGNUP_CHANNEL: "SIGNUP_CHANNEL",
            LOGIN_CHANNEL: "LOGIN_CHANNEL",
        };
        this.setupHandlers = () => {
            this.socket.emit("connected", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleLogin = (message) => {
            console.log("SUBMIT_LOGIN", message);
            this.requestToChannel(this.channels.LOGIN_CHANNEL, message, (response) => {
                this.socket.emit("LOGIN_SUCCESS", message);
            });
        };
        this.handleSignUp = (message) => {
            console.log("SUBMIT_SIGNUP", message);
            this.requestToChannel(this.channels.SIGNUP_CHANNEL, message, (response) => {
                this.socket.emit("SIGNUP_SUCCESS", response);
            });
        };
        this.handleLogout = (message) => {
            console.log("LOGOUT", message);
        };
        this.requestToChannel = (CHANNEL, message, callback) => {
            const REQ_SOCKET = this.rabbitMQContext.socket("REQUEST");
            REQ_SOCKET.connect(CHANNEL, () => {
                REQ_SOCKET.write(JSON.stringify(message), "utf8");
                REQ_SOCKET.on("data", (message) => {
                    callback(message);
                });
            });
        };
        this.handlers = {
            SUBMIT_LOGIN: this.handleLogin,
            SUBMIT_SIGNUP: this.handleSignUp,
            LOGOUT: this.handleLogout
        };
        this.socket = socket;
        this.rabbitMQContext = rabbitMQContext;
        this.setupHandlers();
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map