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
    constructor(app, socket) {
        this.setupHandlers = () => {
            R.forEachObjIndexed((handles) => {
                R.forEachObjIndexed((handle, eventName) => {
                    this.socket.on(eventName, handle);
                })(handles);
            })(this.handlers);
            this.socket.emit("connected", this.socket.id);
        };
        this.handleLogin = (message) => {
            console.log("SUBMIT_LOGIN", message);
            this.socket.emit("LOGIN_FAIL", message);
        };
        this.handleLogout = (message) => {
            console.log("LOGOUT event", message);
        };
        this.handlers = {
            SUBMIT_LOGIN: this.handleLogin,
            LOGOUT: this.handleLogout
        };
        this.app = app;
        this.socket = socket;
        this.setupHandlers();
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map