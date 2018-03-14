import Mongoose = require("mongoose");

const RoomSchema = new Mongoose.Schema({
    title: { type: String, required: true },
    connections: { type: [{ username: String, socketId: String }]}
});

const roomModel = Mongoose.model("Room", RoomSchema);

export default roomModel;