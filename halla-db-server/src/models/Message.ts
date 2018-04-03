import * as R from "ramda";
import Message from "../schemas/Message";
import User from "../models/User";
import Mongoose = require("mongoose");

const create = (data: typeof Message, callback: CallBackType) => {
    const newUser = new Message(data);
    newUser.save(callback);
};

const find = (data: any, callback: CallBackType) => {
    Message.find({chatKey: {$in: [
        `${data.sender}:${data.recipient}`,
        `${data.recipient}:${data.sender}`
    ]}}, (err, messages) => {
        const result: any = {
            messages
        };
        User.find({_id: {$in: [data.sender, data.recipient]}}, (errr, users) => {
            if (err) {return callback(err, users); }

            result.sender =  R.find(R.propEq("_id", new Mongoose.Types.ObjectId(data.sender)))(users);
            result.recipient =  R.find(R.propEq("_id", new Mongoose.Types.ObjectId(data.recipient)))(users);

            callback(undefined, result);
        });
    });
};

export default {
    find,
    create
};
