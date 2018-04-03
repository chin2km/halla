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
const Channels_1 = require("../../../halla-shared/src/Channels");
const Actions_1 = require("../../../halla-shared/src/Actions");
const index_1 = require("../../../halla-shared/src/Namespaces/index");
class DefaultNamespace {
    constructor(socket, requestToChannel, IO) {
        this.setupHandlers = () => {
            this.socket.emit("connect", this.socket.id);
            R.forEachObjIndexed((handle, eventName) => {
                this.socket.on(eventName, handle);
            })(this.handlers);
        };
        this.handleLogin = (message) => {
            this.requestToChannel(Channels_1.LOGIN_CHANNEL, message, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(Actions_1.LOGIN_FAIL, response);
                }
                else {
                    this.socket.emit(Actions_1.LOGIN_SUCCESS, JSON.parse(response));
                }
            });
        };
        this.handleSignUp = (message) => {
            this.requestToChannel(Channels_1.SIGNUP_CHANNEL, message, (response) => {
                if (response === "FAIL") {
                    this.socket.emit(Actions_1.SIGNUP_FAIL, response);
                }
                else {
                    this.socket.emit(Actions_1.SIGNUP_SUCCESS, response);
                    this.IO.of(index_1.CHATROOM_NSC).emit(Actions_1.NEW_USER, JSON.parse(response));
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