const mongoose = require('mongoose');
const db = mongoose.createConnection("mongodb://localhost:27017/blogproject", {useNewUrlParser: true});
const Schema = mongoose.Schema;

// 运用原生promise
mongoose.Promise = global.Promise;

db.on("error", (err) => {
    console.log(err);
});
db.on("open", () => {
    console.log("blogporject数据库连接成功");
});

// 导出 db 与 Schema
module.exports = {
    db,
    Schema
};















