# mven(mongodb+vue+express+nodejs)全栈脚手架项目

> nodejs作为后台开发语言已经越来越流行，一些大公司的新型项目和创业开公司已经在逐渐使用，比如网站后台、插件、工具等。vvue是一套构建用户界面的渐进式框架，易上手，即可各页面使用，也可做单页面应用。

本项目意在搭建一套前后台全js系的web应用框架，达到效果有以下几点：
1. web应用后台基本功能，包含：数据库、日志系统、路由管理、session管理、模板引擎、发送短信、图片验证码等
2. web后台文件变化（如路由业务代码修改）系统自动更新功能
3. web前端结合vue框架实现自动刷新及热重载
4. web前端单页面应用与后台结合，解决用户认证等问题

## 1、框架说明
- nodejs后台语言
- express服务器web框架
- mongodb后台数据库
- vue前端框架

## 2、使用说明
1. 进入src目录，运行：
```
    npm run dev
```
后台默认启动端口3000

2. 进入src/static目录，同样运行：
```
    npm run dev
```
### 后台框架说明
1. web应用Express框架，使用supervisor启动，可以实现所监视目录内指定文件（默认.js，可配置其它 文件)发生变化时，自动重启服务器，实时更新
> - npm install supervisor --save 
> - /package.json文件的scripts值，添加 "dev": "supervisor ./bin/www" 
> - 配置"build" 添加生产环境变量production,可通过process.env.NODE_ENV来得到值，进而控制对应操作(例如：/cpt/db/conn-mongodb.js根据不同环境变量值，选择连接数据库参数)；
> - 控制台通过npm run dev来启动，实时更新js文件（注意：新添加js文件不会自动识别，需要重启）

2. 数据库配置

    数据库选择mongodb，一个基于分布式文件存储的noSql数据库，存储类似json的bson格式，查询速度非常快
> - mongodb安装，直接[官网下载](https://www.mongodb.com/)，默认安装目录下data目录为数据存放目录，比如安装在C盘，则期数据存放目录默认为c:/data，启动时也要在对应目录启动，或指定数据存放目录；
> - mongodb与关系型数据库是一定区别，[查看参考](http://www.runoob.com/mongodb/mongodb-databases-documents-collections.html)，另外mongodb不需要数据库创建collection只需要直接插入数据即可以创建；
> - 安装node版本的数据库驱动库mongoose, npm install mongoose --save，对应数据库操作可以参考[nodejs mongodb使用](http://www.runoob.com/nodejs/nodejs-mongodb.html)
> - 本项目封装了一下DB.js库，用来进行数据库操作，数据集都在table.json中保存，在DB.js中引入读取，save或find等操作时，指定table_name即可；
> - app.js中引入数据库链接，并且配置全局db对象，使用一个连接处理数据库操作，全局引用；

3. 日志系统

    采用pomelo-logger日志模块，它是基于log4js的封装，可将日志内容输出到控制台和日志文件中
> - npm install pomelo-logger --save
> - 配置日志输出到文件/logs/log4js.json，其中type:file即输出到文件，通过category来识别配置，而level是配置不同输出级别，[请参考博客](http://blog.csdn.net/youbl/article/details/32708609)
> - pomelo-logger文档中指出，修改log4js模块下log4js.json即可生效，但通过试验直接修改node_modules下log4js/log4js.json不生效，因此修改一下pomelo-logger中源码 

==特别注意：== node_modules/pomelo-logger/lib/logger.js
```
function getLogger(categoryName) {
    ...
    //注意修改该行
    log4js.configure('logs/log4js.json', { reloadSecs: 300 });
}
```
> - 示例：在/cpt/db/conn-mongodb.js中有对应日志使用；

4. 模板引擎
    
    使用hbs(handlebars)做为视图引擎，指定视图目录views，处理扩展名为html模板文件

> - npm install hbs --save 
> - 在app.js中配置，并指定模板引擎要读取的目录及文件后缀即可；
> - 本项目放在views目录，使用html作为后缀，方便IDE工具识别

5. session管理

    页面访问是基于http协议，而http是无状态协议，即请求完就结束，不会告诉服务器当前用户是谁，因此如何保持用户在同一站点页面间跳转，还能让服务器识别，这就是session（会话）作用，关于session的理解，[请查看](http://www.2cto.com/kf/201206/135471.html)
    
    本项目中使用express-session模块，可以自动保存session到数据，并与req请求对象结合，获取或设置session；
    
> - npm install express-session --save
> - 在/routes/index.js中有关于session管理的示例，基本就是引入模块及cookie-parser模块，然后挂载到router上；
> - 配置session存储到数据库，使用store属性，配置好数据库连接即可自动存储，超时后自动从数据库清除，无需要人为控制；其它配置说明，[请参考官网](https://github.com/expressjs/session)
> - 在用户登录后，保存session，并将其作为cookie设置到客户端，并允许document.cookie访问（默认httpOnly=true，无法访问，可防止xss攻击）；本项目中，基于vue单页面应用中，需要根据cookie值来判断用户是否登录，因此在登录接口中，对session进行httpOnly=false配置，参考：/routes/user.js中/api/user/login对应代码
```
   res.cookie('u_token', retData[0]._id, {httpOnly: false});
```

6. 路由管理

    路由（Routing）是由一个 URI（或者叫路径）和一个特定的 HTTP 方法（GET、POST等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。
    
    每一个路由都可以有一个或者多个处理器函数，当匹配到路由时，这个/些函数将被执行
    
    个人认为在express框架使用者（前端人来看），路由分为页面请求和接口请求（其实是一样的，只是res渲染输出内容不同而已）；
    
    本项目中针对上面页面请求和接口请求分别实现，
    1. 基于页面请求，使用后台模板引擎，制作了一个用户登录页面，登录后进入主页；未登录用户，访问主页直接跳转到登录页，其中就是用户验证问题；实现机制：用户访问页面路由，如需要验证用户，通过session管理，判断session的u_token是否存在数据库，如果有则访问，没有则跳到登录页
    参考：/views目录，/routes/index.js文件（判断用户session.u_token是否在数据库中存在，有则登录）
    2. 基于接口请求，使用vue单页面应用，前后端完成分离，通过接口实现各种交互，也是用户登录功能，未登录用户跳转到登录页。实现机制：vue使用vue-router在所有跳转前判断，该路由是否需要验证，如果需要则验证当前cookie是否包含对应u_token，如果有则跳转，没有则跳到登录页；不需要验证的路由，直接访问；
    参考：/routes/user.js文件
    
7. 短信模块

    现在web应用，经常使用短信验证用户登录或注册，因此短信模块也是必不可少，由于是个人网站，通过调研选择阿里短信服务功能；
    具体参考我的github上项目 [aliyun-sms-nodejs](https://github.com/gaojunle/aliyun-sms-nodejs)
    
8. 图片验证码
    
    图片验证码也是在用户登录注册等操作中必不可少的，主要是要与用户session关联要到一起，用户输入正确后与注册等接口到一起使用；

### 前端框架说明

前端使用vue框架，采用webpack打包，开发环境也会启动一个express框架，实现热重载，可实时观察浏览器变化；所有配置文件都有相关注释，入口是npm run dev 请查看/static/package.json中scripts配置，依次看配置文件说明；

使用代理可以访问同项目中后台接口，示例：/static/config/index.js中proxyTable配置，如果想让后台验证接口能够通过，则需要发送cookie来验证登录用户；

前端exppress默认启动在8080端口，自动打开浏览器

使用element-ui作为UI框架，它是美团大前端开发一套vue组件库，可以方便进行页面组装式开发，试用感觉还不错，基本组件如布局、表单、按钮、等都不错；

本项目中，基于vue的用户登录模块，点击提交，可以与后台接口进行数据交互；