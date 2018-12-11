const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
    // 用户登录(头像 用户名)
    // 文章
    // 内容
    content: String,
    // 关联用户集合(表)
    form : {
        type: ObjectId,
        ref: "users"
    },
    // 关联 articles 集合
    article: {
        type: ObjectId,
        ref: "articles"
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
});

// 设置 comment 的 remove钩子
CommentSchema.post("remove", (doc) => {
    const Article = require('../Models/article');
    const User = require('../Models/user');
    const {form, article} = doc;

    // 对应文章 评论计数 -1
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec();

    // 对应文章的用户 评论计数 -1
    User.updateOne({_id: form}, {$inc: {commentNum: -1}}).exec();
});

module.exports = CommentSchema;
















