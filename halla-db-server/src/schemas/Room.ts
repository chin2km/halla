import Mongoose = require("mongoose");

const RoomSchema = new Mongoose.Schema({
    title: { type: String, required: true, unique: true},
    admin: { type: String, required: true},
    connections: { type: [{ userId: String, socketId: String }]},
    messages: { type: [
        { userId: String, username: String, message: String, time: { type: Date, default: Date.now } }
    ]},
});

const roomModel = Mongoose.model("Room", RoomSchema);

export default roomModel;