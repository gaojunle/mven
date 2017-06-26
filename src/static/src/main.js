// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入vue-resource
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.interceptors.push((request, next) => {
  // 请求发送前的处理逻辑
  if (request.method === 'GET') { //统一增加时间戳,解决ie11 304问题。
    request.params._t = new Date().getTime();
  }
  next((response) => {
    if (response.status === 0) {
      console && console.error('网络异常,请稍后再试!');
    } else {
      if (response.status >= 400) {
        console && console.error(response);
        return false;
      }
      // 请求发送后的处理逻辑
      // 根据请求的状态，response参数会返回给successCallback或errorCallback
      // console.log(response.body);
      const data = response.body;
    }
  });
});

//引入vue视图框架 element-ui
import '@/assets/reset.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI);

Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
