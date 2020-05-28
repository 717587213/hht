import axios from './axios'
const ValidationParameters = ({email, aliyuntoken, sig, scene, csessionid, operationType}) => {
  let flag = true
  // 如果填写编号或者手机号 则编号/手机号/阿里云四个验证 必填
  // if (email) {
  //   if (email && aliyuntoken && sig && scene && csessionid) {
  //   } else { flag = false }
  // }
  // 短信类型必填
  if (!operationType) {
    flag = false
  }
  return flag
}
const emailValidCode = (data) => {
  return new Promise((resolve, reject) => {
    if (ValidationParameters(data)) {
      axios({
        url: 'common/emailValidCode',
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
export default emailValidCode
