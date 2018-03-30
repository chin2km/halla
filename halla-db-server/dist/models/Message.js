"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("../schemas/Message"));
const create = (data, callback) => {
    const newUser = new Message_1.default(data);
    newUser.save(callback);
};
const find = (data, callback) => {
    Message_1.default.find({ chatKey: { $in: [
                `${data.sender}:${data.recipient}`,
                `${data.recipient}:${data.sender}`
            ] } }, callback);
};
exports.default = {
    find,
    create
};
//# sourceMappingURL=Message.js.map