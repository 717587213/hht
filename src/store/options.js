// 存储功能性的状态 例如公共tip弹框的状态
export default {
  state: {
    // tip 弹层的状态
    tipState: {
      flag: false, // 开关变量
      content: '', // 内容
      type: ''
    },
    isshowLoading: false // 全局loading开关
  },
  actions: {
    setTipState ({commit}, data) {
      let content, tipType
      if (data !== null && (typeof data === 'object')) {
        content = data.text
        tipType = data.type
      } else {
        content = data
        tipType = 'success'
      }
      commit('SETTIPSTATE', {
        flag: true,
        content: content,
        type: tipType
      })
      setTimeout(() => {
        commit('SETTIPSTATE', {
          flag: false,
          content: '',
          tipType: null
        })
      }, 5000)
    }
  },
  mutations: {
    SETTIPSTATE (state, data) {
      state.tipState = data
    },
    ISSHOWLOADING (state, data) {
      state.isshowLoading = data
    }
  }
}
