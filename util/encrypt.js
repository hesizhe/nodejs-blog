const crypto = require('crypto');

// 加密对象 ----->返回结果
module.exports = function(password, key = "myflog") {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(password);
    const  passwordHmac = hmac.digest("hex");
    return passwordHmac;
}

















