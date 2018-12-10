const Router = require('koa-router');
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
const upload = require('../util/upload');

const router = new Router();

// 主页页面
router.get("/", user.keeplog, article.getList);

// 动态路由切换用户(登录/退出)界面
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    const path = ctx.path;
    // 变量show
    const show = /reg$/.test(path);
    // 动态title
    const title = show? "注册 -博客" : "登录 -博客";
    await ctx.render('register', {
        title,
        show
    });
});

// 登录 post
router.post('/user/login', user.login);

// 注册 post
router.post('/user/reg', user.reg);

// 退出 get
router.get('/user/logout', user.logout);

// 文章发表页面 get
router.get('/article', user.keeplog, article.addPage);

// 提交添加文章
router.post('/article', user.keeplog, article.addSubmit);

// 文章列表分页 路由
router.get('/page/:id', article.getList);

// 文章详情页
router.get('/article/:id', user.keeplog, article.details);

// 提交评论
router.post('/comment', user.keeplog, comment.save);

// 管理员admin路由
router.get('/admin/:id', user.keeplog, admin.index);

// 用户头像上传
router.post('/upload', user.keeplog, upload.single('file'), user.upload);

// 获取用户评论
router.get('/user/comments', user.keeplog, comment.commentList);

// 删除用户评论
router.post('/comment/:id', user.keeplog, comment.del);

// 获取用户文章
router.get('/user/articles', user.keeplog, article.articleList);

// 删除用户评论
router.post('/article/:id', user.keeplog, article.del);

// 以上都未匹配成功
router.get('*', async ctx => {
    // ctx.status = 404;
    await ctx.render("404");
});

module.exports = router;















