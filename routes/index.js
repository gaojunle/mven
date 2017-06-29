var express = require('express');
var router = express.Router();
var db = global.config.db;


//session管理
var session = require('express-session');
var cookieParser = require('cookie-parser');
router.use(cookieParser());
var MongoStore = require('connect-mongo')(session);
router.use(session({
    secret: 'qcmtp',
    cookie: {maxAge: 1000 * 60 * 60 * 24},  //设置maxAge是1天后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: false, maxAge: null},
    store: new MongoStore({   //创建新的mongodb数据库
        host: 'mongodb://localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
        port: 27017,          //数据库的端口号
        db: 'mydb',            //数据库的名称。
        url: 'mongodb://localhost:27017/mydb'
    })
}));

/* GET home page. */
router.get('/', function (req, res, next) {
    db.find('user_stats_data', {_id: req.session.u_token}, null, (err, retData) => {
        if(!err && retData.length > 0){
            res.render('index', {title: '首页'});
        }else{
            res.redirect('/login');
        }
    })
});
/* GET home page. */
router.get('/main', function (req, res, next) {
    db.find('user_stats_data', {_id: req.session.u_token}, null, (err, retData) => {
        if(!err && retData.length > 0){
            res.render('index', {title: '首页'});
        }else{
            res.redirect('/login');
        }
    })
});

/* GET 用户登录页*/
router.get('/login', function (req, res, next) {
    res.render('login', {title: '用户登录'});
});
module.exports = router;