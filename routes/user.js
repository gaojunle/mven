var express = require('express');
var router = express.Router();
var db = global.config.db;

router.all('/api/user/:action', (req, res, next) => {
    console.log(req.session);
    next();
});

// 用户登录API
router.post('/api/user/login', (req, res) => {
    db.find('user', {
        "username": req.body.username,
        "password": req.body.password
    }, null, function (err, retData) {
        if (!err && retData.length > 0) {
            res.cookie('u_token', retData[0]._id, {httpOnly: false});
            req.session.u_token = retData[0]._id;
            res.send({errno: 0, errmsg: '登录成功'});
        } else {
            res.send({errno: 101, errmsg: '登录失败，用户名密码错误', data: {}});
        }
    })
});

// 用户注册API
router.post('/api/user/regist', (req, res) => {
    db.findOne('user', {mobile: req.body.mobile}, (err, data) => {
        console.log(req.session._cptcode, req.body.capcode)
        if (!err) {
            if (data) {
                res.send({errno: 102, errmsg: '该手机号已经注册'});
            } else {
                db.save('user', {
                    "user_id": Math.random().toString(36).substr(2) + '_' + req.body.mobile,
                    "username": req.body.username,
                    "password": req.body.password,
                    "mobile": req.body.mobile,
                    "create_time": new Date().getTime()
                }, (err, data) => {
                    if (!err) {
                        res.send({errno: 0, errmsg: '注册成功'});
                    }
                })
                return false;
                //TODO 验证码检验（包括图片+短信验证码），但由于vue开发原因，开发环境暂时无法从session中获取，因此暂时搁置，哪们大神知道如何解决，请赐教
                if (req.session._cptcode == req.body.capcode && req.session._smscode == req.body._smscode) {
                    //do regist or something
                } else {
                    res.send({errno: 104, errmsg: '验证码错误'});
                }
            }
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
    db.find('user', {}, null, (err, data) => {
        console.log(data);
        res.send(data);
    })
});

//发送短信
router.post('/api/user/regsmscode', (req, res) => {
    var SMS = require('../cpt/sms');

    var code = Math.random().toString(10).substr(2, 4);

    var ret = SMS.sendRegistSms({
        mobile: req.body.mobile,
        code: code,
        callback: function (data) {
            console.log(data);
            if (data.Code == 'OK') {
                req.session._smscode = code;
                res.cookie('_smscode', code, {httpOnly: false});
                res.send({errno: 0, errmsg: '短信发送成功'});
            } else {
                res.send({errno: 109, errmsg: '短信发送失败'});
            }
        }
    });
});

module.exports = router;