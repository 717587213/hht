import Vue from 'vue'
import Router from 'vue-router'
import Main from './main.js'
import index from '@/components/index'

Vue.use(Router)
let myRouter = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/index',
      component: index,
      children: Main
    },
    {
      path: '*',
      redirect: '/index'
    }
  ]
})
myRouter.beforeEach((to, from, next) => {
  let pathName = to.path.split('/')[1]
  // console.log(pathName)
  let getCookie = (name) => {
    let arrd = null
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (document.cookie.match(reg)) {
      arrd = document.cookie.match(reg)
      return unescape(arrd[2])
    } else {
      return null
    }
  }
  let isLogin = getCookie('token')
  // 未登录可以访问的页面
  let arr = ['index', 'cms', 'register', 'trade', 'help_center', 'forgetPassword', 'login', 'notice_info', 'otcIndex', 'otc_home', 'adsHall', 'otc_personal', 'contract', 'mining', 'BlockTrade']
  // 已登录不可以访问的页面
  let sarr = ['login', 'register']
  // 已经登陆过 要跳转login时
  if (sarr.indexOf(to.name) !== -1 && isLogin) {
    next('/')
    return false
  }
  if (!isLogin) {
    if (arr.indexOf(pathName) === -1) {
      // 如果是登录页面路径，就直接next()
      if (to.path === '/login') {
        next()
      } else { // 不然就跳转到登录；
        next('/login')
      }
    } else {
      next()
    }
    return false
  } else {
    next()
  }
})
export default myRouter
