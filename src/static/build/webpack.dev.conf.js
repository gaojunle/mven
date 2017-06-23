var utils = require('./utils')      //引入utils.js，主要封装样式的loader配置
var webpack = require('webpack')    //webpack模块
var config = require('../config')   //项目主配置文件config/index.js；
var merge = require('webpack-merge')//webpack合并工具
var baseWebpackConfig = require('./webpack.base.conf')  //webpack基础配置文件
var HtmlWebpackPlugin = require('html-webpack-plugin')  //针对html的webpack插件
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')  //友好显示webpack打包错误的模块

// add hot-reload related code to entry chunks 遍历webpack的entry参数（输入文件配置列表），组合到一起，添加到热重载
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

module.exports = merge(baseWebpackConfig, {
  module: {
    //使用utils的样式loaders来处理
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development 配置该模式编译快
  devtool: '#cheap-module-eval-source-map',
  //所使用的webpack插件列表
  plugins: [
    //自定义webpack插件
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage webpack热重载,启动热替换功能；
    // webpack hot middleware 是給 webpack-dev-middleware 用的。就是讓我們在一般的 server 上加上熱替換的功能，總結來說就是 webpack-dev-middleware + webpack-hot-middleware 即可讓我們用 express 客製一個有熱替換功能的 webpack 開發伺服器。
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), //错误提示插件
    // https://github.com/ampedandwired/html-webpack-plugin html的webpack插件，配置内容注入
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
