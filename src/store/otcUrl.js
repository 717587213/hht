export default {
  state: {
    common: {
      public_info: 'otc/public_info', // 公共接口
      parameter: 'otc/parameter', // 初始化参数
      rates: 'otc/rates', // 获取费率信息
      otc_home: 'otc/index',   // 首页
      otc_search: 'otc/search',   // 广告搜索
      upload_img: '/otc/upload_user_img',  // 头像上传
      find: 'otc/payment/find', // 查询用户支付方式
      finance: 'finance/otc_account_list', // 场外账户余额
      company_apply: 'otc/company_apply', // 商户申请
      company_release: 'otc/company_release' // 解除认证
    },
    personal: {
      nickname_update: 'user/nickname_update', // 修改用户昵称
      person_home_page: 'otc/person_home_page',   // 个人主页用户基本信息显示
      operation_ads: 'otc/person_ads',  // 个人广告信息
      person_relationship: '/otc/person_relationship', // 黑名单
      contacts: '/otc/user_contacts'  // 黑白名单修改
    },
    wanted: {
      wanted_detail: '/otc/wanted_detail', // 广告详情
      buy_order_save_one: 'otc/buy_order_save', // 生成购买订单第一步
      buy_order_save_two: 'otc/buy_order_save_two', // 生成购买订单第二步
      sell_order_save_one: 'otc/sell_order_save',
      sell_order_save_two: '/otc/sell_order_save_two',
      search: '/otc/search',  // 广告搜索
      wanted_save: '/otc/wanted_save', // 发布广告
      close_wanted: '/otc/close_wanted' // 关闭广告
    },
    order: {
      order_detail: 'otc/order_detail', // 订单详情数据
      order_cancel: 'otc/order_cancel', // 取消订单
      confirm_order: 'otc/confirm_order', // 确认打币
      order_payed: 'otc/order_payed', // 确认支付
      complain_order: 'otc/complain_order', // 申诉
      message: 'chatMsg/message', // 聊天历史记录
      create_problem: 'question/create_problem', // 发起提问
      complain_cancel: 'otc/complain_cancel', // 取消申诉
      details_problem: 'question/details_problem', // 获取申诉的聊天记录
      reply_create: 'question/reply_create' // 申诉聊天追加提问
    },
    payment: {
      payment_find: 'otc/payment/find', // 查询用户支付方式
      upload_qrcode: 'common/upload_qrcode', // 上传收款二维码
      payment_open: 'otc/payment/open', // 支付方式开关设置
      payment_delete: 'otc/payment/delete', // 删除支付方式
      payment_add: 'otc/payment/add', // 添加支付方式
      payment_update: 'otc/payment/update' // 修改支付方式
    }
  }
}
