import 'babel-polyfill'
import './assets/css/reset.styl'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import {
  i18n
} from '@/locale'
import store from '@/store'
import router from './router'
import axios from '@/apis/http/axios.js'
import commonHttp from '@/apis/http/commonHttp'
import _P from '@/assets/js/public'
import _COOKIE from '@/assets/js/cookie'
import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(_P)
Vue.use(_COOKIE)
Vue.use(HappyScroll)
Vue.prototype.axios = axios
Vue.prototype.commonHttp = commonHttp
Vue.use(VCalendar, {
  firstDayOfWeek: 2,  // Monday
  locale: 'en-GB'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: {
    App
  }
})
