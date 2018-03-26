"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const R = __importStar(require("ramda"));
const Room_1 = __importDefault(require("../schemas/Room"));
const User_1 = __importDefault(require("../models/User"));
const Mongoose = require("mongoose");
const create = (data, callback) => {
    const newRoom = new Room_1.default(data);
    newRoom.save(callback);
};
const find = (data, callback) => {
    Room_1.default.find(data, callback);
};
const findOne = (data, callback) => {
    Room_1.default.findOne(data, callback);
};
const findById = (id, callback) => {
    Room_1.default.findById(id, callback);
};
const findByIdAndUpdate = (id, data, callback) => {
    Room_1.default.findByIdAndUpdate(id, data, { new: true }, callback);
};
const addUser = function (room, userId, socketId, callback) {
    const conn = { userId, socketId };
    const connection = R.find(R.propEq("socketId", socketId))(room.connections);
    if (!connection) {
        room.connections.push(conn);
    }
    room.save(callback);
};
const getUsers = function (roomId, userId, callback) {
    findById(roomId, function (err, room) {
        const userIds = room.connections.map((ele) => new Mongoose.Types.ObjectId(ele.userId));
        User_1.default.find({ _id: { $in: userIds } }, (err, users) => {
            callback(undefined, users);
        });
    });
};
const removeUser = function (socketId, userId, callback) {
    find({ "connections.socketId": socketId }, (err, rooms) => {
        if (err) {
            return callback(err, undefined);
        }
        callback(undefined, rooms);
        if (userId) {
            const roomIds = rooms.map((ele) => new Mongoose.Types.ObjectId(ele._id));
            Room_1.default.collection.update({ "connections.socketId": socketId }, { $pull: { "connections": { "socketId": socketId } } }, { multi: true });
        }
    });
};
exports.default = {
    addUser,
    create,
    find,
    findOne,
    findById,
    removeUser,
    getUsers
};
//# sourceMappingURL=Room.js.map