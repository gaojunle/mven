# expressvue
### 将开发流程配置文件加上注释说明，学习与开解脚手架的框架及搭建
> 学习webpack vue脚手架的配置信息；
1. node基础环境，基于node运行express Web服务，加入路由、代理、hotmiddle等中间件实现热重载
等功能，
2. 使用npm来管理安装包
3. webpack打包vue组件
4. vue前端框架

> dev及build流程
1. npm run dev 这是npm的执行脚本，在package.json查找scripts配置dev，执行其对应命令
2. dev.server.js 对应express一些配置选项，主要包括：
webpack实例(compiler)、自动打开浏览器(opn)、服务器代理(poxyMiddleware)、热重载模块、静态文件处理、服务器启动与监听
3. webpack.dev.conf.js webpack的开发配置文件
4. webpack.base.conf.js webpack的基础配置文件，在开发与生产环境都有使用到；
5. vue-loader.conf.js vue的loader配置文件；
6. utils.js 工具文件，主要包括cssloaders配置项生成，文件路径处理等；
