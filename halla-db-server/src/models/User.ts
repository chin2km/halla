import User from "../schemas/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const create = (data: any, callback: CallBackType) => {
    find({username: data.username}, (err, foundUser) => {
        if (err) {return callback(err); }
        if (foundUser.length) {
            return callback("User Exists", undefined);
        }
        const {username, password} = data;
        const password_encoded = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username,
            password: password_encoded
        });
        newUser.save(callback);
    });
};

const find = (data: any, callback: CallBackType) => {
    User.find(data, "username", callback);
};

const authenticate = (data: any, callback: CallBackType) => {
    User.findOne({username: data.username}, (err, foundUser: any) => {
        if (err) {return callback(err); }

        if (foundUser) {
            if (bcrypt.compareSync(data.password, foundUser.password)) {

                const token = jwt.sign(
                    {
                        _id: foundUser._id,
                        username: foundUser.username
                    },
                    "oruVrithiketaSecret"
                );

                callback(undefined, token);

            } else {
                callback("Invalid Credentials");
            }
        } else {
            callback("Invalid Credentials");
        }
    });
};

const findById = (id: string, callback: CallBackType) => {
    User.findById(id, callback);
};

export default {
    find,
    create,
    authenticate,
    findById,
};
