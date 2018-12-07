const {db} = require('../Schema/config');
const ArticleSchema = require('../Schema/article');
const Article = db.model("articles", ArticleSchema);

const UserSchema = require('../Schema/user');
const User = db.model("users", UserSchema);

const CommentSchema = require('../Schema/comment');
const Comment = db.model("comments", CommentSchema);



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

    await new Promise((resolve, reject) => {
        const _article= new Article(data);
        _article.save((err, data) => {
            if(err) {return reject(err);}

            resolve(data);
        });
    })
    .then(data => {
        ctx.body = {
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg: "请重新发送",
            status: 0
        }
    });
}

// 获取文章列表 并返回首页
exports.getList = async (ctx) => {
    // 查询文章(作者 头像)
    let page = ctx.params.id || 1;

    const  maxNum = await Article.estimatedDocumentCount((err, num) => err? console.log(err) : num)
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
    console.log(artList);

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
    console.log(article);

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












