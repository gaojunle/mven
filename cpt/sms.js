/**
 *
 * 阿里云短信发送接口 nodejs 版本
 * 阿里云短信API官方文档: https://help.aliyun.com/document_detail/44364.html?spm=5176.8195934.507901.11.pLzahV
 * git地址：github: https://github.com/freecto
 * 参考：https://github.com/freecto/aliyun-nodejs-sdk-smsV1
 *
 */

var request = require('request');
var crypto = require('crypto');

var AliyunSmsUtil = {
    config: {
        AccessKeyId: 'LTAI1GKMtI70AWNk',
        AccessKeySecret: "***",         //阿里短信服务所用的密钥值
        Format: 'JSON',
        SignatureMethod: 'HMAC-SHA1',
        SignatureVersion: '1.0',
        SignatureNonce: "" + Math.random(),
        Timestamp: new Date().toISOString(),
        Action: 'SendSms',
        Version: '2017-05-25',
        RegionId: 'cn-hangzhou'
    },

    /**
     * 阿里云短信发送接口
     * @param data  发送短信的参数，请查看阿里云短信模板中的变量做一下调整，格式如：{code:"1234", phone:"13062706593"}
     * @param callback 发送短信后的回调函数
     */
    _sendMessage: function (data, callback) {
        var param = Object.assign(data, this.config);
        delete param.AccessKeySecret
        param.Signature = this._signParameters(param, this.config.AccessKeySecret);
        //console.log(param)
        request.post({
            url: 'http://dysmsapi.aliyuncs.com/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: param
        }, function (err, response, data) {
            if (callback) {
                callback(err, response, data);
            }
        });
    },

    /**
     * 短信接口签名算法函数
     * @param param 发送短信的参数
     * @param AccessKeySecret 阿里短信服务所用的密钥值
     */
    _signParameters: function (param, AccessKeySecret) {
        var param2 = {},
            data = [];

        var oa = Object.keys(param).sort();

        for (var i = 0; i < oa.length; i++) {
            var key = oa[i];
            param2[key] = param[key];
        }

        for (var key in param2) {
            data.push(encodeURIComponent(key) + '=' + encodeURIComponent(param2[key]));
        }

        data = data.join('&');
        var StringToSign = 'POST' + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(data);
        AccessKeySecret = AccessKeySecret + '&';
        return crypto.createHmac('sha1', AccessKeySecret).update(new Buffer(StringToSign, 'utf-8')).digest('base64');
    },

    //发送注册短信[业务级]
    sendRegistSms: function (opt) {
        var data = {
            PhoneNumbers: opt.mobile || '13716732040',
            SignName: '积赏科技',
            TemplateCode: 'SMS_72855005',
            TemplateParam: "{\"name\":\"用户A\",\"text\":\"3421\",\"time\":\"30\"}",
            OutId: '1234'//可选
        };
        this._sendMessage(data, function (err, response, data) {
            if (opt.callback) {
                opt.callback(JSON.parse(data));
            }
            console.log(err, JSON.parse(data));
        })
    },
    //发送用户修改密码短信[业务级]
    sendChangePwdSms: function () {

    },
};

module.exports = AliyunSmsUtil;