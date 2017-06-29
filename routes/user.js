var express = require('express');
var router = express.Router();
var db = global.config.db;

/*router.all('/api/user/:action', (req, res, next) => {
    db.find('user_stats_data', {_id: req.session.u_token}, null, (err, retData) => {
        if(!err && retData.length > 0){
            next();
        }else{
            res.send({errno: 100, errmsg: '用户未登录'});
        }
    })
});*/

// 用户登录API
router.post('/api/user/login', (req, res) => {
    db.find('user_stats_data', {
        "username": req.body.username,
        "password": req.body.password
    }, null, function (err, retData) {
        if (!err && retData.length > 0) {
            res.cookie('u_token', retData[0]._id, {httpOnly: false});
            req.session.u_token = retData[0]._id
            res.send({errno: 0, errmsg: '登录成功', data: {u_token: retData[0]._id}});
        } else {
            res.send({errno: 101, errmsg: '登录失败，用户名密码错误', data: {}});
        }
    })
});

// 用户注册API
router.post('/api/user/regist', (req, res) => {
    var uid = new Date().getTime()

    db.save('user_stats_data', {
        "username": req.body.username,
        "password": req.body.password,
        "create_time": uid
    }, (data) => {
        if (!err) {
            req.session.u_token = retData[0]._id;
            res.send({errno: 0, errmsg: '登录成功', data: {u_token: retData[0]._id}});
        }
    })
});

// 用户退出API
router.post('/api/user/logout', (req, res) => {
    req.session.u_token = null;
    res.send({errno: 0, errmsg: '退出成功', data: {}});
});

// 用户列表API
router.get('/api/user/list', (req, res) => {
    /*console.log(req.body);  //针对post请求
     console.log(req.headers);//所有请求
     console.log(req.url);   //所有请求
     console.log(req.query); //get或post的参数*/
    var uid = new Date().getTime()
    db.find('user_stats_data', {}, null, (err, data) => {
        console.log(data);
        res.send(data);
    })
});

//发送短信
router.post('/api/user/regsmscode', (req, res) => {
    var SMS = require('../cpt/sms');
    SMS.sendRegistSms();
});

module.exports = router;