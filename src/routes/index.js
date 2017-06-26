var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../db/DB');

var SMS = require('alidayu-node');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: '首页'});
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

router.post('/api/smscode', (req, res) => {
    var SMS = require('aliyun-sms-node');

    var sms = new SMS({
        AccessKeyId: 'LTAI1GKMtI70AWNk',
        AccessKeySecret: '6ekjP36h44MLqTzfxF1ZXh8dy7wlPB'
    });

    sms.send({
        Action: 'SingleSendSms',
        Format: 'JSON',
        ParamString: JSON.stringify({name: 'test', text: 1233, time: '15分钟'}),
        RecNum: '13716732040',
        SignName: '积赏科技',
        TemplateCode: 'SMS_72855005',
    }, function () {
        console.log(123233)
        res.send({msg: 1233})
    }) //返回Promise

});
module.exports = router;