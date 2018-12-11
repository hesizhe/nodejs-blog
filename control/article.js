const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')

// 控制返回文章发表页面
exports.addPage = async (ctx) => {
    await ctx.render("add-article", {
        title: "文章发表",
        session: ctx.session
    });
};

// 控制文章发表提交
exports.addSubmit = async  (ctx) => {
    // 判断用户是否登录
    if(ctx.session.isNew) {// true 表示用户未登录
        return ctx.body = {
            msg: "用户未登录",
            status: 0
        }
    }

    // 用户登录 post 发送数据到数据库
    const data = ctx.request.body;

    // 添加文章作者
    data.author = ctx.session.uId;
    data.commentNum = 0;

    await new Promise((resolve, reject) => {
        const _article= new Article(data);

        // 保存文章
        _article.save((err, data) => {
            if(err) {return reject(err);}
            // 保存成功
            // 更新用户文章计数
            User.updateOne({_id: data.author}, {$inc: {articleNum: 1}}, err => {
                if(err)return console.log(err);
            })

            // 更新用户评论计数


            resolve(data);
        });
    })
    .then(data => {
        ctx.body = {
            status: 1
        }
    })
    .catch(err => {
        console.log(err);
        ctx.body = {
            msg: "请重新发送",
            status: 0
        }
    });
}

// 获取所有文章列表 并返回首页
exports.getList = async (ctx) => {
    // 查询文章(作者 头像)
    let page = ctx.params.id || 1;

    const maxNum = await Article.estimatedDocumentCount((err, num) => err? console.log(err) : num)
    const artList = await Article
        .find()
        .sort("-created")
        .skip(2 * (page-1))
        .limit(2)
        .populate({
            path: "author",
            select: "username _id avatar"
        })
        .then(data => data)
        .catch(err => console.log(err));

    await ctx.render('index', {
        title: "博客实战主页",
        session: ctx.session,
        artList,
        maxNum
    });
}

// 文章详情
exports.details = async (ctx) => {
    // 获取动态路由
    const _id = ctx.params.id

    // 查询文章数据
    const article = await Article
        .findById(_id)
        .populate("author", "username")
        .then(data => data);

    // 查询当前文章所关联的评论数据
    const comment = await Comment
        .find({article: _id})
        .sort("-created")
        .populate("form", "username avatar")
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('article', {
        title: article.title,
        session: ctx.session,
        article,
        comment,
    })
}

// 获取用户文章列表
exports.articleList = async  (ctx) => {
    const uId = ctx.session.uId;
    const data = await Article.find({author: uId});

    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

// 删除用户文章
exports.del = async (ctx) => {
    const artId = ctx.params.id;
    let res = {
        state: 1,
        message: "删除成功"
    }

    await Article.findById(artId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: "删除失败"
            }
        });

    ctx.body = res

    /*
    let flag = true;

    // 删除文章
    await Article.deleteOne({_id: articleId}, (err) => {
        if(err) flag = false
    });

    // 删除文章对应的所有评论
    await Comment.deleteMany({article: articleId}, (err) => {
        if(err) flag = false;

    });

    if(flag) {
            ctx.body = {
                state: 1,
                message: "删除成功"
            }
        }
    */
}









