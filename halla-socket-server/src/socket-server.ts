import socketIo = require("socket.io");
import * as rabbitMQ from "amqplib";
import { User } from "./handlers/User";
import * as R from "ramda";

export class SocketServer {
    public static readonly PORT: number = 5027;
    public static readonly RABBITMQ_SERVER: string = "amqp://localhost";
    private socketIO: SocketIO.Server;
    private rabbitMQConnection: rabbitMQ.Connection;
    private port: string | number;
    private ALL_SOCKETS: SocketIO.Socket[] = [];

    constructor() {
        this.config();
        this.createServer();
        this.listenClients();
    }

    private config(): void {
        this.port = process.env.PORT || SocketServer.PORT;
    }

    private createServer(): void {
        this.socketIO = socketIo();
        this.socketIO.listen(this.port);

        // RabbitMq Connection
        rabbitMQ.connect(SocketServer.RABBITMQ_SERVER)
        .then((mqConnection: rabbitMQ.Connection) => {
            this.rabbitMQConnection = mqConnection;
        }).catch(console.warn);
    }


    private sendMessageToTaskQueue(message: string): void {
        const channelPromise: any =  this.rabbitMQConnection.createChannel();
        channelPromise.then((channel: rabbitMQ.Channel) => {

            const q = "LOGIN_QUEUE";
            const ok = channel.assertQueue(q, {durable: true});

            ok.then(function() {
              channel.sendToQueue(q, Buffer.from(message), {deliveryMode: true});
              console.log("Sent to queue:  '%s'", message);
              channel.close();
            });

        });
        channelPromise.catch(console.warn);
    }

    private listenClients(): void {

        ////////////////////////////////////////////////////////////////
        // let Number = 0;
        // setInterval(() => {
        //     this.sendMessageToTaskQueue(`send# ${++Number} \n`);
        // }, 1000);
        ////////////////////////////////////////////////////////////////

        this.socketIO.on("connect", (socket: SocketIO.Socket) => {
            this.ALL_SOCKETS.push(socket);
            console.log(`Connected client on port ${this.port}: Total Clients: ${this.ALL_SOCKETS.length}: Client id: ${socket.id}`);

            socket.emit("connected", socket.id);

            const handlerCategories = {
                user: new User(this, socket).handlers
            };

            R.forEachObjIndexed((handles) => {
                R.forEachObjIndexed((handle, eventName) => {
                    socket.on(eventName, handle);
                })(handles);
            })(handlerCategories);

            socket.on("disconnect", () => {
                this.ALL_SOCKETS = R.filter(R.complement(R.equals(socket)))(this.ALL_SOCKETS);
                console.log(`Client disconnected on port ${this.port}: Total Clients: ${this.ALL_SOCKETS.length}`);
            });
        });
    }

    public getServer(): SocketIO.Server {
        return this.socketIO;
    }
}