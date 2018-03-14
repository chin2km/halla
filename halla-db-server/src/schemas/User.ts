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
        },
        emailId: {
            type: String,
            default: undefined
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", function(next) {
    const user = this;
    next();
});

const userModel = Mongoose.model("User", UserSchema);

export default userModel;