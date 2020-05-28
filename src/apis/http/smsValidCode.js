import axios from './axios'
let sendMsgTimes = 0

const ValidationParameters = ({countryCode, mobile, aliyuntoken, sig, scene, csessionid, operationType}) => {
  let flag = true
  // 如果填写编号或者手机号 则编号/手机号/阿里云四个验证 必填
  // if (countryCode || mobile) {
  //   if (countryCode && mobile && aliyuntoken && sig && scene && csessionid) {
  //   } else { flag = false }
  // }
  // 短信类型必填
  if (!operationType) {
    flag = false
  }
  return flag
}

const switchSendMsg = () => {
  if (sendMsgTimes === 0) {
    sendMsgTimes = 1
  } else if (sendMsgTimes === 1) {
    sendMsgTimes = 0
  }
  return sendMsgTimes
}

const smsValidCode = (data) => {
  return new Promise((resolve, reject) => {
    if (ValidationParameters(data)) {
      data['fromType'] = switchSendMsg()
      axios({
        url: 'common/smsValidCode',
        method: 'post',
        header: {},
        params: data
      }).then((data) => {
        resolve(data)
      })
    } else {
      resolve({
        code: '1',
        msg: '参数错误'
      })
    }
  })
}
export default smsValidCode
