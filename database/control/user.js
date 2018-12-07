const {db} = require('../Schema/config');
const UserSchema = require('../Schema/user');
const encrypt = require("../util/encrypt");

// 通过 db 对象创建并操作user文档集合的模型对象
const User = db.model("users", UserSchema);

// 控制用户注册
exports.reg = async (ctx) => {
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    //处理用户注册的情况(已注册)
    await new Promise((resolve, reject) => {
        User.find({username}, (err, data) => {
            if(err) {return reject(err);}

            if(data.length !== 0) {
                return resolve("");
            }
            // 用户名不存在可以注册
            const _user = new User({
               username,
               password: encrypt(password)
            });

            _user.save((err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data)
                }
            })
        })
    })
    .then(async data => {
        if(data) {
            // 注册成功
            await ctx.render("isOk", {
                status: "注册成功"
            });
        } else {
            // 用户已存在
            await ctx.render("isOk", {
                status: "用户名已存在"
            });
        }
    })
    .catch(async err => {
        console.log(err);
        await ctx.render("isOk", {
            status: "注册失败,请重试!"
        });
    });
}

// 控制用户登录
exports.login = async (ctx) => {
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    await new Promise((resolve, reject) => {
        User.find({username}, (err, data) => {
            if(err){return reject(err)};
            if(data.length !== 0){
                return resolve(data);
            }
            reject("登录失败: 用户名不存在");
        });
    })
    .then(async data => {
        if(encrypt(password) === data[0].password){
            // 设置cookies来控制 保持客户登录 状态
            ctx.cookies.set("username", username, {
                domain: "localhost",
                path: "/",
                maxAge: 36e5,
                httpOnly: true,
                overwrite: false,
                signed: false
            });
            ctx.cookies.set("uId", data[0]._id, {
                domain: "localhost",
                path: "/",
                maxAge: 36e5,
                httpOnly: true,
                overwrite: false,
                signed: false
            });
            ctx.session = {
                username,
                uId: data[0]._id,
                avatar: data[0].avatar
            }

            //登录成功
            await ctx.render("isOk", {
                status: "登录成功"
            })
        } else {
            //登录失败,密码不正确
            await ctx.render("isOk", {
                status: "登录失败: 密码不正确"
            })
        }
    })
    .catch(async err => {
        console.log(err);
        await ctx.render("isOk", {
            status: "登录失败: 用户名不存在"
        })
    });
}

// 保持用户的状态
exports.keeplog = async (ctx, next) => {
    if(ctx.session.isNew && ctx.cookies.get("username")){
        const uId = ctx.cookies.get("uId");
        const username = ctx.cookies.get("usename");
        ctx.session = {
            username,
            uId
        }
    }
    await next();
}

// 控制用户退出
exports.logout = async (ctx) => {
    ctx.session = null;
    ctx.cookies.set("username", null);
    ctx.cookies.set("uId", null);
    ctx.redirect("/");
}















