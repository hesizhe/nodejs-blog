const Koa = require('koa');
const static = require('koa-static');
const router = require('./routers/router');
const views = require('koa-views');
const join = require('path').join;
const body = require('koa-body');
const session = require('koa-session');

const app = new Koa();

app.keys = ["这是签名"];
const CONFIG = {
    key: "Sid",
    maxAge: 36e5,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    rolling: true,
    renew: true
}
// 用户登录/注册 post
app.use(body());
app.use(session(CONFIG, app));
// 引入静态文件
app
    .use(static(join(__dirname, 'public')))
    .use(views(join(__dirname, 'views'), {extension: 'pug'}));

// 配置路由
app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => {
        console.log("项目启动成功,监听在3000端");
    });
















