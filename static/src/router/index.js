import Vue from 'vue'
import Router from 'vue-router'
import Mongo from '@/components/Mongo'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mongo',
      component: Mongo
    }
  ]
})
