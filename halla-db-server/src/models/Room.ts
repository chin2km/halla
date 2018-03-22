
import * as R from "ramda";
import Room from "../schemas/Room";
import User from "../models/User";

const create = (data: typeof Room, callback: CallBackType) => {
    const newRoom = new Room(data);
    newRoom.save(callback);
};

const find = (data: typeof Room, callback: CallBackType) => {
    Room.find(data, callback);
};

const findOne = (data: typeof Room, callback: CallBackType) => {
    Room.findOne(data, callback);
};

const findById = (id: string, callback: CallBackType) => {
    Room.findById(id, callback);
};

const findByIdAndUpdate = (id: String, data: typeof Room, callback: CallBackType) => {
    Room.findByIdAndUpdate(id, data, { new: true }, callback);
};

const addUser = function(room: any, userId: string, socketId: string, callback: CallBackType) {
    const conn = { userId, socketId};
    const connection = R.find(R.propEq("socketId", socketId))(room.connections);
    if (!connection) {
        room.connections.push(conn);
    }
    room.save(callback);
};

const getUsers = function(roomId: any, userId: string, callback: Function) {

    const users: any[] = [], vis: any = {};
    let cunt = 0;

    findById(roomId, function(err, room: any) {
        room.connections.forEach((conn: any) => {
            if (conn.userId === userId) {
                cunt++;
            }

            if (!vis[conn.userId]) {
                users.push(conn.userId);
            }
            vis[conn.userId] = true;
        });

        users.forEach((userId, i) => {
            User.findById(userId, (err, user) => {
                if (err) { return callback(err); }
                users[i] = user;
                if (i + 1 === users.length) {
                    return callback(undefined, users, cunt);
                }
            });
        });
    });
};

const removeUser = function(socketid: string, callback: CallBackType) {
};

export default {
    addUser,
    create,
    find,
    findOne,
    findById,
    removeUser,
    getUsers
};