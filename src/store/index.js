import Vue from 'vue'
import Vuex from 'vuex'
import baseData from './baseData'
import url from './url'
import otcUrl from './otcUrl'
import options from './options'
import trade from './trade'
import otcData from './otcData'
import mesage from './mesage'
import coUrl from './coUrl'
import color from './color'
import coBaseData from './co_baseData'
import wallet from './wallet'
import walletUrl from './walletUrl'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    baseData,
    url,
    otcUrl,
    options,
    trade,
    otcData,
    mesage,
    coUrl,
    coBaseData,
    color,
    wallet,
    walletUrl
  }
})
