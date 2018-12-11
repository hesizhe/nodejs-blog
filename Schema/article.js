const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: "users"
    },
    commentNum: Number,
    tips: String
},{
    versionKey: false,
    timestamps: {createdAt: "created"}
});

// 设置 article 的 remove钩子
ArticleSchema.post("remove", (doc) => {
    const Comment = require('../Models/comment');
    const User = require('../Models/user');
    const {author, _id: artId} = doc;

    User.findByIdAndUpdate(author,　{$inc: {atricleNum: -1}}).exec();
    Comment.find({article: artId})
        .then(data => {
            data.forEach(v => v.remove());
        });
});

module.exports = ArticleSchema;















