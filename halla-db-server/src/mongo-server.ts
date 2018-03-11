
import Mongoose =  require("mongoose");
import * as rabbitMQ from "amqplib";
import * as R from "ramda";

export class MongoServer {
    public static readonly PORT: number = 5027;
    public static readonly RABBITMQ_SERVER: string = "amqp://localhost";
    public static readonly MONGODB_DB: string = "mongodb://localhost/halla_db";
    private rabbitMQConnection: rabbitMQ.Connection;
    private port: string | number;

    private hallaDB: Mongoose.Connection;

    constructor() {
        this.config();
        this.createServer();
        this.listenClients();
    }

    private config(): void {
        this.port = process.env.PORT || MongoServer.PORT;
    }

    private createServer(): void {
        Mongoose.connect(MongoServer.MONGODB_DB);
        this.hallaDB =  Mongoose.connection;
        this.hallaDB.on("error", () => {console.log( "FAILED to connect to mongoose"); });
        this.hallaDB.once("open", () => {
            // Connected to MongoDB
        });

        // RabbitMq Connection
        rabbitMQ.connect(MongoServer.RABBITMQ_SERVER)
        .then((mqConnection: rabbitMQ.Connection) => {
            process.once("SIGINT", function() { mqConnection.close(); });
            this.rabbitMQConnection = mqConnection;
        }).catch(console.warn);
    }

    private recieveMessageFromSocketServer = (): void => {
        const channelPromise: any =  this.rabbitMQConnection.createChannel();
        channelPromise.then((channel: rabbitMQ.Channel) => {

            const q = "LOGIN_QUEUE";

            const ok = channel.assertQueue(q, {durable: true});
            ok.then(function() { channel.prefetch(1); });
            ok.then(function() {
                channel.consume(q, doWork, {noAck: false});
                console.log(" [*] Waiting for messages. To exit press CTRL+C");
            });

            function doWork(msg: any) {
              const body = msg.content.toString();
              const secs = body.split(".").length - 1;

              setTimeout(function() {
                console.log(" [x] Received '%s'", body);
                channel.ack(msg);
              }, secs * 1000);
            }

        });
        channelPromise.catch(console.warn);
    }

    private listenClients(): void {
        setTimeout(this.recieveMessageFromSocketServer, 2000);
    }

    public getServer(): any {
        return this.hallaDB;
    }
}