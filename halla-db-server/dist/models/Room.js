"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("../schemas/Room"));
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
const removeUser = function (socketid, callback) {
};
module.exports = {
    create,
    find,
    findOne,
    findById,
    removeUser
};
//# sourceMappingURL=Room.js.map