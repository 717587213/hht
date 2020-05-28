import axios from '@/apis/http/axios.js'
export default {
  state: {
    isReady: false,
    _symbols: {},
    _rate: null,
    _ws: null, // ws路径
    _nowMarket: null, // 默认市场
    _nowSymbol: 'btc/usdt',  // 默认币对
    _nowMarketData: null, // 当前币对的ws数据
    _co_ID: null, // 合约id
    _co_time: '--', // 当前合约交割时间
    _co_leverageLevel: '--', // 合约杠杆倍数
    _co_doBalance: '--', // 可用保证金
    _co_canOrder: '--', // 可开
    _co_haveOrder: [], // 当前持有仓位
    _co_nowOrder: [], // 当前委托
    riskRate: 0, // 风险率
    _co_status: 0, // 当前合约状态
    _co_currentOrderData: {}, // 当前币对的数据对象
    _co_getOrderDataFunction: null, // 请求订单列表的方法
    _co_getInitDataFunction: null, // 请求初始化订单的方法
    _co_pricePrecision: 4, // 当前合约的价格精度计算值
    _coinList: null,
    // 合约WebSocket
    coWebSocket: {
      r: null,
      s: null
    }
  },
  actions: {
    setCoPublicData ({commit}, data) {
      commit('SET_CO_PUBLICDATA', data)
    },
    // 获取可用保证金 和 可用btc 用于交易页面
    get_init_take_order ({commit, state}) {
      axios({
        url: 'init_take_order',
        hostType: 'co',
        params: { contractId: state._co_ID } // 例如 btcusdt
      }).then((e) => {
        if (e.code === '0') { commit('GETINITTAKEORDER', e) }
      })
    }
  },
  mutations: {
    // 获取可用保证金 和 可用btc 用于交易页面
    GETINITTAKEORDER (state, e) {
      if (e.data.doBalance < 0) { e.data.doBalance = 0 }
      if (e.data.canOrder < 0) { e.data.canOrder = 0 }
      state._co_doBalance = e.data.doBalance // 可用保证金
      state._co_canOrder = e.data.canOrder // 可开
    },
    // public Info 数据
    SET_CO_PUBLICDATA (state, data) {
      state.isReady = true
      state._ws = data.wsUrl
      state._rate = data.rate
      state._coinList = data.coinList
      // 所有开启的币对数据
      state._symbols = data.market
      // 1 localStorage中存在  2 有此币对 (此时默认市场为上次选择币对的市场)
      if (localStorage.coNowSymbol && state._symbols[localStorage.coNowSymbol]) {
        state._nowSymbol = localStorage.coNowSymbol
      } else {
      // 此时默认市场为后端传入 币对为当前市场第一个值
        let obj = state._symbols[data.marketSymbol]
        state._nowSymbol = obj.symbol
        localStorage.coNowSymbol = obj.symbol
      }
    },
    // 更新当前市场、
    SET_NOWMARKET (state, data) {
      state._nowMarket = data
      localStorage.coNowMarket = data
    },
    // 更新当前市场
    SET_NOWSYMBOL (state, data) {
      state._nowSymbol = data
      localStorage.coNowSymbol = data
    },
    // 当前合约的WS数据
    CO_CURRRENT_SYMOBOL_DATA (state, data) {
      state.currentSymbolData = data
    },
    // 创建的 websocket
    CO_WEB_SOCKET (state, result) {
      state.coWebSocket = {
        r: result,
        s: new Date().getTime()
      }
    },
    // 当前合约的订单的数据
    CO_CURRENT_TODER_DATA (state, data) {
      state._co_currentOrderData = data
    },
    CO_GETORDERDATA_FUNCTION (state, data) {
      state._co_getOrderDataFunction = data
    },
    CO_GETINITDATA_FUNCTION (state, data) {
      state._co_getInitDataFunction = data
    },
    // 当前合约的精度计算值
    CO_PRICE_PRECISION (state, data) {
      state._co_pricePrecision = data
    }
  }
}
