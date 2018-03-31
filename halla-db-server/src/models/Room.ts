
import * as R from "ramda";
import Room from "../schemas/Room";
import User from "../models/User";
import Mongoose = require("mongoose");

const create = (data: typeof Room, callback: CallBackType) => {
    const newRoom = new Room(data);
    newRoom.save(callback);
};

const find = (data: any, callback: CallBackType) => {
    Room.find(data, callback);
};

const findOne = (data: typeof Room, callback: CallBackType) => {
    Room.findOne(data, callback);
};

const findById = (id: string, callback: CallBackType) => {
    Room.findById(id, callback);
};

const addUser = function (room: any, userId: string, socketId: string, callback: CallBackType) {
    const conn = { userId, socketId};
    const connection = R.find(R.propEq("socketId", socketId))(room.connections);
    if (!connection) {
        room.connections.push(conn);
    }
    room.save(callback);
};

const addMessage = function (roomId: any, message: any, callback: CallBackType) {
    findById(roomId, function (err, room: any) {
        if (err) {
            return callback(err, undefined);
        }
        room.messages.push(message);
        room.save(callback);
    });
};

const getUsers = function (roomId: any, userId: string, callback: CallBackType) {

    findById(roomId, function (err, room: any) {

        const userIds = room.connections.map((ele: any) => new Mongoose.Types.ObjectId(ele.userId));
        User.find({ _id: { $in: userIds} }, callback);
    });
};

const removeUser = function (socketId: string, userId: string, callback: CallBackType) {
    find({ "connections.socketId" : socketId}, (err, rooms: any[]) => {
        if (err) { return callback(err, undefined); }
        callback(undefined, rooms);

        if (userId) {
            Room.collection.update(
                { "connections.socketId": socketId },
                { $pull: { "connections": { "socketId": socketId} } },
                { multi: true }
            );
        }
    });
};

export default {
    addUser,
    create,
    find,
    findOne,
    findById,
    removeUser,
    addMessage,
    getUsers
};