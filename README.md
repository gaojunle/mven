# mven
#### (mongod+vue+express+nodejs)
- 后台语言使用nodejs
- 采用express的服务器框架
- mongodb作为后台数据库
- 前端使用vue框架
#### 后端框架
1. 使用Express框架，启动方式使用supervisor，可以实现所监视目录内指定文件（默认.js)发生变化时，自动重启服务器，实现实时更新
比如修改一个路由接口文件时，可以实时刷新；
2. 后台数据库为mogodb，非关系型数据库
3. 前端使用vue框架，采用webpack打包，开发环境也启动一个express框架，实现热重载，可实时观察浏览器变化；使用代理可以访问同项目中后台接口

#### 使用说明
1. 进入src目录，运行：
```
    npm run dev
```
后台默认启动端口3000

2. 进入src/static目录，同样运行：
```
    npm run dev
```
前端exppress启动在8080端口，自动打开浏览器，点击提交，可以与后台接口进行数据交互；
