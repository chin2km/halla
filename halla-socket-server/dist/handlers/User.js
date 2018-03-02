"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(app, socket) {
        this.handleLogin = (event) => {
            console.log("SUBMIT_LOGIN", event);
            this.socket.emit("LOGIN_SUCCESS", event);
        };
        this.handleLogout = (event) => {
            console.log("LOGOUT event", event);
        };
        this.handlers = {
            SUBMIT_LOGIN: this.handleLogin,
            LOGOUT: this.handleLogout
        };
        this.app = app;
        this.socket = socket;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map