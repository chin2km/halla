"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../schemas/User"));
const create = (data, callback) => {
    const newUser = new User_1.default(data);
    newUser.save(callback);
};
const find = (data, callback) => {
    User_1.default.find(data, callback);
};
const findOne = (data, callback) => {
    User_1.default.findOne(data, callback);
};
const findById = (id, callback) => {
    User_1.default.findById(id, callback);
};
exports.default = {
    find,
    create,
    findOne,
    findById,
};
//# sourceMappingURL=User.js.map