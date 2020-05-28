import axios from 'axios'
let uploadImg = ({traget, tragetName}) => {
  return new Promise((resolve, reject) => {
    if (traget && tragetName) {
      let _from = new FormData()
      _from.append('file', traget, name)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post('vue-api/common/upload_file', _from, config).then((res) => {
        if (res.code === '0') {
          resolve({
            code: res.code,
            msg: 'success',
            data: res.data
          })
        } else {
          resolve({
            code: res.code,
            msg: 'error'
          })
        }
      })
    } else {
      resolve({
        code: '1',
        msg: '参数错误'
      })
    }
  })
}
export default uploadImg
