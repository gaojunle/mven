var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../db/DB');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: '首页'});
});

// 创建账号接口
router.post('/api/login/createAccount', (req, res) => {
    console.log(req.body);  //针对post请求
    console.log(req.headers);//所有请求
    console.log(req.url);   //所有请求
    console.log(req.query);
    console.log(db);
    db.getConnection('user_stats_data')
    res.send({helo: 1232});
    return;
    /************** 定义模式loginSchema **************/
    const loginSchema = mongoose.Schema({
        account: String,
        password: String
    });

    /************** 定义模型Model **************/
    const models = {
        Login: mongoose.model('Login', loginSchema)
    }
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    let newAccount = new models.Login({
        account: req.body.account,
        password: req.body.password
    });
    // 保存数据newAccount数据进mongoDB
    newAccount.save((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send('createAccount successed');
        }
    });
});

// 获取已有账号接口
router.get('/api/login/getAccount', (req, res) => {
    console.log(req.body);  //针对post请求
    console.log(req.headers);//所有请求
    console.log(req.url);   //所有请求
    console.log(req.query);
    res.send({helo: 1232});
    return;
    // 通过模型去查找数据库
    /*models.Login.find((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });*/
});

module.exports = router;