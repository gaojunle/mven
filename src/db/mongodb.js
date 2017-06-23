/**
 * Created by gaojun-pd on 2017/6/22.
 */
var mongoose = require('mongoose');
var logger = require('pomelo-logger').getLogger('mongodb-log');

var options = {
    db_user: "",
    db_pwd: "",
    db_host: "localhost",
    db_port: 27017,
    db_name: "mydb"
};

//var dbURL = "mongodb://" + options.db_user + ":" + options.db_pwd + "@" + options.db_host + ":" + options.db_port + "/" + options.db_name;
var dbURL = 'mongodb://localhost/mydb';

mongoose.connect(dbURL);

mongoose.connection.on('connected', function (err) {
    if (err) {
        logger.error('Database connection failure')
    } else {
        logger.info('Database connection success')
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