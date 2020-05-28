export default {
  state: {
    cmsfile: localStorage.cmsfile,
    mesg: '',
    problemId: '',
    probleReturn: ''
  },
  actions: {

  },
  mutations: {
    CMSFILE: (state, data) => {
      state.cmsfile = data
    },
    MEAGEID: (state, data) => {
      state.mesg = data
    },
    PROBLEM: (state, data) => {
      state.problemId = data
    },
    RETURN: (state, data) => {
      state.probleReturn = data
    }
  }
}
