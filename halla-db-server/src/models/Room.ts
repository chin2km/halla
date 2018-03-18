
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

const removeUser = function(socketid: string, callback: CallBackType) {
};

export default {
    create,
    find,
    findOne,
    findById,
    removeUser
};