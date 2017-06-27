//加载版本检查，如果版本不符合，则退出进程；
require('./check-versions')()

//引入主配置config目录，默认引入index.js
var config = require('../config');

//配置当前node进程env的NODE_ENV参数为dev.env.NODE_ENV
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')          //自动打开浏览器模块
var path = require('path')        //node路径模块
var express = require('express')  //express模块，基于node的web服务器
var webpack = require('webpack')  //webpack模块，打包vue组件
var proxyMiddleware = require('http-proxy-middleware')  //服务器代理中间件

//webpack的相关配置，开发环境使用，webpack.dev.conf.js 文件
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic， express默认端口号
var port = process.env.PORT || config.dev.port

// automatically open browser, if not set will be false，  //自动开启浏览器
var autoOpenBrowser = !!config.dev.autoOpenBrowser

// Define HTTP proxies to your custom API backend，定义一些API接口调用的代理，详情查看http-proxy-middleware
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable  //配置的代理内容

var app = express() //初始化一个express服务器实例；
var compiler = webpack(webpackConfig)
//console.log(JSON.stringify(webpackConfig))

//webpack开发中间件，参数为webpack实例和配置项
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

//加载webpack热重载中间件模块并实例化，从request到response中间过程通过express的中间件来获得内容，与热替换结合即可让webpack与express结合到一起，实现热重载
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
})

// force page reload when html-webpack-plugin template changes
// 正常热重载不会更新模板文件，如html修改后不会发生变化，这里注册一个compilation插件，调用html-webpack-plugin-after-emit插件来实现html更新；
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

// proxy api requests， 加入代理配置到express服务器的proxyMiddleware中间件上，由本地代理去调用；
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API 处理h5的历史api调用，
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output 将webpack开发中间件引入，与express结合
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display 热重载与express结合
app.use(hotMiddleware)

// serve pure static assets 纯静态文件直接访问，使用express.static函数处理；
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port    //本地服务器启动地址，可以修改成域名形式，配置host对应127.0.0.1即可；

//延迟对象
var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

//启动浏览器应用成功后，释放延迟对象
console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

//启动web服务
var server = app.listen(port)

//导出项
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
