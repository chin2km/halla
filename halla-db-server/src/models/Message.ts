import Message from "../schemas/Message";

const create = (data: typeof Message, callback: CallBackType) => {
    const newUser = new Message(data);
    newUser.save(callback);
};

const find = (data: any, callback: CallBackType) => {
    Message.find({chatKey: {$in: [
        `${data.sender}:${data.recipient}`,
        `${data.recipient}:${data.sender}`
    ]}}, callback);
};

export default {
    find,
    create
};
