var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//使用hbs做为视图引擎，指定视图目录views，处理扩展名为html模板文件
var hbs = require('hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  //全局接口数据urlencode
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));    //静态文件目录，可添加多个
app.use('/static', express.static(path.join(__dirname, 'static')));    //静态文件目录,这里使用vue的单页面应用；

//数据库
var config = require('config');
config.db = require('./cpt/db/DB')
global.config = config;

//路由
app.all('*', (req, res, next) => {
    console.log('we are handling cookies');
    next();
})
app.use(require('./routes/index'));
app.use(require('./routes/user'));

// catch 404 and forward to error handler。404处理
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler 错误处理
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
