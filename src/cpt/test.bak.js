var http = require('http');
var querystring = require('querystring');

var data = querystring.stringify({
    TimeStamp: '2016-02-23T12:46:24Z',
    Format: 'JSON',
    AccessKeyId: 'testid',
    Action: 'DescribeRegions',
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: '3ee8c1b8-83d3-44af-a94f-4e0ad82fd6cf',
    Version: '2014-05-26',
    SignatureVersion: '1.0',
});

var options = {
    hostname: 'ecs.aliyuncs.com',
    port: 80,
    path: '',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
};
var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        //var returnData = JSON.parse(chunk);//如果服务器传来的是json字符串，可以将字符串转换成json
        console.log(chunk);
    });
});
//如果有错误会输出错误
req.on('error', function (e) {
    console.log('错误：' + e.message);
});
req.write(data);
//req.end();