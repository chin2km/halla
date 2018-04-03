"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../schemas/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const create = (data, callback) => {
    find({ username: data.username }, (err, foundUser) => {
        if (err) {
            return callback(err);
        }
        if (foundUser.length) {
            return callback("User Exists", undefined);
        }
        const { username, password } = data;
        const password_encoded = bcrypt_1.default.hashSync(password, 10);
        const newUser = new User_1.default({
            username,
            password: password_encoded
        });
        newUser.save(callback);
    });
};
const find = (data, callback) => {
    User_1.default.find(data, "username", callback);
};
const authenticate = (data, callback) => {
    User_1.default.findOne({ username: data.username }, (err, foundUser) => {
        if (err) {
            return callback(err);
        }
        if (foundUser) {
            if (bcrypt_1.default.compareSync(data.password, foundUser.password)) {
                const token = jsonwebtoken_1.default.sign({
                    _id: foundUser._id,
                    username: foundUser.username
                }, configs_1.default.jwtSecret);
                callback(undefined, token);
            }
            else {
                callback("Invalid Credentials");
            }
        }
        else {
            callback("Invalid Credentials");
        }
    });
};
const findById = (id, callback) => {
    User_1.default.findById(id, callback);
};
exports.default = {
    find,
    create,
    authenticate,
    findById,
};
//# sourceMappingURL=User.js.map