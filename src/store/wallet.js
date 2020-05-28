import axios from '@/apis/http/axios.js'

export default {
  state: {
    records: {}, // 资金流水
    contractList: [], // 未平仓合约
    balance: {}, // 账户余额信息
    isShow: false, // 划转窗口是否显示
    errorInfo: '', // 错误信息
    recordsLoading: true, // 资金流水loading
    balanceLoading: true, // 账户余额loading
    contractListLoading: true, // 未平仓合约loading
    pageSize: 100, // 资金流水一页显示条数
    page: 1, // 资金流水当前页数
    successMsg: '', // 流转成功信息
    pedding: false,
    transferAmount: null,
    transferPedding: false
  },
  mutations: {
    // 设置资金流水页数
    SETPAGE (state, page) {
      state.page = page
    },
    // 设置资金流水记录
    SETRECORD (state, obj) {
      let info = {}
      info[obj.page] = obj.data
      if (obj.init) {
        state.records = []
      }
      state.records = Object.assign({}, state.records, info)
    },
    // 设置loading是否显示
    SETSHOWLOADING (state, obj) {
      state[obj.name] = obj.val
    },
    // 设置未平仓合约记录
    SETCONTRACT (state, list) {
      state.contractList = list
    },
    // 设置账户余额信息
    SETBALANCE (state, obj) {
      state.balance = obj
    },
    // 设置资金流转窗口是否显示
    SETDIALOGSHOW (state, show) {
      state.isShow = show
    },
    // 设置资金流转错误信息
    SETDIALOGERROR (state, msg) {
      state.errorInfo = msg
    },
    // 设置资金流转成功信息
    SETSUCCESSMSG (state, msg) {
      state.successMsg = msg
    },
    // 设置pedding
    SETPEDDING (state, type) {
      state.pedding = type
    }
  },
  actions: {
    // 设置pedding
    setPedding ({commit}, type) {
      commit('SETPEDDING', type)
    },
    // 设置资金流转成功信息
    setSuccessMsg ({commit}, msg) {
      commit('SETSUCCESSMSG', msg)
    },
    // 设置loading是否显示
    setShowLoading ({commit}, type) {
      commit('SETSHOWLOADING', type)
    },
    // 设置资金划转错误信息
    setDialogError ({commit}, msg) {
      commit('SETDIALOGERROR', msg)
    },
    // 设置资金划转是否显示
    setDialogShow ({commit}, show) {
      commit('SETDIALOGSHOW', show)
    },
    // 划转操作
    capitalTransfer ({commit, dispatch, state}, obj) {
      if (!state.transferPedding) {
        state.transferPedding = true
        let callback = obj.callback
        let data = {
          fromType: obj.fromType,
          toType: obj.toType,
          amount: obj.amount,
          bond: obj.bond
        }
        axios({
          url: this.state.walletUrl.capital_transfer,
          hostType: 'co',
          params: data // 例如 btcusdt
        }).then((data) => {
          if (data.code === '0') {
            commit('SETDIALOGSHOW', false)
            dispatch('setTipState', {text: state.successMsg, type: 'success'})
            dispatch('getBalance')
            if (typeof callback === 'function') {
              callback()
            }
            commit('SETDIALOGERROR', null)
          } else {
            commit('SETDIALOGERROR', data.msg)
          }
          state.transferPedding = false
        })
      }
    },
    // 获取账户余额信息
    getBalance ({commit, dispatch, state}, refresh) {
      axios({
        url: this.state.walletUrl.account_balanc,
        hostType: 'co',
        params: {} // 例如 btcusdt
      }).then((data) => {
        let info = data
        if (info.code === '0') {
          commit('SETBALANCE', info.data[0])
          commit('SETSHOWLOADING', {
            name: 'balanceLoading',
            type: false
          })
          if (!refresh) {
            dispatch('getContractList')
            dispatch('getRecords', {pageSize: state.pageSize, page: state.page, init: true})
          }
        }
      })
    },
    // 获取未平仓合约列表
    getContractList ({commit}) {
      axios({
        url: this.state.walletUrl.hold_contract_list,
        hostType: 'co',
        params: {} // 例如 btcusdt
      }).then((data) => {
        let info = data
        if (info.code === '0') {
          commit('SETCONTRACT', info.data)
          commit('SETPEDDING', false)
          commit('SETSHOWLOADING', {
            name: 'contractListLoading',
            type: false
          })
        }
      })
    },
    // 获取资金流水记录
    getRecords ({commit, state}, obj) {
      commit('SETSHOWLOADING', {
        name: 'recordsLoading',
        type: true
      })
      if (state.records[obj.page] && !obj.init) {
        commit('SETRECORD', {data: state.records[obj.page], page: obj.page})
        commit('SETPAGE', obj.page)
        commit('SETSHOWLOADING', {
          name: 'recordsLoading',
          type: false
        })
      } else {
        let params = {
          page: obj.page,
          pageSize: obj.pageSize
        }
        axios({
          url: this.state.walletUrl.business_transation_list,
          hostType: 'co',
          params: params // 例如 btcusdt
        }).then((data) => {
          let info = data
          if (info.code === '0') {
            if (obj.init) {
              commit('SETRECORD', {data: info.data, page: obj.page, init: true})
            } else {
              commit('SETRECORD', {data: info.data, page: obj.page, init: false})
            }
            commit('SETPAGE', obj.page)
            commit('SETPEDDING', false)
            commit('SETSHOWLOADING', {
              name: 'recordsLoading',
              type: false
            })
          }
        })
      }
    }
  }
}
