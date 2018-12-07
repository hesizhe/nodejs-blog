const {db} = require('../Schema/config');

const ArticleSchema = require('../Schema/article');
const Article = db.model("articles", ArticleSchema);

// const UserSchema = require('../Schema/user');
// const User = db.model("users", UserSchema);

const CommentSchema = require('../Schema/comment');
const Comment = db.model("comments", CommentSchema);

exports.save = async (ctx) => {
    let message = {
        status: 0,
        msg: "用户未登录"
    }

    // 验证用户是否登录
    if(ctx.session.isNew)return ctx.body = message;

    //用户登录了
    const data = ctx.request.body;
    data.form = ctx.session.uId;

    const _comment = new Comment(data);
    await _comment
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: "评论成功"
            }
            // 更新评论 count


        })
        .catch(err => {
            message = {
                status: 0,
                msg: "用户未登录"
            }
        });

    ctx.body = message;
}












