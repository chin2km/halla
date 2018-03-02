"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_server_1 = require("./mongo-server");
const mongoServer = new mongo_server_1.MongoServer().getServer();
exports.mongoServer = mongoServer;
//# sourceMappingURL=index.js.map