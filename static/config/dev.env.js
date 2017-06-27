var merge = require('webpack-merge')  //webpack对象合并模块
var prodEnv = require('./prod.env')   //请求build时使用生产环境配置

//将开发NODE环境变量与生产环境配置合并，合并结果，开发。。development
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
