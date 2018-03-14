import User from "../schemas/User";

const create = (data: typeof User, callback: CallBackType) => {
    const newUser = new User(data);
    newUser.save(callback);
};

const findOne = (data: typeof User, callback: CallBackType) => {
    User.findOne(data, callback);
};

const findById = (id: string, callback: CallBackType) => {
    User.findById(id, callback);
};

export default {
    create,
    findOne,
    findById,
};
