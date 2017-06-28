/**
 * Created by gaojun-pd on 2017/6/22.
 */
var path = require('path');
var mongoose = require('mongoose');
var logger = require('pomelo-logger').getLogger('mongodb', '  ', process.pid);
var config = require('config');

//根据npm run dev/pro 开发与生产环境，加载对应的数据库链接配置，在config
var dbConfig = process.env.NODE_ENV == 'production' ? config.get('pro_db_conf') : config.get('dev_db_conf');
var dbURL = "mongodb://" + dbConfig.db_user + ":" + dbConfig.db_pwd + "@" + dbConfig.db_host + ":" + dbConfig.db_port + "/" + dbConfig.db_name;
mongoose.connect(dbURL);

process.env.LOGGER_LINE = true;

mongoose.connection.on('connected', function (err) {
    if (err) {
        logger.error('Database connection failure')
    } else {
        logger.info(' Database connection success')
    }
});

mongoose.connection.on('error', function (err) {
    logger.error('Mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function () {
    logger.error('Mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose