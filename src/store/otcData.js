
import axios from '@/apis/http/axios.js'

let PARAMETER = 'PARAMETER' // 初始化参数
let RATES = 'RATES' // 获取费率信息
let ORDERDATA = 'ORDERDATA' // 获取费率信息
let ADID = 'ADID' // 广告ID
let UCID = 'UCID' // 用户中心ID
let ORDERNUMER = 'ORDERNUMER'
let EDITPAYMENTDATA = 'EDITPAYMENTDATA' // 需要编辑的支付方式的数据
export default {
  state: {
    parameter: {
      r: null,
      s: null
    },
    rates: {
      r: null,
      s: null
    },
    adsID: {
      r: null,
      s: null
    },
    userCenterID: {
      r: null,
      s: null
    },
    orderNumber: {
      r: null,
      s: null
    },
    isData: false,
    paycoins: null,
    payments: null,
    otcChatWS: null,
    defaultCoin: null, // 默认币种
    defaultSeach: null,
    orderData: {}, // 订单详情数据
    otcDefaultPaycoin: null, // 默认使用的法币
    editpaymentData: null // 需要编辑的支付方式的数据
  },
  mutations: {
    [PARAMETER] (state, result) {
      state.parameter = {
        r: result,
        s: new Date().getTime()
      }
    },
    [RATES] (state, result) {
      state.rates = {
        r: result,
        s: new Date().getTime()
      }
    },
    // 订单详情数据
    [ORDERDATA] (state, data) {
      state.orderData = data
    },
    [ADID] (state, result) {
      state.adsID = {
        r: result,
        s: new Date().getTime()
      }
    },
    [UCID] (state, result) {
      state.userCenterID = {
        r: result,
        s: new Date().getTime()
      }
    },
    [ORDERNUMER] (state, result) {
      state.orderNumber = {
        r: result,
        s: new Date().getTime()
      }
    },
    [EDITPAYMENTDATA] (state, result) {
      state.editpaymentData = result
    },
    OTCPUBLICINFO (state, data) {
      !localStorage.getItem('otc_currency') && localStorage.setItem('otc_currency', data.defaultCoin)
      state.isData = true
      state.payments = data.payments
      state.paycoins = data.paycoins
      state.defaultCoin = data.defaultCoin
      state.defaultSeach = data.defaultSeach
      state.otcChatWS = data.otcChatWS
      state.otcDefaultPaycoin = data.otcDefaultPaycoin
    }
  },
  actions: {
    otcPublic_info ({ commit }) {
      axios({
        url: this.state.otcUrl.common.public_info,
        method: 'post',
        hostType: 'otc'
      }).then((data) => {
        commit('OTCPUBLICINFO', data.data)
      })
    }
  }
}
