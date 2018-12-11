const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')

// 保存评论
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

            // 更新当前文章评论计数
            Article.updateOne({_id: data.article}, {$inc: {commentNum: 1}}, (err) => {
                if(err)return console.log(err);
            });

            // 更新用户评论计数
            User.updateOne({_id: data.form}, {$inc: {commentNum: 1}}, (err) => {
                if(err)return console.log(err);
            });

        })
        .catch(err => {
            console.log(err);
            message = {
                status: 0,
                msg: "用户未登录"
            }
        });

    ctx.body = message;
}

// 获取用户评论
exports.commentList = async (ctx) => {
    const uId = ctx.session.uId;

    const data = await Comment.find({form: uId}).populate("article", "title");

    ctx.body = {
        code: 0,
        count: data.length,
        // 根据layui 需命名为data
        data
    }
    // console.log(data);
}

// 删除评论
exports.del = async (ctx) => {
    const commentId = ctx.params.id;
    let res = {
        state: 1,
        message: "删除成功"
    }

    await Comment.findById(commentId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: "删除失败"
            }
        });

    ctx.body = res;

    /*
    const articleId = ctx.request.body.articleId;
    const uId = ctx.session.uId;
    let isOk = true;
    // console.log(ctx.request.body);

    // 删除评论
    await Comment.deleteOne({_id: commentId}, err => {
        if(err) isOk = false;
    });

    // 评论计数 -1
    await Article.updateOne({_id: articleId}, {$inc: {commentNum: -1}});
    await User.updateOne({_id: uId}, {$inc: {commentNum: -1}});

    if(isOk) {
        ctx.body = {
            state: 1,
            message: "删除成功"
        }
    }
    */
}








