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
    const users = [], vis = {};
    let cunt = 0;
    findById(roomId, function (err, room) {
        room.connections.forEach((conn) => {
            if (conn.userId === userId) {
                cunt++;
            }
            if (!vis[conn.userId]) {
                users.push(conn.userId);
            }
            vis[conn.userId] = true;
        });
        users.forEach((userId, i) => {
            User_1.default.findById(userId, (err, user) => {
                if (err) {
                    return callback(err);
                }
                users[i] = user;
                if (i + 1 === users.length) {
                    return callback(undefined, users, cunt);
                }
            });
        });
    });
};
const removeUser = function (socketid, callback) {
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