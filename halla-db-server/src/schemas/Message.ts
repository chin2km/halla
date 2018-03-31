import Mongoose = require("mongoose");

const MessageSchema = new Mongoose.Schema(
    {
        chatKey: {
            type: String
        },
        message: {
            type: String
        },
        sender: {
            type: String
        },
        recipient: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

MessageSchema.pre("save", function (next) {
    this.chatKey = `${this.sender}:${this.recipient}`;
    next();
});


const messageModel = Mongoose.model("Message", MessageSchema);

export default messageModel;