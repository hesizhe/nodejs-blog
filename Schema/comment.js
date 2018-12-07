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

module.exports = CommentSchema
















