import axios from 'axios'
import bus from '../bus'

// import md5 from 'js-md5'
let formatTime = (dateTime) => {
  let date = new Date(dateTime)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  function s (t) {
    return t < 10 ? '0' + t : t
  }
  return year + '-' + s(month) + '-' + s(day) + ' ' + s(hours) + ':' + s(minutes) + ':' + s(seconds)
}
// 参数
const formatParams = (acParams = {}) => {
  // let params = new URLSearchParams()
  // acParams.lang = localStorage.getItem('lang') || 'zh'
  // let arr = []
  // for (var key in acParams) { arr.push(key) }
  // arr.sort((pre, next) => { return pre >= next ? 1 : -1 })
  // let str = ''
  // for (var i in arr) {
  //   str += arr[i] + acParams[arr[i]]
  //   params.append(arr[i], acParams[arr[i]])
  // }
  // params.append('sign', md5(str + 'jiaoyisuo@2017'))
  // console.log(1231231, acParams)
  acParams.uaTime = formatTime(new Date().getTime())
  return acParams
}
let getCookie = (name) => {
  let arr = null
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return unescape(arr[2])
  } else {
    return null
  }
}
// 请求头
const formatHeaders = (acHeaders) => {
  let headers = {}
  headers['exchange-token'] = getCookie('token') || ''
  headers['exchange-client'] = 'pc'
  headers['exchange-language'] = localStorage.lan || 'zh_CN'
  // headers['Content-type'] = 'application/x-www-form-urlencoded'
  // headers['exchange-time'] = formatTime(new Date().getTime())
  if (acHeaders) {
    for (let i in acHeaders) {
      headers[i] = acHeaders[i]
    }
  }
  return headers
}
const http = ({url, headers, params, method, hostType}) => {
  let prefix = ''
  let protocol = location.protocol + '//' || 'https://'
  if (process.env.NODE_ENV === 'development') { // 开发环境接口地址
    switch (hostType) {
      case 'otc':
        prefix = '/otc-api' // 场外
        break
      case 'co':
        prefix = '/co-api' // 场外
        break
      case 'upload':
        prefix = '/upload-api' // 上传
        break
      default: prefix = '/vue-api' // 公共和交易所
    }
  } else if (process.env.NODE_ENV === 'production') { // 生产环境接口地址
    if (window.HOST_API) {
      let EX_API = protocol + window.HOST_API.ex_api
      let OTC_API = protocol + window.HOST_API.otc_api
      let CO_API = protocol + window.HOST_API.co_api
      let UPLOAD_API = protocol + window.HOST_API.updata_url
      if (window.HOST_API.ex_api && window.HOST_API.ex_api.indexOf('http') !== -1) {
        EX_API = protocol + window.HOST_API.ex_api.split('//')[1]
      }
      // 线上场外API接口
      if (window.HOST_API.otc_api && window.HOST_API.otc_api.indexOf('http') !== -1) {
        OTC_API = protocol + window.HOST_API.otc_api.split('//')[1]
      }
      if (window.HOST_API.co_api && window.HOST_API.co_api.indexOf('http') !== -1) {
        CO_API = protocol + window.HOST_API.co_api.split('//')[1]
      }
      if (window.HOST_API.co_api && window.HOST_API.co_api.indexOf('http') !== -1) {
        UPLOAD_API = protocol + window.HOST_API.updata_url.split('//')[1]
      }
      switch (hostType) {
        case 'otc':
          prefix = OTC_API
          break
        case 'co':
          prefix = CO_API
          break
        case 'upload':
          prefix = UPLOAD_API // 上传
          break
        default: prefix = EX_API
      }
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      url: `${prefix}/${url}`,  // exchange-web-api线上  vue-api本地
      headers: formatHeaders(headers),
      data: formatParams(params),
      method: method || 'post'
    }).then((data) => {
      if (data.data.code === '10002') {
        bus.$emit('loginOut')
        localStorage.removeItem('token')
      }
      resolve(data.data)
    }).catch((err) => {
      reject(err)
      throw new Error(`Error:${err}`)
    })
  })
}
export default http
