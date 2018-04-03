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
const Message_1 = __importDefault(require("../schemas/Message"));
const User_1 = __importDefault(require("../models/User"));
const Mongoose = require("mongoose");
const create = (data, callback) => {
    const newUser = new Message_1.default(data);
    newUser.save(callback);
};
const find = (data, callback) => {
    Message_1.default.find({ chatKey: { $in: [
                `${data.sender}:${data.recipient}`,
                `${data.recipient}:${data.sender}`
            ] } }, (err, messages) => {
        const result = {
            messages
        };
        User_1.default.find({ _id: { $in: [data.sender, data.recipient] } }, (errr, users) => {
            if (err) {
                return callback(err, users);
            }
            result.sender = R.find(R.propEq("_id", new Mongoose.Types.ObjectId(data.sender)))(users);
            result.recipient = R.find(R.propEq("_id", new Mongoose.Types.ObjectId(data.recipient)))(users);
            callback(undefined, result);
        });
    });
};
exports.default = {
    find,
    create
};
//# sourceMappingURL=Message.js.map