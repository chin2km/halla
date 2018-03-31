import Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            default: undefined
        }
    },
    {
        timestamps: true
    }
);

const userModel = Mongoose.model("User", UserSchema);

export default userModel;