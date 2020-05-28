let HOST_API = {
  // 访问地址：
  pc_url: 'dev3.365os.com/exchange-web-api',
  h5_url: 'dev3.365os.com/exchange-web-api',
  // 项目开启：
  ex_open: '1',
  otc_open: '1',
  co_open: '0',
  // 项目API接口域名地址：
  ex_api: 'dev3.365os.com/exchange-web-api', // 公共接口，必填！（含币币交易）
  co_api: 'dev3.365os.com/exchange-web-api', // 合约交易接口
  otc_api: 'test.365os.com/exchange-otc-api', // 场外交易接口
  // 如果做分站，且有多个分站，以下为各分站的访问地址
  ex_pc_url: '', // 币币交易PC
  ex_h5_url: '', // 币币交易H5
  otc_pc_url: '', // 场外交易PC
  otc_h5_url: '', // 场外交易H5
  co_pc_url: '', // 合约交易PC
  co_h5_url: '' // 合约交易H5
}
module.exports = HOST_API
