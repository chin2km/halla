"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIo = require("socket.io");
class SocketApp {
    constructor() {
        this.config();
        this.sockets();
        this.listen();
    }
    config() {
        this.port = process.env.PORT || SocketApp.PORT;
    }
    sockets() {
        this.io = socketIo();
    }
    listen() {
        this.io.on("connection", (client) => {
            console.log("Connected client on port %s.", this.port);
            client.on("message", (m) => {
                console.log("[server](message): %s", JSON.stringify(m));
                this.io.emit("message", m);
            });
            client.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }
    getApp() {
        return this.io;
    }
}
SocketApp.PORT = 5027;
exports.SocketApp = SocketApp;
//# sourceMappingURL=socket-app.js.map