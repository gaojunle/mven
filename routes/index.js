var express = require('express');
var router = express.Router();
var db = global.config.db;

var session = require('express-session');
var cookieParser = require('cookie-parser');
router.use(cookieParser());
var MongoStore = require('connect-mongo')(session);

router.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 80000},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({   //创建新的mongodb数据库
        host: 'mongodb://localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
        port: 27017,          //数据库的端口号
        db: 'mydb',            //数据库的名称。
        url: 'mongodb://localhost:27017/mydb'
    })
}));

/* GET home page. */
router.get('/', function (req, res, next) {
    req.session.lastPage = '/index';
    res.render('index', {title: req.session.cookie.maxAge});
});

// 创建账号接口
router.post('/api/user/login', (req, res) => {
    var uid = new Date().getTime()
    db.save('user_stats_data', {
        "user_id": uid,
        "username": req.body.username,
        "password": req.body.password,
        "create_time": uid
    }, (data) => {
        console.log(data);
        res.send({helo: 1232});
    })
});

// 获取已有账号接口
router.get('/api/user', (req, res) => {
    /*console.log(req.body);  //针对post请求
     console.log(req.headers);//所有请求
     console.log(req.url);   //所有请求
     console.log(req.query);*/
    var uid = new Date().getTime()
    db.find('user_stats_data', {}, null, (err, data) => {
        console.log(data);
        res.send(data);
    })
});

//发送短信
router.post('/api/smscode', (req, res) => {
    var SMS = require('../cpt/sms');
    SMS.sendRegistSms();
});
module.exports = router;