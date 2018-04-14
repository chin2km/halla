"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: undefined
    }
}, {
    timestamps: true
});
const userModel = Mongoose.model("User", UserSchema);
exports.default = userModel;
//# sourceMappingURL=User.js.map