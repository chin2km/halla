import { SocketServer } from "./socket-server";

const socketServer: SocketIO.Server = new SocketServer().getServer();

export { socketServer };
