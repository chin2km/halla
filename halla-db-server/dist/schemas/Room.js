"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const RoomSchema = new Mongoose.Schema({
    title: { type: String, required: true, unique: true },
    admin: { type: String, required: true },
    connections: { type: [{ username: String, socketId: String }] }
});
const roomModel = Mongoose.model("Room", RoomSchema);
exports.default = roomModel;
//# sourceMappingURL=Room.js.map