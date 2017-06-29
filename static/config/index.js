// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

//返回一个对象，包含build及dev两个配置；
module.exports = {
  build: {
    env: require('./prod.env'), //build的环境变量值，env:{NODE_ENV: '"production"'}
    index: path.resolve(__dirname, '../dist/index.html'), //webpack打包对应的html文件
    assetsRoot: path.resolve(__dirname, '../dist'),       //打包文件根目录
    assetsSubDirectory: 'static',                         //静态文件目录
    assetsPublicPath: './',                               //打包资源请求路径头
    productionSourceMap: false,                           //是否生成map文件，默认是true
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,  //gzip压缩，默认不开启
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report //块分析报告，默认不开启
  },
  dev: {
    env: require('./dev.env'),  //引入dev时node环境变量
    port: 8080, //开启本地express使用默认端口，8080
    autoOpenBrowser: true,  //自动打开浏览器，默认true
    assetsSubDirectory: 'static', //静态资源目录，不会被打包
    assetsPublicPath: '/',        //当前项目根路径
    proxyTable: {
      '/api': {
        target: 'http://localhost:3000',
        cookieDomainRewrite: '*',
        headers: {
          Cookie: 'connect.sid=s%3AAwi1mGgzs1uQSYHgVzi2Sbt6xSe4kCc8.f60Q3NmG%2FBwWdvaPX6KA2m%2BLTVmkPyqAxLCFYBFfCSM',
          Referer: 'http://localhost:3000'
        },
        changeOrigin: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
