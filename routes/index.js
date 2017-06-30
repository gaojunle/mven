var express = require('express');
var router = express.Router();
var db = global.config.db;

//session管理
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

router.use(session({
    secret: 'qcmtp',
    cookie: {maxAge: 1000 * 60 * 60 * 24},  //设置maxAge是1天后session和相应的cookie失效过期
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
    db.find('user', {_id: req.session.u_token}, null, (err, retData) => {
        if (!err && retData.length > 0) {
            res.render('index', {title: '首页'});
        } else {
            res.redirect('/login');
        }
    })
});

/* GET home page. */
router.get('/main', function (req, res, next) {
    db.find('user', {_id: req.session.u_token}, null, (err, retData) => {
        if (!err && retData.length > 0) {
            res.render('index', {title: '首页'});
        } else {
            res.redirect('/login');
        }
    })
});

/* GET 用户登录页*/
router.get('/login', function (req, res, next) {
    res.render('login', {title: '用户登录'});
});

//图片验证码
var captchapng = require('captchapng');
router.get('/captpng', function (req, res, next) {
    var width = !isNaN(parseInt(req.query.width)) ? parseInt(req.query.width) : 100;
    var height = !isNaN(parseInt(req.query.height)) ? parseInt(req.query.height) : 30;

    var code = Math.random().toString(10).substr(4, 4);//随机数，由于captchapng不支持字符，所以toString取10，从第四位截取，取4个数

    var p = new captchapng(width, height, code); // width,height,numeric captcha
    p.color(0, 80, 1, 22);  // First color: background (red, green, blue, alpha)
    p.color(100, 0, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    //设置验证码过期时间为60秒，保存到session中；在用户注册时可以从session中获取对比是否一致
    req.session.cookie.maxAge = 1000 * 60
    req.session._cptcode = code;
    res.end(imgbase64);
    /*
     var captchapng = require('../cpt/capcode/cptcode');
     var img = captchapng();
     res.setHeader('Content-Type', 'image/bmp');
     res.end(img.getFileData());*/
});

module.exports = router;