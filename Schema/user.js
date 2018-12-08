const {Schema} = require('./config');

const UserSchema = new Schema({
    username: String,
    password: String, //写Number会出错
    sex: {
        type: String,
        default: "男"
    },
    avatar: {
        type: String,
        default: "/avatar/default.jpg"
    },
    role: {
        type: String,
        default: 0
    },
    articleNum: Number,
    commentNum: Number
}, {versionKey: false});

module.exports = UserSchema;
















