// 默认获取全站需要的数据

import axios from '@/apis/http/axios.js'
import router from '@/router/index.js'
import { changeLanguage } from '@/locale/index'
const MYMARKET = 'MYMARKET' // 自选的货币
// const ISLOGIN = 'ISLOGIN' // 是否登录
const LAN = 'LAN' // 语言

export default {
  state: {
    _data: null,
    default_code: null,
    isReady: false,
    _lan: null,
    _lanList: null,
    _user: null,
    _ws: null,
    _symbols: null,
    _topSymbol: null,
    _rate: null,
    _coinList: null,
    _maket_index: null,
    _theme: null,
    isLogin: false,
    nc_appkey: null,
    nc_prefix: null,
    otcOpen: null,
    isDepositOpen: null,
    exOpen: null,
    agentOpen: null,
    contractOpen: null,
    klineColor: null,
    _footer: null,
    logo: null,
    indexHeaderTitle: null,
    marketSort: null, // 市场排序
    _webSiteInfo: window.HOST_API,
    _siteType: window.siteType,
    invitationCode: null,
    invite_open: null,
    return_open: null,
    defaultTheme: 'theme_default',
    verificationType: '1',
    prompt: null,
    openApiUrl: null,
    footerTemplate: null,
    headerTemplate: null,
    activeDate: new Date().getTime()
  },
  actions: {
    // public_info
    getCommonPublic_info ({ commit }) {
      axios({
        url: this.state.url.common.punlic_info,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          commit('GETCOMMONPUBLICINFO', data.data)
        }
      })
    },
    // user_info
    getCommonUser_info ({ commit }) {
      axios({
        url: this.state.url.common.user_info,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          commit('GETCOMMONUSERINFO', data.data)
        } else {
          commit('GETCOMMONUSERINFONOTLOGIN', data)
        }
      })
    },
    getRate_info ({commit}, isfals) {
      clearInterval(this.thisInterval)
      if (!isfals) return false
      this.thisInterval = setInterval(() => {
        axios({
          url: this.state.url.common.rate,
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            commit('RATE', data.data)
          }
        })
      }, 30000)
    },
    getFooterHeander_info ({ commit }) {
      axios({
        url: this.state.url.common.footerAndHeader,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          commit('GETFOOTERHEADERINFO', data.data)
        }
      })
    }
  },
  mutations: {
    // public_info
    GETCOMMONPUBLICINFO (state, data) {
      // 设置 默认市场
      let markTitle = localStorage.getItem('markTitle')
      let homeMarkTitle = localStorage.getItem('homeMarkTitle')
      let marketIndex = data.maket_index
      // 默认市场
      if (!markTitle || !data.market[markTitle]) {
        let defaultMarket = data.market[marketIndex] ? marketIndex : Object.keys(data.market)[0]
        localStorage.setItem('markTitle', defaultMarket)
      }
      // 首页默认市场
      if (!homeMarkTitle || !data.market[homeMarkTitle]) {
        let defaultMarket = data.market[marketIndex] ? marketIndex : Object.keys(data.market)[0]
        localStorage.setItem('homeMarkTitle', defaultMarket)
      }

      // 设置默认币对
      let sSymbolName = localStorage.getItem('sSymbolName') || null
      let sMarkTitle = localStorage.getItem('markTitle')
      // 如果 localStorage 中没有默认币对  或者 市场列表中没有选中的币对
      if (!sSymbolName || !data.market[sMarkTitle][sSymbolName]) {
        let defaultSymbol = data.market[sMarkTitle][sSymbolName] ? sSymbolName : Object.keys(data.market[sMarkTitle])[0]
        localStorage.setItem('sSymbolName', defaultSymbol)
      }

      //  设置 默认语言
      if (!localStorage.getItem('lan') || !this._vm._COOKIE.getCookie('lan')) {
        changeLanguage(data.lan.defLan)
        localStorage.setItem('lan', data.lan.defLan)
        this._vm._COOKIE.setCookie('lan', data.lan.defLan)
      }
      state._data = data
      state.prompt = data.footer_warm_prompt
      state._maket_index = data.maket_index
      state.default_code = data.default_country_code
      state.isReady = true // 是否有public数据
      state._rate = data.rate // 货币汇率
      state._ws = data.wsUrl // ws路径
      state._topSymbol = data.headerSymbol // 首页推荐货币
      state._lan = localStorage.getItem('lan') // 语言
      state._lanList = data.lan.lanList // 语言列表
      state._coinList = data.coinList // 币种列表
      state.nc_appkey = data.nc_appkey // 阿里云滑动验证码参数
      state.nc_prefix = data.nc_prefix
      state.otcOpen = data.otcOpen // 场外开关
      state.isDepositOpen = data.is_deposit_open // 币宝开关
      state.exOpen = data.exOpen || '1' // 现货开关
      state.contractOpen = data.contractOpen // 合约开关
      state.klineColor = data.klineColor // K线图色值
      state.logo = data.logoUrl
      state.indexHeaderTitle = data.indexHeaderTitle // 页面Title
      state.marketSort = data.marketSort // 市场排序
      state.agentOpen = data.agentUserOpen // 经济人开关
      state.invitationCode = data.is_invitationCode_required // 邀请码开关
      state.invite_open = data.is_invite_open
      state.return_open = data.is_return_open
      state.verificationType = data.verificationType || '1' // 滑动验证码类型
      state.openApiUrl = data.open_api_url // API 文档接口地址
      state._footer = {
        name: data.company_name,
        email: data.contact_email,
        number: data.contact_number
      }
      state._symbols === null && (state._symbols = {})
      for (let item in data.market) {
        state._symbols[item] = data.market[item]
      }
      // 设置 标题栏的 icon 图标
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = data.iconUrl
      document.getElementsByTagName('head')[0].appendChild(link)
      // 如果有自定义配置footer 或者有 自定义header  去请求数据
      if (data.config_footer_open === '1' || data.config_header_open === '1') {
        this.dispatch('getFooterHeander_info')
      }
      // 动态添加 js 比如 客服  和 统计的js
      var newScript = document.createElement('script')
      newScript.type = 'text/javascript'
      newScript.innerHTML = data.config_footer_js
      document.getElementsByTagName('head')[0].appendChild(newScript)
    },
    // user_info
    GETCOMMONUSERINFO (state, data) {
      state.isLogin = true
      state._user = data // user默认数据
      // 设置自选数据
      localStorage.setItem('myMarket', data.myMarket)
      state._symbols === null && (state._symbols = {})
      state._symbols.myMarket = {}
      if (data.myMarket.length > 0) {
        for (var i = 0; i < data.myMarket.length; i++) {
          let tempSymbol = data.myMarket[i].split('/')
          state._symbols['myMarket'][data.myMarket[i]] = {
            'name': data.myMarket[i],
            'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
          }
        }
      }
    },
    // 未登录状态 从 localStorage 中获取自选货币
    GETCOMMONUSERINFONOTLOGIN (state, data) {
      let myMarket = localStorage.getItem('myMarket')
      if (!myMarket || myMarket === '[]') return false
      myMarket = myMarket.split(',')
      if (!state._symbols) {
        state._symbols = {}
      }
      state._symbols['myMarket'] = {}
      if (myMarket && myMarket.length > 0) {
        for (var i = 0; i < myMarket.length; i++) {
          let tempSymbol = myMarket[i].split('/')
          state._symbols['myMarket'][myMarket[i]] = {
            'name': myMarket[i],
            'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
          }
        }
      }
    },
    [MYMARKET] (state, data) {
      state._symbols.myMarket = data
    },
    // 退出登录
    ISLOGIN (state, data) {
      state.isLogin = data
      if (!data) {
        localStorage.removeItem('token')
        this._vm._COOKIE.removeCookie('token')
        let pathName = location.pathname.split('/')[1]
        // 未登录可以访问的页面
        let arr = ['index', 'cms', 'register', 'trade', 'help_center', 'forgetPassword', 'login', 'notice_info', 'otcIndex', 'otc_home', 'adsHall', 'otc_personal', 'contract', 'mining', 'BlockTrade']
        if (arr.indexOf(pathName) === -1 && pathName !== '') {
          router.push('/')
        }
      }
    },
    THEME (state, data) {
      state._theme = data
    },
    GETFOOTERHEADERINFO (state, data) {
      state.footerTemplate = data.footer
      state.headerTemplate = data.header
    },
    [LAN] (state, data) {
      state._lan = data
    },
    RATE: (state, data) => {
      state._rate = data.rate // 货币汇率
    },
    ACTIVEDATA (state, data) {
      state.activeDate = data
    }
  }
}
