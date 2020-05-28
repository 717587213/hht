
let TRADE_PRICE = 'TRADE_PRICE' // 买入 卖出 价格
let TRADE_NUMBER = 'TRADE_NUMBER' // 买入 卖出 数量
let SYMBOL_NAME = 'SYMBOL_NAME' // 当前货币对大小写名称 计价货币 和 单位货币
let FIX_VALUE = 'FIX_VALUE' // 精度计算
let MARET_CURRENT_OBJ = 'MARET_CURRENT_OBJ' // 当前市场下的所有货币对对象数据
let TRADE_SUCCESS = 'TRADE_SUCCESS' // 下单成功
let MY_WEB_SOCKET = 'MY_WEB_SOCKET' // webSocket
let DEPTH_CHART_DATA = 'DEPTH_CHART_DATA' // 深度图表数据
let KLINE_CHART_DATA = 'KLINE_CHART_DATA' // K线图数据
let ACCOUNT_BALANCE = 'ACCOUNT_BALANCE'
let DEPTH_VALUE = 'DEPTH_VALUE'
let DEPTH_LIST = 'DEPTH_LIST' // 深度数据depthList
let TRADE_LIST_DATA = 'TRADE_LIST_DATA' // 最新成交数据

export default {
  state: {
    tradePrice: {
      r: null,
      s: null
    },
    tradeNumber: {
      r: null,
      s: null
    },
    symbolName: {
      r: null,
      s: null
    },
    fixValue: {
      r: null,
      s: null
    },
    marketCurrentObj: {
      r: null,
      s: null
    },
    tradeSuccess: {
      r: null,
      s: null
    },
    myWebSocket: {
      r: null,
      s: null
    },
    depthChartData: {
      r: null,
      s: null
    },
    klineChartData: {
      r: null,
      s: null
    },
    accountBalance: {
      r: null,
      s: null
    },
    depthValue: {
      r: null,
      s: null
    },
    depthList: {
      r: null,
      s: null
    },
    tradeListData: {
      r: null,
      s: null
    }
  },
  mutations: {
    [TRADE_PRICE] (state, result) {
      state.tradePrice = {
        r: result,
        s: new Date().getTime()
      }
    },
    [TRADE_NUMBER] (state, result) {
      state.tradeNumber = {
        r: result,
        s: new Date().getTime()
      }
    },
    [SYMBOL_NAME] (state, result) {
      state.symbolName = {
        r: result,
        s: new Date().getTime()
      }
    },
    [FIX_VALUE] (state, result) {
      state.fixValue = {
        r: result,
        s: new Date().getTime()
      }
    },
    [MARET_CURRENT_OBJ] (state, result) {
      state.marketCurrentObj = {
        r: result,
        s: new Date().getTime()
      }
    },
    [TRADE_SUCCESS] (state, result) {
      state.tradeSuccess = {
        r: result,
        s: new Date().getTime()
      }
    },
    [MY_WEB_SOCKET] (state, result) {
      state.myWebSocket = {
        r: result,
        s: new Date().getTime()
      }
    },
    [DEPTH_CHART_DATA] (state, result) {
      state.depthChartData = {
        r: result,
        s: new Date().getTime()
      }
    },
    [KLINE_CHART_DATA] (state, result) {
      state.klineChartData = {
        r: result,
        s: new Date().getTime()
      }
    },
    [ACCOUNT_BALANCE] (state, result) {
      state.accountBalance = {
        r: result,
        s: new Date().getTime()
      }
    },
    [DEPTH_VALUE] (state, result) {
      state.depthValue = {
        r: result,
        s: new Date().getTime()
      }
    },
    [DEPTH_LIST] (state, result) {
      state.depthList = {
        r: result,
        s: new Date().getTime()
      }
    },
    [TRADE_LIST_DATA] (state, result) {
      state.tradeListData = {
        r: result,
        s: new Date().getTime()
      }
    }
  }
}
