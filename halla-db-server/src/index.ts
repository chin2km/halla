import { MongoServer } from "./mongo-server";

const mongoServer = new MongoServer().getServer();

export { mongoServer };
