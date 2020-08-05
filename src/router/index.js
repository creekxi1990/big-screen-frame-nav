import Vue from 'vue'
import VueRouter from 'vue-router'
import _ from 'lodash'
import menu from '../../public/config/menuConfig'

Vue.use(VueRouter)

const comMenu = {
  refresh: () => import('../components/Refresh')
}

let tmpMenu = menu
let navMenu = []
tmpMenu.forEach((item, index, arr) => {
  _.forEach(comMenu, (v, k) => {
    if (k === item.name) {
      item.component = v
      navMenu.push(item)
    }
  })
})

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login/login')
  },
  {
    path: '/main',
    name: 'MainPage',
    component: () => import('../views/MainPage/MainPage'),
    children: navMenu
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
