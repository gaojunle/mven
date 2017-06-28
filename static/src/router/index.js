import Vue from 'vue'
import Router from 'vue-router'

import UserLogin from '@/components/UserLogin'
import UserRegist from '@/components/UserRegist'
import UserForgetPwd from '@/components/UserForgetPwd'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      meta: {requiresAuth: true}
    },
    {
      path: '/userLogin',
      name: 'userLogin',
      component: UserLogin
    },
    {
      path: '/userRegist',
      name: 'userRegist',
      component: UserRegist
    },
    {
      path: '/forgetpwd',
      name: 'forgetpwd',
      component: UserForgetPwd
    }
  ]
})
